import React, { useEffect, useState } from "react";
import { request } from "../../axios_helper";
import ReturnRenting from "./ReturnRenting";
import { Alert, Button, Row, Col, Form, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from 'moment-timezone';
import styles from "./RentingList.module.css";

const RentingList = () => {
    const [listRenting, setRentingList] = useState([]);
    const [selectedRentings, setSelectedRentings] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentings = async () => {
            try {
                setIsLoading(true);
                const response = await request('GET', "/api/rentings/recentlyRenting");
                setRentingList(response.data);
            } catch (error) {
                console.error("Error fetching rentings:", error);
                setErrorMessage("Błąd podczas ładowania listy wypożyczeń");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRentings();
    }, []);

    const handleCheckboxChange = (idRenting) => {
        setSelectedRentings((prevSelected) =>
            prevSelected.includes(idRenting)
                ? prevSelected.filter(id => id !== idRenting)
                : [...prevSelected, idRenting]
        );
    };

    const handleConfirmSelection = async () => {
        if (selectedRentings.length === 0) {
            setErrorMessage("Proszę zaznaczyć co najmniej jedną umowę.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await request('POST', '/api/rentings/print', {
                idRentings: selectedRentings
            });

            if (response.status === 200) {
                navigate("/printAgreements", {
                    state: { rentings: response.data }
                });
            } else {
                setErrorMessage("Błąd podczas przygotowywania umów do druku.");
            }
        } catch (error) {
            console.error("Print request error:", error);
            setErrorMessage(error.response?.data?.message || "Błąd podczas drukowania umów.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturnSuccess = async () => {
        try {
            setIsLoading(true);
            const response = await request('GET', '/api/rentings/recentlyRenting');
            setRentingList(response.data);
            setSelectedRentings([]);
        } catch (error) {
            console.error("Error refreshing rentals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToRecentlyReturned = () => {
        navigate('/show-currently-returned');
    };

    return (
        <div className={styles.rentingContainer}>
            <h2 className={styles.pageTitle}>Aktualne wypożyczenia</h2>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
                <Button
                    variant="primary"
                    onClick={handleConfirmSelection}
                    disabled={selectedRentings.length === 0 || isLoading}
                    className={styles.printButton}
                >
                    {isLoading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Wydrukuj umowę wypożyczenia'
                    )}
                </Button>

                <ReturnRenting
                    selectedRentings={selectedRentings}
                    setSuccessMessage={setSuccessMessage}
                    setErrorMessage={setErrorMessage}
                    onReturnSuccess={handleReturnSuccess}
                    onReturnNavigate={handleNavigateToRecentlyReturned}
                    disabled={selectedRentings.length === 0 || isLoading}
                />
            </div>

            {/* Status Messages */}
            {successMessage && (
                <Alert variant="success" className={styles.alertMessage}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert variant="danger" className={styles.alertMessage}>
                    {errorMessage}
                </Alert>
            )}

            {/* Rentals Table */}
            {isLoading ? (
                <div className={styles.loadingContainer}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Ładowanie...</span>
                    </Spinner>
                </div>
            ) : listRenting.length > 0 ? (
                <Container fluid className={styles.tableContainer}>
                    {/* Table Header */}
                    <Row className={styles.tableHeader}>
                        <Col xs={1}>Wybierz</Col>
                        <Col xs={1}>ID</Col>
                        <Col xs={1}>Imię</Col>
                        <Col xs={1}>Nazwisko</Col>
                        <Col xs={2}>Data wypożyczenia</Col>
                        <Col xs={2}>Rower</Col>
                        <Col xs={1}>Nr ramy</Col>
                        <Col xs={2}>Status</Col>
                    </Row>

                    {/* Table Rows */}
                    {listRenting.map((rental) => {
                        const dateRentingFormat = moment.utc(rental.dateRenting)
                            .tz('Europe/Warsaw')
                            .format('DD/MM/YY HH:mm');

                        return (
                            <Row
                                key={rental.idRenting}
                                className={`${styles.tableRow} ${
                                    selectedRentings.includes(rental.idRenting) ? styles.selectedRow : ''
                                }`}
                            >
                                <Col xs={1} className={styles.checkboxCol}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedRentings.includes(rental.idRenting)}
                                        onChange={() => handleCheckboxChange(rental.idRenting)}
                                        className={styles.checkbox}
                                    />
                                </Col>
                                <Col xs={1}>{rental.idRenting}</Col>
                                <Col xs={1}>{rental.firstName}</Col>
                                <Col xs={1}>{rental.lastName}</Col>
                                <Col xs={2}>{dateRentingFormat}</Col>
                                <Col xs={2}>{rental.nameEquipment}</Col>
                                <Col xs={1}>{rental.frameNumber || "N/A"}</Col>
                                <Col xs={2}>
                                    <span className={styles.statusBadge}>
                                        Aktywne
                                    </span>
                                </Col>
                            </Row>
                        );
                    })}
                </Container>
            ) : (
                <Alert variant="info" className={styles.noResultsAlert}>
                    Brak aktywnych wypożyczeń
                </Alert>
            )}
        </div>
    );
};

export default RentingList;