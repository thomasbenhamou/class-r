import React, { Component } from 'react';
import DisabledInput from '../../UI/DisabledInput/DisabledInput';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '../../UI/Button/Button';
import classes from './Details.css';
import MdCloudDone from 'react-icons/lib/md/cloud-done';
import MdCached from 'react-icons/lib/md/cached';
import MdEmail from 'react-icons/lib/md/email';
import MdLocalPhone from 'react-icons/lib/md/local-phone';
import MdLocationOn from 'react-icons/lib/md/location-on';
import MdLocationCity from 'react-icons/lib/md/location-city';
import SmallDeleteButton from '../../UI/SmallDeleteButton/SmallDeleteButton';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';

class Details extends Component {
  state = {
    clientId: this.props.clientId,
    clientName: this.props.clientName,
    details: this.props.details,
    dataChanged: false,
    nameChanged: false,
    loading: false
  };

  onNameChangeHandler = event => {
    let value = event.target.value;
    this.setState({
      clientName: value,
      nameChanged: true
    });
  };

  saveNameChanges = () => {
    if (!this.state.nameChanged) {
      return;
    } else {
      this.setState({
        loading: true
      });
      axios
        .patch(
          'https://class-r.firebaseio.com/clients/' +
            this.props.selectedClient +
            '.json',
          { name: this.state.clientName }
        )
        .then(response => {
          this.setState({
            nameChanged: false,
            loading: false
          });
          this.props.updated();
        })
        .catch(error => {
          console.log(error);
          this.setState({
            loading: false
          });
        });
    }
  };

  onChangeHandler = (event, type) => {
    let value = event.target.value;

    if (type === 'phone') {
      value = value
        // Remove all non-digits, turn initial 33 into nothing
        .replace(/\D+/, '')
        .replace(/^330?/, '0')
        // Add a space after any 2-digit group followed by more digits
        .replace(/(\d{2})(?=\d)/g, '$1 ')
        // Stick to first 10, ignore later digits
        .slice(0, 14);
    }

    if (type === 'city') {
      value = value.toUpperCase();
    }

    this.setState({
      ...this.state,
      details: {
        ...this.state.details,
        [type]: value
      },
      dataChanged: true
    });
  };

  saveChanges = () => {
    if (!this.state.dataChanged) {
      if (this.state.nameChanged) {
        this.saveNameChanges();
      }
      return;
    } else {
      this.setState({
        loading: true
      });
      axios
        .patch(
          'https://class-r.firebaseio.com/clients/' +
            this.props.selectedClient +
            '/details.json',
          this.state.details
        )
        .then(response => {
          this.setState({
            dataChanged: false,
            loading: false
          });
          this.props.updated();
        })
        .catch(error => {
          console.log(error);
          this.setState({
            loading: false
          });
        });
    }
  };

  render() {
    const details = this.state.details ? (
      <React.Fragment>
        <DisabledInput
          large
          value={this.state.clientName}
          onChange={event => this.onNameChangeHandler(event)}
        />
        <hr className={classes.line} />
        <div>
          <DisabledInput
            value={this.state.details.street}
            placeholder="Adresse"
            onChange={event => this.onChangeHandler(event, 'street')}
          >
            <MdLocationOn size={18} color="#969696" />
          </DisabledInput>
          <DisabledInput
            value={this.state.details.city}
            placeholder="Ville"
            onChange={event => this.onChangeHandler(event, 'city')}
          >
            <MdLocationCity size={18} color="#969696" />
          </DisabledInput>
          <DisabledInput
            value={this.state.details.phone}
            placeholder="Tel"
            onChange={event => this.onChangeHandler(event, 'phone')}
          >
            <MdLocalPhone size={18} color="#969696" />
          </DisabledInput>
          <DisabledInput
            placeholder="Email"
            value={this.state.details.email}
            onChange={event => this.onChangeHandler(event, 'email')}
          >
            <MdEmail size={18} color="#969696" />
          </DisabledInput>
        </div>
      </React.Fragment>
    ) : (
      ''
    );

    return (
      <div>
        {details}
        {this.state.loading ? (
          <Button>
            <CircleSpinner />
          </Button>
        ) : (
          <React.Fragment>
            {this.state.dataChanged || this.state.nameChanged ? (
              <Button btnType="saveButton" clicked={this.saveChanges}>
                <MdCached size={18} /> Sauvegarder les modifications
              </Button>
            ) : (
              <Button btnType="savedButton" clicked={this.saveChanges}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <MdCloudDone color="#41B695" size={18} /> Données enregistrées
                </span>
              </Button>
            )}
            <SmallDeleteButton clicked={this.props.onDelete} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedClient: state.selectedClient
  };
};

export default connect(mapStateToProps)(Details);
