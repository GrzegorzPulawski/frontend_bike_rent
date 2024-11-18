import React, { useState } from "react";
import classes from "./FormClient.module.css";
import { Link } from "react-router-dom";
import {request} from "../../axios_helper";

const FormClient = () => {
    const [formData, setFormData] = useState({

        firstName: '',
        lastName: '',
        identityCard: '',
        phoneNumber: ''
    });
    const[confirmationMessage, setConfirmationMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const submit = async () => {
        try {
            const response = await request("POST","/api/clients", formData);
            console.log(response);
            setConfirmationMessage("Klient został pomyslnie dodany!");
            setFormData({
                firstName: '',
                lastName: '',
                identityCard: '',
                phoneNumber: ''
            });
        } catch (error) {
            console.log(error);
            setConfirmationMessage("Wystąpił błąd podczas dodawania klienta!");
        }
    };

    return (
        <div className={classes.ClientForm}>
            <div className={classes.GridContainer}>
                <label htmlFor="nazwisko">Imię</label>
                <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <label htmlFor="imie">Nazwisko</label>
                <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <label htmlFor="nrDowodu">Numer dowodu</label>
                <input
                    id="identityCard"
                    name="identityCard"
                    value={formData.identityCard}
                    onChange={handleChange}
                />
                <label htmlFor="nrTelefonu">Numer telefonu</label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type={"number"}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
            </div>
            <button className={classes.FormConfirm} onClick={submit}>
                Zatwierdź
            </button>
            {confirmationMessage && <p>{confirmationMessage}</p>}
            <Link to="/clientlist">
                <div>Lista Klientów</div>
            </Link>
        </div>
    );
};

export default FormClient;
