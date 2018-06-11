import React from 'react';
import classes from './BillPdf.css';
import Infos from '../../Company/Infos/Infos';
import Title from '../../Company/Title/Title';

const billPdf = ({ name, details, comments, companyInfo }) => {
  let totalPrice = null;
  const detailsTable = details.map((e, i) => {
    totalPrice += e.unitPrice * e.quantity;
    return (
      <div key={'line' + i} className={classes.flexLine}>
        <div className={classes.flexCell}>{details[i].product}</div>
        <div className={classes.flexCell}>{details[i].quantity}</div>
        <div className={classes.flexCell}>{details[i].unitPrice + ' €'}</div>
        <div className={classes.flexCellDisabled}>
          {(details[i].unitPrice * details[i].quantity).toFixed(2) + ' €'}
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <Infos data={companyInfo} />
      <Title name="Facture"> {name}</Title>
      <div className={classes.tableWrapper}>
        <div className={classes.flexTable}>
          <div className={classes.flexHeader}>
            <div className={classes.flexHeaderCells}>Produit</div>
            <div className={classes.flexHeaderCells}>Quantité</div>
            <div className={classes.flexHeaderCells}>Prix/unité</div>
            <div className={classes.flexHeaderCells}>Prix total</div>
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
      <div>{comments}</div>
    </React.Fragment>
  );
};

export default billPdf;
