import React from "react";
import classes from "./FormEquipment.module.css";
import  {request} from "../../axios_helper";
import {useState} from "react";


function FormEquipment() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState(''); // Nowy stan dla potwierdzenia

    const submitEquipment = () => {
        console.log(name + " " + price);

        let createEquipment = {
            'nameEquipment': name,
            'priceEquipment': price
        };

        request("POST","/api/equipments/add", createEquipment)
            .then((response) => {
                console.log("Odpowiedź serwera:", response);
                setConfirmationMessage("Sprzęt został pomyślnie dodany!"); // Ustawiamy komunikat sukcesu
                setName(''); // Resetujemy pola po udanym dodaniu
                setPrice('');
            })
            .catch((error) => {
                console.log("Błąd:", error);
                setConfirmationMessage("Wystąpił błąd podczas dodawania sprzętu, upewnij się czy masz uprawnienia");
            });
    };

    return (
        <div className={classes.FormEquipment}>
            <div className={classes.GridContainer}>
                <label htmlFor="input name">Nazwa Sprzętu</label>
                <input
                    id={'input-name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="{'input-price'}">Cena sprzętu</label>
                <input
                    id={'input-price'}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button className={classes.Confirm} onClick={submitEquipment}>Zatwierdź</button>
            {/* Wyświetlanie komunikatu potwierdzenia */}
            {confirmationMessage && <p>{confirmationMessage}</p>}
        </div>
    );
}

export default FormEquipment;