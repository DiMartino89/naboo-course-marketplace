import {Component, OnInit} from '@angular/core';
import {Message} from '../../_models/message/message';
import {MessageService} from '../../_services/message/message.service';
import {AlertService} from '../../_services/alert/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '../../translate/translate.service';
import {AuthenticationService} from "../../_services/authentication/authentication.service";

declare const $;

@Component({
    moduleId: module.id,
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.css']
})
export class InboxComponent implements OnInit {
    messages: Message[];
    modal: any;

    messageForm: FormGroup;

    constructor(private _translate: TranslateService,
                private messageService: MessageService,
                private formBuilder: FormBuilder,
                private alertService: AlertService,
                public authService: AuthenticationService) {
        this.messages = null;
    }

    ngOnInit() {
        this.authService.checkIfEnabled();
        if (this.authService.isEnabled) {
            this.updateMessages();
        }

        this.modal = $('#reply-modal');

        this.messageForm = this.formBuilder.group({
            message_id: [0, Validators.required],
            subject: ['', [Validators.required, Validators.maxLength(100)]],
            text: ['', [Validators.required, Validators.maxLength(1000)]]
        });
    }

    archive(id: number) {
        this.messageService.markArchived(id).subscribe(() => {
            this.alertService.success('Message archived.');
            this.updateMessages();
        }, error => {
            this.alertService.error(error.body);
        });
    }

    remove(id: number) {
        if (confirm('Really delete?')) {
            this.messageService.remove(id).subscribe(() => {
                this.alertService.success('Message deleted.');
                this.updateMessages();
            }, error => {
                this.alertService.error(error.body);
            });
        }
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

    private updateMessages() {
        this.messageService.getReceived().subscribe((messages: Message[]) => {
            this.messages = messages;
        });
    }
}
