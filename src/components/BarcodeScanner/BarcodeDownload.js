import React, { useState } from "react";
import { getBarcodePdf } from "./BarcodeService2";

const BarcodeDownload = () => {
    const [bikeId, setBikeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        if (!bikeId.trim()) {
            setError("Podaj poprawne ID roweru");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await getBarcodePdf(bikeId);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Pobierz kod kreskowy jako PDF</h2>
            <input
                type="text"
                placeholder="Wprowadź ID roweru"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
            />
            <button onClick={handleDownload} disabled={loading}>
                {loading ? "Generowanie..." : "Pobierz PDF"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default BarcodeDownload;
