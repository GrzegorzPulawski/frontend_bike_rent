import React, { useState, useEffect } from "react";
import classes from "./RentalAgreement.module.css";
import { Button, Form, Alert } from "react-bootstrap";
import {request} from "../../axios_helper";
import DisplayRentalAgreement from "./DisplayRentalAgreement"; // Import the display component
import { useLocation } from "react-router-dom"; // Hook to get passed state

function RentalAgreement() {
    const [rentingShow, setRentingShow] = useState(null); // To store renting data
    const [errorMessage, setErrorMessage] = useState(""); // To store error messages
    const location = useLocation(); // Hook to get the state (passed rentingId)

    // Function to fetch rental data by ID
    const fetchRentalAgreement = (rentingId) => {
        request("GET", `/api/rentings/show?idRenting=${rentingId}` )
            .then((response) => {
                console.log("OK! ", response.data);
                setRentingShow(response.data); // Pass the data to the display component
                setErrorMessage(""); // Clear previous error messages
            })
            .catch((errorResponse) => {
                console.log("Error: ", errorResponse);
                setRentingShow(null); // Clear display if error
                setErrorMessage("Failed to retrieve data. Please try again."); // Set error message
            });
    };

    useEffect(() => {
        // Pobierz ID umowy z przekazanego state i pobierz dane umowy
        const rentingId = location.state?.rentingId;
        if (rentingId) {
            fetchRentalAgreement(rentingId);
        } else {
            setErrorMessage("No rental agreement ID provided.");
        }
    }, [location.state]);

    return (
        <div>
            {/* Wyświetl dane umowy lub komunikat o błędzie */}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {rentingShow ? (
                <DisplayRentalAgreement renting={rentingShow} />
            ) : (
                <Alert variant="info">Loading rental agreement details...</Alert>
            )}
        </div>
    );
}

export default RentalAgreement;
