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
    loadingSentIcon: false,
    loadingPaidIcon: false
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
    database
      .ref('bills/')
      .once('value')
      .then(snapshot => {
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

  sendIconHandler = billId => {
    this.setState({
      loadingSentIcon: true
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
              sent: !this.state.bills[billId].sent
            }
          },
          loadingSentIcon: false
        });
      });
  };

  payIconHandler = billId => {
    this.setState({
      loadingPaidIcon: true
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
              paid: !this.state.bills[billId].paid
            }
          },
          loadingPaidIcon: false
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
            {...this.state.selectedBillDetails}
            billId={this.state.selectedBill}
            hasChanged={this.detailsChangedHandler}
            onDelete={this.confirmDeleteBill}
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

    let billsList = null;
    if (this.state.bills) {
      billsList = Object.keys(this.state.bills).map(billId => {
        if (this.props.selectedClient === this.state.bills[billId].clientId) {
          return (
            <Bill
              key={billId}
              id={billId}
              name={this.state.bills[billId].name}
              totalPrice={this.state.bills[billId].totalPrice}
              date={this.state.bills[billId].date}
              clicked={this.openDetails}
              loadingSentIcon={this.state.loadingSentIcon}
              sentChecked={this.state.bills[billId].sent}
              clickedSent={this.sendIconHandler}
              loadingPaidIcon={this.state.loadingPaidIcon}
              paidChecked={this.state.bills[billId].paid}
              clickedPaid={this.payIconHandler}
            />
          );
        } else return null;
      });
    }

    return (
      <div className={classes.Bills}>
        {deleteModal}
        {detailsModal}
        <h2>Factures</h2>
        {billsList}
        {this.state.loading ? (
          <Bill name="..." total="...">
            <ButtonSpinner />
          </Bill>
        ) : null}
        <DropzoneBill onCreateBill={this.createBillFromQuote} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedClient: state.selectedClient
  };
};

export default connect(mapStateToProps)(Bills);
