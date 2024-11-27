import  { request, getAuthToken, setAuthToken} from "../../axios_helper";
import {useState, useEffect} from "react";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import classes from "./ClientList.module.css";
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';


const ClientList =  () => {
    const [clientList1, setterClientList] = useState([]);
    const navigate = useNavigate();

    useEffect(() =>{

          request('get','/api/clients')

            .then((response)=>{
                console.log(response);
                setterClientList(response.data)
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
    return(
        <div>
            <h2>Lista klientów</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={goToAddClient}
                style={{ margin: '10px' }}>
                Dodaj Klienta
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={goToDeleteClient}
                style={{ margin: '10px' }}>
                Usuń Klienta
            </Button>

            <Container className={classes.FormRow}>
                <Row>
                    <Col md={1}>Id</Col>
                    <Col md={2}>Imię</Col>
                    <Col md={2}>Nazwisko</Col>
                    <Col md={2}>Numer dowodu</Col>
                    <Col md={2}>Numer telefonu</Col>
                </Row>
            </Container>
            {clientList1.map(value => (
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