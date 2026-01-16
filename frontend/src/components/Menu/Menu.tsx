import { FC } from 'react';
import { useGlobal } from '../../contexts/GlobalContext';
import './Menu.css';

const Menu: FC = () => {
  const { documentText, setDocSummary, apiBaseUrl } = useGlobal();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!', event);
    console.log('Doc Text', documentText);
    try {
      const response = await fetch(`${apiBaseUrl}/api/generate-summary`, {
        method: 'POST',
        body: JSON.stringify({ text: documentText }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }
      const data = await response.json();
      setDocSummary(data.summary);
    } catch (err) {
      console.error('Error during button click handling:', err);
    }
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
