import { FC, useState } from 'react';
import './Menu.css';

const Menu: FC = () => {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!', event);
  };

  return (
    <div className='menu'>
       <button type="button" onClick={handleClick} title="Document Summary" style={{'backgroundColor':'#841584', color:'white', padding:'10px', borderRadius:'5px', border:'none', cursor:'pointer'}}>
        Document Summary
      </button>
      {/* <button type="button" onClick={handleClick} title="Document Summary" style={{'backgroundColor':'#841584', color:'white', padding:'10px', borderRadius:'5px', border:'none', cursor:'pointer'}}>
        Q&A
      </button>
      <button type="button" onClick={handleClick} title="Document Summary" style={{'backgroundColor':'#841584', color:'white', padding:'10px', borderRadius:'5px', border:'none', cursor:'pointer'}}>
        Mind Map Creator
      </button> */}
    </div>
  );
};

export default Menu;
