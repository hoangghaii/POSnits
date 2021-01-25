import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {LocalTime} from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss']
})
export class ReservationCalendarComponent implements OnInit, OnChanges {
  localTime = LocalTime;
  dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  currentDay = new Date();
  multiDate = [];
  choiceDate = {
    date: null,
    month: null,
    year: null,
    day: ''
  };

  @Input() multi = false;
  @Input() days = [];
  @Input() reservationsSort = [];
  @Input() reservationStatus = false;
  /**
   * The holiday of week
   */
  @Input() weekOff = [];

  /**
   * Emit date
   */
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() nextPrev: EventEmitter<any> = new EventEmitter();

  /**
   * View calendar
   */
  @ViewChild('showDate', {static: true}) showDate: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  /**
   * Init component
   */
  ngOnInit(): void {
    this.choiceDate = {
      date: this.currentDay.getDate(),
      month: this.currentDay.getMonth() + 1,
      year: this.currentDay.getFullYear(),
      day: this.dayOfWeek[this.currentDay.getDay()]
    };

    this.renderCalendar(this.choiceDate.year, this.choiceDate.month, this.choiceDate.date);
  }

  /**
   * Change init
   */
  ngOnChanges(): void {
    setTimeout(() => {
      this.refreshCalendar();
    }, 1000);
  }

  /**
   * Refresh calendar
   */
  refreshCalendar(): void {
    if (this.days) {
      this.days.map((date) => this.localTime.formatDate(date));
    }

    this.renderCalendar(this.choiceDate.year, this.choiceDate.month, this.choiceDate.date);
  }

  /**
   * Render calendar
   *
   * @param {number} year
   * @param {number} curMonth
   * @param {number} curDate
   *
   * @return void
   */
  renderCalendar(year, curMonth, curDate): void {
    // Pre month
    const preMonth = curMonth - 1;
    // First day && last day of the month
    const firstDay = new Date(year, preMonth, 1);
    const lastDay = new Date(year, curMonth, 0);
    // Last day of pre month
    const lastDate = new Date(year, preMonth, 0).getDate();
    // index is number day of date in month
    let index = 1;
    let count = 0;
    if (firstDay.getDay() != 0) {
      count = firstDay.getDay();
    }

    // Array date of the calender on month
    const dateOfMoth = [];
    // Get table body HTML
    const tbody = this.showDate.nativeElement.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(el => el.remove()); // Remove all tr of the body calender

    // The first row
    // Get date of pre month
    for (let i = lastDate - count + 1; i <= lastDate; i++) {
      dateOfMoth.push({date: i, month: preMonth, year, class: 'dis'});
    }
    // Get next date of the current month for the first row
    for (let i = 1; i <= 7 - count; i++) {
      dateOfMoth.push({date: i, month: curMonth, year, class: 'point'});
      index++;
    }
    // Get the continue rows,(3 line continues)
    let line = 3;
    if (lastDay.getDate() - index >= 28) { // If date greater 28 days then set more line(4 line)
      line++;
    }

    // For line(tr) and add date into array date of month
    for (let t = 0; t < line; t++) {
      for (let i = index; i < index + 7; i++) {
        dateOfMoth.push({date: i, month: curMonth, year, class: 'point'});
      }
      index += 7;
    }

    // Get end date
    count = 0;
    // If the month has any more date then add more new line
    for (let i = index; i <= lastDay.getDate(); i++) { // Get date again
      dateOfMoth.push({date: i, month: curMonth, year, class: 'point'});
      count++;
    }
    // Because we need 7 days for a line, so we add more for full week by set date of next month
    count = 7 - count;
    for (let i = 1; i <= count; i++) {
      // Date of next month
      dateOfMoth.push({date: i, month: curMonth + 1, year, class: 'dis'});
    }

    // Render HTML
    for (let row = 0; row < dateOfMoth.length / 7; row++) {
      // Create tr
      const trEle: HTMLTableRowElement = this.renderer.createElement('tr');
      trEle.setAttribute('class', 'tr');
      // Loop date in a month
      for (let col = 0; col < 7; col++) {
        // Get item date
        const item = dateOfMoth[(col + row * 7)];
        // Get css
        let cssClass = item.class ? item.class : '';
        // Create td (Column container date)
        const tdEle: HTMLTableColElement = this.renderer.createElement('td');
        // Set current date || choice date
        const itemDate = new Date(item.year, item.month - 1, item.date);
        if (this.days.includes((this.localTime.formatDate(itemDate)))
          || this.weekOff.includes(itemDate.getDay())) {
          cssClass += ' choice';
          if (this.weekOff.includes(itemDate.getDay())) {
            cssClass += ' read-only';
          }
        }

        tdEle.setAttribute('class', cssClass); // Set class
        if (cssClass.includes('dis')) {
          tdEle.innerText = ''; // Set html
        } else {
          tdEle.innerText = item?.date.toString(); // Set html
        }

        if (cssClass != 'dis') { // Set event click into date
          tdEle.addEventListener('click', this.clickDate.bind(this, [item]), false);
        }

        // if in reservation-table page
        if (this.reservationStatus) {
          // Create em (container count)
          const emEle: HTMLTableColElement = this.renderer.createElement('em');
          // Create sub (container number)
          const subEle: HTMLTableColElement = this.renderer.createElement('sub');

          if (cssClass.includes('dis')) {
            emEle.innerText = ''; // Set html
            subEle.innerText = ''; // Set html
          } else {
            if (this.reservationsSort[item?.date]) {
              emEle.innerText = this.reservationsSort[item?.date]; // Set html
              subEle.innerText = '名'; // Set html
            }
          }

          emEle.insertAdjacentElement('beforeend', subEle);
          tdEle.insertAdjacentElement('beforeend', emEle);
        }

        trEle.insertAdjacentElement('beforeend', tdEle);
      }

      // Render calendar
      this.renderer.appendChild(tbody, trEle);
    }

    this.handleEmitted();
  }

