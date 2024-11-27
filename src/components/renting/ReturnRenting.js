import React from "react";
import { Button } from "react-bootstrap";
import  {request} from "../../axios_helper";
import classes from "./ReturnRenting.module.css";

const ReturnRenting = ({ selectedRentings, setSuccessMessage, setErrorMessage, onReturnSuccess, onReturnNavigate}) => {

    const submitReturns = async () => {
            try {
                const requests = selectedRentings.map(idRenting =>
                    request("PUT", `/api/rentings/return/${idRenting}`, {})
                );
                await Promise.all(requests);
                    setSuccessMessage(`Wszystkie wypożyczenia zostały pomyślnie zatwierdzone.`);
                    onReturnSuccess();
                onReturnNavigate(); // Wywołaj funkcję nawigacji po udanym zwróceniu
                }
                catch(error) {
                    setErrorMessage(`Błąd zwrotu: ${error.message}`);
                }
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
