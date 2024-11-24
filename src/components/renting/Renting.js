import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import classes from './Renting.module.css';
import  {request} from "../../axios_helper";

function Renting() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        request("GET",'/api/clients')
            .then(response => {
                setClients(response.data);
                setFilteredClients(response.data);  // Initialize with full list
            })
            .catch(error => console.error("Error fetching clients:", error));

        request("GET",'/api/equipments')
            .then(response => setEquipment(response.data))
            .catch(error => console.error("Error fetching equipment:", error));
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setFilteredClients(clients.filter(client =>
            client.lastName.toLowerCase().includes(query.toLowerCase()) // Filter by last name
        ));
    };

    const submit = () => {
        const createRenting = {
            idClient: selectedClient, // Selected client ID
            idEquipment: selectedEquipment // Selected equipment IDs
        };

        request("POST",'/api/rentings', createRenting)
            .then(response => {
                setConfirmationMessage("Utworzono wypożyczenie!");
                setSelectedClient("");
                setSelectedEquipment([]);
                setTimeout(() => {
                    navigate("/rentingList");
                }, 1000);
            })
            .catch(error => {
                setConfirmationMessage("Wystąpił błąd podczas tworzenia wypożyczenia!");
            });
    };

    const handleCheckboxChange = (id) => {
        setSelectedEquipment(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(equipmentId => equipmentId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    return (
        <div>
            <Container className={classes.Form}>
                <Row>
                    <Col className={classes.FormRow}>
                        <label className={classes.formInputLabel}>Wyszukaj klienta po nazwisku:</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Wpisz nazwisko klienta"
                            className={classes.formInputField}
                        />
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className={classes.formInputField}
                        >
                            <option value="">Wybierz klienta</option>
                            {filteredClients.map(client => (
                                <option key={client.idClient} value={client.idClient}>
                                    {client.lastName} {client.firstName}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col className={classes.FormRow}>
                        <label className={classes.formInputLabel}>Wybierz sprzęt:</label>
                        <div className={classes.EquipmentList}>
                            {equipment.map(equip => (
                                <div key={equip.idEquipment}>
                                    <input
                                        type="checkbox"
                                        id={`equip-${equip.idEquipment}`}
                                        checked={selectedEquipment.includes(equip.idEquipment)}
                                        onChange={() => handleCheckboxChange(equip.idEquipment)}
                                    />
                                    <label htmlFor={`equip-${equip.idEquipment}`}>{equip.nameEquipment}</label>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Row className={classes.Button}>
                    {confirmationMessage && <p>{confirmationMessage}</p>}
                    <Button variant={"light"} onClick={submit} className={classes.RentingButton}>Utwórz wypożyczenie</Button>
                </Row>

                <Row className={classes.Button}>
                    <Col>
                        <Button variant="primary" onClick={() => navigate('/rentingList')} className={classes.RentingButton}>
                            Zobacz listę wypożyczeń
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Renting;


