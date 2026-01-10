import { FC } from 'react';
import UploadDocument from '../uploadDocument/uploadDocument';
import Menu from '../Menu/Menu';
import ResponseDisplay from '../ResponseDisplay/ResponseDisplay';
import './first-page.css';


interface FirstPageProps {}

const FirstPage: FC<FirstPageProps> = () => {

  return (
    <div className='container'>
      <div className='left-side'>
        <UploadDocument />
      </div>
      <div className='right-side'>
        <Menu />
        <ResponseDisplay />
      </div>
    </div>
  );
};

export default FirstPage;
