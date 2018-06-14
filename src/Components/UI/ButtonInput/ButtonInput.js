import React, { Component } from 'react';
import classes from './ButtonInput.css';
import MdPersonAdd from 'react-icons/lib/md/person-add';
import MdAdd from 'react-icons/lib/md/add';
import ButtonSpinner from '../ButtonSpinner/ButtonSpinner';

class ButtonInput extends Component {
  state = {
    newItemName: '',
    focused: false
  };

  inputRef = React.createRef();

  inputChangeHandler = event => {
    this.setState({
      newItemName: event.target.value
    });
  };

  clickHandler = e => {
    e.preventDefault();
    if (this.state.newItemName === '') {
      this.inputRef.current.focus();
      this.setState({
        focused: true
      });
      return;
    }
    this.props.clicked(this.state.newItemName);
    this.setState({
      newItemName: ''
    });
    return;
  };

  onFocusHandler = () => {
    this.setState({
      focused: !this.state.focused
    });
    if (this.props.focused) {
      this.props.focused();
    }
  };

  render() {
    let icon = null;
    switch (this.props.type) {
      case 'newClient':
        icon = (
          <MdPersonAdd size={25} color="#969696" className={classes.icon} />
        );
        break;
      case 'newQuote':
        icon = <MdAdd size={25} color="#969696" className={classes.icon} />;
        break;
      default:
        icon = (
          <MdPersonAdd size={25} color="#969696" className={classes.icon} />
        );
        break;
    }

    return (
      <React.Fragment>
        <form onSubmit={this.clickHandler} style={{ zIndex: '200' }}>
          <div
            className={classes.inputGroup}
            onFocus={this.onFocusHandler}
            onBlur={this.onFocusHandler}
          >
            {this.props.loading ? (
              <ButtonSpinner />
            ) : (
              <input
                type="text"
                ref={this.inputRef}
                placeholder={this.props.placeholder}
                className={classes.Input}
                value={this.state.newItemName}
                onChange={this.inputChangeHandler}
              />
            )}
            <button type="submit" className={classes.noButton}>
              {icon}
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default ButtonInput;
