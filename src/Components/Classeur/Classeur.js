import React, { Component } from 'react';
import classes from './Classeur.css';
import Clients from '../Clients/Clients';
import Quotes from '../Quotes/Quotes';
import Bills from '../Bills/Bills';
import NavBar from '../UI/NavBar/NavBar';
import Modal from '../UI/Modal/Modal';
import MdLightBulbOutline from 'react-icons/lib/md/lightbulb-outline';
import MdFace from 'react-icons/lib/md/face';
import Arrow from 'react-icons/lib/md/keyboard-arrow-right';
import MdClose from 'react-icons/lib/md/close';

class Classeur extends Component {
  state = {
    showModal: true
  };

  componentDidMount = () => {
    this.setState({
      showModal: true
    });
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          show={this.state.showModal}
          modalClosed={() => this.setState({ showModal: false })}
          padding={'0px'}
        >
          <div className={classes.banner}>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.setState({
                  showModal: false
                })
              }
            >
              <MdClose size={25} color="#aaa" />
            </span>
            <MdLightBulbOutline size={25} color="yellow" />
          </div>
          <div className={classes.welcome}>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <p style={{ fontSize: '1.4rem' }}>
                Bienvenue sur <span className={classes.brand}>classeur_</span>
              </p>
              <MdFace size={62} color="#45555f" />
            </div>
            <div style={{ fontSize: '1.2rem' }}>
              <p>Pour commencer vous pouvez :</p>
              <ul style={{ listStyleType: 'none' }}>
                <li>
                  <Arrow size={18} />Créer un nouveau client
                </li>
                <li>
                  <Arrow size={18} />Créer un devis
                </li>
                <li>
                  <Arrow size={18} />Puis créer une facture à partir de ce devis
                  (glisser-déposer)
                </li>
              </ul>
            </div>
          </div>
        </Modal>
        <NavBar />
        <div className={classes.main}>
          <Clients />
          <Quotes />
          <Bills />
        </div>
      </React.Fragment>
    );
  }
}

export default Classeur;
