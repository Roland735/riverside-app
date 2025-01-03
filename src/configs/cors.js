// lib/cors.js
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    origin: '*', // Adjust this as necessary (e.g., specify your frontend URL)
    credentials: true,
});

// Helper function to run the middleware
export const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
