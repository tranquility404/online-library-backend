import { storage } from "../app.js";

export function allowedOrigins(){
    return process.env.ORIGINS.split(',').map(origin => origin.trim());
}

// console.log(allowedOrigins);

export async function setCorsConfiguration() {
    const corsConfiguration = [
        {
            origin: allowedOrigins(),  // Allow your frontend origin
            method: ['GET', 'HEAD', 'OPTIONS'],  // Allowed methods
            responseHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
            maxAgeSeconds: 3600,                  // How long to cache the preflight response
        },
    ];

    try {
        const a = await storage.bucket(process.env.BOOK_BUCKET).setMetadata({ cors: corsConfiguration });

        console.log('CORS configuration updated successfully.');
    } catch (error) {
        console.error('Error updating CORS configuration:', error);
    }
}