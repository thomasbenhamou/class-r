import React from 'react';
import classes from './CommentsArea.css';

const commentsArea = props => {
  return (
    <div className={classes.comments}>
      <div
        style={{
          display: 'flex',
          width: '90%',
          margin: 'auto',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexBasis: '90%'
          }}
        >
          <textarea
            className={classes.commentsInput}
            placeholder="Commentaires"
            maxLength="100"
            rows={2}
            onChange={props.changed}
            value={props.value}
          />
        </div>
      </div>
    </div>
  );
};

export default commentsArea;
