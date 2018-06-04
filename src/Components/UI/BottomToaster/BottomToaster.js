import React, { Component } from 'react';
import classes from './BottomToaster.css';
import Backdrop from '../Backdrop/Backdrop';

class BottomToaster extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.toasterClosed} />
        <div
          className={classes.BottomToaster}
          style={{
            transform: this.props.show ? 'translateY(0px)' : 'translateY(10vh)',
            opacity: this.props.show ? '1' : '0'
          }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default BottomToaster;
