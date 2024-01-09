import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrintService {
  constructor() {}

  public print(printContents: string, printWidth: string = 'auto'): void {
    const popupWin = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(
      `<html>
        <head>
          <style>
            html,body {
                height: 842px;
                width: ${printWidth}px;
                margin-left: auto;
                margin-right: auto;
                margin: 0px;
            }
            @page {
              size: ${printWidth}px auto;
            }
          </style>
        </head>
        <body style="">
          ${printContents}
          <script defer>
            function triggerPrint(event) {
              window.removeEventListener('load', triggerPrint, false);
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 0);
              },0);
            }
            window.addEventListener('load', triggerPrint, false);
          </script>
        </body>
      </html>`
    );
    popupWin.document.close();
  }
}
