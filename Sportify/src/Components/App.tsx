import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AllEvents from '../Components/AllEvents';
import SingleEvent from '../Components/SingleEvent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/events/:id" element={<SingleEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
