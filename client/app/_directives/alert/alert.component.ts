import {Component, Input, OnInit} from '@angular/core';

import { AlertService } from '../../_services/index';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
    @Input() text: string;
    @Input() type: string;
    @Input() headline: string;

    @Input() service = false;

    constructor(private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.service === true) {
            this.alertService.getMessage().subscribe((message) => {
                if (message) {
                    this.text = message.text;
                    this.type = message.type;
                    this.headline = null;

                    $('.alerts').get(0).scrollIntoView();
                }
            });
        }
    }
}