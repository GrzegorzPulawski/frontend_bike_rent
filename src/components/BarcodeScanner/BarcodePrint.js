
import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";

import { useReactToPrint } from "react-to-print";
import {request} from "../../axios_helper";

const BarcodePrint = () => {
    const [bikeId, setBikeId] = useState("");  // User enters Bike ID
    const [barcodeText, setBarcodeText] = useState("");
    const barcodeRef = useRef(null);
    const printRef = useRef();

    // Fetch barcode text when Bike ID changes
    useEffect(() => {
        if (!bikeId) return;

   request("GET",`/api/equipment/barcode/${bikeId}`)
            .then((response) => {
                setBarcodeText(response.data);
            })
            .catch((error) => console.error("Error fetching barcode:", error));
    }, [bikeId]);

    // Generate barcode dynamically
    useEffect(() => {
        if (barcodeText && barcodeRef.current) {
            JsBarcode(barcodeRef.current, barcodeText, { format: "CODE128", width: 2, height: 100 });
        }
    }, [barcodeText]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <div>
            <h2>Enter Bike ID:</h2>
            <input
                type="text"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                placeholder="Enter Bike ID"
            />
            <button onClick={handlePrint}>Print Barcode</button>

            <div ref={printRef} style={{ textAlign: "center", padding: "20px" }}>
                <h2>Bike ID: {bikeId}</h2>
                <svg ref={barcodeRef}></svg>  {/* SVG Barcode */}
            </div>
        </div>
    );
};

export default BarcodePrint;