  /**
   * Handle event click into date
   *
   * @param {array} args
   * @param {Event} evt
   *
   * @return void
   */
  clickDate(args, evt): void {
    let isExisted = false;
    const params = args ? args[0] : {};
    let curDate = null;
    if (params) {
      curDate = new Date(params.year, params.month - 1, params.date);
    }

    if (this.weekOff.includes(curDate.getDay())) {
      return evt.preventDefault();
    }

    if (!this.multi) {
      // Remove all choice class
      this.showDate.nativeElement.querySelectorAll('td').forEach((item) => {
        item.classList.remove('choice');
      });
    }
    if (evt.target.classList.contains('choice') && this.multi) {
      isExisted = true;
      this.renderer.removeClass(evt.target, 'choice');
    } else {
      // Set choice class for current date
      this.renderer.addClass(evt.target, 'choice');
    }

    this.choiceDate.date = curDate.getDate();
    this.choiceDate.month = curDate.getMonth() + 1;
    this.choiceDate.year = curDate.getFullYear();
    this.choiceDate.day = this.dayOfWeek[curDate.getDay()];
    curDate = this.localTime.formatDate(curDate);
    if (!this.multi) {
      this.days = [];
    }
    if (this.days.includes(curDate) && isExisted) {
      this.days.splice(this.days.indexOf(curDate), 1);
    } else {
      if (!this.days.includes(curDate)) {
        this.days.push(curDate);
      }
    }

    this.handleEmitted();
  }

  /**
   * Move to current date
   *
   * @return {void}
   */
  moveToday(): void {
    this.choiceDate = {
      date: this.currentDay.getDate(),
      month: this.currentDay.getMonth() + 1,
      year: this.currentDay.getFullYear(),
      day: this.dayOfWeek[this.currentDay.getDay()]
    };

    this.renderCalendar(this.choiceDate.year, this.choiceDate.month, this.choiceDate.date);
  }

  /**
   * Handle event click next month
   *
   * @return {void}
   */
  handleNext(): void {
    // Get current date of the next month
    const curDay = new Date(this.choiceDate.year, this.choiceDate.month, 1);
    let curMonth = curDay.getMonth();
    let year = curDay.getFullYear();

    // If month is 12 then set month is 1 and the yead + 1
    if (curMonth == 12) {
      curMonth = 1;
      year++;
    } else {
      curMonth++;
    }

    // Month 1-12 but on Date, Month 0-11
    const curDate = new Date(year, curMonth - 1, 1);
    this.choiceDate.date = curDate.getDate();
    this.choiceDate.month = curDate.getMonth() + 1;
    this.choiceDate.year = curDate.getFullYear();
    this.choiceDate.day = this.dayOfWeek[curDate.getDay()];
    // Will be run if it's reservation page
    if (this.reservationStatus) {
      this.nextPrev.emit(LocalTime.formatDate(new Date(this.choiceDate.year, curDate.getMonth(), this.choiceDate.date)));
    }
    // Render new calendar
    this.renderCalendar(this.choiceDate.year, this.choiceDate.month, this.choiceDate.date);
  }

  /**
   * Handle event click preview month
   *
   * @return {void}
   */
  handlePre(): void {
    // Get current date
    const curDay = new Date(this.choiceDate.year, this.choiceDate.month, 1);
    let curMonth = curDay.getMonth();
    let year = curDay.getFullYear();
    // If month is 1 then set month is 12 and the yead - 1
    if (curMonth == 1) {
      curMonth = 12;
      year--;
    } else {
      curMonth--;
    }

    // Month 1-12 but on Date, Month 0-11
    const curDate = new Date(year, curMonth - 1, 1);
    this.choiceDate.date = curDate.getDate();
    this.choiceDate.month = curDate.getMonth() + 1;
    this.choiceDate.year = curDate.getFullYear();
    this.choiceDate.day = this.dayOfWeek[curDate.getDay()];
    // Will be run if it's reservation page
    if (this.reservationStatus) {
      this.nextPrev.emit(LocalTime.formatDate(new Date(this.choiceDate.year, curDate.getMonth(), this.choiceDate.date)));
    }
    // Render new calendar
    this.renderCalendar(this.choiceDate.year, this.choiceDate.month, this.choiceDate.date);
  }

  /**
   * Emitted event
   */
  handleEmitted(): void {
    if (!this.multi && this.days.length > 0) {
      return this.select.emit(this.days[this.days.length - 1]);
    }
    this.select.emit(this.days);
  }
}
