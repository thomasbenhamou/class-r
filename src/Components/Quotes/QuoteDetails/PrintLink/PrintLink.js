import React from 'react';
import MdPrint from 'react-icons/lib/md/print';

const printLink = ({ clicked }) => {
  const style = {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0px 14px',
    margin: '0px 7px',
    cursor: 'pointer',
    color: '#999'
  };
  return (
    <div style={style} onClick={clicked}>
      <MdPrint size={18} />
      <span>Imprimer</span>
    </div>
  );
};

export default printLink;
