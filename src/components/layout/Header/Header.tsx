import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

//Put our logo import here when we have it
// import logo from '../../assets/logo.png';
//Need to change emjoi to logo later.

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* <img src={logo} alt="CampusJam Logo" /> */}
        {/* Import for Logo */}
        <span>🎸</span> 
        CampusJam
      </div>

<nav className={styles.navLinks}>
        {/* 2. Change this to a Link */}
        <Link to="/">Home</Link>
        <a href="#">About</a>
        <a href="#">Contact</a>
        <Link to="/pricing">Pricing</Link>
      </nav>

      <div className={styles.authButtons}>
        <Link to="/login" className={styles.loginButton}>
          Log In
        </Link>

        <Link to="/signup" className={styles.signupButton}>
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;