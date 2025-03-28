import React from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment-timezone';
import { useReactToPrint } from 'react-to-print';
import classes from "./PrintAgreements.module.css";
import {Card} from "react-bootstrap";

const PrintAgreements = () => {
    const location = useLocation();
    const { rentings } = location.state || {}; // Oczekiwane jest hasło „rentings”
    const componentRef = React.useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Umowy Wypożyczeń',

    });
    const handleSimplePrint = () => {
        window.print();

    };

    if (!rentings || rentings.length === 0) {
        return <p>Brak umów do wydruku.</p>;
    }

    return (
        <div>
            <div className={classes.ButtonPrint}>
            <button onClick={handleSimplePrint} style={{ marginBottom: '20px' }}>Drukuj wszystkie umowy</button>
            </div>
                <div ref={componentRef} style={{ padding: '0px' } }>
                <h3>Lista Umów Na Wypożyczenie Sprzętu Zimowego</h3>
                <div>Płatność za usługę nastąpi przy zwrocie sprzętu, w cyklu 24 godzinnym za dobę lub cyklu dziennym (Czytaj regulamin wypożyczalni).
                Klient zobowiązuję się zwrócić sprzęt w stanie niepogorszonym. W przypadku uszkodzenia, kradzieży zobowiązuje się do pokrycia kosztów odtworzenia.</div>

                {rentings.map((renting) => (
                    <Card key={renting.idRenting}  style={{ margin: '10px 10px', padding: '5px' }}>
                        <h4>Data wypożyczenia: {moment.utc(renting.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')}, Umowa nr: {renting.idRenting}</h4>
                        <p>Klient Pani/Pan: {renting.firstName} {renting.lastName}</p>
                        <p>Nr telefonu: {renting.phoneNumber}, Nr dowodu: {renting.identityCard}</p>
                        <p>Wypożycza sprzęt zimowy o nazwie : {renting.nameEquipment}, W cenie za dobę/dzień: {renting.priceEquipment} zł</p>
                        <div justifyContent={"flex-end"}>CZYTELNY PODPIS KLIENTA:</div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PrintAgreements;