import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeacherGuide from './pages/TeacherGuide';
import Chat from './pages/Chat';
import Email from './pages/Email';
import Resources from './pages/Resources';
import PlagiarismDetector from './pages/PlagiarismDetector';
import ApplicationLauncher from './pages/ApplicationLauncher';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<ApplicationLauncher />} />
            <Route path="/apps" element={<ApplicationLauncher />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher-guide" element={<TeacherGuide />} />
            <Route path="/guide" element={<TeacherGuide />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/email" element={<Email />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/plagiarism-detector" element={<PlagiarismDetector />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
