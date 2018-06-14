import React, { Component } from 'react';
import { firebase } from './firebase/index';
import { connect } from 'react-redux';
import * as actions from './store/actions/actions';
import { Route, Switch, withRouter } from 'react-router-dom';
import Classeur from './Components/Classeur/Classeur';
import Home from './Components/Home/Home';

class App extends Component {
  componentDidMount = () => {
    // set up a listener for any login related changes
    firebase.auth.onAuthStateChanged(authUser => {
      this.props.initAuth(authUser);
    });
  };

  render() {
    return (
      <Switch>
        <Route path="/classeur" component={Classeur} />
        <Route path="/" exact component={Home} />
      </Switch>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initAuth: authUser => dispatch(actions.initAuth(authUser))
  };
};
export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(App)
);
