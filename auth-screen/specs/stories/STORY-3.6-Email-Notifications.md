# STORY-3.6: Email Notifications

**Status:** Not Started  
**Story ID:** STORY-3.6  
**Epic:** EPIC-3 (Idea Evaluation Workflow & Status Tracking)  
**Sprint:** Backlog  
**Story Points:** 3  
**Priority:** P1 (Important)  
**Persona:** Priya (Submitter)  
**Created:** February 26, 2026  
**Updated:** February 26, 2026  

---

## User Story

**As a** submitter  
**I want** to receive an email notification when my idea status changes  
**so that** I'm immediately informed whether my idea was accepted or rejected

---

## Context

When an idea status transitions to "Accepted" or "Rejected", the submitter receives an email notification. The email includes the new status, rejection feedback (if applicable), and a link to view the idea. Email service uses job queue with retry logic for reliability.

---

## Acceptance Criteria

### AC1: Email Sent on Approval
**Given:** Evaluator approves an idea  
**When:** Status changes to "Accepted"  
**Then:**
- Email sent to submitter within 1 minute
- Email sent exactly once (no duplicates)
- Email deliverability tracked

### AC2: Email Sent on Rejection
**Given:** Evaluator rejects an idea with feedback  
**When:** Status changes to "Rejected"  
**Then:**
- Email sent to submitter within 1 minute
- Rejection feedback included in email body
- Clear reason for rejection visible

### AC3: Email Contains Link to Idea
**Given:** Email sent  
**When:** Submitter receives email  
**Then:**
- Email includes: `https://app.example.com/ideas/{ideaId}`
- Link is clickable (href attribute)
- Link opens idea detail page

### AC4: Email Template Professional and Clear
**Given:** Email sent  
**When:** Submitter reads email  
**Then:**
- Subject line: "Your idea was accepted!" (or "Status Update: Your idea")
- Body explains decision clearly
- Call-to-action present ("View your idea")
- Footer with platform branding/unsubscribe link

### AC5: Submitter Email Address Correct
**Given:** Email queued for sending  
**When:** Email service processes  
**Then:**
- Email sent to correct submitter email address
- Address fetched from users table
- Bounced emails tracked

### AC6: Failed Emails Are Retried
**Given:** Email fails to send (network error, service down)  
**When:** Failure detected  
**Then:**
- Automatic retry after 5 minutes (exponential backoff)
- Up to 3 retry attempts
- After 3 failures, logged as "permanent failure"
- Admin notified of failures

---

## Technical Details

### Email Service Integration

**File:** `backend/src/services/emailService.ts` (NEW)

