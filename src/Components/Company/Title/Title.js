import React from 'react';

const title = ({ name, children }) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5rem',
      marginTop: '20px',
      borderTop: '1px solid #eee',
      borderBottom: '1px solid #eee'
    }}
  >
    <span style={{ width: '15%', textAlign: 'center', cursor: 'default' }}>
      <strong>{name}</strong>
    </span>
    {children}
  </div>
);

export default title;
