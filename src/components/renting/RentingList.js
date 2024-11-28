import React, {useEffect, useState} from "react";

import styles from "./RentingList.module.css"
import {request} from "../../axios_helper";
import ReturnRenting from "./ReturnRenting";
import {Alert, Button, Row, Col, Form, Container} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import moment from 'moment-timezone';


const RentingList = () => {
    const [listRenting, setRentingList] = useState([]);
    const [selectedRentings, setSelectedRentings] = useState([])
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentings = async () => {
            try {
                const response = await request('get', "/api/rentings");
                setRentingList(response.data);
            } catch (error) {
                console.error("Error fetching rentings:", error);
            }
        };
        fetchRentings();
    }, []);
    // Handle selecting/unselecting rentals
    const handleCheckboxChange = (idRenting) => {
        setSelectedRentings((prevSelected) => {
            if (prevSelected.includes(idRenting)) {
                return prevSelected.filter(id => id !== idRenting); // Unselect
            } else {
                return [...prevSelected, idRenting]; // Select
            }
        });
    };

    //Logika przekierowania do Listy umow
    const handleConfirmSelection = async () => {
        if (selectedRentings.length > 0) {
            try {
                const response = await request('post', '/api/rentings/print', {idRentings: selectedRentings });
                if (response.status === 200) {
                    console.log('Navigating with data:', response.data); // Debug log
                    navigate("/printAgreements", { state: { rentings: response.data } });
                } else {
                    setErrorMessage("Błąd podczas drukowania umów.");
                }
            } catch (error) {
                setErrorMessage("Błąd podczas drukowania umów.");
                console.error("Error during print request:", error);
                console.error("Error response:", error.response);
            }
        } else {
            setErrorMessage("Proszę zaznaczyć co najmniej jedną umowę.");
        }
    };
    const handleReturnSuccess = async () => {
        //Fetch updated renting list after successful return
        const response = await request('get', '/api/rentings');
        setRentingList(response.data);
    }
    const handleNavigateToRecentlyReturned = () => {
        navigate('/show-currently-returned');
    };
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center mt-3">
                <Button
                    variant="primary"
                    onClick={handleConfirmSelection}
                    disabled={selectedRentings.length === 0}
                    className="btn-lg me-2"
                >
                    Wydrukuj umowę wypożyczenia
                </Button>

                <ReturnRenting
                    selectedRentings={selectedRentings}
                    setSuccessMessage={setSuccessMessage}
                    setErrorMessage={setErrorMessage}
                    onReturnSuccess={handleReturnSuccess}
                    onReturnNavigate={handleNavigateToRecentlyReturned}
                />
            </div>

            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
        <Container>
            <Row className="bg-light fw-bold text-center py-2 mb-3">
                <Col >Wybierz</Col>
                <Col >Id</Col>
                <Col >Nazwisko</Col>
                <Col >Data wypożyczenia</Col>
                <Col >Sprzęt</Col>
                <Col >Data zwrotu</Col>
                <Col >Cena całkowita</Col>
                <Col >Ilość dni</Col>
            </Row>
            {
                listRenting.map(value => {
                    const dateRentingFormat = moment.utc(value.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm');
                    const dateOfReturnFormat = value.dateOfReturn
                        ? moment.utc(value.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')
                        : 'Wynajem w toku';

                    return (
                        <Row className={`py-2 border-bottom text-center justify-content-between ${value.dateOfReturn ? 'bg-success text-white' : ''}`} key={value.idRenting}>
                            <Col >
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedRentings.includes(value.idRenting)}
                                    onChange={() => handleCheckboxChange(value.idRenting)}
                                    className={styles.checkbox}
                                />
                            </Col>
                            <Col >{value.idRenting}</Col>
                            <Col >{value.lastName}</Col>
                            <Col >{dateRentingFormat}</Col>
                            <Col >{value.nameEquipment}</Col>
                            <Col >{dateOfReturnFormat}</Col>
                            <Col >{value.priceOfDuration}</Col>
                            <Col >{value.daysOfRental}</Col>
                        </Row>
                    );
                })
            }</Container>
        </div>
    );
}

export default RentingList;