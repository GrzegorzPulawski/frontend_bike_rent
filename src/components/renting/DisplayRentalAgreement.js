import React from "react";
import { Grid } from "@mui/material";
import moment from "moment";
import classes from "./DisplayRentalAgreement.module.css";
import {Button} from "react-bootstrap";
import {useEffect,useState} from "react";
import {request} from "../../axios_helper";

function DisplayRentalAgreement({ renting }) {
    console.log("Dane wypożyczenia:", renting);

    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
    // Format the renting date
    const dateRentingFormat = moment(renting.dateRenting).format('DD/MM/YY HH:mm');

    useEffect(() => {
        // Fetch user details from the getUserDetails endpoint
        const fetchUserDetails = async () => {
            try {
                const response = await request('get', '/api/user/details');

                const userData = response.data;

                setUserDetails(userData);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    return (

    <Grid container className={classes.TableRow}>
            <Grid item xs={12} justifyContent={"center"}>
                <h4>Umowa wypożyczenia o nr: {renting.idRenting}</h4>
            </Grid>
            <Grid item xs={12}>Została zawarta z datą: {dateRentingFormat} godzina.</Grid>
            <Grid item xs={12}>Na wypożyczenie sprzętu zimowego</Grid>
            <Grid item xs={12}>Od firmy: {userDetails.firstName|| "N/A"}</Grid>
            <Grid item xs={12}>która ma NIP: {userDetails.lastName || "N/A"} </Grid>
            <Grid item xs={12}>Klient Pani/Pan: {renting.firstName} {renting.lastName}</Grid>
            <Grid item xs={12}>Nr telefonu kontaktowego: {renting.phoneNumber}</Grid>
            <Grid item xs={12}>Nr dowodu: {renting.identityCard}</Grid>
            <Grid item xs={12}>Wypożycza komplet zimowy o nazwie : {renting.nameEquipment}</Grid>
            <Grid item xs={12}>W cenie za dobę: {renting.priceEquipment} zł</Grid>
            <Grid item xs={12}>
                Płatność za usługę nastąpi przy zwrocie sprzętu, w cyklu 24 godzinnym za dobę. Po minięciu 24 godzin obowiązuję płatnośc za kolejną dobę.
                Klient zobowiązuję się zwrócić sprzęt w stanie niepogorszonym. W przypadku uszkodzenia, kradzieży zobowiązuje się do pokrycia kosztów odtworzenia.
            </Grid>
            <Grid item xs={12} justifyContent={"flex-end"}>CZYTELNY PODPIS KLIENTA:</Grid>
            {/* Przycisk drukowania */}
            <div className={classes.ButtonPrint}>
                <Button variant="dark" onClick={() => window.print()}>
                    Drukuj umowę
                </Button>
            </div>
        </Grid>
    );
}

export default DisplayRentalAgreement;
