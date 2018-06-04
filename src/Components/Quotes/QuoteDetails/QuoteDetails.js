import React, { Component } from 'react';
import classes from './QuoteDetails.css';
import SmallDeleteButton from '../../UI/SmallDeleteButton/SmallDeleteButton';
import CellInput from '../../UI/CellInput/CellInput';
import Button from '../../UI/Button/Button';
import MdCloudDone from 'react-icons/lib/md/cloud-done';
import MdCached from 'react-icons/lib/md/cached';
import { database } from '../../../firebase/firebase';
import CircleSpinner from '../../UI/CircleSpinner/CircleSpinner';
import Controls from './Controls/Controls';
import PrintLink from './PrintLink/PrintLink';

class QuoteDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: this.props.details,
      name: this.props.name,
      nameChanged: false,
      dataChanged: false,
      loading: false,
      detailsHaveChanged: false
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (state.detailsHaveChanged) {
      return {
        detailsHaveChanged: false
      };
    } else {
      return {
        details: props.details,
        name: props.name
      };
    }
  };

  updateData = quoteId => {
    database
      .ref('quotes/' + quoteId)
      .once('value')
      .then(snapshot => {
        const quoteData = snapshot.val();
        this.setState({
          name: quoteData.name,
          details: quoteData.details
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
    database.ref('quotes/' + this.props.quoteId).update(
      {
        name: this.state.name,
        details: this.state.details,
        totalPrice: totalPrice
      },
      error => {
        this.setState({
          dataChanged: false,
          nameChanged: false,
          loading: false
        });
        this.props.hasChanged(this.state.detailsHaveChanged);
        this.updateData(this.props.quoteId);
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
              {this.state.details[i].unitPrice * this.state.details[i].quantity}
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

    return (
      <div className={classes.wrapper}>
        <div className={classes.quoteHeader}>
          <div className={classes.title}>
            <CellInput
              changed={this.onChangeNameHandler}
              value={this.state.name ? this.state.name : ''}
              color="#000"
              fontSize="1.4rem"
              textAlign="left"
            />
          </div>
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
        <PrintLink />
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
              <div className={classes.totalCell}>{totalPrice}</div>
            </div>
          </div>
        </div>
        <SmallDeleteButton clicked={this.props.onDelete} />
      </div>
    );
  }
}

export default QuoteDetails;
