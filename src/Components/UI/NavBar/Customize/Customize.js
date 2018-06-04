import React, { Component } from 'react';
import { storage, database } from '../../../../firebase/firebase';
import CircleSpinner from '../../CircleSpinner/CircleSpinner';
import classes from './Customize.css';
import DisabledInput from '../../DisabledInput/DisabledInput';
import MdEmail from 'react-icons/lib/md/email';
import MdLocalPhone from 'react-icons/lib/md/local-phone';
import MdLocationOn from 'react-icons/lib/md/location-on';
import MdLocationCity from 'react-icons/lib/md/location-city';
import MdCloudDone from 'react-icons/lib/md/cloud-done';
import MdCached from 'react-icons/lib/md/cached';
import Button from '../../Button/Button';

class Customize extends Component {
  state = {
    loadingLogo: false,
    loading: false,
    logo: '',
    name: '',
    street: '',
    city: '',
    phone: '',
    email: '',
    dataChanged: false
  };

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    database
      .ref('companyInfo')
      .once('value')
      .then(snapshot => {
        this.setState({
          name: snapshot.val().name,
          street: snapshot.val().street,
          city: snapshot.val().city,
          phone: snapshot.val().phone,
          email: snapshot.val().email,
          loading: false
        });
      });
  };

  fileSelectedHandler = e => {
    this.setState({
      loadingLogo: true
    });
    const storageRef = storage.ref().child('customLogo.png');
    storageRef.put(e.target.files[0]).then(snapshot => {
      storageRef.getDownloadURL().then(url => {
        this.setState({
          logo: url,
          loadingLogo: false
        });
      });
    });
  };

  onNameChangeHandler = e => {
    let value = e.target.value;
    this.setState({
      name: value,
      dataChanged: true
    });
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
      [type]: value,
      dataChanged: true
    });
  };

  saveChanges = () => {
    this.setState({
      loading: true
    });
    const updatedCompanyData = {
      name: this.state.name,
      city: this.state.city,
      email: this.state.email,
      phone: this.state.phone,
      street: this.state.street
    };
    database
      .ref('companyInfo/')
      .update(updatedCompanyData)
      .then(error => {
        this.setState({
          loading: false,
          dataChanged: false
        });
      });
  };

  render() {
    let companyName = <CircleSpinner />;
    let companyInfos = <CircleSpinner />;
    if (this.state.name !== '') {
      companyName = (
        <DisabledInput
          large
          value={this.state.name}
          onChange={this.onNameChangeHandler}
        />
      );
      companyInfos = (
        <React.Fragment>
          <DisabledInput
            value={this.state.street}
            placeholder="Adresse"
            onChange={event => this.onChangeHandler(event, 'street')}
          >
            <MdLocationOn size={18} color="#969696" />
          </DisabledInput>
          <DisabledInput
            value={this.state.city}
            placeholder="Ville"
            onChange={event => this.onChangeHandler(event, 'city')}
          >
            <MdLocationCity size={18} color="#969696" />
          </DisabledInput>
          <DisabledInput
            value={this.state.phone}
            placeholder="Tel"
            onChange={event => this.onChangeHandler(event, 'phone')}
          >
            <MdLocalPhone size={18} color="#969696" />
          </DisabledInput>
          <DisabledInput
            placeholder="Email"
            value={this.state.email}
            onChange={event => this.onChangeHandler(event, 'email')}
          >
            <MdEmail size={18} color="#969696" />
          </DisabledInput>
        </React.Fragment>
      );
    }
    return (
      <div>
        <h2>Paramètres</h2>
        <div style={{ marginBottom: '30px' }}>{companyName}</div>
        <div className={classes.details}>
          <div>{companyInfos}</div>
          <div className={classes.logoDiv}>
            {this.state.loadingLogo ? (
              <CircleSpinner />
            ) : (
              <img
                className={classes.logo}
                src={
                  this.state.logo
                    ? this.state.logo
                    : 'https://firebasestorage.googleapis.com/v0/b/class-r.appspot.com/o/file.png?alt=media&token=b2401f73-fb92-4904-9bd3-b4712d247a05'
                }
                alt="logo"
              />
            )}
            <div className={classes.inputDiv}>
              <label className={classes.fileInput} htmlFor="inputRef">
                Sélectionner un logo
              </label>
              <input
                style={{ display: 'none' }}
                type="file"
                onChange={this.fileSelectedHandler}
                id="inputRef"
              />
            </div>
          </div>
        </div>
        <div className={classes.saveDiv}>
          {this.state.loading ? (
            <Button>
              <CircleSpinner />
            </Button>
          ) : this.state.dataChanged ? (
            <Button btnType="saveButton" clicked={this.saveChanges}>
              <MdCached size={18} /> Sauvegarder les modifications
            </Button>
          ) : (
            <Button btnType="savedButton" clicked={this.saveChanges}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MdCloudDone color="#41B695" size={18} /> Données enregistrées
              </span>
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Customize;
