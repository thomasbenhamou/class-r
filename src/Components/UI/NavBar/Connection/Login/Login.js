import React, { Component } from 'react';
import classes from './Login.css';
import Backdrop from '../../../Backdrop/Backdrop';
import Button from '../../../Button/Button';
import { auth } from '../../../../../firebase/index';
import ButtonSpinner from '../../../ButtonSpinner/ButtonSpinner';

class Login extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    error: null,
    isLoggingIn: true,
    loading: false
  };

  onSignUp = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    auth
      .doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(authUser => {
        console.log(authUser);
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  };

  onLogIn = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    auth
      .doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then(authUser => {
        console.log(authUser);
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  };

  handleInput = (type, event) => {
    this.setState({
      ...this.state,
      [type]: event.target.value
    });
  };

  switchAuthMode = () => {
    this.setState({
      isLoggingIn: !this.state.isLoggingIn
    });
  };

  render() {
    const isValidSignUpForm =
      this.state.password === this.state.confirmPassword &&
      this.state.password !== '' &&
      this.state.email !== '';

    const isValidLoginForm =
      this.state.password !== '' && this.state.email !== '';

    const signingInForm = (
      <form onSubmit={this.onSignUp}>
        <input
          className={classes.Input}
          autoComplete="email"
          type="email"
          value={this.state.email}
          placeholder="Email"
          onChange={event => this.handleInput('email', event)}
        />
        <input
          className={classes.Input}
          autoComplete="current-password"
          type="password"
          value={this.state.password}
          placeholder="Mot de passe"
          onChange={event => this.handleInput('password', event)}
        />
        <input
          className={classes.Input}
          type="password"
          autoComplete="current-password"
          value={this.state.confirmPassword}
          placeholder="Confirmez mot de passe"
          onChange={event => this.handleInput('confirmPassword', event)}
        />
        {this.state.loading ? (
          <ButtonSpinner />
        ) : (
          <Button btnType="loginButton" disabled={!isValidSignUpForm}>
            Créer mon compte
          </Button>
        )}
      </form>
    );

    const loggingInForm = (
      <form onSubmit={this.onLogIn}>
        <input
          className={classes.Input}
          type="email"
          autoComplete="email"
          value={this.state.email}
          placeholder="Email"
          onChange={event => this.handleInput('email', event)}
        />
        <input
          className={classes.Input}
          autoComplete="current-password"
          type="password"
          value={this.state.password}
          placeholder="Mot de passe"
          onChange={event => this.handleInput('password', event)}
        />
        {this.state.loading ? (
          <ButtonSpinner />
        ) : (
          <Button btnType="loginButton" disabled={!isValidLoginForm}>
            Connection
          </Button>
        )}
      </form>
    );
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.closeLogin} />
        <div className={classes.login}>
          {this.state.isLoggingIn ? loggingInForm : signingInForm}
          {this.state.isLoggingIn ? (
            <Button btnType="createAccount" clicked={this.switchAuthMode}>
              Créer un compte
            </Button>
          ) : (
            <Button btnType="createAccount" clicked={this.switchAuthMode}>
              Se connecter
            </Button>
          )}
          {this.state.error && <p>{this.state.error.message}</p>}
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
