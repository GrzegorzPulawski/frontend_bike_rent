import React from "react";
import { request } from "../../axios_helper.js";
import 'jspdf-autotable'; // Do tabeli z danymi (opcjonalne)
const API_BASE_URL = "/api/equipment/barcode";


export const getBarcode = async (bikeId) => {
    try {
        const response = await request(
            'GET',
            `${API_BASE_URL}/${bikeId}`
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get barcode');
    }
};

export const getBarcodePdf = async (bikeId) => {
    try {
        const response = await request("get", `${API_BASE_URL}/${bikeId}/pdf`, {
            responseType: "blob",
            headers: {
                "Accept": "application/pdf"
            }
        });

        if (!response.data || response.data.size === 0) {
            throw new Error("Received an empty PDF file");
        }

        // Convert blob to a downloadable object
        const blob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);

        // Open in new tab for debugging
        window.open(pdfUrl);

        // Download logic
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfUrl;
        downloadLink.download = `barcode-${bikeId}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();

        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(pdfUrl);
        }, 100);
    } catch (error) {
        console.error("Error fetching barcode PDF:", error);
        throw new Error("Could not fetch PDF: " + error.message);
    }
};


// Dodatkowe metody jeśli potrzebne
export const checkBarcodeExists = async (bikeId) => {
    try {
        const response = await request(
            'GET',
            `${API_BASE_URL}/${bikeId}/exists`
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to check barcode');
    }
};