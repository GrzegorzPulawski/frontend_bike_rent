import classes from "./EquipmentList.module.css";
import React, { useEffect, useState } from "react";
import { request } from "../../axios_helper.js";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

const EquipmentList = () => {
    const [nazwaZmiennej, setterDoKolekcji] = useState([]);
    const navigate = useNavigate(); // Hook do nawigacji

    useEffect(() => {
        request('get', "/api/equipments")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setterDoKolekcji(response.data); // Ustaw dane, jeśli to tablica
                } else {
                    setterDoKolekcji(response.data.equipments);
                }
            })
            .catch((error) => {
                console.log("Błąd podczas pobierania danych:", error);
            });
    }, []);

    // Przekierowanie do komponentu FormEquipment
    const goToAddEquipment = () => {
        navigate("/formEquipment"); // Przekierowanie do formularza dodawania sprzętu
    };

    const goToDeleteEquipment = () => {
        navigate("/equipmentDelete"); // Przekierowanie do formularza usuwania sprzętu
    };

    return (
        <Container className={classes.Equipment}>
            <h2>Lista sprzętu</h2>

            <Button
                variant="primary"
                onClick={goToAddEquipment}
                style={{ margin: '10px' }}>
                Dodaj Sprzęt
            </Button>

            <div className={classes.EquipmentTableHeader}>
                <Row>
                    <Col xs={4} sm={4}>Id</Col>
                    <Col xs={4} sm={4}>Nazwa sprzętu</Col>
                    <Col xs={4} sm={4}>Cena</Col>
                </Row>
            </div>
            {nazwaZmiennej.map((value) => (
                <Row className={classes.EquipmentTableRow} key={value.idEquipment}>
                    <Col xs={4} sm={4}>{value.idEquipment}</Col>
                    <Col xs={4} sm={4}>{value.nameEquipment}</Col>
                    <Col xs={4} sm={4}>{value.priceEquipment}</Col>
                </Row>
            ))}
            <Button
                variant="primary"
                onClick={goToDeleteEquipment}
                style={{ margin: '10px' }}>
                Usuń Sprzęt
            </Button>
        </Container>
    );
}

export default EquipmentList;