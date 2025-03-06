import React, { useState } from "react";
import {request} from "../../axios_helper";
import {Button} from "react-bootstrap";

const DeleteClient = () => {
    const [idClient, setIdClient] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = () => {
        request('DELETE', `/api/clients/delete?idClient=${idClient}`)
            .then((response) => {
                setMessage(`Klient o ID ${idClient} został usunięty.`);
                console.log("Klient usunięty:", response.data);
            })
            .catch((error) => {
                console.error("Błąd usuwania klienta:", error);
                setMessage('Wystąpił błąd przy usuwaniu klienta.');
            });
    };

    return (
        <div>
            <h2>Usuń klienta</h2>
            <div>
                <label>Podaj ID</label>
            <input
                type="number"
                value={idClient}
                onChange={(e) => setIdClient(e.target.value)}
                placeholder="Wprowadź ID klienta"
            />
        </div>
            <Button variant={"danger"} onClick={handleDelete}>Usuń klienta</Button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteClient;
