import React from 'react';
import classes from './Infos.css';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';

const infos = ({ data }) => {
  return (
    <div className={classes.infos}>
      {data.logo ? (
        <img src={data.logo} alt="logo" className={classes.logo} />
      ) : (
        <CircleSpinner />
      )}
      <div className={classes.details}>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          {data.name}
        </span>
        <span>{data.street}</span>
        <span>{data.city}</span>
        <span>{data.phone}</span>
        <span>{data.email}</span>
      </div>
    </div>
  );
};

export default infos;
