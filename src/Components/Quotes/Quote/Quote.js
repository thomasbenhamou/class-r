import React, { Component } from 'react';
import classes from './Quote.css';
import MdMoreHoriz from 'react-icons/lib/md/more-horiz';

class Quote extends Component {
  onDragStart = e => {
    e.dataTransfer.setData('quoteId', this.props.id);
  };
  render() {
    return (
      <div className={classes.Quote} draggable onDragStart={this.onDragStart}>
        <div className={classes.line}>
          <span>{this.props.name}</span>
          <span className={classes.editButton}>
            <MdMoreHoriz
              onClick={this.props.clicked}
              size={18}
              color="#969696"
            />
          </span>
        </div>
        {this.props.children}
        <div className={classes.line}>
          <span className={classes.span}>{this.props.date}</span>
          <span className={classes.span}>{this.props.totalPrice}€</span>
        </div>
      </div>
    );
  }
}

export default Quote;
