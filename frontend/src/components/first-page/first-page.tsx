import { FC, useState } from 'react';
import UploadDocument from '../uploadDocument/uploadDocument';
import Menu from '../Menu/Menu';
import ResponseDisplay from '../ResponseDisplay/ResponseDisplay';
import './first-page.css';


interface FirstPageProps {}

const FirstPage: FC<FirstPageProps> = () => {
  const [response, setResponse] = useState<string>('');

  return (
    <div className='container'>
      <div className='left-side'>
        <UploadDocument />
      </div>
      <div className='right-side'>
        <Menu />
        <ResponseDisplay response={response} />
      </div>
    </div>
  );
};

export default FirstPage;
