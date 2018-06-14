import React, { Component } from 'react';
import classes from './QuoteDetails.css';
import SmallDeleteButton from '../../UI/SmallDeleteButton/SmallDeleteButton';
import CellInput from '../../UI/CellInput/CellInput';
import Button from '../../UI/Button/Button';
import MdCloudDone from 'react-icons/lib/md/cloud-done';
import MdCached from 'react-icons/lib/md/cached';
import { database } from '../../../firebase/firebase';
import { storage } from '../../../firebase/firebase';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';
import Controls from './Controls/Controls';
import PrintLink from './PrintLink/PrintLink';
import Title from '../../Company/Title/Title';
import Infos from '../../Company/Infos/Infos';
import CommentsArea from '../../UI/CommentsArea/CommentsArea';
import ClientInfos from './ClientInfos/ClientInfos';

class QuoteDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null,
      comments: '',
      name: null,
      nameChanged: false,
      dataChanged: false,
      loading: false,
      companyInfo: null,
      clientDetails: null
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    let detailsData = [{}];
    let name = '';
    let comments = '';
    let clientDetails = '';
    database.ref('quotes/' + props.quoteId).on('value', snapshot => {
      if (snapshot.val() !== null) {
        detailsData = snapshot.val().details;
        name = snapshot.val().name;
        comments = snapshot.val().comments;
      }
    });
    database.ref('clients/' + props.clientId).on('value', snap => {
      clientDetails = snap.val();
    });
    return {
      details: detailsData,
      name: name,
      comments: comments,
      clientDetails: clientDetails
    };
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
      nameChanged: true
    });
  };

  parseFloat2Decimals = value => {
    return parseFloat(parseFloat(value).toFixed(2));
  };

  onChangeHandler = (event, i, type) => {
    let value = event.target.value;
    let updatedDetails = [...this.state.details];
    if (type === 'unitPrice') {
      value = value.replace(',', '.');
    }
    if (type === 'quantity') {
      value = value.replace(',', '.');
    }
    updatedDetails[i][type] = value;
    this.setState({
      details: updatedDetails,
      dataChanged: true
    });
  };

  onChangeComments = e => {
    this.setState({
      comments: e.target.value,
      dataChanged: true
    });
  };
  saveChanges = totalPrice => {
    this.setState({
      loading: true
    });
    database.ref('quotes/' + this.props.quoteId).update(
      {
        name: this.state.name,
        details: this.state.details,
        comments: this.state.comments,
        totalPrice: totalPrice
      },
      error => {
        this.setState({
          dataChanged: false,
          nameChanged: false,
          loading: false
        });
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
                type="text"
                value={this.state.details[i].product || ''}
              />
            </div>
            <div className={classes.flexCell}>
              <CellInput
                changed={event => this.onChangeHandler(event, i, 'quantity')}
                type="number"
                value={this.state.details[i].quantity || 0}
                pattern="[-+]?[0-9]"
              />
            </div>
            <div className={classes.flexCell}>
              <CellInput
                changed={event => this.onChangeHandler(event, i, 'unitPrice')}
                value={this.state.details[i].unitPrice || 0}
                pattern="[-+]?[0-9]"
                euro
                textAlign="right"
              />
            </div>
            <div className={classes.flexCellDisabled}>
              {isNaN(
                this.state.details[i].unitPrice * this.state.details[i].quantity
              )
                ? 0
                : (
                    this.state.details[i].unitPrice *
                    this.state.details[i].quantity
                  ).toFixed(2) + ' €'}
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
      companyInfo = (
        <React.Fragment>
          <Infos data={this.state.companyInfo} />
          <ClientInfos data={this.state.clientDetails} />
        </React.Fragment>
      );
    }
    if (this.props.customLogo) {
      this.updateLogo();
    }
    return (
      <div className={classes.wrapper}>
        <div className={classes.header}>{companyInfo}</div>
        <Title name="Devis :">
          <CellInput
            changed={this.onChangeNameHandler}
            value={this.state.name ? this.state.name : ''}
            color="#000"
            fontSize="1.5rem"
            textAlign="left"
            backgroundColor="#fff"
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
          {this.props.creatingPdf ? (
            <CircleSpinner />
          ) : (
            <PrintLink
              clicked={() =>
                this.props.createPdf(
                  this.state.name,
                  this.state.details,
                  this.state.comments,
                  this.state.companyInfo,
                  this.state.clientDetails
                )
              }
            />
          )}
        </div>
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
              <div className={classes.totalCell}>
                {totalPrice.toFixed(2) + ' €'}
              </div>
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

export default QuoteDetails;
