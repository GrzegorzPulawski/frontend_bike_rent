
import { useReactToPrint } from "react-to-print";
import {request} from "../../axios_helper";

import React, { useRef, useState, useEffect } from "react";


const BarcodePrint = ({ bikeId: initialBikeId }) => {
    const printRef = useRef();
    const [bikeId, setBikeId] = useState(initialBikeId || ""); // Allow setting bikeId manually
    const [barcodeUrl, setBarcodeUrl] = useState("");

    // Fetch barcode image when bikeId is set
    useEffect(() => {
        if (!bikeId) return; // Avoid API call when bikeId is empty

     request("get",`/api/equipment/barcode/${bikeId}/barcode-image`, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        })
            .then((response) => {
                setBarcodeUrl(URL.createObjectURL(response.data));
            })
            .catch((error) => console.error("Failed to load barcode:", error));
    }, [bikeId]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Print Barcode</h2>

            {/* Input field to enter Bike ID manually if not provided */}
            <input
                type="text"
                placeholder="Enter Bike ID"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                style={{ padding: "8px", marginBottom: "10px" }}
            />

            <div ref={printRef} style={{ padding: "20px", border: "1px solid #ddd" }}>
                <h3>Bike ID: {bikeId || "N/A"}</h3>
                {barcodeUrl ? (
                    <img src={barcodeUrl} alt="Barcode" style={{ width: "300px", height: "100px" }} />
                ) : (
                    <p>{bikeId ? "Loading barcode..." : "Enter Bike ID above"}</p>
                )}
            </div>

            <button onClick={handlePrint} disabled={!barcodeUrl} style={{ marginTop: "10px", padding: "10px 20px" }}>
                Print Barcode
            </button>
        </div>
    );
};

export default BarcodePrint;
