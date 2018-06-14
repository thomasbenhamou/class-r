import React, { Component } from 'react';
import classes from './Client.css';
import Modal from '../../UI/Modal/Modal';
import Details from '../Details/Details';
import MdEdit from 'react-icons/lib/md/edit';

class Client extends Component {
  render() {
    const {
      id,
      selected,
      clicked,
      name,
      clickedDetails,
      showDetails,
      details,
      updated,
      onDelete,
      children,
      isNew
    } = this.props;
    return (
      <div className={classes.wrapper}>
        <div
          className={selected ? classes.selected : classes.Client}
          style={{
            backgroundColor: isNew && '#eee',
            border: isNew && '1px solid #faaa6c'
          }}
          onClick={event => clicked(event, id)}
        >
          {children}
          {name}
          <span
            className={classes.editButton}
            onClick={() => clickedDetails(id)}
          >
            <MdEdit size={14} color="#969696" />
          </span>
        </div>
        <Modal show={showDetails} modalClosed={() => clickedDetails(id)}>
          <Details
            details={details}
            clientName={name}
            clientId={id}
            updated={updated}
            onDelete={onDelete}
          />
        </Modal>
      </div>
    );
  }
}

export default Client;
