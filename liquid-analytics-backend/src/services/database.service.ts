import * as duckdb from "duckdb";
import { CellData } from "../types/sheet.types";

export class DatabaseService {
  private connection: duckdb.Connection;

  constructor(db: duckdb.Database) {
    this.connection = db.connect();
  }

  async getAllData(): Promise<CellData[]> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
               *
            FROM liquid_sheets 
            ORDER BY row, col;
        `;

        this.connection.all(
            query,
            (err: Error | null, results) => {
                if (err) {
                    console.error("DB Error:", err);
                    reject(err);
                } else {
                    const cellData: CellData[] = results.map(row => ({
                        row: row.row,
                        col: row.col,
                        value: row.value
                    }));
                    resolve(cellData);
                }
            }
        );
    });
}

  async updateCell(data: CellData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.validateData(data)) {
          throw new Error("Invalid cell data");
        }

        const query = `
        INSERT INTO liquid_sheets (row, col, value, updated_at)
        VALUES (?::INTEGER, ?::VARCHAR, ?::VARCHAR, ?::TIMESTAMP)
        ON CONFLICT (row, col) 
        DO UPDATE SET 
            value = excluded.value, 
            updated_at = excluded.updated_at;
        `;

        console.log("Binding data:", {
          row: data.row,
          col: data.col,
          value: data.value,
          timestamp: new Date().toISOString(),
        });

        this.connection.all(
          query,
          data.row, data.col, data.value.toString(), new Date().toISOString(),
          (err: Error | null) => {
            if (err) {
              console.error("DB Error:", err);
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
      } catch (error) {
        console.error("Service error:", error);
        reject(error);
      }
    });
  }

  private validateData(data: CellData): boolean {
    const isValid =
      data.row > 0 && /^[A-Z]$/.test(data.col) && data.value !== undefined;
    console.log("Data validation:", { data, isValid });
    return isValid;
  }
}
