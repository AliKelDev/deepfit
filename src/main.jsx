import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import AIChatAssistant from './AIChatAssistant';
import ProfileCreation from './ProfileCreation';
import NavigationMenu from './components/NavigationMenu';
import WorkoutPage from './pages/WorkoutPage';
import ProgressPage from './pages/ProgressPage';
import { WorkoutProvider } from './WorkoutContext';

const App = () => {
  return (
    <BrowserRouter>
      <WorkoutProvider>
        <NavigationMenu />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chat" element={
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <AIChatAssistant />
            </div>
          } />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/profile" element={<ProfileCreation />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </WorkoutProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);