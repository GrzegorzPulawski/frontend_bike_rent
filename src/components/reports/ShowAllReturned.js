import React, {useEffect, useState} from "react";

import styles from "../renting/RentingList.module.css"
import {request} from "../../axios_helper";
import {Row, Col, Container} from "react-bootstrap";
import moment from 'moment-timezone';

const RentingList = () => {
    const [listRenting, setRentingList] = useState([]);

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

    return (
        <div>
            <Container>
                <Row className="bg-light fw-bold text-center py-2 mb-3">
                    <Col xs={1}>Id</Col>
                    <Col xs={1}>Imię</Col>
                    <Col xs={2}>Nazwisko</Col>
                    <Col xs={2}>Data wypożyczenia</Col>
                    <Col xs={2}>Sprzęt</Col>
                    <Col xs={2}>Data zwrotu</Col>
                    <Col xs={1}>Cena całkowita</Col>
                    <Col xs={1}>Ilość dni</Col>
                </Row>
                {
                    listRenting
                        .filter(value => value.dateOfReturn)
                        .sort((a, b) => new Date(b.dateOfReturn) - new Date(a.dateOfReturn)) // Sort by dateOfReturn
                        .map(value => {
                            const dateRentingFormat = moment.utc(value.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm');
                            const dateOfReturnFormat = value.dateOfReturn
                                ? moment.utc(value.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')
                                : 'Wynajem w toku';

                            return (
                                <Row className={`py-2 border-bottom text-center justify-content-between ${value.dateOfReturn ? 'bg-success text-white' : ''}`} key={value.idRenting}>
                                    <Col xs={1}>{value.idRenting}</Col>
                                    <Col xs={1}>{value.firstName}</Col>
                                    <Col xs={2}>{value.lastName}</Col>
                                    <Col xs={2}>{dateRentingFormat}</Col>
                                    <Col xs={2}>{value.nameEquipment}</Col>
                                    <Col xs={2}>{dateOfReturnFormat}</Col>
                                    <Col xs={1}>{value.priceOfDuration}</Col>
                                    <Col xs={1}>{value.daysOfRental}</Col>
                                </Row>
                            );
                        })
                }
            </Container>
        </div>
    );
}

export default RentingList;