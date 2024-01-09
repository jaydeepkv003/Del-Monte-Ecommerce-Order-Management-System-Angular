// import { BellTypes, BellLanguages } from '@dynamics/dynamics.enum';
// import { DataService } from '@services/data.service';
// import { Subject } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { Modules, Urls } from '@urls';
// import { CallingToken } from '@queue/queue.service';

// @Injectable({ providedIn: 'root' })
// export class PlayerService {
//   private soundUrl = `${Modules.Sounds}${localStorage.TenantCode}/`;
//   private audioQueue: SoundQueue[] = [];
//   private play: Subject<boolean> = new Subject<boolean>();
//   private isPlaying = false;
//   private audioPlayer = new Audio();
//   private bellTypes: BellType[] = [];

//   constructor(private dataService: DataService) {
//     this.getSoundSettings();
//     this.play.subscribe(data => {
//       if (data && this.audioQueue.length && !this.isPlaying) {
//         this.isPlaying = true;
//         this.playQueue();
//       }
//     });
//   }

//   getSoundSettings() {
//     this.dataService.postData<BellType[]>(Urls.Queue.BellTypes).then(data => { this.bellTypes = data; });
//   }

//   playTokenSound(callingTokens: CallingToken[]) {
//     if (callingTokens && callingTokens.length) {
//       this.bellTypes.forEach(bell => {
//         const language = BellLanguages[bell.language];
//         switch (bell.pattern) {
//           case BellTypes.BellAndToken:
//             callingTokens.forEach(element => {
//               if (element.isBelling && element.currentToken && element.currentToken.tokenNo) {
//                 this.audioQueue.push({ audio: 'bell', language: language });
//                 this.audioQueue.push({ audio: 'token', language: language });
//                 this.addToList(element.currentToken.tokenNo.toString(), language);
//               }
//               if (element.currentToken) { this.removeBell(element.currentToken.id); }
//             });
//             break;
//           case BellTypes.TokenAndCounter:
//             callingTokens.forEach(element => {
//               if (element.isBelling && element.currentToken && element.currentToken.tokenNo) {
//                 this.audioQueue.push({ audio: 'token', language: language });
//                 this.addToList(element.currentToken.tokenNo.toString(), language);
//                 this.audioQueue.push({ audio: 'counter', language: language });
//                 this.addToList(element.carrierName.toString(), language);
//               }
//               if (element.currentToken) { this.removeBell(element.currentToken.id); }
//             });
//             break;
//           case BellTypes.Bell:
//             this.audioQueue.push({ audio: 'bell', language: language });
//             break;
//         }
//       });
//       this.play.next(true);
//     }
//   }

//   addToList(data, language) {
//     data = data.replace(/[^a-z0-9]/gi, '');
//     data.split('').forEach(char => {
//       this.audioQueue.push({ audio: char, language: language });
//     });
//   }

//   playQueue() {
//     if (this.audioQueue[0]) {
//       this.playAudio(`${this.audioQueue[0].language}/${this.audioQueue[0].audio}`).then(data => {
//         this.audioQueue.splice(0, 1);
//         if (this.audioQueue.length === 0) { this.isPlaying = false; } else { this.playQueue(); }
//       });
//     } else {
//       this.isPlaying = false;
//     }
//   }

//   playAudio(soundUrl: string) {
//     return new Promise<boolean>(resolve => {
//       this.audioPlayer.src = `${this.soundUrl}${soundUrl}.wav`;
//       this.audioPlayer.load();
//       this.audioPlayer.play();
//       this.audioPlayer.onended = () => resolve(true);
//     });
//   }

//   removeBell(tokenId) {
//     this.dataService.postData(Urls.Queue.StopBell, { data: tokenId }).then();
//   }
// }
// class BellType {
//   id: number;
//   pattern: number;
//   language: number;
// }
// class SoundQueue {
//   language: string;
//   audio: string;
// }
