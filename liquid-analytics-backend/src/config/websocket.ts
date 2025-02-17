import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { DatabaseService } from '../services/database.service';
import { CellData } from '../types/sheet.types';

export class WebSocketService {
    private wss: WebSocketServer;
    private dbService: DatabaseService;

    constructor(server: Server, dbService: DatabaseService) {
        this.wss = new WebSocketServer({ server });
        this.dbService = dbService;
        this.initialize();
    }

    private initialize() {
        this.wss.on('connection', async (ws: WebSocket) => {
            console.log('Client connected');
            
            // Send initial data when client connects
            try {
                const allData = await this.dbService.getAllData();
                ws.send(JSON.stringify({ type: 'initial', data: allData }));
            } catch (error) {
                console.error('Error sending initial data:', error);
                ws.send(JSON.stringify({ error: 'Failed to load initial data' }));
            }

            ws.on('message', async (message: string) => {
                try {
                    const data: CellData = JSON.parse(message);
                    await this.handleCellUpdate(data);
                    this.broadcastUpdate(data);
                } catch (error) {
                    console.error('Message handling error:', error);
                    ws.send(JSON.stringify({ error: 'Invalid data format' }));
                }
            });
        });
    }

    private async handleCellUpdate(data: CellData) {
        try {
            await this.dbService.updateCell(data);
        } catch (error) {
            console.error('Error handling cell update:', error);
            throw error;
        }
    }

    private broadcastUpdate(data: CellData) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', data }));
            }
        });
    }
}