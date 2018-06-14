import React, { Component } from 'react';
import Client from './Client/Client';
import classes from './Clients.css';
import ButtonInput from '../UI/ButtonInput/ButtonInput';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import { database } from '../../firebase/firebase';
import Button from '../UI/Button/Button';
import ButtonSpinner from '../UI/ButtonSpinner/ButtonSpinner';
import BottomToaster from '../UI/BottomToaster/BottomToaster';
import Spinner from '../UI/Spinner/Spinner';
import SearchBar from '../UI/SearchBar/SearchBar';

class Clients extends Component {
  state = {
    clients: null,
    newClient: '',
    showingDetails: null,
    loadingNewClient: false,
    newClientIndex: null,
    searchTerm: '',
    deleteModal: {
      show: false,
      name: '',
      loading: false
    }
  };

  newClientRef = React.createRef();
  clientsContainerRef = React.createRef();
  clientsArray = [];

  componentDidMount = () => {
    database.ref('clients/').on('value', snap => {
      this.setState({
        clients: snap.val()
      });
    });
  };

  convertJsonToArray = jsonList => {
    let arrayList = [];
    Object.keys(jsonList).map(e => {
      const client = {
        id: e,
        name: jsonList[e].name,
        details: jsonList[e].details
      };
      arrayList.push(client);
      return null;
    });
    return arrayList;
  };

  sortClients = arrayList => {
    const sortedList = arrayList.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
    return sortedList;
  };

  addNewClient = newClientName => {
    this.setState({
      loadingNewClient: true
    });
    database.ref('clients/').push(
      {
        name: newClientName,
        details: {
          city: '',
          email: '',
          phone: '',
          street: ''
        }
      },
      complete => {
        this.setState({
          loadingNewClient: false
        });
        this.scrollAfterNewClient(newClientName);
      }
    );
  };

  scrollAfterNewClient = name => {
    const i = this.clientsArray.findIndex(e => {
      return e.name === name;
    });
    this.setState({
      newClientIndex: i
    });
    const container = this.clientsContainerRef.current;
    const scrollTarget = i * 36;
    container.scrollTop = scrollTarget;
    setTimeout(() => {
      this.setState({
        newClientIndex: null
      });
    }, 2000);
  };

  onSelectClient = (event, clientId) => {
    this.props.onSelectClient(clientId);
  };

  onShowDetails = clientId => {
    if (this.state.showingDetails === clientId) {
      this.setState({
        showingDetails: null,
        deleteModal: {
          show: false,
          ...this.state.confirmModal
        }
      });
      return;
    }
    this.setState({
      showingDetails: clientId
    });
  };

  handleChangeInput = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  filterList = (list, searchTerm) => {
    const search = searchTerm
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (searchTerm === '') {
      return list;
    }
    let filteredList = list.filter(e => {
      const listElem = e.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return listElem.match(search);
    });
    return filteredList;
  };

  confirmDeleteClient = clientName => {
    if (this.state.deleteModal.show) {
      this.setState({
        deleteModal: {
          show: false,
          name: ''
        }
      });
    } else {
      this.setState({
        deleteModal: {
          show: true,
          name: clientName
        }
      });
    }
  };

  deleteClient = () => {
    this.setState({
      deleteModal: {
        ...this.state.deleteModal,
        loading: true
      }
    });

    const quotesRef = database.ref('quotes/');
    quotesRef
      .orderByChild('clientId')
      .equalTo(this.props.selectedClient)
      .once('value', snap => {
        let updates = {};
        snap.forEach(child => (updates[child.key] = null));
        quotesRef.update(updates);
      });

    const billsRef = database.ref('bills/');
    billsRef
      .orderByChild('clientId')
      .equalTo(this.props.selectedClient)
      .once('value', snap => {
        let updates = {};
        snap.forEach(child => (updates[child.key] = null));
        billsRef.update(updates);
      });

    let clientRef = database.ref('clients/' + this.props.selectedClient);
    clientRef
      .remove()
      .then(() => {
        this.setState({
          deleteModal: {
            ...this.state.deleteModal,
            loading: false
          }
        });
        this.confirmDeleteClient();
        this.onShowDetails();
      })
      .catch(error => {
        console.log('Remove failed: ' + error.message);
      });
  };

  render() {
    let clientList = <Spinner />;
    if (this.state.clients) {
      const arrayList = this.convertJsonToArray(this.state.clients);
      clientList = this.sortClients(arrayList);
      let filteredList = this.filterList(clientList, this.state.searchTerm);
      this.clientsArray = filteredList;
      clientList = filteredList.map((e, index) => {
        return (
          <Client
            key={e.id}
            id={e.id}
            name={e.name}
            isNew={this.state.newClientIndex === index ? true : false}
            details={e.details}
            clicked={this.onSelectClient}
            clickedDetails={this.onShowDetails}
            selected={e.id === this.props.selectedClient}
            onDelete={() => this.confirmDeleteClient(e.name)}
            showDetails={e.id === this.state.showingDetails}
          />
        );
      });
    }

    const confirmModal = (
      <BottomToaster
        show={this.state.deleteModal.show}
        modalClosed={this.confirmDeleteClient}
      >
        Supprimer le client <strong>{this.state.deleteModal.name}</strong> et
        toutes les données associées ?
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button clicked={this.confirmDeleteClient} btnType="cancelDelete">
            Annuler
          </Button>
          <Button clicked={this.deleteClient} btnType="confirmDelete">
            {this.state.deleteModal.loading ? <ButtonSpinner /> : 'Supprimer'}
          </Button>
        </div>
      </BottomToaster>
    );

    return (
      <div className={classes.Clients}>
        {confirmModal}
        <div className={classes.catTitle}>Clients</div>
        <SearchBar
          searchTerm={this.state.searchTerm}
          changed={this.handleChangeInput}
        />
        <div
          className={classes.ClientsContainer}
          ref={this.clientsContainerRef}
        >
          {clientList}
          {this.state.loadingNewClient ? (
            <Client name="...">
              <ButtonSpinner />
            </Client>
          ) : null}
        </div>
        <div className={classes.fixedBottomMenu}>
          <ButtonInput
            placeholder="Nouveau client"
            type="newClient"
            clicked={newClient => this.addNewClient(newClient)}
            loading={this.state.loadingNewClient}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedClient: state.selectedClient
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectClient: clientId => dispatch(actions.selectClient(clientId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clients);
