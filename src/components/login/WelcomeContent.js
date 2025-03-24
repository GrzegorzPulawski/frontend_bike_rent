import React from 'react';
import styles from './WelcomeContent.module.css';

export default class WelcomeContent extends React.Component {
    render() {
        return (
            <div className={styles.welcomeContainer}>
                <div className={styles.welcomeCard}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>Witamy w naszym programie</h1>
                        <h4 className={styles.subtitle}>
                            Przeczytaj instrukcję, która znajduje się w zakładce <span className={styles.highlight}>Home</span>
                        </h4>
                        <div className={styles.decorativeLine}></div>
                    </div>
                </div>
            </div>
        );
    }
}