import React, { useState } from "react";
import { request } from "../../axios_helper";
import styles from "./ReturnRenting.module.css";

const ReturnRenting = ({
                           selectedRentings,
                           setSuccessMessage,
                           setErrorMessage,
                           onReturnSuccess,
                           onReturnNavigate,
                           disabled
                       }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const submitReturns = async () => {
        if (selectedRentings.length === 0 || disabled) return;

        setIsProcessing(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const requests = selectedRentings.map(idRenting =>
                request("PUT", `/api/rentings/return/${idRenting}`, {})
            );

            await Promise.all(requests);
            setSuccessMessage(`Pomyślnie zwrócono ${selectedRentings.length} wypożyczeń`);

            // Call success handler
            if (onReturnSuccess) onReturnSuccess();

            // Navigate after delay if callback provided
            if (onReturnNavigate) {
                setTimeout(() => onReturnNavigate(), 1500);
            }
        } catch (error) {
            console.error("Return error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                `Błąd podczas zwrotu wypożyczeń (${error.message})`
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.buttonContainer}>
            <button
                onClick={submitReturns}
                disabled={selectedRentings.length === 0 || disabled || isProcessing}
                className={`${styles.returnButton} ${
                    (selectedRentings.length === 0 || disabled) ? styles.disabled : ''
                }`}
            >
                {isProcessing ? (
                    <span className={styles.spinner}></span>
                ) : (
                    `Zatwierdź zwroty (${selectedRentings.length})`
                )}
            </button>
        </div>
    );
};

export default ReturnRenting;