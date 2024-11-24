import React from 'react';
import { useLocation } from 'react-router-dom';
import { Paper } from '@mui/material';
import moment from 'moment-timezone';
import { useReactToPrint } from 'react-to-print';
import classes from "./PrintAgreements.module.css";

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
                <div ref={componentRef} style={{ padding: '20px' } }>
                <h3>Lista Umów Wypożyczeń</h3>
                <h4> Na wypożyczenie sprzętu zimowego</h4>
                <div>Płatność za usługę nastąpi przy zwrocie sprzętu, w cyklu 24 godzinnym za dobę lub cyklu dziennym (Czytaj regulamin wypożyczalni).
                Klient zobowiązuję się zwrócić sprzęt w stanie niepogorszonym. W przypadku uszkodzenia, kradzieży zobowiązuje się do pokrycia kosztów odtworzenia.</div>

                {rentings.map((renting) => (
                    <Paper key={renting.idRenting} elevation={3} style={{ margin: '10px 0', padding: '15px' }}>
                        <h4>Umowa wypożyczenia nr: {renting.idRenting}</h4>
                        <p>Data wypożyczenia: {moment(renting.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')}</p>
                        <p>Klient Pani/Pan: {renting.firstName} {renting.lastName}</p>
                        <p>Nr telefonu kontaktowego: {renting.phoneNumber}</p>
                        <p>Nr dowodu: {renting.identityCard}</p>
                        <p>Wypożycza komplet zimowy o nazwie : {renting.nameEquipment}</p>
                        <p> W cenie za dobę: {renting.priceEquipment} zł</p>
                        <div justifyContent={"flex-end"}>CZYTELNY PODPIS KLIENTA:</div>
                    </Paper>
                ))}
            </div>
        </div>
    );
};

export default PrintAgreements;