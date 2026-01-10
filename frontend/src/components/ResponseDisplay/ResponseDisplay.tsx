import { FC } from 'react';
import { useGlobal } from '../../contexts/GlobalContext';
import './ResponseDisplay.css';

const ResponseDisplay: FC = () => {

const { docSummary } = useGlobal();
  return (
    <div className='response-display-container'>
      {!docSummary && <p>Response would be shown here! Backend is being setup.</p>}
      {docSummary && <><h3>Document Summary:</h3><p>{docSummary}</p></>}
    </div>
  );
};

export default ResponseDisplay;
