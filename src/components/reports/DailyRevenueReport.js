import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import  {request} from "../../axios_helper";
import classes from "./DailyRevenueReport.module.css"

const DailyRevenueReport = () => {
    const [date, setDate] = useState('');
    const [revenue, setRevenue] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRevenue(null); // Resetuj przychody przed nowym zapytaniem
        setErrorMessage(''); // Resetuj komunikat o błędzie

        try {
            const response = await request("GET",`/api/rentings/report?date=${date}`);
            setRevenue(response.data); // Ustaw przychody z odpowiedzi
        } catch (error) {
            setErrorMessage('Wystąpił błąd podczas pobierania raportu.');
            console.error(error);
        }
    };

    return (
        <Container>
            <h2>Raport dzienny przychodów</h2>
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <label htmlFor="date">Wybierz datę:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Col>
                    <Col>
                        <Button type="submit" variant="primary">Generuj raport</Button>
                    </Col>
                </Row>
            </form>

            {revenue !== null && (
                <Alert variant="success" className="mt-3">
                    Przychody za {date}: {revenue} PLN
                </Alert>
            )}
            {errorMessage && (
                <Alert variant="danger" className="mt-3">
                    {errorMessage}
                </Alert>
            )}
        </Container>
    );
};

export default DailyRevenueReport;
