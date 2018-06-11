import React, { Component } from 'react';
import classes from './SearchBar.css';
import MdSearch from 'react-icons/lib/md/search';
import MdClear from 'react-icons/lib/md/clear';

class SearchBar extends Component {
  state = {
    focused: false
  };

  onFocusHandler = () => {
    this.setState({
      focused: !this.state.focused
    });
  };

  render() {
    return (
      <div
        className={this.state.focused ? classes.focused : classes.inputGroup}
        onFocus={this.onFocusHandler}
        onBlur={this.onFocusHandler}
      >
        <input
          className={classes.searchInput}
          value={this.props.searchTerm}
          type="text"
          onChange={this.props.changed}
          placeholder="Rechercher"
        />
        {this.state.focused ? (
          <MdClear size={18} color="#969696" style={{ cursor: 'pointer' }} />
        ) : (
          <MdSearch size={18} color="#969696" />
        )}
      </div>
    );
  }
}

export default SearchBar;
