import  { request} from "../../axios_helper";
import {useState, useEffect} from "react";
import {Col, Container, Row, Button} from "react-bootstrap";
import React from "react";
import classes from "./ClientList.module.css";
import {useNavigate} from "react-router-dom";

const ClientList =  () => {
    const [clientList1, setterClientList] = useState([]);
    const navigate = useNavigate();
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() =>{

          request('get','/api/clients')

            .then((response)=>{
                console.log(response);
                setterClientList(response.data)
                setFilteredClients(response.data); // Initialize filtered clients with all clients
            })
            .catch((error)=>{
                console.error("Błąd podczas pobierania klientów",error);
            });
    },[]);

    const goToAddClient = () =>{
        navigate("/formClient");
    }
    const goToDeleteClient = () =>{
        navigate("/deleteClient");
    }
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Filter clients by last name
        setFilteredClients(clientList1.filter(client =>
            client.lastName.toLowerCase().includes(query.toLowerCase())
        ));
    };
    return(
        <div>
            <h2>Lista klientów</h2>

                <div>
                    <label className={classes.formInputLabel}>Wyszukaj klienta po nazwisku:</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Wpisz nazwisko klienta"
                        className={classes.formInputField}
                    />
                </div>
            <Button
                variant="success"
                onClick={goToAddClient}
                style={{ margin: '10px' }}>
                Dodaj Klienta
            </Button>
            <Button
                variant="success"
                onClick={goToDeleteClient}
                style={{ margin: '10px' }}>
                Usuń Klienta
            </Button>

            <Container className="p-4 bg-light rounded-2 shadow-sm fw-bold"  >
                <Row>
                    <Col md={1}>Id</Col>
                    <Col md={2}>Imię</Col>
                    <Col md={2}>Nazwisko</Col>
                    <Col md={2}>Numer dowodu</Col>
                    <Col md={2}>Numer telefonu</Col>
                </Row>
            </Container>
            {filteredClients.map(value => (
                <Container key={value.idClient} className={classes.FormRow}>
                    <Row>
                        <Col md={1}>{value.idClient}</Col>
                        <Col md={2}>{value.firstName}</Col>
                        <Col md={2}>{value.lastName}</Col>
                        <Col md={2}>{value.identityCard}</Col>
                        <Col md={2}>{value.phoneNumber}</Col>
                    </Row>
                </Container>
                ))}
        </div>
    );
}
export default ClientList;