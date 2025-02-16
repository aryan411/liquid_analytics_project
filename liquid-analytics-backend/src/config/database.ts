import * as duckdb from 'duckdb';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'liquid.duckdb');

export const initializeDatabase = async (): Promise<duckdb.Database> => {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('Data directory created at:', DATA_DIR);
    }

    const db = new duckdb.Database(DB_PATH);
    const connection = db.connect();

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS liquid_sheets (
            row INTEGER CHECK (row > 0),
            col VARCHAR(1) CHECK (col ~ '^[A-Z]$'),
            value VARCHAR,
            updated_at TIMESTAMP DEFAULT now(),
            PRIMARY KEY (row, col)
        );
    `;

    return new Promise((resolve, reject) => {
        connection.run(createTableSQL, (err: Error | null) => {
            if (err) {
                console.error('Error creating table:', err);
                reject(err);
            } else {
                console.log('Table created successfully');
                resolve(db);
            }
        });
    });
};