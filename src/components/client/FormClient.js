import React, { useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../axios_helper";
import styles from "./FormClient.module.css";

const FormClient = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        identityCard: '',
        phoneNumber: ''
    });

    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Imię jest wymagane';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nazwisko jest wymagane';
        }

        if (!formData.identityCard.trim()) {
            newErrors.identityCard = 'Numer dowodu jest wymagany';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Numer telefonu jest wymagany';
        } else if (!/^\d{9,15}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Podaj prawidłowy numer telefonu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await request("POST", "/api/clients", formData);
            console.log(response);
            setConfirmationMessage("Klient został pomyślnie dodany!");
            setFormData({
                firstName: '',
                lastName: '',
                identityCard: '',
                phoneNumber: ''
            });
            // Clear message after 5 seconds
            setTimeout(() => setConfirmationMessage(''), 5000);
        } catch (error) {
            console.error(error);
            setConfirmationMessage("Wystąpił błąd podczas dodawania klienta!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Dodaj nowego klienta</h2>

            <form onSubmit={submit} className={styles.clientForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.formLabel}>
                        Imię*
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.firstName ? styles.errorInput : ''}`}
                        placeholder="Wprowadź imię"
                    />
                    {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.formLabel}>
                        Nazwisko*
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.lastName ? styles.errorInput : ''}`}
                        placeholder="Wprowadź nazwisko"
                    />
                    {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="identityCard" className={styles.formLabel}>
                        Numer dowodu*
                    </label>
                    <input
                        id="identityCard"
                        name="identityCard"
                        value={formData.identityCard}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.identityCard ? styles.errorInput : ''}`}
                        placeholder="Wprowadź numer dowodu"
                    />
                    {errors.identityCard && <span className={styles.errorText}>{errors.identityCard}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber" className={styles.formLabel}>
                        Numer telefonu*
                    </label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.phoneNumber ? styles.errorInput : ''}`}
                        placeholder="Wprowadź numer telefonu"
                    />
                    {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            'Zatwierdź'
                        )}
                    </button>
                </div>

                {confirmationMessage && (
                    <div className={confirmationMessage.includes("błąd") ? styles.errorMessage : styles.successMessage}>
                        {confirmationMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default FormClient;
