import React, { Component } from 'react';
import classes from './CellInput.css';

class cellInput extends Component {
  render() {
    return (
      <input
        className={classes.cellInput}
        value={this.props.value}
        onChange={this.props.changed}
        style={{
          color: this.props.color ? this.props.color : '#999',
          fontSize: this.props.fontSize ? this.props.fontSize : 'inherit',
          textAlign: this.props.textAlign ? this.props.textAlign : 'center'
        }}
      />
    );
  }
}

export default cellInput;
