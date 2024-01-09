import { Injectable } from '@angular/core';
import { TcpMessageType } from '@dynamics/dynamics.enum';
import { WebSockets } from '@urls';
import { Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  public webSocket: Subject<any>;

  private createWebsocket(): Subject<MessageEvent> {
    if (this.webSocket) {
      return this.webSocket;
    } else {
      this.webSocket = webSocket(WebSockets.Socket);
      return this.webSocket;
    }
  }

  public registerSocketUser(): void {
    if (localStorage.User) {
      this.createWebsocket();
      this.webSocket.next({
        messageType: TcpMessageType.UserConncetion,
        data: JSON.parse(localStorage.User),
      });
    }
  }

  public removeSocketUser(): void {
    this.webSocket.next({ messageType: TcpMessageType.UserDisconnection });
  }

  private tryReconnection(): void {
    setTimeout(() => {
      window.location.reload();
    }, 30000);
  }
}
