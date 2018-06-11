import React from 'react';
import MdPrint from 'react-icons/lib/md/print';
import FaFilePdfO from 'react-icons/lib/fa/file-pdf-o';
import classes from './PrintLink.css';

const printLink = ({ clicked }) => {
  return (
    <div className={classes.printLink}>
      <span className={classes.printControls}>
        <MdPrint
          onClick={clicked}
          title="Sauvegarder en Pdf puis imprimer"
          size={18}
        />
      </span>
      <span> / </span>
      <span className={classes.printControls}>
        <FaFilePdfO
          onClick={clicked}
          title="Sauvegarder en Pdf puis imprimer"
          size={18}
        />
      </span>
    </div>
  );
};

export default printLink;
