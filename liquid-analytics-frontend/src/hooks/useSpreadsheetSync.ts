import { useState, useEffect, useCallback } from "react";
import { WebSocketService } from "../services/WebSocket";

type CellData = {
  row: number;
  col: string;
  value: string;
};

export const useSpreadsheetSync = () => {
  const [data, setData] = useState<CellData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocketService | null>(null);

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

  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  useEffect(() => {
    const wsService = new WebSocketService(
      "ws://localhost:3000",
      handleMessage,
      handleConnect
    );
    setWs(wsService);

    return () => {
      wsService.disconnect();
    };
  }, [handleMessage, handleConnect]);

  const updateCell = (cellData: CellData) => {
    ws?.sendMessage(cellData);
  };

  return {
    data,
    isConnected,
    updateCell,
  };
};
