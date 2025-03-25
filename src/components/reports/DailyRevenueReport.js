import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert, Card, Spinner, Form } from 'react-bootstrap';
import { request } from "../../axios_helper";
import { useNavigate } from "react-router-dom";

const DailyRevenueReport = () => {
    const [date, setDate] = useState('');
    const [revenue, setRevenue] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRevenue(null);
        setErrorMessage('');

        if (!date) {
            setErrorMessage('Proszę wybrać datę.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await request("GET", `/api/rentings/report?date=${date}`);
            setRevenue(response.data);
        } catch (error) {
            setErrorMessage('Wystąpił błąd podczas pobierania raportu.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToAllReturned = () => {
        navigate('/show-daily-returned');
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
            <Container>
                <Card className="shadow-sm mb-4" style={{ border: 'none' }}>
                    <Card.Body style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <h2 className="mb-0">Raport dzienny przychodów</h2>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm mb-4">
                    <Card.Body>
                        <form onSubmit={handleSubmit}>
                            <Row className="align-items-end">
                                <Col md={4}>
                                    <Form.Group controlId="datePicker">
                                        <Form.Label style={{ fontWeight: '500', color: '#343a40' }}>
                                            Wybierz datę:
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ border: '2px solid #6c757d' }}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-md-0 mt-2">
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        style={{
                                            backgroundColor: '#ffc107',
                                            borderColor: '#ffc107',
                                            color: '#343a40',
                                            fontWeight: 'bold'
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                                <span className="ms-2">Ładowanie...</span>
                                            </>
                                        ) : (
                                            'Generuj raport'
                                        )}
                                    </Button>
                                </Col>
                                <Col md={3} className="mt-md-0 mt-2 ms-auto">
                                    <Button
                                        variant="outline-dark"
                                        onClick={handleNavigateToAllReturned}
                                        style={{ fontWeight: '500' }}
                                    >
                                        Zobacz zwrócone sprzęty
                                    </Button>
                                </Col>
                            </Row>
                        </form>

                        {errorMessage && (
                            <Alert variant="danger" className="mt-3">
                                {errorMessage}
                            </Alert>
                        )}

                        {revenue !== null && (
                            <Alert variant="success" className="mt-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                        Przychody za dzień <strong>{date}</strong>:
                                    </span>
                                    <span className="fs-4 fw-bold" style={{ color: '#28a745' }}>
                                        {revenue} PLN
                                    </span>
                                </div>
                            </Alert>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default DailyRevenueReport;