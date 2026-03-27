import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header';
import CompanyTracker from './pages/CompanyTracker/CompanyTracker';
import Profile from './pages/Profile/Profile';
import './App.css';

// 1. Create a layout to wrap your pages (replacing the old App structure)
const RootLayout = () => {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet /> {/* This is where CompanyTracker or Profile will render */}
      </main>
    </>
  );
};

// 2. Define your routes using a configuration object
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { 
        path: "/", 
        element: <CompanyTracker /> 
      },
      { 
        path: "/profile", 
        element: <Profile /> 
      },
    ],
  },
]);

// 3. Provide the router to the app
function App() {
  return <RouterProvider router={router} />;
}

export default App;