import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ReportMenu = () => {
    const navigate = useNavigate();

    const handleNavigateToDailyReport = () => {
        navigate('/daily-report');
    };

    const handleNavigateToDailyReturned = () => {
        navigate('/show-daily-returned');
    }
    const handleNavigateRentalCreated = () => {
        navigate('/daily-rented-report');
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
                    <Button variant="primary" onClick={handleNavigateToDailyReturned} className="w-100">
                        Zwrócone Wypożyczenia w Dniu
                    </Button>
                </Col>
                <Col xs={4} className="mb-3">
                    <Button variant="primary" onClick={handleNavigateRentalCreated} className="w-100">
                        Utworzone Wypożyczenia w Dniu
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ReportMenu;