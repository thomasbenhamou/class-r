import React, { Component } from 'react';
import Button from '../../Button/Button';
import Login from './Login/Login';
import { auth } from '../../../../firebase/index';
import ButtonSpinner from '../../ButtonSpinner/ButtonSpinner';

class Connection extends Component {
  state = {
    show: false,
    loading: false
  };

  switchShowState = () => {
    this.setState({
      show: !this.state.show
    });
  };

  closeLogin = () => {
    this.setState({
      show: false
    });
  };

  onSignOut = () => {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      auth.doSignOut().then(res => {
        console.log(res);
        this.setState({
          loading: false
        });
      });
    }, 500);
  };

  render() {
    let connection = (
      <Button btnType="connectButton" clicked={this.switchShowState}>
        Se connecter
      </Button>
    );

    if (this.state.show) {
      connection = (
        <React.Fragment>
          <Button btnType="connectButton" clicked={this.switchShowState}>
            Se connecter
          </Button>
          <Login show={this.state.show} closeLogin={this.closeLogin} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {this.props.loggedIn ? (
          this.state.loading ? (
            <ButtonSpinner />
          ) : (
            <Button btnType="logout" clicked={this.onSignOut}>
              Déconnection
            </Button>
          )
        ) : (
          connection
        )}
      </React.Fragment>
    );
  }
}

export default Connection;
