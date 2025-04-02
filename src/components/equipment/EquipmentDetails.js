import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../../axios_helper";
import styles from "./EquipmentDetails.module.css";
import {Alert} from "react-bootstrap";

const EquipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [rentingLoading, setRentingLoading] = useState(false);

    // Fetch equipment details
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                const response = await request("GET", `/api/equipments/details/${id}`);
                setEquipment(response.data);
                setError(null);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("Sprzęt nie został znaleziony");
                } else {
                    setError("Wystąpił błąd podczas ładowania danych sprzętu");
                }
                console.error("Error fetching equipment:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [id]);

    // Fetch clients for the renting form
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await request("GET", "/api/clients");
                setClients(response.data);
            } catch (err) {
                console.error("Error fetching clients:", err);
            }
        };

        fetchClients();
    }, []);

    // Handle renting submission
    const handleRentEquipment = async () => {
        if (!selectedClient) return;

        const createRenting = {
            idClient: selectedClient,
            idEquipment: [equipment.idEquipment],
        };

        setRentingLoading(true);
        try {
            const response = await request("POST", "/api/rentings", createRenting);
            setConfirmationMessage("Sprzęt pomyślnie wypożyczono!");
            setTimeout(() => navigate("/rentingList"), 2000);
        } catch (err) {
            console.error("Error renting equipment:", err);
            setConfirmationMessage("Błąd podczas wypożyczania: " +
                (err.response?.data?.message || "Spróbuj ponownie"));
        } finally {
            setRentingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Ładowanie danych sprzętu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className={styles.errorAlert}>
                {error}
            </Alert>
        );
    }

    if (!equipment) {
        return (
            <Alert variant="warning" className={styles.alert}>
                Sprzęt niedostępny
            </Alert>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Detale Roweru</h2>

            {/* Equipment Details Card */}
            <div className={styles.detailsCard}>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>ID:</span>
                    <span className={styles.detailValue}>{equipment.idEquipment}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Nazwa:</span>
                    <span className={styles.detailValue}>{equipment.nameEquipment}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Numer ramy:</span>
                    <span className={styles.detailValue}>{equipment.frameNumber}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Rozmiar:</span>
                    <span className={styles.detailValue}>{equipment.size}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Typ:</span>
                    <span className={styles.detailValue}>{equipment.type}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Elektryk:</span>
                    <span className={`${styles.statusBadge} ${
                        equipment.electric ? styles.active : styles.inactive
                    }`}>
                        {equipment.electric ? "Tak" : "Nie"}
                    </span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Dostępność:</span>
                    <span className={`${styles.statusBadge} ${
                        equipment.available ? styles.active : styles.inactive
                    }`}>
                        {equipment.available ? "Dostępny" : "Wypożyczony"}
                    </span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Cena/dzień:</span>
                    <span className={styles.priceValue}>{equipment.priceEquipment} zł</span>
                </div>
            </div>

            {/* Rental Form */}
            {!equipment.available ? (
                <Alert variant="warning" className={styles.alert}>
                    Sprzęt jest obecnie wypożyczony
                </Alert>
            ) : (
                <div className={styles.rentalForm}>
                    <h3 className={styles.sectionTitle}>Wypożycz rower</h3>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Wybierz klienta:</label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className={styles.formSelect}
                        >
                            <option value="">Wybierz klienta</option>
                            {clients.map((client) => (
                                <option key={client.idClient} value={client.idClient}>
                                    {client.lastName} {client.firstName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.rentButton}
                            onClick={handleRentEquipment}
                            disabled={rentingLoading || !selectedClient}
                        >
                            {rentingLoading ? (
                                <span className={styles.buttonSpinner}></span>
                            ) : (
                                'Wypożycz rower'
                            )}
                        </button>
                    </div>

                    {confirmationMessage && (
                        <Alert
                            variant={confirmationMessage.includes("Błąd") ? "danger" : "success"}
                            className={styles.alert}
                        >
                            {confirmationMessage}
                        </Alert>
                    )}
                </div>
            )}


        </div>
    );
};

export default EquipmentDetails;