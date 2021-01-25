import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  state(
    'fadeIn',
    style({
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 99999998,
      display: 'block',
    })
  ),
  state(
    'fadeOut',
    style({
      background: 'none',
      zIndex: 0,
      display: 'none',
    })
  ),
  transition('fadeIn => fadeOut', [animate('0.35s')]),
  transition('fadeOut => fadeIn', [animate('0.2s')]),
]);
