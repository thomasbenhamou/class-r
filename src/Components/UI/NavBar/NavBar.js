import React, { Component } from 'react';
import classes from './NavBar.css';
import Connection from './Connection/Connection';
import { connect } from 'react-redux';
import MdVerifiedUser from 'react-icons/lib/md/verified-user';
import MdSettings from 'react-icons/lib/md/settings';
import Modal from '../Modal/Modal';
import Customize from './Customize/Customize';

class NavBar extends Component {
  state = {
    showSettings: false
  };

  showSettings = () => {
    this.setState({
      showSettings: !this.state.showSettings
    });
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          show={this.state.showSettings}
          modalClosed={() => this.showSettings()}
          padding={'0px'}
        >
          <Customize />
        </Modal>
        <div className={classes.NavBar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {this.props.authUser ? (
              <span>
                <MdVerifiedUser size={18} />
                {this.props.authUser.email}
              </span>
            ) : null}
          </div>
          <h2 className={classes.brand}>classeur_</h2>
          <div>
            <MdSettings
              onClick={this.showSettings}
              size={20}
              color="#455560"
              style={{ cursor: 'pointer' }}
            />
            <Connection loggedIn={this.props.authUser ? true : false} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    authUser: state.authUser
  };
};

export default connect(mapStateToProps)(NavBar);
