/**
 * Service class for managing WebSocket connections with automatic reconnection
 */
export class WebSocketService {
    /** The WebSocket instance */
    private ws: WebSocket;
    /** Number of reconnection attempts made */
    private reconnectAttempts = 0;
    /** Maximum number of reconnection attempts allowed */
    private maxReconnectAttempts = 5;
  
    /**
     * Creates a new WebSocketService instance
     * @param url - The WebSocket server URL to connect to
     * @param onMessage - Callback function to handle incoming messages
     * @param onConnect - Callback function called when connection is established
     */
    constructor(
      private url: string,
      private onMessage: (data: any) => void,
      private onConnect: () => void
    ) {
      this.ws = this.connect();
    }
  
    /**
     * Establishes a WebSocket connection and sets up event handlers
     * @returns A new WebSocket instance
     * @private
     */
    private connect(): WebSocket {
      const ws = new WebSocket(this.url);
  
      ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        this.onConnect();
      };
  
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
  
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        this.handleReconnect();
      };
  
      return ws;
    }
  
    /**
     * Handles reconnection attempts when connection is lost
     * @private
     */
    private handleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          this.ws = this.connect();
        }, 1000 * this.reconnectAttempts);
      }
    }
  
    /**
     * Sends a message through the WebSocket connection
     * @param data - The data to send (will be JSON stringified)
     */
    sendMessage(data: any) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      }
    }
  
    /**
     * Closes the WebSocket connection
     */
    disconnect() {
      this.ws.close();
    }
  }