import { request } from "../../axios_helper";
import { useState, useEffect } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import React from "react";
import classes from "./ClientList.module.css";
import { useNavigate } from "react-router-dom";

const ClientList = () => {
    const [clientList1, setterClientList] = useState([]);
    const navigate = useNavigate();
    const [lastClient, setLastClient] = useState(null); // State to store the last client
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        request('get', '/api/clients')
            .then((response) => {
                console.log(response);
                setterClientList(response.data);

                // Find the client with the highest idClient
                const lastClient = response.data.reduce((prev, current) =>
                    (prev.idClient > current.idClient) ? prev : current
                );
                setLastClient(lastClient); // Set the last client
            })
            .catch((error) => {
                console.error("Błąd podczas pobierania klientów", error);
            });
    }, []);

    const goToAddClient = () => {
        navigate("/formClient");
    };

    const goToDeleteClient = () => {
        navigate("/deleteClient");
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query === "") {
            // If the search query is empty, reset to the last client
            const lastClient = clientList1.reduce((prev, current) =>
                (prev.idClient > current.idClient) ? prev : current
            );
            setLastClient(lastClient);
        } else {
            // Filter clients by last name
            const filtered = clientList1.filter(client =>
                client.lastName.toLowerCase().includes(query.toLowerCase())
            );
            if (filtered.length > 0) {
                // If there are filtered results, display the last client from the filtered list
                const lastFilteredClient = filtered.reduce((prev, current) =>
                    (prev.idClient > current.idClient) ? prev : current
                );
                setLastClient(lastFilteredClient);
            } else {
                // If no results, set lastClient to null
                setLastClient(null);
            }
        }
    };

    return (
        <div>
            <h2>Lista klientów</h2>

            <div>
                <label className={classes.formInputLabel}>Wyszukaj klienta po nazwisko:</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Wpisz nazwisko klienta"
                    className={classes.formInputField}
                />
            </div>

            <Button
                variant="success"
                onClick={goToAddClient}
                style={{ margin: '10px' }}>
                Dodaj Klienta
            </Button>
            <Button
                variant="success"
                onClick={goToDeleteClient}
                style={{ margin: '10px' }}>
                Usuń Klienta
            </Button>

            <Container className="p-4 bg-light rounded-2 shadow-sm fw-bold">
                <Row>
                    <Col md={1}>Id</Col>
                    <Col md={2}>Imię</Col>
                    <Col md={2}>Nazwisko</Col>
                    <Col md={2}>Numer dowodu</Col>
                    <Col md={2}>Numer telefonu</Col>
                </Row>
            </Container>

            {lastClient ? (
                <Container className={classes.FormRow}>
                    <Row>
                        <Col md={1}>{lastClient.idClient}</Col>
                        <Col md={2}>{lastClient.firstName}</Col>
                        <Col md={2}>{lastClient.lastName}</Col>
                        <Col md={2}>{lastClient.identityCard}</Col>
                        <Col md={2}>{lastClient.phoneNumber}</Col>
                    </Row>
                </Container>
            ) : (
                <div>No client found.</div>
            )}
        </div>
    );
};

export default ClientList;