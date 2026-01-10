import { FC, useState } from 'react';
import { useGlobal } from '../../contexts/GlobalContext';
import './ResponseDisplay.css';

const ResponseDisplay: FC<{ response: string }> = ({ response }) => {

const { docSummary } = useGlobal();
  return (
    <div className='response-display-container'>
      {!docSummary && <p>Response would be shown here!</p>}
      {docSummary && <><h3>Document Summary:</h3><p>{docSummary}</p></>}
      {response}
    </div>
  );
};

export default ResponseDisplay;
