import React, { Component } from 'react';
import classes from './DropzoneBill.css';
import { database } from '../../../firebase/firebase';

class DropzoneBill extends Component {
  state = {
    draggingOver: false
  };

  onDragOver = e => {
    e.preventDefault();
    this.setState({
      draggingOver: true
    });
  };

  onDragLeave = e => {
    e.preventDefault();
    this.setState({ draggingOver: false });
  };

  onDrop = e => {
    let quoteId = e.dataTransfer.getData('quoteId');
    database
      .ref('quotes/' + quoteId)
      .once('value')
      .then(snapshot => {
        this.setState({
          draggingOver: false
        });
        this.props.onCreateBill(quoteId, snapshot.val());
      });
  };
  render() {
    return (
      <div
        className={this.state.draggingOver ? classes.active : classes.Bill}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        Glisser un devis ici pour créer une facture
      </div>
    );
  }
}

export default DropzoneBill;
