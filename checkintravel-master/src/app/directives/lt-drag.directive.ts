import {
  Directive,
  Input,
  NgZone,
  Renderer2,
  HostListener,
  HostBinding,
  OnInit,
  ElementRef
} from '@angular/core';

class Position {
  x: number; y: number;
  constructor(x, y) { this.x = x; this.y = y; }
};

@Directive({
  selector: '[appLtDrag]'
})
export class LtDragDirective {

  private allowDrag = true;
  private moving = false;
  private origin = null;

  // for adding / detaching mouse listeners dynamically so they're not *always* listening
  private moveFunc: Function;
  private clickFunc: Function;

  constructor(private el: ElementRef,
    private zone: NgZone,
    private rend: Renderer2) { }

  @Input('handle') handle: HTMLElement;

  @HostBinding('style.transform') transform: string = 'translate3d(0,0,0)';

  ngOnInit() {

    let host = this.el.nativeElement.offsetParent;

    // applies mousemove and mouseup listeners to the parent component, typically my app componennt window, I prefer doing it like this so I'm not binding to a window or document object

    this.clickFunc = this.rend.listen(host, 'mouseup', () => {
      this.moving = false;
    });

    // uses ngzone to run moving outside angular for better performance
    this.moveFunc = this.rend.listen(host, 'mousemove', ($event) => {
      if (this.moving && this.allowDrag) {
        this.zone.runOutsideAngular(() => {
          event.preventDefault();
          this.moveTo($event.clientX, $event.clientY);
        });
      }
    });
  }

  // detach listeners if host element is removed from DOM
  ngOnDestroy() {
    if (this.clickFunc) { this.clickFunc(); }
    if (this.moveFunc) { this.moveFunc(); }
  }

  // parses css translate string for exact px position
  private getPosition(x: number, y: number): Position {
    let transVal: string[] = this.transform.split(',');
    let newX = parseInt(transVal[0].replace('translate3d(', ''));
    let newY = parseInt(transVal[1]);
    return new Position(x - newX, y - newY);
  }

  private moveTo(x: number, y: number): void {
    if (this.origin) {
      this.transform = this.getTranslate((x - this.origin.x), (y - this.origin.y));
    }
  }

  private getTranslate(x: number, y: number): string {
    return 'translate3d(' + x + 'px,' + y + 'px,0px)';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button == 2 || (this.handle !== undefined && event.target !==
      this.handle)) {
      return;
    }
    else {
      this.moving = true;
      this.origin = this.getPosition(event.clientX, event.clientY);
    }
  }

}
