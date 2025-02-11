import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js'; // Ensure `.js` extension is included

dotenv.config();

async function main() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        const server = app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        });

        process.on('unhandledRejection', (err) => {
            console.error(`😈 Unhandled Rejection detected, shutting down...`, err);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', (err) => {
            console.error(`😈 Uncaught Exception detected, shutting down...`, err);
            process.exit(1);
        });

    } catch (err) {
        console.error(err);
    }
}

main();
