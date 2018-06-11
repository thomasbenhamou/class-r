import React, { Component } from 'react';
import classes from './Bill.css';
import MdSend from 'react-icons/lib/md/send';
import MdPayment from 'react-icons/lib/md/payment';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';
import MdEdit from 'react-icons/lib/md/edit';

class Bill extends Component {
  state = {
    loadingChecked: this.props.loadingSentIcon,
    loadingPaid: this.props.loadingPaidIcon,
    sentChecked: this.props.sentChecked,
    paidChecked: this.props.paidChecked
  };

  static getDerivedStateFromProps = (props, state) => {
    return {
      loadingChecked: props.loadingSentIcon,
      sentChecked: props.sentChecked,
      loadingPaid: props.loadingPaidIcon,
      paidChecked: props.paidChecked
    };
  };

  handleSendClick = () => {
    this.props.clickedSent(this.props.id);
  };

  handlePayClick = () => {
    this.props.clickedPaid(this.props.id);
  };

  render() {
    return (
      <div className={classes.Bill}>
        {/* <div className={classes.badge}>Facture</div> */}
        <div className={classes.line}>
          <span>{this.props.name}</span>
          <span
            className={classes.editButton}
            onClick={() => this.props.clicked(this.props.id)}
          >
            <MdEdit size={14} color="#969696" />
          </span>
        </div>
        {this.props.children}
        <div className={classes.line}>
          <span className={classes.type}>{this.props.date}</span>
          <span className={classes.type}>{this.props.totalPrice}€</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          {this.props.loadingSentIcon === this.props.id ? (
            <CircleSpinner />
          ) : (
            <div title="Marquer cette facture comme envoyée">
              <MdSend
                size={18}
                color={this.props.sentChecked ? '#41B695' : '#969696'}
                onClick={this.handleSendClick}
              />
            </div>
          )}
          {this.state.loadingPaid === this.props.id ? (
            <CircleSpinner />
          ) : (
            <div title="Marquer cette facture comme payée">
              <MdPayment
                size={18}
                color={this.state.paidChecked ? '#41B695' : '#969696'}
                onClick={this.handlePayClick}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Bill;
