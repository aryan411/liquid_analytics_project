// src/config/database.ts
import * as duckdb from 'duckdb';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'liquid.duckdb');

export const initializeDatabase = async () => {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('Data directory created at:', DATA_DIR);
    }

    const db = new duckdb.Database(DB_PATH);
    
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS liquid_sheets (
            row INTEGER CHECK (row > 0),
            column VARCHAR(1) CHECK (column ~ '^[A-Z]$'),
            value VARCHAR,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (row, column)
        );
    `;

    try {
        const connection = db.connect();
        await connection.run(createTableSQL);
        console.log('Database initialized at:', DB_PATH);
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

initializeDatabase();