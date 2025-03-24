import React, { useState, useEffect } from 'react';
import { request, isUserInRole } from '../../axios_helper';
import { useNavigate } from 'react-router-dom';
import styles from './EquipmentDelete.module.css';
import {Alert} from "react-bootstrap";



const EquipmentDelete = () => {
    const [idEquipment, setIdEquipment] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check admin privileges on component mount
        if (isUserInRole('ADMIN')) {
            setHasAccess(true);
        } else {
            setErrorMessage("Brak uprawnień administratora");
            setHasAccess(false);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!hasAccess) {
            setErrorMessage("Brak uprawnień do usuwania sprzętu");
            return;
        }

        if (!idEquipment) {
            setErrorMessage("Proszę podać ID sprzętu");
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await request(
                "DELETE",
                `/api/equipments/delete?idEquipment=${idEquipment}`
            );

            setSuccessMessage(`Sprzęt o ID ${idEquipment} został pomyślnie usunięty.`);
            setIdEquipment('');

            // Redirect after 2 seconds
            setTimeout(() => navigate("/list"), 2000);
        } catch (error) {
            console.error("Error deleting equipment:", error);
            setErrorMessage(
                error.response?.data?.message ||
                "Nie udało się usunąć sprzętu. Sprawdź czy ID jest poprawne."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.deleteContainer}>
            <h2 className={styles.pageTitle}>Usuń Sprzęt</h2>

            {!hasAccess && (
                <Alert variant="danger" className={styles.alert}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className={styles.deleteForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="equipmentId" className={styles.label}>
                        ID sprzętu do usunięcia*
                    </label>
                    <input
                        id="equipmentId"
                        type="number"
                        value={idEquipment}
                        onChange={(e) => {
                            setIdEquipment(e.target.value);
                            setErrorMessage('');
                        }}
                        className={styles.input}
                        placeholder="Wprowadź ID sprzętu"
                        min="1"
                        disabled={!hasAccess}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.deleteButton}
                    disabled={!hasAccess || loading || !idEquipment}
                >
                    {loading ? (
                        <span className={styles.spinner}></span>
                    ) : (
                        'Usuń Sprzęt'
                    )}
                </button>

                {successMessage && (
                    <Alert variant="success" className={styles.alert}>
                        {successMessage}
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
};

export default EquipmentDelete;