```typescript
import SendGrid from '@sendgrid/mail';
import { Queue } from 'bull';

const sendgridClient = SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export class EmailService {
  private emailQueue: Queue;

  constructor() {
    // Initialize Bull queue for email sending with retries
    this.emailQueue = new Queue('email', process.env.REDIS_URL);
    
    // Process queue jobs
    this.emailQueue.process(this.sendEmailJob.bind(this));
  }

  /**
   * Queue email for sending (non-blocking)
   */
  async queueEmail(emailData: EmailData) {
    await this.emailQueue.add(emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5 * 60 * 1000 // 5 minute delay
      },
      removeOnComplete: true,
      removeOnFail: false // Keep failed jobs for debugging
    });
  }

  /**
   * Actual job that sends email
   */
  private async sendEmailJob(job) {
    const { to, subject, html, ideaId } = job.data;

    try {
      const result = await sendgridClient.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ideas.epam.com',
        subject,
        html,
        trackingSettings: {
          openTracking: { enable: true },
          clickTracking: { enable: true }
        }
      });

      // Log successful send
      console.log(`Email sent to ${to} for idea ${ideaId}`);
      
      return result;
    } catch (error) {
      console.error(`Email send failed: ${error.message}`);
      throw error; // Trigger retry
    }
  }

  /**
   * Send approval email
   */
  async sendApprovalEmail(submitter: User, idea: Idea) {
    const html = this.generateApprovalTemplate(submitter, idea);
    
    await this.queueEmail({
      to: submitter.email,
      subject: `Great news! Your idea "${idea.title}" was accepted!`,
      html,
      ideaId: idea.id
    });
  }

  /**
   * Send rejection email
   */
  async sendRejectionEmail(submitter: User, idea: Idea, feedback: string) {
    const html = this.generateRejectionTemplate(submitter, idea, feedback);
    
    await this.queueEmail({
      to: submitter.email,
      subject: `Thank you for your idea submission - Status Update`,
      html,
      ideaId: idea.id
    });
  }

  private generateApprovalTemplate(submitter: User, idea: Idea): string {
    const ideaUrl = `${process.env.APP_URL}/ideas/${idea.id}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .cta-button { 
              display: inline-block;
              background-color: #10b981;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer { background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Great News!</h1>
            </div>
            
            <div class="content">
              <p>Dear ${submitter.name},</p>
              
              <p>We're thrilled to inform you that your idea <strong>"${idea.title}"</strong> has been accepted!</p>
              
              <p>Your idea showed great potential and will be considered for further implementation. Thank you for your valuable contribution to EPAM's innovation efforts.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${ideaUrl}" class="cta-button">View Your Idea</a>
              </p>
              
              <p>Best regards,<br>
              <strong>EPAM Ideas Platform</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} EPAM. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateRejectionTemplate(submitter: User, idea: Idea, feedback: string): string {
    const ideaUrl = `${process.env.APP_URL}/ideas/${idea.id}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #6b7280; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .feedback-box { 
              background-color: #fef2f2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
            }
            .cta-button { 
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer { background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Submission</h1>
            </div>
            
            <div class="content">
              <p>Dear ${submitter.name},</p>
              
              <p>Thank you for submitting your idea <strong>"${idea.title}"</strong>. After careful review by our evaluation team, it was not selected at this time.</p>
              
              <div class="feedback-box">
                <strong>Evaluator Feedback:</strong><br>
                <p>${feedback}</p>
              </div>
              
              <p>We truly appreciate your participation and innovation mindset. We encourage you to submit more ideas in the future. Your contributions help drive EPAM's continuous improvement.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${ideaUrl}" class="cta-button">View Your Idea</a>
              </p>
              
              <p>Best regards,<br>
              <strong>EPAM Ideas Platform</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} EPAM. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
```

### Integration with Status Transition

**File:** `backend/src/services/statusTransition.service.ts` - Update executeTransition:

```typescript
static async executeTransition(
  ideaId: string,
  newStatus: string,
  evaluatorId: string,
  evaluatorName: string,
  feedback?: string
) {
  const idea = await db.ideas.findUnique({ 
    where: { id: ideaId },
    include: { submitter: true }
  });

  // ... existing validation and update logic ...

  return await db.$transaction(async (tx) => {
    // ... update and log ...

    // Queue email notification (non-blocking)
    const emailService = new EmailService();
    
    if (newStatus === 'Accepted') {
      await emailService.sendApprovalEmail(idea.submitter, idea);
    } else if (newStatus === 'Rejected' && feedback) {
      await emailService.sendRejectionEmail(idea.submitter, idea, feedback);
    }

    return updated;
  });
}
```

### Configuration

**File:** `.env` - Add email settings:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@ideas.epam.com
APP_URL=https://app.example.com
REDIS_URL=redis://localhost:6379
```

### Environment Setup

**File:** `backend/package.json` - Add to dependencies:

```json
{
  "dependencies": {
    "@sendgrid/mail": "^7.7.0",
    "bull": "^4.10.0",
    "redis": "^4.6.0"
  }
}
```

---

## Files Affected

### New Files
- `backend/src/services/emailService.ts`
- `backend/src/services/emailTemplates.ts` (optional, can be in emailService)

### Modified Files
- `backend/src/services/statusTransition.service.ts` - Add email sending
- `.env` - Add SendGrid API key

### External Services
- SendGrid (email service)
- Redis (for Bull job queue)

---

## Testing

### Unit Tests
- [ ] Approval email template generates correctly
- [ ] Rejection email includes feedback
- [ ] Email queued non-blocking
- [ ] Retry logic works
- [ ] Failed email tracked

### E2E Tests
- [ ] Email sent on approval
- [ ] Email sent on rejection
- [ ] Email link works
- [ ] Failed delivery detected
- [ ] Retry succeeds

### Manual Testing
- [ ] Check SendGrid logs for email delivery
- [ ] Verify email content and formatting
- [ ] Test link routing
- [ ] Monitor Redis queue

---

## Definition of Done Checklist

- [ ] Email service implemented with queue
- [ ] Approval template created
- [ ] Rejection template with feedback
- [ ] SendGrid integration working
- [ ] Retry logic implemented
- [ ] Emails tested end-to-end
- [ ] Failed emails tracked
- [ ] Unit tests >80%
- [ ] E2E tests passing
- [ ] No sensitive data in emails

---

## Dependencies

### Blocks
- None

### Blocked By
- STORY-3.3 (Status transitions must exist)

### Related To
- STORY-3.5 (Audit logging)

---

## Estimation

- **Story Points:** 3
- **Estimated Days:** 0.5-1 day
- **Confidence:** High

**Breakdown:**
- Email service: 0.3 days
- Templates: 0.2 days
- Integration: 0.1 day
- Testing: 0.1 day

---

## Deliverables

- Email templates (approval + rejection)
- SendGrid integration
- Queue-based delivery with retries
- Failed email tracking
- Configuration documentation

---

## Notes

- Non-blocking: Email queuing doesn't delay status update response
- Retry logic ensures delivery even with temporary outages
- Email templates must be professional and clear
- Links must direct to correct app URL
- SendGrid tracks opens/clicks for analytics
