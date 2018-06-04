import React, { Component } from 'react';
import classes from './Controls.css';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';
import MdRemoveCircleOutline from 'react-icons/lib/md/remove-circle-outline';

class Controls extends Component {
  state = {
    hoveredPlus: false,
    hoveredMinus: false
  };

  switchPlusState = () => {
    this.setState({ hoveredPlus: !this.state.hoveredPlus });
  };
  switchMinusState = () => {
    this.setState({ hoveredMinus: !this.state.hoveredMinus });
  };
  render() {
    return (
      <div className={classes.wrapper}>
        <MdAddCircleOutline
          size={18}
          color={this.state.hoveredPlus ? '#41b695' : '#969696'}
          onClick={this.props.clickedAdd}
          className={classes.controlIcon}
          onMouseEnter={this.switchPlusState}
          onMouseLeave={this.switchPlusState}
        />
        {this.props.disableMinus ? null : (
          <MdRemoveCircleOutline
            size={18}
            color={this.state.hoveredMinus ? '#41b695' : '#969696'}
            onClick={this.props.clickedRemove}
            className={classes.controlIcon}
            onMouseEnter={this.switchMinusState}
            onMouseLeave={this.switchMinusState}
          />
        )}
      </div>
    );
  }
}

export default Controls;
