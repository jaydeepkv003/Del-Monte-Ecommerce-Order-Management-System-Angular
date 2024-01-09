// import { Injectable, OnDestroy } from '@angular/core';
// import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
// import { Keepalive } from '@ng-idle/keepalive';
// import { Subscription } from 'rxjs';
// import { Urls } from '@urls';
// import { AuthService } from '../auth.service';
// import { DataService } from '../completed/data.service';

// export class IdleConfig { idleTimeout: number; idleTimeoutPeriod: number; keepAliveInterval: number; }
// @Injectable()
// export class IdleService implements OnDestroy {
//   private idleConfig: IdleConfig;
//   private subscriptions: Subscription[] = [];
//   constructor(
//     private idle: Idle,
//     private keepalive: Keepalive,
//     private authService: AuthService,
//     private dataService: DataService
//   ) {
//     // this.idleConfig = { idleTimeout: 1, keepAliveInterval: 2, idleTimeoutPeriod: 3 };
//     this.idleConfig = { idleTimeout: 1200, keepAliveInterval: 1500, idleTimeoutPeriod: 20000 };
//   }

//   setupIdle(config: IdleConfig = this.idleConfig) {
//     this.ngOnDestroy();
//     this.idle.setIdle(+config.idleTimeout);
//     this.idle.setTimeout(+config.idleTimeoutPeriod);
//     this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
//     this.keepalive.interval(config.keepAliveInterval);
//     this.watchIdle();
//     this.idle.watch();
//   }

//   stopIdle() {
//     this.idle.stop();
//     this.keepalive.stop();
//     this.ngOnDestroy();
//   }

//   watchIdle() {
//     this.subscriptions.push(this.idle.onTimeout.subscribe(() => {
//       this.authService.handleChecking();
//     }));
//     this.subscriptions.push(this.keepalive.onPing.subscribe(() => {
//       if (this.authService.isAuthenticated()) {
//         this.keepAlive().then(result => {
//           if (!result) { this.authService.handleChecking(); }
//         });
//       }
//     }));
//     this.subscriptions.push(this.authService.reAuthenticated.subscribe(result => {
//       if (result) { this.idle.stop(); this.idle.watch(); }
//     }));
//   }

//   private keepAlive(): Promise<boolean> {
//     return new Promise<boolean>(resolve => {
//       this.dataService.postData(Urls.Authenticate.KeepAlive)
//         .then(value => {
//           this.authService.setupLocalValues(value);
//           resolve(value ? true : false);
//         });
//     });
//   };

//   ngOnDestroy() {
//     this.subscriptions.forEach(subscription => {
//       subscription.unsubscribe();
//     });
//   }

//   // private getCurrentIP() {
//   //   this.dataService.get<string>(ExternalUrls.IPAddress).then(response => {
//   //     debugger;
//   //   });
//   // };
// }
