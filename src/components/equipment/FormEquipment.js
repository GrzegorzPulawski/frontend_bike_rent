import React from "react";
import classes from "./FormEquipment.module.css";
import  {request, isUserInRole} from "../../axios_helper";
import {useState,useEffect} from "react";

const SizeBike = {
    XS: "XS",
    S: "S",
    M: "M",
    L: "L",
    XL: "XL"
};

function FormEquipment() {
    const [name, setName] = useState('');
    const [frame, setFrame] = useState ('');
    const [size, setSize]= useState (SizeBike.M);
    const [available, setAvailable] = useState(true);
    const [price, setPrice] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState(''); // Nowy stan dla potwierdzenia
    const[hasAccess, setHasAccess]= useState(false);

    useEffect(() => {
        // Sprawdzaj rolę bezpośrednio
        if (isUserInRole('ADMIN')) {
            setHasAccess(true); // Użytkownik ma dostęp
        } else {
            setHasAccess(false);
            setConfirmationMessage("Brak uprawnień."); // Ustaw komunikat o błędzie
        }
    }, []);

    const submitEquipment = (e) => {
        e.preventDefault(); // Zatrzymaj domyślne działanie formularza
        console.log(name + " " + price);

        let createEquipment = {
            'nameEquipment': name,
            'frameNumber' : frame,
            'size': size,
            'available' : true,
            'priceEquipment': price

        };
        if (hasAccess) {
            request("POST", "/api/equipments/add", createEquipment)
                .then((response) => {
                    console.log("Odpowiedź serwera:", response);
                    setConfirmationMessage("Sprzęt został pomyślnie dodany!"); // Ustawiamy komunikat sukcesu
                    setName(''); // Resetujemy pola po udanym dodaniu
                    setFrame('');
                    setSize(SizeBike.M);
                    setAvailable(true);
                    setPrice('');
                })
                .catch((error) => {
                    console.log("Błąd:", error);
                    setConfirmationMessage("Wystąpił błąd podczas dodawania sprzętu, upewnij się czy masz uprawnienia");
                });
        } else {
                setConfirmationMessage("Brak dostępu do dodawania sprzętu.");
            }
    };
    const handleAvailableChange = (e) =>{
        setAvailable(e.target.checked);
    }

    return (
        <div className={classes.FormEquipment}>
            <div className={classes.GridContainer}>

                <label htmlFor="input-name">Nazwa roweru</label>
                <input
                    id={'input-name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="input-frame">Nr ramy</label>
                <input
                    id={'input-frame'}
                    value={frame}
                    onChange={(e) => setFrame(e.target.value)}
                />
                <label htmlFor="input-size">Rozmiar roweru</label>
                <select
                    id="input-size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                >
                    {Object.values(SizeBike).map((sizeValue) => (
                        <option key={sizeValue} value={sizeValue}>
                            {sizeValue}
                        </option>
                    ))}
                </select>
                <div className={classes.FormGroup}>
                <label htmlFor="input-available">Czy dostępny</label>
                <input
                    type="checkbox"
                    id="input-available"
                    checked={available}
                    onChange={handleAvailableChange}
                />
                </div>
                <label htmlFor="input-price">Cena roweru</label>
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