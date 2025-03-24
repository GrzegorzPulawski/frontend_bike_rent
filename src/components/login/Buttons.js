
import React from 'react';
import styles from './Buttons.module.css'; // Create this CSS module

export default function Buttons({ login, logout }) {
    return (
        <div className={styles.buttonContainer}>
            <button
                onClick={login}
                className={styles.loginButton}
            >
                Login
            </button>
            <button
                onClick={logout}
                className={styles.logoutButton}
            >
                Logout
            </button>
        </div>
    );
}