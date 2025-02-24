import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../../axios_helper";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";

const EquipmentDetails = () => {
    const { id } = useParams(); // Get equipment ID from the URL
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
                setEquipment(response.data); // Set equipment data
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Equipment not found"); // Handle 404 error
                } else {
                    setError("An error occurred while fetching equipment details"); // Handle other errors
                }
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchEquipment(); // Fetch equipment details
    }, [id]);

    // Fetch clients for the renting form
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await request("get", "/api/clients");
                setClients(response.data); // Set clients data
            } catch (err) {
                console.error("Error fetching clients:", err);
            }
        };

        fetchClients(); // Fetch clients
    }, []);

    // Handle renting submission
    const handleRentEquipment = async () => {
        if (rentingLoading) return;

        const createRenting = {
            idClient: selectedClient, // Selected client ID
            idEquipment: [equipment.idEquipment], // Use the current equipment ID
        };

        setRentingLoading(true); // Set loading to true
        try {
            const response = await request("post", "/api/rentings", createRenting);
            setConfirmationMessage("Renting created successfully!");
            setTimeout(() => {
                navigate("/rentingList"); // Redirect to renting list after success
            }, 2000);
        } catch (err) {
            setConfirmationMessage("An error occurred while creating the renting!");
        } finally {
            setRentingLoading(false); // Reset loading status
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading message
    }

    if (error) {
        return <div>{error}</div>; // Display error message
    }

    if (!equipment) {
        return <div>No equipment data available</div>; // Handle case where equipment is null
    }
    return (
        <Container>
            <Row>
                <Col>
                    <h2>Equipment Details</h2>
                    <p><strong>ID:</strong> {equipment.idEquipment}</p>
                    <p><strong>Name:</strong> {equipment.nameEquipment}</p>
                    <p><strong>Frame Number:</strong> {equipment.frameNumber}</p>
                    <p><strong>Size:</strong> {equipment.size}</p>
                    <p><strong>Available:</strong> {equipment.available ? "Yes" : "No"}</p>
                    <p><strong>Price:</strong> ${equipment.priceEquipment}</p>
                </Col>
            </Row>

            {/* Renting Form */}
            <Row>
                <Col>
                    {!equipment.available ? (
                        <Alert variant="warning">Sprzęt jest już wypożyczony</Alert>
                    ) : (
                        <>
                            <h3>Rent this Equipment</h3>
                            <Form>
                                <Form.Group controlId="clientSelect">
                                    <Form.Label>Select Client:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                    >
                                        <option value="">Select a client</option>
                                        {clients.map((client) => (
                                            <option key={client.idClient} value={client.idClient}>
                                                {client.lastName} {client.firstName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    onClick={handleRentEquipment}
                                    disabled={rentingLoading || !selectedClient}
                                    className="mt-3"
                                >
                                    {rentingLoading ? "Processing..." : "Rent Equipment"}
                                </Button>
                            </Form>

                            {confirmationMessage && <p className="mt-3">{confirmationMessage}</p>}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EquipmentDetails;
