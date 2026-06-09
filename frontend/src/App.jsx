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
import TripCarrier from './pages/TripCarrier';
import TripDetails from './pages/TripDetails';
import ItemDemander from './pages/ItemDemander';
import RequestForm from './pages/RequestForm';
import CarrierRequests from './pages/CarrierRequests';
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
        <Route path='/post-trip' element={<PostTrip />} ></Route>
        <Route path='/carrier' element={<TripCarrier />} ></Route>
         <Route path='/trip/:id' element={<TripDetails />} ></Route>
          <Route path='/item-demander' element={<ItemDemander />} ></Route>
 <Route path='/request/:tripId' element={<RequestForm />} ></Route>
        <Route path="/carrier/requests" element={<CarrierRequests />} />
      </Routes>
        
    
    </Router>
  );
}

export default App;