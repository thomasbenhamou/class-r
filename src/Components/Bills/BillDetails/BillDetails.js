import React, { Component } from 'react';
import classes from './BillDetails.css';
import SmallDeleteButton from '../../UI/SmallDeleteButton/SmallDeleteButton';
import CellInput from '../../UI/CellInput/CellInput';
import Button from '../../UI/Button/Button';
import MdCloudDone from 'react-icons/lib/md/cloud-done';
import MdCached from 'react-icons/lib/md/cached';
import { database, storage } from '../../../firebase/firebase';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';
import Controls from '../../Quotes/QuoteDetails/Controls/Controls';
import PrintLink from '../../Quotes/QuoteDetails/PrintLink/PrintLink';
import Infos from '../../Company/Infos/Infos';
import Title from '../../Company/Title/Title';
import CommentsArea from '../../UI/CommentsArea/CommentsArea';

class BillDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null,
      name: null,
      comments: '',
      nameChanged: false,
      dataChanged: false,
      loading: false,
      detailsHaveChanged: false,
      companyInfo: null
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    let detailsData = null;
    let name = null;
    let comments = null;
    database.ref('bills/' + props.billId).on('value', snapshot => {
      if (snapshot.val()) {
        detailsData = snapshot.val().details;
        name = snapshot.val().name;
        comments = snapshot.val().comments;
      }
    });
    if (detailsData && name) {
      return {
        details: detailsData,
        name: name,
        comments: comments
      };
    } else return null;
  };

  componentDidMount = () => {
    database.ref('companyInfo/').on('value', snapshot => {
      this.setState({
        companyInfo: {
          ...this.state.companyInfo,
          city: snapshot.val().city,
          email: snapshot.val().email,
          name: snapshot.val().name,
          phone: snapshot.val().phone,
          street: snapshot.val().street
        }
      });
    });
    storage
      .ref()
      .child('file.png')
      .getDownloadURL()
      .then(url => {
        this.setState({
          companyInfo: {
            ...this.state.companyInfo,
            logo: url
          }
        });
      });
  };

  updateData = billId => {
    database
      .ref('bills/' + billId)
      .once('value')
      .then(snapshot => {
        const billData = snapshot.val();
        this.setState({
          name: billData.name,
          details: billData.details
        });
      });
  };

  updateLogo = () => {
    storage
      .ref()
      .child('file.png')
      .getDownloadURL()
      .then(url => {
        this.setState({
          companyInfo: {
            ...this.state.companyInfo,
            logo: url
          }
        });
      });
  };
  onChangeNameHandler = e => {
    this.setState({
      name: e.target.value,
      nameChanged: true,
      detailsHaveChanged: true
    });
  };

  onChangeComments = e => {
    this.setState({
      comments: e.target.value,
      dataChanged: true
    });
  };

  onChangeHandler = (event, i, type) => {
    let value = event.target.value;
    if (type === 'quantity' || type === 'unitPrice') {
      value = value.replace(/\D+/, '');
    }
    const updatedDetails = [...this.state.details];
    updatedDetails[i][type] = value;
    this.setState({
      details: updatedDetails,
      dataChanged: true,
      detailsHaveChanged: true
    });
  };

  saveChanges = totalPrice => {
    this.setState({
      loading: true
    });
    database.ref('bills/' + this.props.billId).update(
      {
        name: this.state.name,
        details: this.state.details,
        totalPrice: totalPrice,
        comments: this.state.comments
      },
      error => {
        this.setState({
          dataChanged: false,
          nameChanged: false,
          loading: false
        });
        this.props.hasChanged(this.state.detailsHaveChanged);
        this.updateData(this.props.billId);
      }
    );
  };

  addNewLine = i => {
    const newLine = { product: '', quantity: '', unitPrice: '' };
    let updatedDetails = [];
    if (this.state.details) {
      updatedDetails = [...this.state.details];
    }
    updatedDetails.splice(i + 1, 0, newLine);
    this.setState({
      details: updatedDetails
    });
  };

  removeLine = i => {
    const updatedDetails = [...this.state.details];
    updatedDetails.splice(i, 1);
    this.setState({
      details: updatedDetails,
      dataChanged: true
    });
  };

  render() {
    let detailsTable = null;
    let totalPrice = 0;
    let emptyTableControls = null;
    if (
      (this.state.details && !this.state.details.length) ||
      !this.state.details
    ) {
      emptyTableControls = (
        <Controls clickedAdd={() => this.addNewLine(0)} disableMinus />
      );
    }
    if (this.state.details) {
      detailsTable = this.state.details.map((e, i) => {
        totalPrice += e.unitPrice * e.quantity;
        return (
          <div key={'line' + i} className={classes.flexLine}>
            <div className={classes.flexCell}>
              <CellInput
                changed={event => this.onChangeHandler(event, i, 'product')}
                value={this.state.details[i].product}
              />
            </div>
            <div className={classes.flexCell}>
              <CellInput
                changed={event => this.onChangeHandler(event, i, 'quantity')}
                value={this.state.details[i].quantity}
              />
            </div>
            <div className={classes.flexCell}>
              <CellInput
                changed={event => this.onChangeHandler(event, i, 'unitPrice')}
                value={this.state.details[i].unitPrice}
              />
            </div>
            <div className={classes.flexCellDisabled}>
              {this.state.details[i].unitPrice *
                this.state.details[i].quantity +
                ' €'}
            </div>
            <div className={classes.controls}>
              <Controls
                clickedAdd={() => this.addNewLine(i)}
                clickedRemove={() => this.removeLine(i)}
              />
            </div>
          </div>
        );
      });
    }

    let companyInfo = <CircleSpinner />;
    if (this.state.companyInfo) {
      companyInfo = <Infos data={this.state.companyInfo} />;
    }

    if (this.props.customLogo) {
      this.updateLogo();
    }

    return (
      <div className={classes.wrapper}>
        {companyInfo}
        <Title name="Facture :">
          <CellInput
            changed={this.onChangeNameHandler}
            value={this.state.name ? this.state.name : ''}
            color="#000"
            fontSize="1.5rem"
            textAlign="left"
          />
        </Title>
        <div className={classes.quoteHeader}>
          {this.state.loading ? (
            <Button btnType="emptyButton">
              <CircleSpinner />
            </Button>
          ) : (
            <div>
              {this.state.dataChanged || this.state.nameChanged ? (
                <Button
                  btnType="saveButton"
                  clicked={() => this.saveChanges(totalPrice)}
                >
                  <MdCached size={18} /> Sauvegarder les modifications
                </Button>
              ) : (
                <Button btnType="savedButton">
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <MdCloudDone color="#41B695" size={18} /> Données
                    enregistrées
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
        {this.props.creatingPdf ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '30px'
            }}
          >
            <CircleSpinner />
          </div>
        ) : (
          <PrintLink
            clicked={() =>
              this.props.createPdf(
                this.state.name,
                this.state.details,
                this.state.comments,
                this.state.companyInfo
              )
            }
          />
        )}
        <div className={classes.tableWrapper}>
          <div className={classes.flexTable}>
            <div className={classes.flexHeader}>
              <div className={classes.flexHeaderCells}>Produit</div>
              <div className={classes.flexHeaderCells}>Quantité</div>
              <div className={classes.flexHeaderCells}>Prix/unité</div>
              <div className={classes.flexHeaderCells}>Prix total</div>
              <div className={classes.lastHeaderCell}>{emptyTableControls}</div>
            </div>
            {detailsTable}
            <div className={classes.totalLine}>
              <div className={classes.totalCell}>Total</div>
              <div className={classes.totalCell}>{totalPrice + ' €'}</div>
            </div>
          </div>
        </div>
        <CommentsArea
          value={this.state.comments}
          changed={this.onChangeComments}
        />
        <SmallDeleteButton clicked={this.props.onDelete} />
      </div>
    );
  }
}

export default BillDetails;
