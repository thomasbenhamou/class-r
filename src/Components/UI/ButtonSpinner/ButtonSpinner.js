import React from 'react';
import classes from './ButtonSpinner.css';

const buttonSpinner = (props) => (
  <div className={classes.spinner}>
    <div className={classes.rect1}></div>
    <div className={classes.rect2}></div>
    <div className={classes.rect3}></div>
    <div className={classes.rect4}></div>
    <div className={classes.rect5}></div>
  </div>
)

export default buttonSpinner;
  
