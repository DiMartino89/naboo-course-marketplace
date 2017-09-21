import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'calendar',
    templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {

    @Input() events: any;
    @Input() creation: boolean;

    constructor() {
    }

    ngOnInit() {

        if (this.creation) {
            ($('#calendar') as any).fullCalendar({
                firstDay: 1,
                dayClick: function (date, jsEvent, view) {
                    let today = new Date();
                    let todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2) + 'T' + '00:00';
                    let selected = new Date(date.format());
                    let selectedDate = selected.getFullYear() + '-' + ('0' + (selected.getMonth() + 1)).slice(-2) + '-' + ('0' + selected.getDate()).slice(-2) + 'T' + '00:00';
                    if (selectedDate > todayDate) {
                        $('.eventlist').append('<p><input type="datetime-local" class="event form-control ng-pristine ng-valid ng-touched"/>' +
                            '<button type="button" class="btn btn-danger btn-s removeEvent"><span class="glyphicon glyphicon-trash"></span></button></p>');
                        $('.event').last().val(selectedDate);
                        $('.removeEvent').click(function () {
                            $(this).parent().remove();
                        });
                    } else {
                        alert('Please select Date in the Future');
                    }
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        if (!this.creation && changes.events.currentValue) {
            let events = [];

            for (let i = 0; i < changes.events.currentValue.length; i++) {
                events[i] = {start: changes.events.currentValue[i]};
            }
            ($('#calendar') as any).fullCalendar({
                firstDay: 1,
                events: events
            });
        }
    }
}