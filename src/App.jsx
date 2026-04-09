import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Vendors from './pages/Vendors';
import CreateEvent from './pages/CreateEvent';
import Recommendations from './pages/Recommendations';
import VendorMatching from './pages/VendorMatching';
import VendorRegister from './pages/VendorRegister';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-500/30 selection:text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/vendor-register" element={<VendorRegister />} />
            <Route path="/vendor-matching" element={<VendorMatching />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;