import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import AIChatAssistant from './AIChatAssistant';
import ProfileCreation from './ProfileCreation';
import NavigationMenu from './components/NavigationMenu';

const App = () => {
  return (
    <BrowserRouter>
      <NavigationMenu />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chat" element={
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <AIChatAssistant />
          </div>
        } />
        <Route path="/workout" element={
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
              <p className="text-gray-600">The workout tracking feature is currently in development.</p>
            </div>
          </div>
        } />
        <Route path="/profile" element={<ProfileCreation />} />
        <Route path="/progress" element={
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Progress Tracking</h2>
              <p className="text-gray-600">Your fitness journey tracking dashboard is coming soon!</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);