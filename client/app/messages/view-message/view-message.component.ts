import {Component, OnInit} from '@angular/core';
import {Message} from '../../_models/message/message';
import {MessageService} from '../../_services/message/message.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AlertService} from '../../_services/alert/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {TranslateService} from '../../translate/translate.service';
import {DataService} from '../../_services/data/data.service';
import {AppConfig} from '../../app.config';

declare const $;

@Component({
    moduleId: module.id,
    selector: 'app-view-message',
    templateUrl: './view-message.component.html',
    styleUrls: ['./view-message.css']
})
export class ViewMessageComponent implements OnInit {
    message: Message;

    modal: any;

    messageForm: FormGroup;

    constructor(private _translate: TranslateService, private messageService: MessageService,
                private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
                private alertService: AlertService, public authService: AuthenticationService,
                public dataService: DataService, public config: AppConfig) {
        this.message = null;


    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const messageId = parseInt(params['id'], 10);

            this.messageService.getById(messageId).subscribe((message: Message) => {
                this.message = message;

                if (!this.message.read) {
                    this.messageService.markRead(this.message.id).subscribe(() => {
                    }, error => {
                        this.alertService.error(error.body);
                    });
                }
            });
        });

        this.modal = $('#reply-modal');

        this.messageForm = this.formBuilder.group({
            message_id: [0, Validators.required],
            subject: ['', [Validators.required, Validators.maxLength(100)]],
            text: ['', [Validators.required, Validators.maxLength(1000)]]
        });

        this.messageService.checkForNewMessages();
    }

    openMessageModal(message: Message) {
        this.messageForm.get('message_id').setValue(message.id);
        this.messageForm.get('subject').setValue(`RE: ${message.subject}`);
        this.modal.modal('show');
    }

    sendMessage() {
        this.messageService.send(this.messageForm.value).subscribe(() => {
            this.modal.modal('hide');
            this.alertService.success(this._translate.instant('Nachricht erfolgreich versandt!'));
        }, error => {
            this.alertService.error(error.body);
        });
    }
}
