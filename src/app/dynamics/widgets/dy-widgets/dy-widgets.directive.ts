import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { WidgetConfig } from '@dynamics/dynamics.interface';
import { WidgetMapper } from '@dynamics/widget.mapper';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dyWidgets]',
})
export class DyWidgetsDirective implements OnInit {
  @Input() config: WidgetConfig;
  componentRef: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const factory = this.resolver.resolveComponentFactory(
      WidgetMapper[this.config.widgetType]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.config = this.config;
  }
}
