import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Reports.module.css';

const ReportMenu = () => {
    const navigate = useNavigate();

    const reportButtons = [
        {
            title: "Raport Dzienny Przychodów",
            path: "/daily-report",
            variant: "revenue"
        },
        {
            title: "Zwrócone Wypożyczenia w Dniu",
            path: "/show-daily-returned",
            variant: "returns"
        },
        {
            title: "Utworzone Wypożyczenia w Dniu",
            path: "/daily-rented-report",
            variant: "rentals"
        }
    ];

    return (
        <div className={styles.reportContainer}>
            <h2 className={styles.pageTitle}>Menu Raportów</h2>

            <div className={styles.buttonGrid}>
                {reportButtons.map((button, index) => (
                    <button
                        key={index}
                        className={`${styles.reportButton} ${styles[button.variant]}`}
                        onClick={() => navigate(button.path)}
                    >
                        <span className={styles.buttonIcon}>
                            {getIconForVariant(button.variant)}
                        </span>
                        {button.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Helper function to render icons
const getIconForVariant = (variant) => {
    switch(variant) {
        case 'revenue':
            return '💰';
        case 'returns':
            return '🔄';
        case 'rentals':
            return '➕';
        default:
            return '📊';
    }
};

export default ReportMenu;