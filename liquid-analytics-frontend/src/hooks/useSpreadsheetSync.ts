import { useState, useEffect, useCallback } from "react";
import { WebSocketService } from "../services/WebSocket";

type Data = {
  row: number;
  col: string;
  value: string;
};

/**
 * Custom hook for managing WebSocket-based spreadsheet synchronization
 * @returns {Object} An object containing:
 * - data: Array of cell data with row, column and value information
 * - isConnected: Boolean indicating WebSocket connection status
 * - updateCell: Function to send cell updates through WebSocket
 */
export const useSpreadsheetSync = () => {
  const [data, setData] = useState<Data[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocketService | null>(null);
  const baseURL = import.meta.env.VITE_BASE_URL;
  console.log(import.meta.env)
  /**
   * Handles incoming WebSocket messages
   * @param {any} message - The received WebSocket message
   */
  const handleMessage = useCallback((message: any) => {
    if (message.type === "initial") {
      setData(message.data);
    } else if (message.type === "update") {
      setData((prev) => {
        const index = prev.findIndex(
          (cell) =>
            cell.row === message.data.row && cell.col === message.data.col
        );
        if (index >= 0) {
          return [
            ...prev.slice(0, index),
            message.data,
            ...prev.slice(index + 1),
          ];
        }
        return [...prev, message.data];
      });
    }
  }, []);

  /**
   * Handles successful WebSocket connection
   */
  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  useEffect(() => {
    console.log(baseURL)
    const wsService = new WebSocketService(
      baseURL || "",
      handleMessage,
      handleConnect
    );
    setWs(wsService);

    return () => {
      wsService.disconnect();
    };
  }, [handleMessage, handleConnect]);

  /**
   * Sends cell update through WebSocket
   * @param {Data} cellData - The cell data to update
   */
  const updateCell = (cellData: Data) => {
    ws?.sendMessage(cellData);
  };

  return {
    data,
    isConnected,
    updateCell,
  };
};
