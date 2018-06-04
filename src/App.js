import React, { Component } from 'react';
import classes from './App.css';
import Clients from './Components/Clients/Clients';
import NavBar from './Components/UI/NavBar/NavBar';
import Quotes from './Components/Quotes/Quotes';
import Bills from './Components/Bills/Bills';
import {firebase} from './firebase/index';
import {connect} from 'react-redux';
import * as actions from './store/actions/actions';

class App extends Component {

  componentDidMount = () => {
    // set up a listener for any login related changes
    firebase.auth.onAuthStateChanged(authUser => {
      this.props.initAuth(authUser);
    });
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <div className={classes.main}>
          <Clients />
          <Quotes />
          <Bills />
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initAuth: (authUser) => dispatch(actions.initAuth(authUser))
  }
}
export default connect(null, mapDispatchToProps)(App);
