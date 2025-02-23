import React from "react";
import {useEffect, useState} from "react";
import { request } from "../../axios_helper.js";
import {useParams} from "react-router-dom";
import {Container} from "react-bootstrap";

const RentEquipment = () => {
    const { idEquipment } = useParams(); // Get equipment ID from URL
    const [equipment, setEquipment] = useState(null);

    useEffect(() => {
        request('get', `/api/equipments/${idEquipment}`)
            .then((response) => {
                setEquipment(response.data);
            })
            .catch((error) => {
                console.log("Błąd podczas pobierania danych:", error);
            });
    }, [idEquipment]);

    if (!equipment) {
        return <div>Ładowanie...</div>;
    }

    return (
        <Container>
            <h2>Wypożycz Sprzęt: {equipment.nameEquipment}</h2>
            <p>Nr ramy: {equipment.frameNumber}</p>
            <p>Rozmiar: {equipment.size}</p>
            <p>Cena: {equipment.priceEquipment}</p>
            {/* Add rental form here (e.g., select dates, confirm rental) */}
        </Container>
    );
};
export default RentEquipment;