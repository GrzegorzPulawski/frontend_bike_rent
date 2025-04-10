import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { request } from "../../axios_helper";
import styles from "./BarcodeGenerator.module.css";

const BarcodeGenerator = () => {
    const [bikeId, setBikeId] = useState("");
    const [barcodeValue, setBarcodeValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const barcodeRef = useRef();
    const printRef = useRef();

    // Generate barcode when barcodeValue updates
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

    const handleGenerateAndPrint = () => {
        if (!bikeId) {
            setErrorMessage("Podaj ID roweru.");
            return;
        }

        request("POST", `/api/equipments/barcode/${bikeId}/generate`)
            .then((res) => {
                setBarcodeValue(res.data);
                setErrorMessage("");

                // Wait for barcode to render before printing
                setTimeout(() => {
                    window.print();
                }, 300);
            })
            .catch((err) => {
                console.error("Błąd generowania kodu:", err);
                setErrorMessage("Nie udało się wygenerować kodu dla tego ID.");
            });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Generuj kod kreskowy</h2>

            <div className={styles.inputGroup}>
                <label className={styles.label}>ID roweru</label>
                <input
                    type="text"
                    value={bikeId}
                    onChange={(e) => setBikeId(e.target.value)}
                    className={styles.input}
                    placeholder="Wprowadź ID roweru"
                />
            </div>

            <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={handleGenerateAndPrint}>
                    Wygeneruj i Drukuj
                </button>
            </div>

            {errorMessage && (
                <div className={styles.error}>
                    {errorMessage}
                </div>
            )}

            {barcodeValue && (
                <div ref={printRef} className={styles.barcodeWrapper}>
                    <h3 className={styles.barcodeText}>Kod roweru: {barcodeValue}</h3>
                    <svg ref={barcodeRef}></svg>
                </div>
            )}
        </div>
    );
};

export default BarcodeGenerator;

