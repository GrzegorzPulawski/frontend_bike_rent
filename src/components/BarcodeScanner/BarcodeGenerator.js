import React, { useState } from "react";
import {request} from "../../axios_helper";

const BarcodeGenerator = () => {
    const [bikeId, setBikeId] = useState("");
    const [barcode, setBarcode] = useState("");
    const [error, setError] = useState("");

    const fetchBarcode = async () => {
        try {
            const response = await request("GET", `/api/equipment/barcode/${bikeId}`);
            setBarcode(response.data);
            setError("");
        } catch (err) {
            setError("Error fetching barcode");
        }
    };

    const generateBarcode = async () => {
        try {
            const response = await request("POST", `/api/equipment/barcode/${bikeId}/generate`);
            setBarcode(response.data);
            setError("");
        } catch (err) {
            setError("Error generating barcode");
        }
    };

    const downloadBarcodePdf = async () => {
        try {
            const response = await request("GET", `/api/equipment/barcode/${bikeId}/pdf`, null);
            const blob = new Blob([response.data], { type: "application/pdf" });

            // Create download link
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `barcode-${bikeId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError("Error downloading PDF");
        }
    };

    return (
        <div>
            <h2>Barcode Generator</h2>
            <input
                type="text"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                placeholder="Enter Bike ID"
            />
            <button onClick={fetchBarcode}>Fetch Barcode</button>
            <button onClick={generateBarcode}>Generate Barcode</button>
            <button onClick={downloadBarcodePdf}>Download PDF</button>

            {barcode && <p>Barcode: {barcode}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default BarcodeGenerator;