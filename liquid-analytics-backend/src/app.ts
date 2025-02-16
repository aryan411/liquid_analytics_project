import express from 'express';
import { createServer } from 'http';
import { initializeDatabase } from './config/database';
import { WebSocketService } from './config/websocket';
import { DatabaseService } from './services/database.service';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        const db = await initializeDatabase();
        const dbService = new DatabaseService(db);
        new WebSocketService(server, dbService);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();