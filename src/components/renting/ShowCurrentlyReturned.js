import React, { useState, useEffect } from 'react';
import {request} from "../../axios_helper";
import styles from "./ShowCurrentlyReturned.module.css";
import {Container,Col,Row, Button, Alert, Spinner} from "react-bootstrap";
import moment from "moment-timezone";
import {useNavigate} from "react-router-dom";

const ShowCurrentlyReturned = () => {
    const [recentlyReturned, setRecentlyReturned] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentlyReturned = async () => {
            try {
                const response = await request("GET", "/api/rentings/recentlyReturned");
                setRecentlyReturned(response.data);
            } catch (error) {
                setError("Wystąpił błąd podczas pobierania danych.");
                console.error("Error fetching recently returned rentals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentlyReturned();
    }, []);

    const handleSelectItem = (itemId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const handlePrintConfirmations = async () => {
        const { generatePdf } = await import('../print/pdfWorker');
        generatePdf(recentlyReturned, selectedItems);
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <Spinner animation="border" variant="danger" />
            <p>Ładowanie danych...</p>
        </div>
    );

    if (error) return (
        <Alert variant="danger" className={styles.errorAlert}>
            {error}
        </Alert>
    );
    if (recentlyReturned.length === 0) return <p>Brak ostatnio zwróconych wypożyczeń.</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Aktualne zwroty</h2>

            <div className={styles.buttonGroup}>
                <Button
                    variant="warning"
                    onClick={() => navigate('/rentingList')}
                    className={styles.backButton}
                >
                    Wróć do listy wypożyczeń
                </Button>
            </div>

            {successMessage && (
                <Alert variant="success" className={styles.successMessage}>
                    {successMessage}
                </Alert>
            )}

            {recentlyReturned.length === 0 ? (
                <Alert variant="info" className={styles.noResults}>
                    Brak ostatnio zwróconych wypożyczeń
                </Alert>
            ) : (
                <div className={styles.tableContainer}>
                    {/* Table Header */}
                    <Row className={styles.tableHeader}>
                        <Col xs={1}><span>Wybierz</span></Col>
                        <Col xs={1}><span>ID</span></Col>
                        <Col xs={1}><span>Imię</span></Col>
                        <Col xs={1}><span>Nazwisko</span></Col>
                        <Col xs={2}><span>Data wypożyczenia</span></Col>
                        <Col xs={1}><span>Sprzęt</span></Col>
                        <Col xs={2}><span>Data zwrotu</span></Col>
                        <Col xs={1}><span>Cena/dzień</span></Col>
                        <Col xs={1}><span>Dni</span></Col>
                        <Col xs={1}><span>Razem</span></Col>
                    </Row>

                    {/* Table Rows */}
                    {recentlyReturned.map((value) => {
                        const dateRentingFormat = moment.utc(value.dateRenting)
                            .tz('Europe/Warsaw')
                            .format('DD/MM/YY HH:mm');
                        const dateOfReturnFormat = value.dateOfReturn
                            ? moment.utc(value.dateOfReturn)
                                .tz('Europe/Warsaw')
                                .format('DD/MM/YY HH:mm')
                            : 'W trakcie';

                        return (
                            <Row
                                key={value.idRenting}
                                className={`${styles.tableRow} ${
                                    selectedItems.includes(value.idRenting) ? styles.selectedRow : ''
                                }`}
                            >
                                <Col xs={1} className={styles.checkboxCol}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(value.idRenting)}
                                        onChange={() => handleSelectItem(value.idRenting)}
                                        className={styles.checkbox}
                                    />
                                </Col>
                                <Col xs={1}>{value.idRenting}</Col>
                                <Col xs={1}>{value.firstName}</Col>
                                <Col xs={1}>{value.lastName}</Col>
                                <Col xs={2}>{dateRentingFormat}</Col>
                                <Col xs={1}>{value.nameEquipment}</Col>
                                <Col xs={2}>{dateOfReturnFormat}</Col>
                                <Col xs={1}>{value.priceEquipment} zł</Col>
                                <Col xs={1}>{value.daysOfRental}</Col>
                                <Col xs={1} className={styles.totalPrice}>
                                    {value.priceOfDuration} zł
                                </Col>
                            </Row>
                        );
                    })}

                    {/* Print Button */}
                    <div className={styles.printButtonContainer}>
                        <Button
                            variant="danger"
                            onClick={handlePrintConfirmations}
                            disabled={selectedItems.length === 0 || loading}
                            className={styles.printButton}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                'Drukuj potwierdzenia'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowCurrentlyReturned;