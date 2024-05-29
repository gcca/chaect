interface SocketManager {
  Connect(): SocketManager;
  Disconnect(): SocketManager;
  OnMessage(callback: (message: string) => void): void;
  OnClose(callback: () => void): void;
  Send(message: string): void;
  SafeConnected(): SocketManager;
}

class UnconnectedSocketManager implements SocketManager {
  Connect(): SocketManager {
    return new ConnectedSocketManager();
  }

  Disconnect(): SocketManager {
    throw new Error("Already disconnected socket manager");
  }

  OnMessage(_: (message: string) => void): void {
    throw new Error("Disconnected socket manager");
  }

  OnClose(_: () => void): void {
    throw new Error("Disconnected socket manager");
  }

  Send(_: string): void {
    throw new Error("Disconnected socket manager");
  }

  SafeConnected(): SocketManager {
    return this.Connect();
  }
}

class ConnectedSocketManager implements SocketManager {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket("ws://localhost:8000");
  }

  Connect(): SocketManager {
    throw new Error("Already connected socket manager");
  }

  Disconnect(): SocketManager {
    return new UnconnectedSocketManager();
  }

  OnMessage(callback: (message: string) => void): void {
    this.socket.addEventListener("message", (evt) => {
      callback(evt.data);
    });
  }

  OnClose(callback: () => void): void {
    this.socket.addEventListener("close", () => callback());
  }

  Send(message: string): void {
    this.socket.send(message);
  }

  SafeConnected(): SocketManager {
    return this;
  }
}

export default class ChatService {
  constructor(private socketManager: SocketManager) {
    this.socketManager = new UnconnectedSocketManager();
  }

  Connect(): this {
    this.socketManager = this.socketManager.SafeConnected();
    this.socketManager.OnClose(() => {
      if (this.socketManager instanceof UnconnectedSocketManager) {
        this.socketManager = this.socketManager.Disconnect();
      }
    });
    return this;
  }

  OnMessage(callback: (message: string) => void): this {
    this.socketManager.OnMessage(callback);
    return this;
  }

  Send(message: string): this {
    this.socketManager.Send(message);
    return this;
  }

  SafeConnected(): this {
    this.socketManager = this.socketManager.SafeConnected();
    return this;
  }
}
