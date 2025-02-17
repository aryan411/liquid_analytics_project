export class WebSocketService {
    private ws: WebSocket;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
  
    constructor(
      private url: string,
      private onMessage: (data: any) => void,
      private onConnect: () => void
    ) {
      this.ws = this.connect();
    }
  
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
  
    private handleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          this.ws = this.connect();
        }, 1000 * this.reconnectAttempts);
      }
    }
  
    sendMessage(data: any) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      }
    }
  
    disconnect() {
      this.ws.close();
    }
  }