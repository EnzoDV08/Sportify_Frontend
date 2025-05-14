import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import AdminDashboard from '../pages/AdminDashboard';
import AllEvents from '../pages/AllEvents';
import SingleEvent from '../pages/SingleEvent';
import CreateEvent from '../pages/CreateEvent';
import '../Style/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="layout-container">
        <Sidebar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="/events" element={<AllEvents />} />
            <Route path="/events/:id" element={<SingleEvent />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/add-event" element={<CreateEvent />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
