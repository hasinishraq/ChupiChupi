import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const isAskPage = location.pathname.startsWith("/u/");

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/" className="brand-link">
          <span className="brand-mark">ChupiChupi</span>
          <span className="brand-text"></span>
        </Link>
      </div>
      <nav className="nav-actions">
        {!isAuthenticated && !isAskPage && (
          <>
            <Link className="nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-button" to="/register">
              Create account
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <span className="nav-user">Hi, {user?.username || "creator"}</span>
            <Link className="nav-link" to="/inbox">
              Inbox
            </Link>
            <button className="nav-button ghost" type="button" onClick={logout}>
              Log out
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
