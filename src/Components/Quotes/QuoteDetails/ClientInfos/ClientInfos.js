import React from 'react';

const clientInfos = ({ data }) => (
  <div
    style={{
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <strong>{data.name}</strong>
    <span>{data.details.street}</span>
    <span>{data.details.city}</span>
    <span>{data.details.phone}</span>
    <span>{data.details.email}</span>
  </div>
);

export default clientInfos;
