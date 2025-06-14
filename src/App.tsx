import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PillSelection from './pages/PillSelection';
import UpnAssistApp from './pages/UpnAssistApp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirección automática a UpnAssist */}
          <Route path="/" element={<Navigate to="/upnassist" replace />} />
          {/* Mantener PillSelection comentado para poder reactivarlo fácilmente */}
          {/* <Route path="/" element={<PillSelection />} /> */}
          <Route path="/matrix" element={<PillSelection />} />
          <Route path="/upnassist/*" element={<UpnAssistApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
