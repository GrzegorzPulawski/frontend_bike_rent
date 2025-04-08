
import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { useReactToPrint } from "react-to-print";
import { request } from "../../axios_helper";

const BarcodeGenerator = () => {
    const [bikeId, setBikeId] = useState("");
    const [barcodeValue, setBarcodeValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const barcodeRef = useRef(null);
    const printRef = useRef();

    const handleGenerateBarcode = () => {
        if (!bikeId) {
            setErrorMessage("Podaj ID roweru.");
            return;
        }

        request("POST", `/api/equipments/barcode/${bikeId}/generate`)
            .then((res) => {
                setBarcodeValue(res.data);
                setErrorMessage("");
            })
            .catch((err) => {
                console.error("Błąd generowania kodu:", err);
                setErrorMessage("Nie udało się wygenerować kodu dla tego ID.");
            });
    };

    useEffect(() => {
        if (barcodeValue && barcodeRef.current) {
            JsBarcode(barcodeRef.current, barcodeValue, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
            });
        }
    }, [barcodeValue]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `
      @page { size: auto; margin: 0mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
        svg { max-width: 100% !important; height: auto !important; }
      }
    `,
        documentTitle: `Barcode-${bikeId}`,
        onAfterPrint: () => console.log("Printed successfully")
    });


    return (
        <div>
            <h2>Generuj i drukuj kod kreskowy</h2>
            <input
                type="text"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                placeholder="Wprowadź ID roweru"
            />
            <div style={{ marginTop: 10 }}>
                <button onClick={handleGenerateBarcode}>Wygeneruj kod</button>
                <button onClick={handlePrint} disabled={!barcodeValue}>
                    Drukuj kod
                </button>
            </div>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <div
                ref={printRef}
                style={{
                    textAlign: "center",
                    marginTop: 20,
                    padding: 20,
                    border: "1px dashed gray",
                }}
            >
                {barcodeValue && <h3>Kod roweru: {barcodeValue}</h3>}
                <svg ref={barcodeRef}></svg>
            </div>
        </div>
    );
};

export default BarcodeGenerator;
