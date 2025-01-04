import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ReportMenu = () => {
    const navigate = useNavigate();

    const handleNavigateToDailyReport = () => {
        navigate('/daily-report'); // Navigate to Daily Revenue Report
    };

    const handleNavigateToRentalsReturned = () => {
        navigate('/show-all-returned'); // Navigate to Rentals Returned Report
    };
    const handleNavigateToDailyReturned = () => {
        navigate('/show-daily-returned');
    }
    return (
        <Container className="mt-5">
            <h2>Menu Raportów</h2>
            <Row className="justify-content-center">
                <Col xs={4} className="mb-3">
                    <Button variant="primary" onClick={handleNavigateToDailyReport} className="w-100">
                        Raport Dzienny Przychodów
                    </Button>
                </Col>
                <Col xs={4} className="mb-3">
                    <Button variant="primary" onClick={handleNavigateToRentalsReturned} className="w-100">
                        Wszystkie Zwrócone Wypożyczenia
                    </Button>
                </Col>
                <Col xs={4} className="mb-3">
                    <Button variant="primary" onClick={handleNavigateToDailyReturned} className="w-100">
                        Dzienne Zwrócone Wypożyczenia
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ReportMenu;