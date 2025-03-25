import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { request } from "../../axios_helper";
import moment from 'moment-timezone';

const ReturnedRentalsList = () => {
    const [listRenting, setRentingList] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRentings = async () => {
            setIsLoading(true);
            try {
                const response = await request('get', "/api/rentings");
                setRentingList(response.data);
            } catch (error) {
                console.error("Error fetching rentings:", error);
                setErrorMessage('Wystąpił błąd podczas ładowania danych.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRentings();
    }, []);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setErrorMessage('');
    };

    const handleFilter = () => {
        if (!selectedDate) {
            setErrorMessage('Proszę wybrać datę.');
        }
    };

    const filteredRentings = listRenting
        .filter(value => value.dateOfReturn && moment(value.dateOfReturn).isSame(selectedDate, 'day'));
    const totalRentalsCount = filteredRentings.length;
    const totalPrice = filteredRentings.reduce((sum, value) => sum + value.priceOfDuration, 0);

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
            <Container>
                <Card className="shadow-sm mb-4" style={{ border: 'none' }}>
                    <Card.Body style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <h2 className="mb-0">Lista zwróconych wypożyczeń</h2>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm mb-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={4}>
                                <Form.Group controlId="datePicker">
                                    <Form.Label style={{ fontWeight: '500', color: '#343a40' }}>Wybierz datę zwrotu:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        style={{ border: '2px solid #6c757d' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2} className="mt-md-0 mt-2">
                                <Button
                                    variant="warning"
                                    onClick={handleFilter}
                                    style={{
                                        backgroundColor: '#ffc107',
                                        borderColor: '#ffc107',
                                        color: '#343a40',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Filtruj
                                </Button>
                            </Col>
                        </Row>

                        {errorMessage && (
                            <Alert variant="danger" className="mt-3">
                                {errorMessage}
                            </Alert>
                        )}
                    </Card.Body>
                </Card>

                {isLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : (
                    <>
                        <Card className="shadow-sm mb-3">
                            <Card.Body className="p-0">
                                <Row className="fw-bold text-center py-2 m-0" style={{
                                    backgroundColor: '#343a40',
                                    color: 'white',
                                    borderBottom: '3px solid #ffc107'
                                }}>
                                    <Col xs={1}>ID</Col>
                                    <Col xs={1}>Imię</Col>
                                    <Col xs={2}>Nazwisko</Col>
                                    <Col xs={2}>Data wypożyczenia</Col>
                                    <Col xs={2}>Sprzęt</Col>
                                    <Col xs={2}>Data zwrotu</Col>
                                    <Col xs={1}>Cena</Col>
                                    <Col xs={1}>Dni</Col>
                                </Row>

                                {filteredRentings.length > 0 ? (
                                    filteredRentings.map((value, index) => {
                                        const dateRentingFormat = moment.utc(value.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm');
                                        const dateOfReturnFormat = moment.utc(value.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm');

                                        return (
                                            <Row
                                                className={`py-2 border-bottom text-center m-0 ${index % 2 === 0 ? 'bg-white' : 'bg-light'}`}
                                                key={value.idRenting}
                                            >
                                                <Col xs={1}>{value.idRenting}</Col>
                                                <Col xs={1}>{value.firstName}</Col>
                                                <Col xs={2}>{value.lastName}</Col>
                                                <Col xs={2}>{dateRentingFormat}</Col>
                                                <Col xs={2}>{value.nameEquipment}</Col>
                                                <Col xs={2}>{dateOfReturnFormat}</Col>
                                                <Col xs={1}>{value.priceOfDuration} PLN</Col>
                                                <Col xs={1}>{value.daysOfRental}</Col>
                                            </Row>
                                        );
                                    })
                                ) : (
                                    <Row className="py-4">
                                        <Col className="text-center text-muted">Brak zwróconych wypożyczeń na tę datę.</Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>

                        {filteredRentings.length > 0 && (
                            <>
                                <Card className="shadow-sm mb-3">
                                    <Card.Body className="py-2" style={{ backgroundColor: '#f8f9fa' }}>
                                        <Row className="fw-bold text-center">
                                            <Col xs={8} className="text-end" style={{ color: '#343a40' }}>
                                                Ilość zwróconych wypożyczeń:
                                            </Col>
                                            <Col xs={4} className="text-start">
                                                <span style={{
                                                    backgroundColor: '#ffc107',
                                                    padding: '5px 15px',
                                                    borderRadius: '20px',
                                                    color: '#343a40'
                                                }}>
                                                    {totalRentalsCount} wypożyczeń
                                                </span>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className="shadow-sm">
                                    <Card.Body className="py-2" style={{ backgroundColor: '#f8f9fa' }}>
                                        <Row className="fw-bold text-center">
                                            <Col xs={8} className="text-end" style={{ color: '#343a40' }}>
                                                Suma całkowita:
                                            </Col>
                                            <Col xs={4} className="text-start">
                                                <span style={{
                                                    backgroundColor: '#28a745',
                                                    padding: '5px 15px',
                                                    borderRadius: '20px',
                                                    color: 'white'
                                                }}>
                                                    {totalPrice} PLN
                                                </span>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

export default ReturnedRentalsList;