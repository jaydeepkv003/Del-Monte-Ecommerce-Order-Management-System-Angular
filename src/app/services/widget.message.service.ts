import { Injectable, OnDestroy } from '@angular/core';
import { TcpMessage } from '@dynamics/dynamics.interface';
import { BehaviorSubject } from 'rxjs';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from './subscriber.service';
import { WebsocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class WidgetMessageService implements OnDestroy {
  private subList: SubscriptionObject[] = [];
  messageSubject: BehaviorSubject<TcpMessage> = new BehaviorSubject(null);

  constructor(private wsService: WebsocketService) {
    this.initializeMessages();
  }

  initializeMessages(): void {
    if (this.wsService.webSocket) {
      pushSubscription(
        'WidMessageSub',
        this.subList,
        this.wsService.webSocket.subscribe((message: TcpMessage) => {
          if (
            message &&
            message.widgetMessageType &&
            message.widgetMessageType !== 0
          ) {
            this.messageSubject.next(message);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
