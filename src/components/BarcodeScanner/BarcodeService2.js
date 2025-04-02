import React from "react";
import {request} from "../../axios_helper";

const API_BASE_URL = "http://localhost:8080/api/equipment/barcode"; // Dostosuj do swojego backendu

export const getBarcodePdf = async (bikeId) => {
    try {
        const response = await request('GET', `${API_BASE_URL}/${bikeId}/pdf`, {
            responseType: "blob", // Oczekujemy pliku PDF
            headers: {
                "Accept": "application/pdf",
            },
            withCredentials: true
        });

        if (!response.data || response.data.size === 0) {
            throw new Error("Otrzymano pusty plik PDF");
        }

        // Tworzymy obiekt URL dla pliku PDF
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Tworzymy link do pobrania pliku
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `barcode-${bikeId}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Sprzątanie
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(pdfUrl);
        }, 100);
    } catch (error) {
        console.error("Błąd podczas pobierania PDF:", error);
        throw new Error("Nie udało się pobrać PDF: " + error.message);
    }
};
