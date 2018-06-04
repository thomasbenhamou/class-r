import React, { Component } from 'react';
import classes from './Bill.css';
import MdMoreHoriz from 'react-icons/lib/md/more-horiz';
import MdSend from 'react-icons/lib/md/send';
import MdPayment from 'react-icons/lib/md/payment';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';

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
        <div className={classes.badge}>Facture</div>
        <div className={classes.line}>
          <span>{this.props.name}</span>
          <span className={classes.editButton}>
            <MdMoreHoriz
              onClick={() => this.props.clicked(this.props.id)}
              size={18}
              color="#969696"
            />
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
          {this.props.loadingSentIcon ? (
            <CircleSpinner />
          ) : (
            <MdSend
              size={18}
              color={this.props.sentChecked ? '#41B695' : '#969696'}
              onClick={this.handleSendClick}
            />
          )}
          {this.state.loadingPaid ? (
            <CircleSpinner />
          ) : (
            <MdPayment
              size={18}
              color={this.state.paidChecked ? '#41B695' : '#969696'}
              onClick={this.handlePayClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Bill;
