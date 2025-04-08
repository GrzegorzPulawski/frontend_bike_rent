import styles from "./EquipmentList.module.css";
import React, { useEffect, useState, useRef } from "react";
import { request } from "../../axios_helper.js";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";


const EquipmentList = () => {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook do nawigacji

    const [barcodeQuery, setBarcodeQuery] = useState("");
    const barcodeInputRef = useRef(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                const response = await request('GET', "/api/equipments");
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.equipments;
                setEquipments(data);
                setFilteredEquipment(data);
            } catch (error) {
                setError("Błąd podczas pobierania danych sprzętu");
                console.error("Error fetching equipment:", error);
            } finally {
                setLoading(false);
                if (barcodeInputRef.current) {
                    barcodeInputRef.current.focus();
                }
            }
        };
        fetchEquipment();
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
            const filtered = equipments.filter(equipment =>
                equipment.frameNumber.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredEquipment(filtered);

    };
    if (loading) return (
        <div className={styles.loadingContainer}>
            <Spinner animation="border" variant="danger" />
            <p>Ładowanie listy sprzętu...</p>
        </div>
    );

    if (error) return (
        <Alert variant="danger" className={styles.errorAlert}>
            {error}
        </Alert>
    );
    const handleBarcodeSearch = async () => {
        try {
            const response = await request('GET', `/api/equipments/barcode/find/${barcodeQuery}`);
            const equipment = response.data;
            navigate(`/equipment-details/${equipment.idEquipment}`);
        } catch (error) {
            alert("Nie znaleziono roweru z tym kodem kreskowym.");
            console.error("Błąd przy wyszukiwaniu kodu kreskowego:", error);
        }
    };


    return (
        <Container className={styles.equipmentContainer}>
            <h2 className={styles.pageTitle}>Lista sprzętu</h2>

            {/* Search Bar */}
            <div className={styles.searchGroup}>
                <label className={styles.searchLabel}>
                    Wyszukaj rower po nr ramy:
                </label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Wpisz nr ramy"
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.searchGroup}>
                <label className={styles.searchLabel}>
                    Zeskanuj lub wpisz kod kreskowy:
                </label>
                <input
                    ref={barcodeInputRef}
                    type="text"
                    value={barcodeQuery}
                    onChange={(e) => setBarcodeQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleBarcodeSearch();
                        }
                    }}
                    placeholder="Kod kreskowy roweru"
                    className={styles.searchInput}
                />

            </div>



            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
                <Button
                    variant="success"
                    onClick={goToAddEquipment}
                    className={styles.actionButton}
                >
                    Dodaj Sprzęt
                </Button>
                <Button
                    variant="primary"
                    onClick={goToRentEquipment}
                    className={styles.actionButton}
                    disabled={!selectedEquipment}
                >
                    Zobacz detale roweru
                </Button>
                <Button
                    variant="danger"
                    onClick={goToDeleteEquipment}
                    className={styles.actionButton}
                >
                    Usuń Sprzęt
                </Button>
            </div>

            {/* Equipment Table */}
            <div className={styles.tableContainer}>
                {/* Table Header */}
                <Row className={styles.tableHeader}>
                    <Col xs={1}>Wybierz</Col>
                    <Col xs={1}>ID</Col>
                    <Col xs={2}>Nazwa Roweru</Col>
                    <Col xs={2}>Nr ramy</Col>
                    <Col xs={1}>Rozmiar</Col>
                    <Col xs={1}>Typ</Col>
                    <Col xs={1}>Elektryk</Col>
                    <Col xs={1}>Dostępny</Col>
                    <Col xs={1}>Cena</Col>
                </Row>

                {/* Table Rows */}
                {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((equipment) => (
                        <Row
                            key={equipment.idEquipment}
                            className={`${styles.tableRow} ${
                                selectedEquipment?.idEquipment === equipment.idEquipment
                                    ? styles.selectedRow
                                    : ''
                            }`}
                            onClick={() => handleSelectEquipment(equipment)}
                        >
                            <Col xs={1} className={styles.checkboxCol}>
                                <input
                                    type="checkbox"
                                    checked={selectedEquipment?.idEquipment === equipment.idEquipment}
                                    readOnly
                                    className={styles.checkbox}
                                />
                            </Col>
                            <Col xs={1}>{equipment.idEquipment}</Col>
                            <Col xs={2}>{equipment.nameEquipment}</Col>
                            <Col xs={2}>{equipment.frameNumber}</Col>
                            <Col xs={1}>{equipment.size}</Col>
                            <Col xs={1}>{equipment.type}</Col>
                            <Col xs={1}>
                                <div className={`${styles.statusIndicator} ${
                                    equipment.electric ? styles.active : styles.inactive
                                }`} />
                            </Col>
                            <Col xs={1}>
                                <div className={`${styles.statusIndicator} ${
                                    equipment.available ? styles.active : styles.inactive
                                }`} />
                            </Col>
                            <Col xs={1} className={styles.price}>
                                {equipment.priceEquipment} zł
                            </Col>
                        </Row>
                    ))
                ) : (
                    <Row className={styles.noResults}>
                        <Col>Nie znaleziono sprzętu spełniającego kryteria</Col>
                    </Row>
                )}
            </div>
        </Container>
    );
};

export default EquipmentList;