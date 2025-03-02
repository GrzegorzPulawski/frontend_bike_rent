import React, { useState, useEffect } from 'react';
import {request} from "../../axios_helper";
import styles from "./ShowCurrentlyReturned.module.css";
import {Container,Col,Row, Button} from "react-bootstrap";
import moment from "moment-timezone";

import {useNavigate} from "react-router-dom";

const ShowCurrentlyReturned = () => {
    const [recentlyReturned, setRecentlyReturned] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
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

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {error.message}</p>;
    if (recentlyReturned.length === 0) return <p>Brak ostatnio zwróconych wypożyczeń.</p>;

    return (
        <Container className="table-responsive">
            <h3>Aktualne zwroty</h3>
            <Row className={styles.button}>
                <Col>
                    <Button variant="primary" onClick={() => navigate('/rentingList')} >
                        Wróć do listy wypożyczeń
                    </Button>
                </Col>
            </Row>
            <Row className={`${styles.header} mb-2`}>
                <Col><strong>Wybierz</strong></Col>
                <Col><strong>Id</strong></Col>
                <Col><strong>Imię</strong></Col>
                <Col><strong>Nazwisko</strong></Col>
                <Col><strong>Data wypożyczenia</strong></Col>
                <Col><strong>Sprzęt</strong></Col>
                <Col><strong>Data zwrotu</strong></Col>
                <Col><strong>Cena</strong></Col>
                <Col><strong>Ilość dni</strong></Col>
                <Col><strong>Cena całkowita</strong></Col>
            </Row>
            {recentlyReturned.map((value) => {
                const dateRentingFormat = moment.utc(value.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm');
                const dateOfReturnFormat = value.dateOfReturn
                    ? moment.utc(value.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')
                    : 'Wynajem w toku';

                return (
                    <Row key={value.idRenting} className={`${styles.rowCustom} mb-2`}>
                        <Col className={styles.colCustom}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(value.idRenting)}
                                onChange={() => handleSelectItem(value.idRenting)}
                            />
                        </Col>
                        <Col className={styles.colCustom}>{value.idRenting}</Col>
                        <Col className={styles.colCustom}>{value.firstName}</Col>
                        <Col className={styles.colCustom}>{value.lastName}</Col>
                        <Col className={styles.colCustom}>{dateRentingFormat}</Col>
                        <Col className={styles.colCustom}>{value.nameEquipment}</Col>
                        <Col className={styles.colCustom}>{dateOfReturnFormat}</Col>
                        <Col className={styles.colCustom}>{value.priceEquipment}</Col>
                        <Col className={styles.colCustom}>{value.daysOfRental}</Col>

                        <Col className={styles.colCustom}>{value.priceOfDuration}</Col>

                    </Row>
                );
            })}
            <Button
                variant="primary"
                onClick={handlePrintConfirmations}
                disabled={selectedItems.length === 0}
                className="mt-3"
            >
                Drukuj potwierdzenia
            </Button>
        </Container>
    );
};
export default ShowCurrentlyReturned;