import React, { Component } from 'react';
import classes from './Bills.css';
import DropzoneBill from './DropzoneBill/DropzoneBill';
import { database } from '../../firebase/firebase';
import { connect } from 'react-redux';
import Bill from './Bill/Bill';
import ButtonSpinner from '../UI/ButtonSpinner/ButtonSpinner';
import Modal from '../UI/Modal/Modal';
import BillDetails from './BillDetails/BillDetails';
import BottomToaster from '../UI/BottomToaster/BottomToaster';
import Button from '../UI/Button/Button';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import BillPdf from '../Pdfs/BillPdf/BillPdf';
import SearchBar from '../UI/SearchBar/SearchBar';

class Bills extends Component {
  state = {
    bills: null,
    loading: false,
    showDetails: false,
    selectedBill: null,
    selectedBillDetails: null,
    deleteModal: {
      show: false,
      loading: false
    },
    searchTerm: '',
    loadingSentIcon: false,
    loadingPaidIcon: false,
    creatingPdf: false,
    showBillAlreadyExistsModal: false,
    newBillId: null,
    newBillData: null
  };

  checkIfBillExists = (quoteId, data) => {
    database.ref('bills/' + quoteId).once('value', snap => {
      if (snap.val()) {
        this.setState({
          showBillAlreadyExistsModal: true,
          newBillId: quoteId,
          newBillData: data
        });
      } else this.createBillFromQuote(quoteId, data);
    });
  };

  createBillFromQuote = (quoteId, data) => {
    this.setState({
      loading: true
    });
    const today = new Date();
    let billData = {
      ...data,
      date: today.toLocaleDateString(),
      sent: false,
      paid: false
    };

    database
      .ref('bills/' + quoteId)
      .set(billData)
      .then(error => {
        this.updateList();
        if (this.state.showBillAlreadyExistsModal) {
          this.setState({
            showBillAlreadyExistsModal: false
          });
        }
        if (error) console.log(error);
      });
  };

  updateList = () => {
    database
      .ref('bills/')
      .once('value')
      .then(snapshot => {
        this.setState({
          loading: false,
          bills: snapshot.val()
        });
      });
  };

  componentDidMount = () => {
    database.ref('bills/').on('value', snapshot => {
      this.setState({
        bills: snapshot.val()
      });
    });
  };

  openDetails = billId => {
    this.setState({
      showDetails: true,
      selectedBill: billId,
      selectedBillDetails: {
        ...this.state.bills[billId]
      }
    });
  };

  detailsChangedHandler = hasChanged => {
    if (hasChanged) {
      this.updateList();
    }
  };

  confirmDeleteBill = () => {
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

  deleteBill = () => {
    database.ref('bills/' + this.state.selectedBill).off();
    this.setState({
      deleteModal: {
        show: true,
        loading: true
      }
    });
    database
      .ref('bills/' + this.state.selectedBill)
      .remove()
      .then(() => {
        this.setState({
          deleteModal: {
            show: false,
            loading: false
          },
          showDetails: false
        });
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

  sendIconHandler = billId => {
    this.setState({
      loadingSentIcon: billId
    });
    const newIconState = !this.state.bills[billId].sent;
    database
      .ref('bills/' + billId)
      .update({
        sent: newIconState
      })
      .then(() => {
        this.setState({
          bills: {
            ...this.state.bills,
            [billId]: {
              ...this.state.bills[billId],
              sent: newIconState
            }
          },
          loadingSentIcon: false
        });
      });
  };

  payIconHandler = billId => {
    this.setState({
      loadingPaidIcon: billId
    });
    const newIconState = !this.state.bills[billId].paid;
    database
      .ref('bills/' + billId)
      .update({
        paid: newIconState
      })
      .then(() => {
        this.setState({
          bills: {
            ...this.state.bills,
            [billId]: {
              ...this.state.bills[billId],
              paid: newIconState
            }
          },
          loadingPaidIcon: false
        });
      });
  };

  createPdf = (billName, billData, billComments, companyData, clientData) => {
    this.setState({
      creatingPdf: true
    });
    const html = ReactDOMServer.renderToStaticMarkup(
      <BillPdf
        name={billName}
        details={billData}
        comments={billComments}
        companyInfo={companyData}
        clientInfo={clientData}
      />
    );
    const options = {
      margin: 0.5,
      filename: ('Facture ' + billName + '.pdf').trim(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { logging: false, useCORS: true },
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
    let detailsModal = null;
    if (this.state.selectedBill) {
      detailsModal = (
        <Modal
          show={this.state.showDetails && this.state.selectedBill}
          modalClosed={() => this.setState({ showDetails: false })}
          modalType="large"
        >
          <BillDetails
            billId={this.state.selectedBill}
            clientId={this.props.selectedClient}
            hasChanged={this.detailsChangedHandler}
            onDelete={this.confirmDeleteBill}
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
        modalClosed={this.confirmDeleteBill}
      >
        Êtes-vous sûr de vouloir supprimer cette facture ?
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button clicked={this.confirmDeleteBill} btnType="cancelDelete">
            Annuler
          </Button>
          <Button clicked={this.deleteBill} btnType="confirmDelete">
            Supprimer
          </Button>
        </div>
      </BottomToaster>
    );

    const billAlreadyExistsModal = (
      <BottomToaster show={this.state.showBillAlreadyExistsModal}>
        Une facture existe déjà pour ce devis. Voulez-vous la mettre à jour avec
        les données du devis ?
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button
            clicked={() => this.setState({ showBillAlreadyExistsModal: false })}
            btnType="cancelDelete"
          >
            Annuler
          </Button>
          <Button
            clicked={() =>
              this.createBillFromQuote(
                this.state.newBillId,
                this.state.newBillData
              )
            }
            btnType="confirmDelete"
          >
            Confirmer
          </Button>
        </div>
      </BottomToaster>
    );

    let billsList = null;
    if (this.state.bills) {
      let displayedList = this.filterList(
        this.state.bills,
        this.state.searchTerm
      );
      if (!displayedList) billsList = 'Aucun résulat';
      displayedList &&
        (billsList = Object.keys(displayedList).map(billId => {
          if (this.props.selectedClient === displayedList[billId].clientId) {
            return (
              <Bill
                key={billId}
                id={billId}
                name={displayedList[billId].name}
                totalPrice={displayedList[billId].totalPrice}
                date={displayedList[billId].date}
                clicked={this.openDetails}
                loadingSentIcon={this.state.loadingSentIcon}
                sentChecked={displayedList[billId].sent}
                clickedSent={this.sendIconHandler}
                loadingPaidIcon={this.state.loadingPaidIcon}
                paidChecked={displayedList[billId].paid}
                clickedPaid={this.payIconHandler}
              />
            );
          } else return null;
        }));
    }

    return (
      <div className={classes.Bills}>
        {deleteModal}
        {billAlreadyExistsModal}
        {detailsModal}
        <div className={classes.catTitle}>Factures</div>
        <SearchBar
          searchTerm={this.state.searchTerm}
          changed={this.handleChangeInput}
        />
        {!this.props.selectedClient ? (
          <div className={classes.prompt}>
            Sélectionnez un client pour voir les factures associées
          </div>
        ) : (
          <div className={classes.billsContainer}>{billsList}</div>
        )}

        {this.state.loading ? (
          <Bill name="..." total="...">
            <ButtonSpinner />
          </Bill>
        ) : null}
        <DropzoneBill onCreateBill={this.checkIfBillExists} />
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

export default connect(mapStateToProps)(Bills);
