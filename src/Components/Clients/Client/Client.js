import React from 'react';
import classes from './Client.css';
import Modal from '../../UI/Modal/Modal';
import Details from '../Details/Details';
import MdMoreHoriz from 'react-icons/lib/md/more-horiz';

const client = ({
  id,
  selected,
  clicked,
  name,
  clickedDetails,
  showDetails,
  details,
  updated,
  onDelete,
  children
}) => {
  const clientId = id;
  return (
    <div className={classes.wrapper}>
      <div
        className={selected ? classes.selected : classes.Client}
        onClick={event => clicked(event, clientId)}
      >
        {children}
        {name}
        <span
          className={classes.editButton}
          onClick={() => clickedDetails(clientId)}
        >
          <MdMoreHoriz size={18} color="#969696" />
        </span>
      </div>
      <Modal show={showDetails} modalClosed={() => clickedDetails(clientId)}>
        <Details
          details={details}
          clientName={name}
          clientId={clientId}
          updated={updated}
          onDelete={onDelete}
        />
      </Modal>
    </div>
  );
};

export default client;
