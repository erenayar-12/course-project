import React from 'react';

const AppDebug: React.FC = () => {
  const [timestamp] = React.useState(() => new Date().toLocaleTimeString());

  React.useEffect(() => {
    console.log('✓ AppDebug initialized at', timestamp);
    // Try to log all window properties to help debug
    console.log('Window object:', Object.keys(window).slice(0, 10));
  }, [timestamp]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h1 style={{ margin: '0 0 1rem 0' }}>✓ REACT IS WORKING!</h1>
      <p style={{ margin: '0 0 1rem 0', fontSize: '18px' }}>If you see this,  React is rendering successfully</p>
      <p style={{ margin: 0, fontSize: '16px' }}>Time: {timestamp}</p>
    </div>
  );
};

export default AppDebug;
