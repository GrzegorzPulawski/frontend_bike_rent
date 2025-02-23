import classes from "./EquipmentList.module.css";
import React, { useEffect, useState } from "react";
import { request } from "../../axios_helper.js";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

const EquipmentList = () => {
    const [nazwaZmiennej, setterDoKolekcji] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

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

    const handleSelectEquipment =(equipment) =>{
        setSelectedEquipment(equipment);
    }
    const goToRentEquipment = () =>{
        if (selectedEquipment){
            navigate(`/rentEquipment/${selectedEquipment.idEquipment}`);
        } else {
        alert("Proszę wybrać sprzęt do wypożyczenia."); // Alert if no equipment is selected
        }
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
            <Button
                variant="success"
                onClick={goToRentEquipment}
                style={{ margin: '10px' }}
                disabled={!selectedEquipment} // Disable button if no equipment is selected
            >
                Wypożycz Sprzęt
            </Button>
            <div className={classes.EquipmentTableHeader}>
                <Row>
                    <Col xs={2} sm={1}>Id</Col>
                    <Col xs={2} sm={2}>Nazwa Roweru</Col>
                    <Col xs={2} sm={2}>Nr ramy</Col>
                    <Col xs={2} sm={2}>Rozmiar</Col>
                    <Col xs={2} sm={2}>Czy dostępny</Col>
                    <Col xs={2} sm={2}>Cena</Col>
                </Row>
            </div>
            {nazwaZmiennej.map((value) => (
                <Row
                className={`${classes.EquipmentTableRow} ${selectedEquipment?.idEquipment === value.idEquipment ? classes.SelectedRow : ''}`}
                key={value.idEquipment}
                onClick={() => handleSelectEquipment(value)} // Select equipment on row click
            >
                <Col xs={1} sm={1}>
                    <input
                        type="radio"
                        name="selectedEquipment"
                        checked={selectedEquipment?.idEquipment === value.idEquipment}
                        readOnly
                    />
                </Col>
                    <Col xs={1} sm={1}>{value.idEquipment}</Col>
                    <Col xs={2} sm={2}>{value.nameEquipment}</Col>
                    <Col xs={2} sm={2}>{value.frameNumber}</Col>
                    <Col xs={2} sm={2}>{value.size}</Col>
                    <Col xs={2} sm ={2}><input type="checkbox" checked={value.available} readOnly className="checkbox-style" /></Col>
                    <Col xs={2} sm={2}>{value.priceEquipment}</Col>
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