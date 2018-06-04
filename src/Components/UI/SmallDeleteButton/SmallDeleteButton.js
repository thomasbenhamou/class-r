import React from 'react';
import classes from './SmallDeleteButton.css';
import MdDelete from 'react-icons/lib/md/delete';

const smallDeleteButton = props => (
  <span className={classes.deleteButton} onClick={props.clicked}>
    <MdDelete size={14} />Supprimer
  </span>
);

export default smallDeleteButton;
