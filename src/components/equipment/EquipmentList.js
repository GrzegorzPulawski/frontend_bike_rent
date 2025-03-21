import classes from "./EquipmentList.module.css";
import React, { useEffect, useState } from "react";
import { request } from "../../axios_helper.js";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";


const EquipmentList = () => {
    const [nazwaZmiennej, setterDoKolekcji] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const navigate = useNavigate(); // Hook do nawigacji

    useEffect(() => {
        request('get', "/api/equipments")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setterDoKolekcji(response.data); // Ustaw dane, jeśli to tablica
                    setFilteredEquipment(response.data);
                } else {
                    setterDoKolekcji(response.data.equipments);
                    setFilteredEquipment(response.data.equipments);
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
            navigate(`/equipment-details/${selectedEquipment.idEquipment}`);
        } else {
        alert("Proszę wybrać sprzęt do wypożyczenia."); // Alert if no equipment is selected
        }
    };
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

            // Filter equipments by frame Number
            const filtered = nazwaZmiennej.filter(equipment =>
                equipment.frameNumber.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredEquipment(filtered);

    };
    return (
        <Container className={classes.Equipment}>
            <h2>Lista sprzętu</h2>
            <div>
                <label className={classes.formInputLabel}>Wyszukaj rower po nr ramy:</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Wpisz nr ramy"
                    className={classes.formInputField}
                />
            </div>
            <Button
                variant="success"
                onClick={goToAddEquipment}
                style={{ margin: '10px' }}>
                Dodaj Sprzęt
            </Button>
            <Button
                variant="secondary"
                onClick={goToRentEquipment}
                style={{ margin: '10px' }}
                disabled={!selectedEquipment} // Disable button if no equipment is selected
            >
                Zobacz detale Roweru
            </Button>
            <div className={classes.EquipmentTableHeader}>
                <Row>
                    <Col xs={2} sm={1}>Wybierz</Col>
                    <Col xs={2} sm={1}>Id</Col>
                    <Col xs={2} sm={2}>Nazwa Roweru</Col>
                    <Col xs={2} sm={2}>Nr ramy</Col>
                    <Col xs={2} sm={1}>Rozmiar</Col>
                    <Col xs={2} sm={1}>Typ</Col>
                    <Col xs={2} sm={1}>Czy elektryk</Col>
                    <Col xs={2} sm={1}>Czy dostępny</Col>
                    <Col xs={2} sm={1}>Cena</Col>
                </Row>
            </div>
            {filteredEquipment.map((value) => (
                <Row
                className={`${classes.EquipmentTableRow} ${selectedEquipment?.idEquipment === value.idEquipment ? classes.SelectedRow : ''}`}
                key={value.idEquipment}
                onClick={() => handleSelectEquipment(value)} // Select equipment on row click
            >
                <Col xs={1} sm={1}>
                    <input
                        type="checkbox"
                        name="selectedEquipment"
                        checked={selectedEquipment?.idEquipment === value.idEquipment}
                        readOnly
                    />
                </Col>
                    <Col xs={1} sm={1}>{value.idEquipment}</Col>
                    <Col xs={2} sm={2}>{value.nameEquipment}</Col>
                    <Col xs={2} sm={2}>{value.frameNumber}</Col>
                    <Col xs={2} sm={1}>{value.size}</Col>
                    <Col xs={2} sm={1}>{value.type}</Col>
                    <Col xs={2} sm={1}><input type="radio" checked={value.electric} readOnly /> </Col>
                    <Col xs={2} sm={1}><input type="radio" checked={value.available} readOnly /></Col>
                    <Col xs={2} sm={1}>{value.priceEquipment}</Col>
                </Row>
            ))}
            <Button
                variant="danger"
                onClick={goToDeleteEquipment}
                style={{ margin: '20px' }}>
                Usuń Sprzęt
            </Button>
        </Container>
    );
}

export default EquipmentList;