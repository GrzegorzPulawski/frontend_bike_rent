import React, { useState } from 'react';
import { request } from "../../axios_helper";
import { Button, Modal } from "react-bootstrap";

const BikeUnlockModal = ({ bikeId, show, onHide }) => {
    const [qrCode, setQrCode] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const generateQR = async () => {
        setLoading(true);
        try {
            const response = await request("get", `/api/qrcode/generate?idBike=${bikeId}`);
            setQrCode(response.data.qrCodeImage);
            setToken(response.data.qrCodeData.split(':')[1]);
        } catch (error) {
            console.error("QR generation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const unlockBike = async () => {
        try {
            await request("post", `/api/qrcode/unlock?idBike=${bikeId}&token=${token}`);
            alert("Bike unlocked successfully!");
        } catch (error) {
            alert("Unlock failed. Please try again.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Bike Unlock</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {!qrCode ? (
                    <Button
                        variant="primary"
                        onClick={generateQR}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate QR Code"}
                    </Button>
                ) : (
                    <>
                        <img
                            src={`data:image/png;base64,${qrCode}`}
                            alt="Bike QR Code"
                            className="img-fluid mb-3"
                            style={{ maxWidth: '200px' }}
                        />
                        <Button
                            variant="success"
                            onClick={unlockBike}
                            className="w-100"
                        >
                            Unlock Bike
                        </Button>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <small className="text-muted">
                    Scan this QR code at the bike's lock mechanism
                </small>
            </Modal.Footer>
        </Modal>
    );
};

export default BikeUnlockModal;