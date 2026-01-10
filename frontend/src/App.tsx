import './App.css';
import { GlobalProvider } from './contexts/GlobalContext';
import FirstPage from './components/first-page/first-page';

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        {/* <Container /> */}
        <FirstPage />
      </div>
    </GlobalProvider>
  );
}

export default App;
