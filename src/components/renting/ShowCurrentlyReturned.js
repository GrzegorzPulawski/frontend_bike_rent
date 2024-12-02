import React, { useState, useEffect } from 'react';
import {request} from "../../axios_helper";
import styles from "./ShowCurrentlyReturned.module.css";
import {Container,Col,Row, Button} from "react-bootstrap";
import moment from "moment-timezone";
import jsPDF from 'jspdf';

const ShowCurrentlyReturned = () => {
    const [recentlyReturned, setRecentlyReturned] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);

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
    const handlePrintConfirmations = () => {
        const doc = new jsPDF();

        doc.addFont('fonts/Roboto-Medium.ttf', 'Roboto-Medium', 'normal');
        doc.setFont('Roboto-Medium');
        doc.setFontSize(12);

        let verticalPosition = 10;  // Rozpocznij od góry strony
        const marginX = 10;         // Lewy margines
        const marginY = 0;         // Górny margines
        const confirmationHeight = 65; // Wysokość jednego potwierdzenia
        let totalSum = 0; // Zmienna do podsumowania

        recentlyReturned.forEach((item, index) => {
            if (selectedItems.includes(item.idRenting)) {

                doc.text(`Potwierdzenie przyjecia zwrotu sprzętu Nr: ${item.idRenting}`, marginX, verticalPosition + 10);
                doc.text(`Imię: ${item.firstName}`, marginX, verticalPosition + 20);
                doc.text(`Nazwisko: ${item.lastName}`, marginX, verticalPosition + 25);
                doc.text(`Data wypożyczenia: ${moment.utc(item.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')}`, marginX, verticalPosition + 30);
                doc.text(`Sprzęt: ${item.nameEquipment}`, marginX, verticalPosition + 35);
                doc.text(`Data zwrotu: ${item.dateOfReturn ? moment.utc(item.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm') : 'Wynajem w toku'}`, marginX, verticalPosition + 40);
                doc.text(`Cena: ${item.priceEquipment}`, marginX, verticalPosition + 45);
                doc.text(`Ilość dni: ${item.daysOfRental}`, marginX, verticalPosition + 50);
                doc.text(`Cena całkowita: ${item.priceOfDuration}`, marginX, verticalPosition + 55);
                doc.text('Sprzęt przyjęto bez zastrzeżeń', marginX, verticalPosition +60)

                totalSum += item.priceOfDuration;
                // Zwiększ pozycję pionową dla kolejnego potwierdzenia

                verticalPosition += confirmationHeight ;
                // Jeśli pozycja przekracza wysokość strony, dodaj nową stronę
                if (verticalPosition > doc.internal.pageSize.height - marginY) {
                    doc.addPage();
                    verticalPosition = marginY; // Resetuj pozycję pionową
                }
            }
        });
        verticalPosition += 5;
        doc.setFontSize(14);
        doc.text(`Suma: ${totalSum.toFixed(2)} zł`, marginX, verticalPosition);

        doc.save(`confirmations_return_${Date.now()}.pdf`);
    };

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {error.message}</p>;
    if (recentlyReturned.length === 0) return <p>Brak ostatnio zwróconych wypożyczeń.</p>;

    return (
        <Container className="table-responsive">
            <h3>Aktualne zwroty</h3>
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