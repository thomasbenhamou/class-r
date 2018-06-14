import React, { Component } from 'react';
import classes from './Quotes.css';
import { connect } from 'react-redux';
import Quote from './Quote/Quote';
import Modal from '../UI/Modal/Modal';
import QuoteDetails from './QuoteDetails/QuoteDetails';
import ButtonInput from '../UI/ButtonInput/ButtonInput';
import { database } from '../../firebase/firebase';
import BottomToaster from '../UI/BottomToaster/BottomToaster';
import Button from '../UI/Button/Button';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import QuotePdf from '../Pdfs/QuotePdf/QuotePdf';
import SearchBar from '../UI/SearchBar/SearchBar';

class Quotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: null,
      selectedClient: null,
      showDetails: false,
      selectedQuote: null,
      loadingNewQuote: false,
      searchTerm: '',
      needToSelect: false,
      warningMessage: '',
      deleteModal: {
        show: false,
        loading: false
      },
      creatingPdf: false
    };
  }

  quoteContainerRef = React.createRef();

  static getDerivedStateFromProps(props, state) {
    return {
      selectedClient: props.selectedClient
    };
  }

  componentDidMount = () => {
    database.ref('quotes/').on('value', snapshot => {
      this.setState({
        quotes: snapshot.val()
      });
    });
  };

  openDetails = quoteId => {
    this.setState({
      showDetails: true,
      selectedQuote: quoteId
    });
  };

  updateList = () => {
    database.ref('quotes/').on('value', snapshot => {
      this.setState({
        quotes: snapshot.val(),
        loadingNewQuote: false
      });
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
        ],
        comments: ''
      },
      error => {
        this.setState({
          loadingNewQuote: false
        });
        this.scrollToBottom();
        if (error) {
          console.log('error');
        }
      }
    );
  };

  scrollToBottom = () => {
    const container = this.quoteContainerRef.current;
    container.scrollTop = container.scrollHeight;
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
    database.ref('quotes/' + this.state.selectedQuote).off();
    database.ref('quotes/' + this.state.selectedQuote).remove(error => {
      this.setState({
        deleteModal: {
          show: false,
          loading: false
        },
        showDetails: false
      });
    });
  };

  detailsChangedHandler = hasChanged => {
    if (hasChanged) {
      this.updateList();
    }
  };

  createPdf = (
    quoteName,
    quoteData,
    quoteComments,
    companyData,
    clientData
  ) => {
    this.setState({
      creatingPdf: true
    });
    // render  a new component custom made for pdf
    const html = ReactDOMServer.renderToStaticMarkup(
      <QuotePdf
        name={quoteName}
        details={quoteData}
        comments={quoteComments}
        companyInfo={companyData}
        clientInfo={clientData}
      />
    );
    const options = {
      margin: 0.5,
      filename: ('Devis ' + quoteName + '.pdf').trim(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        logging: false,
        useCORS: true
      },
      jsPDF: { unit: 'in', orientation: 'portrait' }
    };
    html2pdf()
      .from(html)
      .set(options)
      .save()
      .then(res => {
        this.setState({
          creatingPdf: false
        });
      });
  };

  render() {
    let quotes = null;
    if (this.state.quotes) {
      let displayedList = this.filterList(
        this.state.quotes,
        this.state.searchTerm
      );
      if (!displayedList) quotes = 'Aucun résulat';
      displayedList &&
        (quotes = Object.keys(displayedList).map(quoteId => {
          if (this.state.selectedClient === displayedList[quoteId].clientId) {
            return (
              <Quote
                key={quoteId}
                id={quoteId}
                name={displayedList[quoteId].name}
                date={displayedList[quoteId].date}
                totalPrice={displayedList[quoteId].totalPrice}
                clicked={() => this.openDetails(quoteId)}
              />
            );
          } else return null;
        }));
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
            quoteId={this.state.selectedQuote}
            clientId={this.props.selectedClient}
            name={this.state.name}
            onDelete={this.confirmDeleteQuote}
            createPdf={this.createPdf}
            creatingPdf={this.state.creatingPdf}
            customLogo={this.props.customLogo}
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
        <div className={classes.catTitle}>Devis</div>
        <SearchBar
          searchTerm={this.state.searchTerm}
          changed={this.handleChangeInput}
        />
        {!this.state.selectedClient ? (
          <div className={classes.prompt}>
            Sélectionnez un client pour voir les devis associés
          </div>
        ) : (
          <div className={classes.quotesContainer} ref={this.quoteContainerRef}>
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
    selectedClient: state.selectedClient,
    customLogo: state.customLogo
  };
};

export default connect(mapStateToProps)(Quotes);
