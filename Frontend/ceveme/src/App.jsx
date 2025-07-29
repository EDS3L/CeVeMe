import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './features/home/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 bg-[#F6F5F4] min-h-[70vh] rounded-2xl shadow-lg">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
