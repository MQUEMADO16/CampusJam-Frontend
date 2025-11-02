//npm install react-icons --legacy-peer-deps
//Install this package to use the icons in the footer since it has a dependancy conflict with antd icons.

import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
// 1. Import the CSS module file
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    // 2. Use the imported styles as class names
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Get In Touch */}
        <div>
          <h3 className={styles.heading}>Get In Touch</h3>
          <p className={styles.text}>CampusJam.Support@gmail.com</p>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook" className={styles.iconLink}>
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className={styles.iconLink}>
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter" className={styles.iconLink}>
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h3 className={styles.heading}>Company Info</h3>
          <ul className={styles.list}>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Outcomes</a></li>
            <li><a href="#">Place Holder</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className={styles.heading}>Features</h3>
          <ul className={styles.list}>
            <li><a href="#">Break Me</a></li>
            <li><a href="#">Campus Analytics</a></li>
            <li><a href="#">Live Chat</a></li>

          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        “Bringing Students Together, One Jam at a Time.”
      </div>
    </footer>
  );
};

export default Footer;