import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = ({ onScan, onError }) => {
    const videoRef = useRef(null);
    const readerRef = useRef(null);

    useEffect(() => {
        readerRef.current = new BrowserMultiFormatReader();

        const startScan = async () => {
            try {
                await readerRef.current.decodeFromVideoDevice(
                    undefined,
                    videoRef.current,
                    (result, error) => {
                        if (result) onScan(result.getText());
                        if (error) onError(error);
                    }
                );
            } catch (err) {
                onError(err);
            }
        };

        startScan();

        return () => {
            if (readerRef.current) {
                readerRef.current.reset();
            }
        };
    }, [onScan, onError]);

    return (
        <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
        }}>
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                }}
            />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '2px',
                background: 'red',
                opacity: 0.5
            }}></div>
        </div>
    );
};

export default QRScanner;