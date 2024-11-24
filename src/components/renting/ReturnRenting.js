import React from "react";
import { Button } from "react-bootstrap";
import connection, {request} from "../../axios_helper";
import classes from "./ReturnRenting.module.css";

const ReturnRenting = ({ selectedRentings, setSuccessMessage, setErrorMessage }) => {


    const submitReturns = () => {
        selectedRentings.forEach(idRenting => {
            const updateRenting = {}; // You can add properties here if needed

            request("PUT", `/api/rentings/return/${idRenting}`, updateRenting)
                .then((response) => {
                    setSuccessMessage(`Zwrot wypożyczenia z Nr ID: ${idRenting} został pomyślnie zatwierdzony.`);
                    setTimeout(() => {
                        window.location.reload(); // Refresh the page after 5 seconds
                    }, 1000);
                })
                .catch((error) => {
                    setErrorMessage(`Błąd zwrotu dla wypożyczenia z Nr ID: ${idRenting}: ${error.message}`);
                });
        });
    };

    return (
        <div className={classes.ButtonContainer}>
            <Button
                variant="primary" // Change the variant for a different color
                onClick={submitReturns}
                disabled={selectedRentings.length === 0}
                className={`btn-lg ${classes.CustomButton}`} // Adding custom classes
            >
                Zatwierdź zwroty
            </Button>
        </div>
    );
};

export default ReturnRenting;
