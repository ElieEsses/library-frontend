import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect } from "react";

export default function BarcodeScanner({ onScan }) {
    useEffect(() => {
        const scanner = new Html5Qrcode("barcode-reader", {
            formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
            verbose: false,
        });

        let cancelled = false;

        const startPromise = scanner.start(
            { facingMode: "environment" },
            { fps: 15, qrbox: { width: 300, height: 150 } },
            (decodedText) => {
                if (!cancelled) {
                    onScan(decodedText);
                }
            },
            () => {}
        );

        // startPromise.catch(console.error);

        startPromise
            .then(() => console.log("Camera started successfully"))
            .catch((err) => console.error("CAMERA FAILED:", err));

        return () => {
            cancelled = true;

            startPromise
            .then(() => scanner.stop())
            .catch(() => {});
        };
    }, [onScan]);
  return <div id="barcode-reader" />;
}