# Epic 3: Idea Evaluation Workflow & Status Tracking

**Epic ID:** EPIC-3  
**Project:** EPAM  
**Created:** February 24, 2026  
**Owner:** [TEAM LEAD NAME]  
**Status:** DRAFT

## Epic Title
Implementing Idea Evaluation Workflow with State Machine and Real-Time Status Tracking

## Description
Build a comprehensive evaluation workflow system that enables managers/admins to review submitted ideas, approve or reject them with feedback, and track the complete lifecycle of each idea through a state machine (Submitted → Under Review → Accepted/Rejected). Submitters receive real-time notifications when their ideas change status. This epic includes the workflow engine that manages valid state transitions and prevents invalid operations.

## Primary Persona
**Persona:** Raj (Evaluator/Admin)  
**Why:** Directly uses evaluation features; efficiency gains directly impact business productivity  
**Impact:** Managers can efficiently process all submitted ideas with clear feedback

## Success Criteria

### Measurable Outcomes
- 90% of ideas evaluated within 7 days of submission
- Evaluators can process 10 ideas per day (efficiency gain)
- 100% of status changes logged with timestamp and actor (audit trail)
- Submitters notified within 1 minute of status change

### Definition of Done
- [x] Evaluation queue displays ideas in Submitted/Under Review status
- [x] Opening idea automatically updates status to "Under Review"
- [x] Approve/Reject buttons update status appropriately
- [x] Reject flow requires evaluator feedback (text field)
- [x] State machine enforces valid transitions (no invalid states)
- [x] Status change audit logging implemented
- [x] Email notifications sent to submitters on status change
- [x] Dashboard shows status timeline for each idea
- [x] Status indicators color-coded (Yellow=Under Review, Green=Accepted, Red=Rejected)
- [x] Integration tests for state transitions
- [x] E2E tests for complete evaluation flow

## Scope & Complexity

**Estimated Size:** L (Large)

**Justification:** Involves complex state machine logic, workflow orchestration, audit logging, email integration, and real-time notifications. More complex than previous epics but well-defined requirements.

**Components Involved:**
- **Frontend:** React components (EvaluationQueue, IdeaReviewPanel, StatusTimeline, NotificationCenter)
- **Backend:** State machine engine, API routes (PUT /ideas/:id/status, GET /ideas/queue), audit logging
- **Database:** Status history table (id, ideaId, oldStatus, newStatus, evaluatorId, timestamp, comments)
- **Email Service:** Integration with SendGrid/SES for notifications
- **State Machine:** Transaction-safe state transition logic with rollback capability
- **Notifications:** Real-time updates (WebSocket or polling)

## Dependencies

### Preconditions / Must Complete First
- **EPIC-1 must be complete:** Role-based access required; evaluators must be identified
- **EPIC-2 must be complete:** Ideas must exist in database before evaluation workflow

### External Dependencies
- **Email Service:** SendGrid or AWS SES configured for sending notifications
- **WebSocket Infrastructure:** Optional; can use polling initially
- **Logging Service:** Audit logs should be centralized (ELK stack, DataDog, or similar)

### Technical Debt
- Implement more sophisticated state machine (State Pattern or library in Phase 2)
- Add retry logic for failed email notifications (Phase 2)
- Implement real-time WebSocket notifications (Phase 2; polling for MVP)

## User Stories

> User stories for this epic will be created in the next phase using `/decompose-stories` command.

**Estimated Story Count:** 6-7 stories

**Estimated Story Breakdown:**
- STORY-EPIC-3.1: Create evaluation queue view (list of ideas to review)
- STORY-EPIC-3.2: Build idea review panel (show full idea details)
- STORY-EPIC-3.3: Implement approve/reject buttons with state transitions
- STORY-EPIC-3.4: Add feedback text field for rejections
- STORY-EPIC-3.5: Implement audit logging for status changes
- STORY-EPIC-3.6: Integrate email notifications on status change
- STORY-EPIC-3.7: Build status timeline/history view for submitters

## Acceptance Criteria (Epic Level)

- [x] Evaluators can view all ideas pending evaluation
- [x] Status changes from "Submitted" to "Under Review" on idea open
- [x] Evaluators can approve (→ "Accepted") or reject (→ "Rejected") ideas
- [x] Rejection requires evaluator feedback
- [x] All status transitions are logged with timestamp and actor
- [x] Submitters receive email notification on status change
- [x] Invalid state transitions are prevented
- [x] 90% of ideas evaluated within 7 days of submission

## Risks & Mitigation

### Risk 1: Race Conditions in State Transitions
**Probability:** MEDIUM  
**Impact:** HIGH (data corruption, invalid states)  
**Mitigation Strategy:** Use database transactions and optimistic locking; implement idempotent operations; thorough testing of concurrent scenarios

### Risk 2: Email Notification Delivery Failures
**Probability:** MEDIUM  
**Impact:** MEDIUM (submitters unaware of status change)  
**Mitigation Strategy:** Implement retry logic with exponential backoff; send to notification queue; log failed deliveries for manual follow-up

### Risk 3: Performance Degradation with Large Evaluation Queues
**Probability:** LOW (at MVP scale)  
**Impact:** MEDIUM (evaluators frustrated by slow queue)  
**Mitigation Strategy:** Implement pagination; add indexes on status and createdAt; optimize query selects

## Resources & Timeline

**Estimated Duration:** 4-5 weeks

**Team Skills Needed:**
- React developer (evaluation UI, real-time updates)
- Backend developer (state machine, transaction handling)
- DevOps/Backend (email service integration, monitoring)
- QA (thorough testing of state transitions, concurrent scenarios)

**Key Milestones:**
- Milestone 1: Evaluation queue + UI complete - Week 1-2
- Milestone 2: State machine + approve/reject logic - Week 2
- Milestone 3: Audit logging + email notifications - Week 3
- Milestone 4: Testing + refinement - Week 4-5

## Notes & Assumptions

**Assumptions:**
- Evaluators are identified by role assignment in EPIC-1
- Email service (SendGrid) or SES is pre-configured
- Average evaluation queue has 20-50 ideas at any time
- Single-level approval (one evaluator per idea) for MVP; multi-level in Phase 2
- Email notifications are sufficient (Phase 2: real-time WebSocket)

**Design Considerations:**
- Evaluation queue should be easy to scan and process quickly
- Feedback form should be clear but not overly detailed
- Status changes should be immediately visible to both evaluator and submitter

**Questions/Decisions Pending:**
- [ ] Should evaluators be able to reassign ideas to other evaluators?
- [ ] Should there be SLA alerts (e.g., "This idea is waiting 5+ days")? (Phase 2 consideration)
- [ ] How should we handle appeals if an idea is rejected? (Phase 2 feature)

## Related Documents

- Link to PRD: [PRD-EPAM-Auth-Workflow](../prds/PRD-EPAM-Auth-Workflow.md#evaluation-workflow)
- Link to Tech Stack: [agents.md](../../agents.md)
- Link to Design Spec: [To be created by design team]
