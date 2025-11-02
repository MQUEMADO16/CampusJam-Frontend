import React from 'react';
import styles from './Pricing.module.css';
// We can use the check icon from react-icons, which you already have
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PricingPage: React.FC = () => {
  return (
    <div className={styles.pricingContainer}>
      <h2>Pricing</h2>
      <p className={styles.subtitle}>
        Choose the plan that's right for you and take your CampusJam
        experience to the next level.
      </p>

      <div className={styles.cardWrapper}>
        {/* Basic Plan Card */}
        <div className={styles.card}>
          <h3>Basic</h3>
          <p>Free for Life</p>
          <div className={styles.price}>
            $0<span>/month</span>
          </div>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.iconEnabled} /> Host 1 jam session per month</li>
            <li><FaCheckCircle className={styles.iconEnabled} /> Basic profile customization</li>
            <li><FaCheckCircle className={styles.iconEnabled} /> Access to public jam sessions</li>
            <li className={styles.disabled}><FaTimesCircle className={styles.iconDisabled} /> Access to private jam sessions</li>
            <li className={styles.disabled}><FaTimesCircle className={styles.iconDisabled} /> Advanced analytics</li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>

        {/* Pro Plan Card */}
        <div className={`${styles.card} ${styles.proCard}`}>
          <div className={styles.popularBadge}>Most Popular</div>
          <h3>Pro</h3>
          <p>Unlock all features</p>
          <div className={styles.price}>
            $10<span>/month</span>
          </div>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.iconEnabled} /> Unlimited jam sessions</li>
            <li><FaCheckCircle className={styles.iconEnabled} /> Full profile customization</li>
            <li><FaCheckCircle className={styles.iconEnabled} /> Access to private jam sessions</li>
            <li><FaCheckCircle className={styles.iconEnabled} /> Advanced analytics</li>
            <li><FaCheckCircle className={styles.iconEnabled} /> Priority support</li>
          </ul>
          <button className={`${styles.button} ${styles.proButton}`}>Go Pro</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;