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
const TypeBike ={
    SZOSOWY:"SZOSOWY",
    MTB:"MTB",
    CROSSOWY:"CROSSOWY",
    MIEJSKI:"MIEJSKI",
    TREKINGOWY:"TREKINGOWY"

};

function FormEquipment() {
    const [name, setName] = useState('');
    const [frame, setFrame] = useState ('');
    const [size, setSize]= useState (SizeBike.M);
    const [type, setType]= useState(TypeBike.MTB);
    const [available, setAvailable] = useState(true);
    const [electric, setElectric] = useState(false);
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
            'type': type,
            'available' : true,
            'electric': electric,
            'priceEquipment': price

        };
        if (hasAccess) {
            request("POST", "/api/equipments/add", createEquipment)
                .then((response) => {
                    console.log("Odpowiedź serwera:", response);
                    setConfirmationMessage("Sprzęt został pomyślnie dodany!"); // Ustawiamy komunikat sukcesu
                    setTimeout(() => {
                        setConfirmationMessage(""); // Reset the message to an empty string
                    }, 5000);

                    setName(''); // Resetujemy pola po udanym dodaniu
                    setFrame('');
                    setSize(SizeBike.M);
                    setType(TypeBike.MTB);
                    setAvailable(true);
                    setElectric(false);
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

    const handleElectricChange = (e) =>{
        setElectric(e.target.checked);
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
                <label htmlFor="input-type">Typ roweru</label>
                <select
                    id="input-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {Object.values(TypeBike).map((typeValue) => (
                        <option key={typeValue} value={typeValue}>
                            {typeValue}
                        </option>
                    ))}
                </select>

                    <div className={classes.FormGroup}>
                    <label htmlFor="input-electric">Czy elektryk</label>
                    <input
                        type="checkbox"
                        id="input-electric"
                        checked={electric}
                        onChange={handleElectricChange}
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