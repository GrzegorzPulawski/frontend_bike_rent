import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Alert, Spinner, Image } from 'react-bootstrap';
import {request} from "../../axios_helper";

const BarcodeDisplay = () => {
    const [bikeId, setBikeId] = useState('');
    const [barcodeValue, setBarcodeValue] = useState('');
    const [barcodeImage, setBarcodeImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBarcode = async () => {
        if (!bikeId) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Pobierz wartość kodu
            const valueResponse = await request('GET', `/api/equipment/barcode/${bikeId}`);
            setBarcodeValue(valueResponse.data);

            // 2. Pobierz obrazek kodu
            const imageResponse = await request("GET", `/api/equipment/barcode/${bikeId}/barcode-image`, {
                responseType: 'blob'
            });

            const imageUrl = URL.createObjectURL(new Blob([imageResponse.data]));
            setBarcodeImage(imageUrl);

        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (barcodeImage) {
                URL.revokeObjectURL(barcodeImage); // Sprzątanie
            }
        };
    }, [barcodeImage]);

    return (
        <Card className="mt-4">
            <Card.Header as="h5">Wyświetl kod kreskowy</Card.Header>
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

                    <Button
                        variant="primary"
                        onClick={fetchBarcode}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner as="span" size="sm" animation="border" />
                                <span className="ms-2">Ładowanie...</span>
                            </>
                        ) : 'Pokaż kod'}
                    </Button>
                </Form>

                {barcodeValue && (
                    <div className="mt-4">
                        <h6>Kod kreskowy:</h6>
                        <p className="font-monospace">{barcodeValue}</p>
                    </div>
                )}

                {barcodeImage && (
                    <div className="mt-3">
                        <Image
                            src={barcodeImage}
                            alt="Kod kreskowy"
                            fluid
                            style={{ maxHeight: '150px' }}
                        />
                        <div className="mt-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => window.open(barcodeImage, '_blank')}
                            >
                                Otwórz w nowej karcie
                            </Button>
                        </div>
                    </div>
                )}

                {error && (
                    <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default BarcodeDisplay;