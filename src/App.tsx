import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PillSelection from './pages/PillSelection';
import UpnAssistApp from './pages/UpnAssistApp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">        <Routes>
          <Route path="/" element={<PillSelection />} />
          <Route path="/upnassist/*" element={<UpnAssistApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
