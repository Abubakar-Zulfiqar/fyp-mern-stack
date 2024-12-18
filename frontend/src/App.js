import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import Navbar from "./components/Navbar";
import ReportPage from "./pages/ReportPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthContext } from "./services/AuthContext";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/test-page"
          element={isLoggedIn ? <TestPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/report"
          element={isLoggedIn ? <ReportPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <HistoryPage /> : <Navigate to="/login" />}
        />
        ;
      </Routes>
    </Router>
  );
};

export default App;
