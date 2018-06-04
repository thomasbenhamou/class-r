import React, { Component } from 'react';
import Client from './Client/Client';
import axios from 'axios';
import classes from './Clients.css';
import ButtonInput from '../UI/ButtonInput/ButtonInput';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import MdSearch from 'react-icons/lib/md/search';
import { database } from '../../firebase/firebase';
import Button from '../UI/Button/Button';
import ButtonSpinner from '../UI/ButtonSpinner/ButtonSpinner';
import BottomToaster from '../UI/BottomToaster/BottomToaster';
import Spinner from '../UI/Spinner/Spinner';

class Clients extends Component {
  state = {
    clients: null,
    newClient: '',
    showingDetails: null,
    loadingNewClient: false,
    searchTerm: '',
    deleteModal: {
      show: false,
      name: '',
      loading: false
    },
    scrollAfterNewClient: false
  };

  clientContainerRef = React.createRef();

  componentDidMount = () => {
    // Calling setState() in this method will trigger an extra rendering, but it will happen before the browser updates the screen.This guarantees that even though the render() will be called twice in this case, the user won’t see the intermediate state.Use this pattern with caution because it often causes performance issues.It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.
    axios
      .get('https://class-r.firebaseio.com/clients.json')
      .then(response => {
        this.setState({
          clients: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  scrollToBottom = () => {
    const container = this.clientContainerRef.current;
    container.scrollTop = container.scrollHeight;
    this.setState({
      scrollAfterNewClient: false
    });
  };

  updateList = () => {
    axios
      .get('https://class-r.firebaseio.com/clients.json')
      .then(response => {
        this.setState({
          clients: response.data,
          newClient: '',
          loadingNewClient: false
        });
        if (this.state.scrollAfterNewClient) {
          this.scrollToBottom();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  addNewClient = newClientName => {
    this.setState({
      loadingNewClient: true
    });
    const newClient = {
      name: newClientName,
      details: {
        city: '',
        email: '',
        phone: '',
        street: ''
      }
    };
    axios
      .post('https://class-r.firebaseio.com/clients.json', newClient)
      .then(response => {
        this.setState({
          scrollAfterNewClient: true
        });
        this.updateList();
      })
      .catch(error => {
        this.setState({
          loadingNewClient: false
        });
        console.log(error);
      });
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
    let filteredList = null;
    Object.keys(list).map(e => {
      const listElem = list[e].name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      if (listElem.match(search)) {
        filteredList = {
          ...filteredList,
          [e]: {
            ...list[e]
          }
        };
      }
      return null;
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
        this.updateList();
      })
      .catch(error => {
        console.log('Remove failed: ' + error.message);
      });
  };

  render() {
    let clientList = <Spinner />;

    if (this.state.clients) {
      let displayedList = this.filterList(
        this.state.clients,
        this.state.searchTerm
      );
      if (!displayedList) clientList = 'Aucun résulat';
      displayedList &&
        (clientList = Object.keys(displayedList).map(clientId => {
          return (
            clientId && (
              <Client
                key={clientId}
                id={clientId}
                name={displayedList[clientId].name}
                details={
                  displayedList[clientId].details
                    ? displayedList[clientId].details
                    : null
                }
                clicked={this.onSelectClient}
                clickedDetails={this.onShowDetails}
                selected={clientId === this.props.selectedClient}
                onDelete={() =>
                  this.confirmDeleteClient(displayedList[clientId].name)
                }
                showDetails={clientId === this.state.showingDetails}
                updated={this.updateList}
              />
            )
          );
        }));
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
        <h2>Clients</h2>
        <div className={classes.inputGroup}>
          <input
            className={classes.searchInput}
            value={this.state.searchTerm}
            type="text"
            onChange={this.handleChangeInput}
            placeholder="Rechercher"
          />
          <MdSearch size={25} color="#969696" />
        </div>

        <div className={classes.ClientsContainer} ref={this.clientContainerRef}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
