import React, { useState } from "react";
import { request } from "../../axios_helper";
import { useNavigate } from "react-router-dom";
import styles from "./DeleteClient.module.css";

const DeleteClient = () => {
    const [idClient, setIdClient] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!idClient) {
            setError("Proszę podać ID klienta");
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            const response = await request('DELETE', `/api/clients/delete?idClient=${idClient}`);
            setMessage(`Klient o ID ${idClient} został pomyślnie usunięty.`);
            console.log("Klient usunięty:", response.data);

            // Clear form and message after 5 seconds
            setTimeout(() => {
                setIdClient('');
                setMessage('');
                navigate("/clientlist");
            }, 3000);
        } catch (error) {
            console.error("Błąd usuwania klienta:", error);
            setError(error.response?.data?.message || 'Wystąpił błąd przy usuwaniu klienta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.deleteContainer}>
            <h2 className={styles.pageTitle}>Usuń klienta</h2>

            <form onSubmit={handleDelete} className={styles.deleteForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="clientId" className={styles.formLabel}>
                        ID klienta do usunięcia*
                    </label>
                    <input
                        id="clientId"
                        type="number"
                        value={idClient}
                        onChange={(e) => {
                            setIdClient(e.target.value);
                            setError('');
                        }}
                        placeholder="Wprowadź ID klienta"
                        className={`${styles.formInput} ${error ? styles.errorInput : ''}`}
                        min="1"
                    />
                    {error && <p className={styles.errorText}>{error}</p>}
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        className={styles.deleteButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            'Usuń klienta'
                        )}
                    </button>
                </div>

                {message && (
                    <div className={styles.successMessage}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default DeleteClient;