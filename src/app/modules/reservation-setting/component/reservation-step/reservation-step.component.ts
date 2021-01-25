import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Helper} from 'src/app/core/utils/helper';

@Component({
  selector: 'app-reservation-step',
  templateUrl: './reservation-step.component.html',
  styleUrls: ['./reservation-step.component.scss']
})
export class ReservationStepComponent implements OnInit {
  helper = Helper;
  endStep = 9;
  @Input() stepNum: number;

  /**
   * View calendar
   */
  @ViewChild('viewStep', {static: true}) viewStep: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  /**
   * Init component
   */
  ngOnInit(): void {
    this.renderStep();
  }

  /**
   * Render step HTML
   *
   * @return {Void}
   */
  renderStep(): void {
    for (let i = 1; i <= 9; i++) {
      const spanEle: HTMLSpanElement = this.renderer.createElement('span');
      spanEle.innerText = '●';
      if (i <= this.stepNum) {
        spanEle.setAttribute('class', 'color');
      }

      this.renderer.appendChild(this.viewStep.nativeElement, spanEle);
    }
  }

}
