import React from 'react';

// Minimal App component for debugging
const AppMinimal: React.FC = () => {
  React.useEffect(() => {
    console.log('✓ AppMinimal component mounted');
    return () => {
      console.log('AppMinimal component unmounted');
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>✓ React is Working!</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>If you see this, React rendering is functioning.</p>
        <p style={{ color: '#999', fontSize: '0.875rem' }}>Check browser console (F12) for detailed logs.</p>
        <hr style={{ margin: '1rem 0' }} />
        <code style={{ 
          display: 'block',
          padding: '0.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '0.75rem',
          marginTop: '1rem'
        }}>
          Timestamp: {new Date().toLocaleTimeString()}
        </code>
      </div>
    </div>
  );
};

export default AppMinimal;
