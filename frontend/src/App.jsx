import React from 'react';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import PostTrip from './pages/PostTrip';
import Trips from './pages/Trips';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import TripResponses from './pages/TripResponses';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/how-it-works" element={<HowItWorks />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path='/dashboard' element={<Dashboard />} ></Route>
        <Route path="/post-trip" element={<PostTrip />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path="/trip/:tripId/responses" element={<TripResponses />} />
      </Routes>
    </Router>
  );
}

export default App;