import React from 'react';
import styles from './MessagesContent.module.css';

const MessagesContent = ({ userDetails }) => {
    // Safe access to userDetails with fallbacks
    const firstName = userDetails?.firstName || 'Użytkowniku';
    const isLoggedIn = !!userDetails;

    return (
        <div className={styles.welcomeMessage}>
            <h1 className={styles.title}>
                Witaj, <span className={styles.highlight}>{firstName}</span>!
            </h1>
            <h4 className={styles.subtitle}>
                {isLoggedIn ? 'Zalogowano poprawnie' : 'Trwa weryfikacja...'}
            </h4>

            {/* Optional decorative elements */}
            <div className={styles.successIcon}>✓</div>
            <div className={styles.decorativeLine}></div>
        </div>
    );
};

export default MessagesContent;