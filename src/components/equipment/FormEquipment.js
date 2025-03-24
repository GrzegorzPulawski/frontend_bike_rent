import React from "react";
import styles from "./FormEquipment.module.css";
import  {request, isUserInRole} from "../../axios_helper";
import {useState,useEffect} from "react";
import { Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

const SizeBike = {
    XS: "XS",
    S: "S",
    M: "M",
    L: "L",
    XL: "XL"
};
const TypeBike ={
    SZOSOWY:"SZOSOWY",
    MTB:"MTB",
    CROSSOWY:"CROSSOWY",
    MIEJSKI:"MIEJSKI",
    TREKINGOWY:"TREKINGOWY"

};


    function FormEquipment() {
        const [formData, setFormData] = useState({
            name: '',
            frame: '',
            size: SizeBike.M,
            type: TypeBike.MTB,
            available: true,
            electric: false,
            price: ''
        });
        const [confirmationMessage, setConfirmationMessage] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
        const [hasAccess, setHasAccess] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);

        useEffect(() => {
            if (isUserInRole('ADMIN')) {
                setHasAccess(true);
            } else {
                setErrorMessage("Brak uprawnień administratora");
                setHasAccess(false);
            }
        }, []);

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const validateForm = () => {
            if (!formData.name.trim()) {
                setErrorMessage("Nazwa roweru jest wymagana");
                return false;
            }
            if (!formData.frame.trim()) {
                setErrorMessage("Numer ramy jest wymagany");
                return false;
            }
            if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
                setErrorMessage("Podaj prawidłową cenę");
                return false;
            }
            setErrorMessage('');
            return true;
        };

        const submitEquipment = async (e) => {
            e.preventDefault();

            if (!hasAccess) {
                setErrorMessage("Brak uprawnień do dodawania sprzętu");
                return;
            }

            if (!validateForm()) return;

            setIsSubmitting(true);

            const equipmentData = {
                nameEquipment: formData.name,
                frameNumber: formData.frame,
                size: formData.size,
                type: formData.type,
                available: true,
                electric: formData.electric,
                priceEquipment: formData.price
            };

            try {
                const response = await request("POST", "/api/equipments/add", equipmentData);
                setConfirmationMessage("Sprzęt został pomyślnie dodany!");

                // Reset form after success
                setFormData({
                    name: '',
                    frame: '',
                    size: SizeBike.M,
                    type: TypeBike.MTB,
                    available: true,
                    electric: false,
                    price: ''
                });

                setTimeout(() => setConfirmationMessage(''), 5000);
            } catch (error) {
                console.error("Error adding equipment:", error);
                setErrorMessage(error.response?.data?.message || "Wystąpił błąd podczas dodawania sprzętu");
            } finally {
                setIsSubmitting(false);
            }
        };
    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Dodaj nowy sprzęt</h2>

            {!hasAccess && (
                <Alert variant="danger" className={styles.alert}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={submitEquipment} className={styles.equipmentForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Nazwa roweru*
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={!hasAccess}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="frame" className={styles.label}>
                        Numer ramy*
                    </label>
                    <input
                        id="frame"
                        name="frame"
                        type="text"
                        value={formData.frame}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={!hasAccess}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="size" className={styles.label}>
                        Rozmiar roweru
                    </label>
                    <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className={styles.select}
                        disabled={!hasAccess}
                    >
                        {Object.values(SizeBike).map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="type" className={styles.label}>
                        Typ roweru
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={styles.select}
                        disabled={!hasAccess}
                    >
                        {Object.values(TypeBike).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="electric"
                            checked={formData.electric}
                            onChange={handleChange}
                            className={styles.checkbox}
                            disabled={!hasAccess}
                        />
                        <span className={styles.checkboxCustom}></span>
                        Rower elektryczny
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="price" className={styles.label}>
                        Cena (zł)*
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={!hasAccess}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!hasAccess || isSubmitting}
                >
                    {isSubmitting ? (
                        <span className={styles.spinner}></span>
                    ) : (
                        'Zatwierdź'
                    )}
                </button>

                {confirmationMessage && (
                    <Alert variant="success" className={styles.alert}>
                        {confirmationMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert variant="danger" className={styles.alert}>
                        {errorMessage}
                    </Alert>
                )}
            </form>
        </div>
    );
}

export default FormEquipment;