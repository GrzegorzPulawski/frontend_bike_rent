import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../../axios_helper";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";

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
                const response = await request("get", `/api/equipments/details/${id}`);
                setEquipment(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Equipment not found");
                } else {
                    setError("An error occurred while fetching equipment details");
                }
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
                const response = await request("get", "/api/clients");
                setClients(response.data);
            } catch (err) {
                console.error("Error fetching clients:", err);
            }
        };

        fetchClients();
    }, []);

    // Handle renting submission
    const handleRentEquipment = async () => {
        if (rentingLoading) return;

        const createRenting = {
            idClient: selectedClient,
            idEquipment: [equipment.idEquipment],
        };

        setRentingLoading(true);
        try {
            const response = await request("post", "/api/rentings", createRenting);
            setConfirmationMessage("Renting created successfully!");
            setTimeout(() => {
                navigate("/rentingList");
            }, 2000);
        } catch (err) {
            setConfirmationMessage("An error occurred while creating the renting!");
        } finally {
            setRentingLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!equipment) {
        return <div>No equipment data available</div>;
    }

    return (
        <Container className="p-4 bg-light rounded-3 shadow-sm">
            <Row>
                <Col>
                    <h2 className="text-success">Detale Roweru</h2>
                    <p><strong>ID:</strong> {equipment.idEquipment}</p>
                    <p><strong>Nazwa:</strong> {equipment.nameEquipment}</p>
                    <p><strong>Numer ramy:</strong> {equipment.frameNumber}</p>
                    <p><strong>Wielkość ramy:</strong> {equipment.size}</p>
                    <p><strong>Czy dostępny:</strong> {equipment.available ? "Tak" : "Nie"}</p>
                    <p><strong>Cena za dobę:</strong> {equipment.priceEquipment} Zł</p>
                </Col>
            </Row>

            {/* Renting Form */}
            <Row>
                <Col>
                    {!equipment.available ? (
                        <Alert variant="warning" className="mt-4">Sprzęt jest już wypożyczony</Alert>
                    ) : (
                        <>
                            <h3 className="text-success mt-4">Wypożycz ten rower</h3>
                            <Form className="mt-3">
                                <Form.Group controlId="clientSelect" className="mb-3">
                                    <Form.Label>Wybierz klienta:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                    >
                                        <option value="">Wybierz klienta</option>
                                        {clients.map((client) => (
                                            <option key={client.idClient} value={client.idClient}>
                                                {client.lastName} {client.firstName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Button
                                    variant="success" // Green button
                                    onClick={handleRentEquipment}
                                    disabled={rentingLoading || !selectedClient}
                                    className="w-100" // Full-width button
                                >
                                    {rentingLoading ? "Processing..." : "Rent Equipment"}
                                </Button>
                            </Form>

                            {confirmationMessage && (
                                <p className="text-success mt-3">{confirmationMessage}</p>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EquipmentDetails;