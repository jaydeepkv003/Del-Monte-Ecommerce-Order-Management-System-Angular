import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { GlobalConfigService } from '@services/global.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-image-box',
  templateUrl: './dy-image-box.component.html',
  styleUrls: ['./dy-image-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class DyImageBoxComponent {
  modalRef: BsModalRef;
  currrentImage = '';
  originalImage = '';
  viewImage = true;
  cssClasses =
    'img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall very-small';

  @Input() set ImageUrl(url: string) {
    if (url && url != null) {
      this.originalImage = url;
      this.currrentImage = this.gcService.imageUrl + url;
    } else {
      this.currrentImage = this.gcService.globalConfig.logoUrl;
    }
    this.changeDetector.detectChanges();
  }

  @Input() set CssToApply(css: string) {
    this.cssClasses = css;
    this.changeDetector.detectChanges();
  }

  @Input() set ViewImage(toView: boolean) {
    this.viewImage = toView;
  }

  constructor(
    public gcService: GlobalConfigService,
    private modalService: BsModalService,
    private changeDetector: ChangeDetectorRef
  ) {}

  errorLoadImage(): void {
    if (this.currrentImage === this.gcService.imageUrl + this.originalImage) {
      this.currrentImage = this.gcService.globalConfig.logoUrl;
    } else if (this.currrentImage === this.gcService.globalConfig.logoUrl) {
      this.currrentImage = this.gcService.defaultLogo;
    }
    this.changeDetector.detectChanges();
  }

  onImageView(template: TemplateRef<any>): void {
    if (
      this.viewImage &&
      this.currrentImage === this.gcService.imageUrl + this.originalImage
    ) {
      this.modalRef = this.modalService.show(template);
    }
  }
}
