import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../../axios_helper";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import BikeUnlock from "../QRScanner/BikeUnlockModal";

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
    const [showUnlockModal, setShowUnlockModal] = useState(false);// Bikeunlock

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
            setConfirmationMessage("Sprzęt pomyślnie wypożyczono!");
            setTimeout(() => {
                navigate("/rentingList");
            }, 2000);
        } catch (err) {
            setConfirmationMessage("Błąd podczas kreowania wypożyczenia!");
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
        return <div>Sprzęt niedostępny</div>;
    }

    return (
        <Container className="p-4 bg-light rounded-3 shadow-sm">
            <Row>
                <Col>
                    <h2 className="text-secondary-emphasis mb-4">
                        Detale Roweru
                    </h2>
                    <div className="card p-3 mb-3">
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-tag me-2"></i>ID:</strong> {equipment.idEquipment}
                        </p>
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-card-text me-2"></i>Nazwa:</strong> {equipment.nameEquipment}
                        </p>
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-upc-scan me-2"></i>Numer ramy:</strong> {equipment.frameNumber}
                        </p>
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-rulers me-2"></i>Wielkość ramy:</strong> {equipment.size}
                        </p>
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-bicycle me-2"></i>Typ roweru:</strong> {equipment.type}
                        </p>
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-check-circle me-2"></i>Czy elektryk:</strong>
                            <span className={`badge ${equipment.electric ? 'bg-success' : 'bg-danger'} ms-2`}>
                        {equipment.electric ? "Tak" : "Nie"}
                    </span>
                        </p>
                        <p className="mb-2">
                            <strong className="text-primary"><i className="bi bi-check-circle me-2"></i>Czy dostępny:</strong>
                            <span className={`badge ${equipment.available ? 'bg-success' : 'bg-danger'} ms-2`}>
                        {equipment.available ? "Tak" : "Nie"}
                    </span>
                        </p>
                        <p className="mb-0">
                            <strong className="text-primary"><i className="bi bi-currency-exchange me-2"></i>Cena za dobę:</strong> {equipment.priceEquipment} Zł
                        </p>
                    </div>
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
                                    {rentingLoading ? "Processing..." : "Wypożycz ten rower"}
                                </Button>
                            </Form>

                            {confirmationMessage && (
                                <p className="text-success mt-3">{confirmationMessage}</p>
                            )}
                        </>
                    )}
                </Col>
            </Row>
            {/* Bike Unlock Modal */}
            <BikeUnlock
                bikeId={equipment.idEquipment}
                show={showUnlockModal}
                onHide={() => setShowUnlockModal(false)}
            />
        </Container>
    );
};

export default EquipmentDetails;