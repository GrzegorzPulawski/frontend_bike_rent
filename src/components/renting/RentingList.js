import React, {useEffect, useState} from "react";
import { Checkbox} from "@mui/material";
import classes from "./RentingList.module.css"
import {request} from "../../axios_helper";
import ReturnRenting from "./ReturnRenting";
import {Alert, Button, Col, Row, Container} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import moment from 'moment-timezone';


const RentingList = () => {
    const [listRenting, setRentingList] = useState([]);
    const [selectedRentings, setSelectedRentings] = useState([])
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentings = async () => {
            try {
                const response = await request('get', "/api/rentings");
                setRentingList(response.data);
            } catch (error) {
                console.error("Error fetching rentings:", error);
            }
        };
        fetchRentings();
    }, []);
    // Handle selecting/unselecting rentals
    const handleCheckboxChange = (idRenting) => {
        setSelectedRentings((prevSelected) => {
            if (prevSelected.includes(idRenting)) {
                return prevSelected.filter(id => id !== idRenting); // Unselect
            } else {
                return [...prevSelected, idRenting]; // Select
            }
        });
    };
    // Potwierdzenie i przekierowanie do umowy
    const handleConfirmSelection1 = () => {
        if (selectedRentings.length > 0) {
            // Przekierowanie do komponentu RentalAgreement z ID umowy
            navigate("/rentalAgreement", { state: { rentingId: selectedRentings[0] } }); // Zakładam, że wybierasz tylko jedną umowę
        } else {
            setErrorMessage("Proszę zaznaczyć co najmniej jedną umowę.");
        }
    };
    //Logika przekierowania do Listy umow
    const handleConfirmSelection = async () => {
        if (selectedRentings.length > 0) {
            try {
                const response = await request('post', '/api/rentings/print', {idRentings: selectedRentings });
                if (response.status === 200) {
                    console.log('Navigating with data:', response.data); // Debug log
                    navigate("/printAgreements", { state: { rentings: response.data } });
                } else {
                    setErrorMessage("Błąd podczas drukowania umów.");
                }
            } catch (error) {
                setErrorMessage("Błąd podczas drukowania umów.");
                console.error("Error during print request:", error);
                console.error("Error response:", error.response);
            }
        } else {
            setErrorMessage("Proszę zaznaczyć co najmniej jedną umowę.");
        }
    };
    const handleReturnSuccess = async () => {
        //Fetch updated renting list after successful return
        const response = await request('get', '/api/rentings');
        setRentingList(response.data);
    }
    const handleNavigateToRecentlyReturned = () => {
        navigate('/show-currently-returned');
    };
    return(
        <div>
            <div className={classes.ButtonContainer}>
                <Button
                    variant="primary"
                    onClick={handleConfirmSelection}
                    disabled={selectedRentings.length === 0}
                    className={`btn-lg ${classes.CustomButton}`} // Adding custom classes
                >Wydrukuj umowę wypożyczenia
                </Button>

                 <ReturnRenting
                selectedRentings={selectedRentings}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
                onReturnSuccess={handleReturnSuccess}
                onReturnNavigate={handleNavigateToRecentlyReturned} // Przekazanie funkcji nawigacji
                 />

                {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            </div>
            <Container>
                <Row className={classes.TableHeader}>
                    <Col xs={1} className={classes.HeaderCell}>Wybierz</Col>
                    <Col xs={1} className={classes.HeaderCell}>Id</Col>
                    <Col xs={1} className={classes.HeaderCell}>Nazwisko</Col>
                    <Col xs={1} className={classes.HeaderCell}>Data wypożyczenia</Col>
                    <Col xs={1} className={classes.HeaderCell}>Sprzęt</Col>
                    <Col xs={1} className={classes.HeaderCell}>Data zwrotu</Col>
                    <Col xs={1} className={classes.HeaderCell}>Cena całkowita</Col>
                    <Col xs={1} className={classes.HeaderCell}>Ilość dni</Col>
                </Row>
                {listRenting.map(value => {
                    // formatowanie daty
                    const dateRentingFormat = moment.utc(value.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm');
                    const dateOfReturnFormat = value.dateOfReturn
                        ? moment.utc(value.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')
                        : 'Wynajem w toku';

                    // Ustawienie klasy w wierszu
                    const rowClass = `${classes.TableRow} ${value.dateOfReturn ? 'returned' : ''}`;

                    return (
                        <Row className={rowClass} key={value.idRenting}>
                            <Col xs={1}>
                                <Checkbox
                                    checked={selectedRentings.includes(value.idRenting)}
                                    onChange={() => handleCheckboxChange(value.idRenting)}
                                />
                            </Col>
                            <Col xs={1} className={classes.RowCell}>{value.idRenting}</Col>
                            <Col xs={1} className={classes.RowCell}>{value.lastName}</Col>
                            <Col xs={1} className={classes.RowCell}>{dateRentingFormat}</Col>
                            <Col xs={1} className={classes.RowCell}>{value.nameEquipment}</Col>
                            <Col xs={1} className={classes.RowCell}>{dateOfReturnFormat}</Col>
                            <Col xs={1} className={classes.RowCell}>{value.priceOfDuration}</Col>
                            <Col xs={1} className={classes.RowCell}>{value.daysOfRental}</Col>
                        </Row>
                    );
                })}
            </Container>
                })
            }

        </div>
    );
}
export default RentingList;