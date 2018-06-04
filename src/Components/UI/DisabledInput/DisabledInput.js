import React, { Component } from 'react';
import classes from './DisabledInput.css';

class DisabledInput extends Component {
  state = {
    isDisabled: true
  };

  swithDisabledMode = () => {
    this.setState({
      isDisabled: !this.state.isDisabled
    });
  };

  render() {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={this.swithDisabledMode}
      >
        {this.props.children}
        <input
          className={
            this.props.large
              ? classes.DisabledInputLarge
              : classes.DisabledInput
          }
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={event => this.props.onChange(event)}
        />
      </div>
    );
  }
}

export default DisabledInput;
