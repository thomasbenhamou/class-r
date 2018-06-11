import React from 'react';
import classes from './CellInput.css';

const cellInput = props => (
  <React.Fragment>
    <input
      className={classes.cellInput}
      value={props.value}
      onChange={props.changed}
      style={{
        color: props.color ? props.color : '#999',
        fontSize: props.fontSize ? props.fontSize : 'inherit',
        textAlign: props.textAlign ? props.textAlign : 'center',
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : 'transparent',
        width: props.width ? props.width : '100%'
      }}
      type={props.type ? props.type : null}
      pattern={props.pattern || null}
    />{' '}
    {props.euro ? '€' : null}
  </React.Fragment>
);

export default cellInput;
