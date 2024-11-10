import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import {request} from "../../axios_helper";
import { useNavigate } from 'react-router-dom';

const EquipmentDelete = () => {
    const [idEquipment, setIdEquipment] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Wykonanie żądania DELETE do backendu
        request("DELETE", `/api/equipments/delete?idEquipment=${idEquipment}`)
            .then((response) => {
                console.log("Sprzęt usunięty:", response);
                setSuccessMessage(`Sprzęt o ID ${idEquipment} został pomyślnie usunięty.`);
                setErrorMessage('');
                setIdEquipment(''); // Wyczyść pole po pomyślnym usunięciu
                setTimeout(()=> {
                    navigate("/list");
                },2000);
            })
            .catch((error) => {
                console.error("Błąd podczas usuwania sprzętu:", error);
                setErrorMessage("Nie udało się usunąć sprzętu. Upewnij się, że sprzęt istnieje, lub czy masz uprawnienia");
                setSuccessMessage('');
            });
    };

    return (
        <div>
            <h2>Usuń Sprzęt</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEquipmentId">
                    <Form.Label>Podaj ID sprzętu do usunięcia</Form.Label>
                    <Form.Control
                        type="number"
                        value={idEquipment}
                        onChange={(e) => setIdEquipment(e.target.value)}
                        placeholder="ID sprzętu"
                        required
                    />
                </Form.Group>
                <Button variant="danger" type="submit">Usuń Sprzęt</Button>
            </Form>
            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
        </div>
    );
};

export default EquipmentDelete;
