import React, { useState } from 'react';
import {  getBarcode, getBarcodePdf } from './BarcodeService';
import {
    Button,
    Form,
    Card,
    Alert,
    Container,
    Spinner,
    Row,
    Col
} from 'react-bootstrap';


const EquipmentBarcodeManager = (bike) => {
    const [bikeId, setBikeId] = useState('');
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleGetBarcode = async () => {
        if (!bikeId) {
            setError('Proszę wprowadzić ID roweru');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await getBarcode(bikeId);
            setBarcode(result);
            setSuccess('Kod kreskowy pobrany pomyślnie');
        } catch (err) {
            setError(err.message || 'Wystąpił błąd podczas pobierania kodu');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!bikeId) {
            setError('Proszę wprowadzić ID roweru');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await getBarcodePdf(bikeId);
            setSuccess('PDF z kodem kreskowym został pobrany');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };




        return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">Zarządzanie kodami kreskowymi</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="bikeId" className="mb-3">
                                    <Form.Label>ID Roweru</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={bikeId}
                                        onChange={(e) => setBikeId(e.target.value)}
                                        placeholder="Wprowadź ID roweru"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2 mb-3">

                                    <Button
                                        variant="outline-primary"
                                        onClick={handleGetBarcode}
                                        disabled={loading}
                                    >
                                        Pobierz kod
                                    </Button>

                                </div>
                                <div className="mt-3">
                                    <h5>Generuj kod kreskowy</h5>
                                    <Button
                                        variant="success"
                                        onClick={handleDownloadPdf}
                                        disabled={loading || !barcode}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" /> : 'Pobierz PDF'}
                                    </Button>
                                </div>
                                {barcode && (
                                    <Card className="mt-3">
                                        <Card.Body>
                                            <Card.Title>Kod kreskowy:</Card.Title>
                                            <Card.Text className="font-monospace fs-5">
                                                {barcode}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>

                    {error && (
                        <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success" className="mt-3" onClose={() => setSuccess(null)} dismissible>
                            {success}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EquipmentBarcodeManager;