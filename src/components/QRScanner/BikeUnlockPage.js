import React, { useState } from 'react';
import { request } from "../../axios_helper";
import BikeUnlockModal from './BikeUnlockModal';
import QRScanner from './QRScanner';
import classes from './BikeUnlockPage.module.css';

const BikeUnlockPage = () => {
    const [bikeId, setBikeId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('scan');
    const [error, setError] = useState(null);
    const [scanResult, setScanResult] = useState(null);

    const handleScan = (data) => {
        if (!data?.includes(':')) {
            setError('Invalid QR format. Expected bikeId:token');
            return;
        }
        setScanResult(data);
        const [id, token] = data.split(':');
        setBikeId(id);
        setError(null);
    };

    const unlockBike = async (id, token) => {
        try {
            await request("post", `/api/qrcode/unlock?idBike=${id}&token=${token}`);
            alert("Bike unlocked successfully!");
            setScanResult(null);
        } catch (error) {
            setError("Unlock failed. Please try again.");
        }
    };

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Bike Unlock</h1>

            {error && <div className={classes.error}>{error}</div>}

            <div className={classes.modeSelector}>
                <button
                    className={`${classes.modeButton} ${mode === 'scan' ? classes.active : ''}`}
                    onClick={() => {
                        setMode('scan');
                        setError(null);
                    }}
                >
                    Scan QR Code
                </button>
                <button
                    className={`${classes.modeButton} ${mode === 'generate' ? classes.active : ''}`}
                    onClick={() => {
                        setMode('generate');
                        setShowModal(true);
                    }}
                >
                    Generate QR Code
                </button>
            </div>

            {mode === 'scan' ? (
                <div className={classes.scannerWrapper}>
                    <QRScanner
                        onScan={handleScan}
                        onError={(err) => setError(err.message || 'Scanner error')}
                    />
                    {scanResult && (
                        <div className={classes.resultContainer}>
                            <button
                                className={classes.unlockButton}
                                onClick={() => {
                                    const [id, token] = scanResult.split(':');
                                    unlockBike(id, token);
                                }}
                            >
                                Unlock Bike {scanResult.split(':')[0]}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <BikeUnlockModal
                    bikeId={bikeId}
                    show={showModal}
                    onHide={() => {
                        setShowModal(false);
                        setMode('scan');
                    }}
                />
            )}
        </div>
    );
};

export default BikeUnlockPage;