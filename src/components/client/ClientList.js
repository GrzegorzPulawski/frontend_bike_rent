import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { request } from "../../axios_helper";
import { useNavigate } from "react-router-dom";
import styles from "./ClientList.module.css";

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [displayedClient, setDisplayedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = () => {
        request('GET', '/api/clients')
            .then((response) => {
                setClients(response.data);
                updateDisplayedClient(response.data, "");
            })
            .catch((error) => {
                console.error("Error fetching clients:", error);
                setError("Failed to load clients. Please try again.");
            });
    };

    const updateDisplayedClient = (clientList, query) => {
        if (query === "") {
            // Show most recently added client (highest ID)
            const lastClient = clientList.reduce((prev, current) =>
                (prev.idClient > current.idClient) ? prev : current, {});
            setDisplayedClient(lastClient);
        } else {
            // Filter by last name
            const filtered = clientList.filter(client =>
                client.lastName.toLowerCase().includes(query.toLowerCase())
            );
            if (filtered.length > 0) {
                // Show most recent from filtered results
                const lastFiltered = filtered.reduce((prev, current) =>
                    (prev.idClient > current.idClient) ? prev : current, {});
                setDisplayedClient(lastFiltered);
            } else {
                setDisplayedClient(null);
            }
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        updateDisplayedClient(clients, query);
    };

    const handleAddClient = () => navigate("/formClient");
    const handleDeleteClient = () => navigate("/deleteClient");

    return (
        <div className={styles.clientListContainer}>
            <h2 className={styles.pageTitle}>Lista klientów</h2>

            {/* Status Messages */}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Search Bar */}
            <Form.Group className={styles.searchGroup}>
                <Form.Label className={styles.searchLabel}>
                    Wyszukaj klienta po nazwisku:
                </Form.Label>
                <Form.Control
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Wpisz nazwisko klienta"
                    className={styles.searchInput}
                />
            </Form.Group>

            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
                <Button
                    variant="primary"
                    onClick={handleAddClient}
                    className={styles.actionButton}>
                    Dodaj Klienta
                </Button>
                <Button
                    variant="danger"
                    onClick={handleDeleteClient}
                    className={styles.actionButton}>
                    Usuń Klienta
                </Button>
            </div>

            {/* Clients Table */}
            <Container className={styles.tableHeader}>
                <Row>
                    <Col md={1}>ID</Col>
                    <Col md={2}>Imię</Col>
                    <Col md={2}>Nazwisko</Col>
                    <Col md={2}>Numer dowodu</Col>
                    <Col md={2}>Numer telefonu</Col>
                </Row>
            </Container>

            {/* Client Display */}
            {displayedClient ? (
                <Container className={styles.clientRow}>
                    <Row>
                        <Col md={1}>{displayedClient.idClient}</Col>
                        <Col md={2}>{displayedClient.firstName}</Col>
                        <Col md={2}>{displayedClient.lastName}</Col>
                        <Col md={2}>{displayedClient.identityCard}</Col>
                        <Col md={2}>{displayedClient.phoneNumber}</Col>
                    </Row>
                </Container>
            ) : (
                <Alert variant="info" className={styles.noResults}>
                    Nie znaleziono klientów spełniających kryteria wyszukiwania
                </Alert>
            )}
        </div>
    );
};

export default ClientList;