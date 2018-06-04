import React, { Component } from 'react';
import classes from './Quotes.css';
import axios from 'axios';
import { connect } from 'react-redux';
import Quote from './Quote/Quote';
import Modal from '../UI/Modal/Modal';
import QuoteDetails from './QuoteDetails/QuoteDetails';
import ButtonSpinner from '../UI/ButtonSpinner/ButtonSpinner';
import ButtonInput from '../UI/ButtonInput/ButtonInput';
import { database } from '../../firebase/firebase';
import BottomToaster from '../UI/BottomToaster/BottomToaster';
import Button from '../UI/Button/Button';

class Quotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: null,
      selectedClient: null,
      showDetails: false,
      selectedQuote: null,
      selectedQuoteDetails: null,
      loadingNewQuote: false,
      needToSelect: false,
      warningMessage: '',
      deleteModal: {
        show: false,
        loading: false
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      selectedClient: props.selectedClient
    };
  }

  componentDidMount = () => {
    database
      .ref('quotes/')
      .once('value')
      .then(snapshot => {
        this.setState({
          quotes: snapshot.val()
        });
      });
  };

  openDetails = quoteId => {
    this.setState({
      showDetails: true,
      selectedQuote: quoteId,
      selectedQuoteDetails: {
        ...this.state.quotes[quoteId]
      }
    });
  };

  updateList = () => {
    axios
      .get('https://class-r.firebaseio.com/quotes.json')
      .then(res => {
        this.setState({
          quotes: res.data,
          loadingNewQuote: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  addNewQuote = newQuoteName => {
    this.setState({
      loadingNewQuote: true
    });
    const today = new Date();
    database.ref('quotes/').push(
      {
        clientId: this.state.selectedClient,
        name: newQuoteName,
        date: today.toLocaleDateString(),
        totalPrice: 0,
        details: [
          {
            product: '',
            unitPrice: '',
            quantity: ''
          }
        ]
      },
      error => {
        if (error) {
          console.log('error');
        } else {
          this.updateList();
        }
      }
    );
  };

  onAddQuoteFocused = () => {
    if (!this.state.selectedClient) {
      if (this.state.warningMessage === '') {
        this.setState({
          warningMessage: 'Sélectionnez un client avant de créer un devis'
        });
      } else {
        this.setState({
          warningMessage: ''
        });
      }
    }
  };

  confirmDeleteQuote = () => {
    if (this.state.deleteModal.show) {
      this.setState({
        deleteModal: {
          show: false,
          loading: false
        }
      });
    } else {
      this.setState({ deleteModal: { show: true, loading: false } });
    }
  };

  deleteQuote = () => {
    this.setState({
      deleteModal: {
        show: true,
        loading: true
      }
    });
    database
      .ref('quotes/' + this.state.selectedQuote)
      .remove()
      .then(() => {
        this.setState(
          {
            deleteModal: {
              show: false,
              loading: false
            },
            showDetails: false
          },
          this.updateList()
        );
      });
  };

  detailsChangedHandler = hasChanged => {
    if (hasChanged) {
      this.updateList();
    }
  };

  render() {
    let quotes = null;
    if (this.state.quotes) {
      quotes = Object.keys(this.state.quotes).map(quoteId => {
        if (this.state.selectedClient === this.state.quotes[quoteId].clientId) {
          return (
            <Quote
              key={quoteId}
              id={quoteId}
              name={this.state.quotes[quoteId].name}
              date={this.state.quotes[quoteId].date}
              totalPrice={this.state.quotes[quoteId].totalPrice}
              clicked={() => this.openDetails(quoteId)}
            />
          );
        } else return null;
      });
    }

    let detailsModal = null;
    if (this.state.selectedQuote) {
      detailsModal = (
        <Modal
          show={this.state.showDetails && this.state.selectedQuote}
          modalClosed={() => this.setState({ showDetails: false })}
          modalType="large"
        >
          <QuoteDetails
            {...this.state.selectedQuoteDetails}
            quoteId={this.state.selectedQuote}
            hasChanged={this.detailsChangedHandler}
            onDelete={this.confirmDeleteQuote}
          />
        </Modal>
      );
    }

    const deleteModal = (
      <BottomToaster
        show={this.state.deleteModal.show}
        modalClosed={this.confirmDeleteQuote}
      >
        Êtes-vous sûr de vouloir supprimer ce devis ?
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button clicked={this.confirmDeleteQuote} btnType="cancelDelete">
            Annuler
          </Button>
          <Button clicked={this.deleteQuote} btnType="confirmDelete">
            Supprimer
          </Button>
        </div>
      </BottomToaster>
    );

    return (
      <div className={classes.Quotes}>
        {deleteModal}
        <h2>Devis</h2>
        {!this.state.selectedClient ? (
          <div className={classes.prompt}>
            Sélectionnez un client pour voir les devis associés
          </div>
        ) : (
          <div className={classes.quotesContainer}>
            {this.state.loadingNewQuote ? (
              <Quote name="...">
                <ButtonSpinner />
              </Quote>
            ) : null}
            {quotes}
          </div>
        )}
        {detailsModal}
        <div className={classes.fixedBottomMenu}>
          <div className={classes.warningMessage}>
            {this.state.warningMessage}
          </div>
          <ButtonInput
            placeholder="Créer devis"
            type="newQuote"
            clicked={newQuote => this.addNewQuote(newQuote)}
            loading={this.state.loadingNewQuote}
            focused={this.onAddQuoteFocused}
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

export default connect(mapStateToProps)(Quotes);
