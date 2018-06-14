import React, { Component } from 'react';
import classes from './Home.css';
import classeurExample from '../../assets/classeur_example.png';
import classeurQuote from '../../assets/classeur_quote.png';
import MdPlayCircleOutline from 'react-icons/lib/md/play-circle-outline';
import blurredExample from '../../assets/blurredExample.png';
import OfficeView from '../../assets/officeview.jpg';
import deskView from '../../assets/deskView.jpg';
import officeMaterial from '../../assets/officeMaterial.jpg';

class Home extends Component {
  startDemo = () => {
    this.props.history.push('/classeur');
  };

  render() {
    return (
      <div className={classes.main}>
        <div
          className={classes.jumboOne}
          style={{
            background: `url(${deskView})`,
            backgroundPosition: 'top',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className={classes.navBar}>
            <h2 className={classes.brand}>classeur_</h2>
            <div className={classes.tryMeDiv} onClick={this.startDemo}>
              <span className={classes.tryMe}>Essayer</span>
              <MdPlayCircleOutline size={25} color="#F6F740" />
            </div>
          </div>
          <div className={classes.jumboOneUnder}>
            <div className={classes.jumboOneUnderLeft}>
              <p>
                <strong>Gérez votre PME simplement.</strong>
              </p>
            </div>
            <div className={classes.jumboOneUnderRight}>
              <img
                src={blurredExample}
                alt="classeur_"
                style={{
                  height: '50vh',
                  boxShadow: '1px 3px 2px #222',
                  borderRadius: '10px'
                }}
              />
            </div>
          </div>
          <div className={classes.jumboOneBottom}>
            <div>
              <span className={classes.brandLight}>classeur_</span> organise vos{' '}
              <span className={classes.itemClient}>clients</span>,
              <span className={classes.itemQuote}>devis</span> et{' '}
              <span className={classes.itemBill}>factures</span> sur un seul
              écran.
            </div>
            <p className={classes.demo} onClick={this.startDemo}>
              démo <MdPlayCircleOutline size={42} color="#F6F740" />
            </p>
          </div>
        </div>
        <div
          className={classes.jumboOneBis}
          style={{
            background: `url(${officeMaterial})`,
            backgroundPosition: 'top',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <img
            src={classeurExample}
            alt="classeur_"
            className={classes.jumboOneBisImage}
          />
          <div className={classes.jumboOneBisUnder}>
            <p>
              <span className={classes.itemLightClient}>Créer</span>,{' '}
              <span className={classes.itemLightQuote}>modifier</span> et{' '}
              <span className={classes.itemLightBill}>supprimer</span> vos
              données.
            </p>
            <p>
              Tout est <span className={classes.brandLight}>sauvegardé</span> et
              directement <span className={classes.brandLight}>disponible</span>.
            </p>
          </div>
        </div>
        <div
          className={classes.jumboTwo}
          style={{
            background: `url(${OfficeView})`,
            backgroundPosition: 'top',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className={classes.jumboTwoUnder}>
            <img
              src={classeurQuote}
              alt="classeur_"
              className={classes.jumboTwoImage}
            />
          </div>
          <div className={classes.jumboTwoBottom}>
            <p>
              Vous pouvez ensuite exporter{' '}
              <span className={classes.itemBill}>factures</span> et{' '}
              <span className={classes.itemQuote}>devis</span> directement en{' '}
              <span className={classes.brand}>pdf</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
