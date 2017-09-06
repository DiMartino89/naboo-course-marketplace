import {Component, OnInit} from '@angular/core';
import {Message} from '../../_models/message/message';
import {MessageService} from '../../_services/message/message.service';
import {AlertService} from '../../_services/alert/alert.service';
import {AuthenticationService} from "../../_services/authentication/authentication.service";

@Component({
    moduleId: module.id,
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.css']
})
export class ArchiveComponent implements OnInit {
    messages: Message[];

    constructor(private messageService: MessageService,
                private alertService: AlertService,
                public authService: AuthenticationService) {
        this.messages = null;
    }

    ngOnInit() {
        this.authService.checkIfEnabled();
        if (this.authService.isEnabled) {
            this.updateMessages();
        }
    }

    unArchive(id: number) {
        this.messageService.markArchived(id, false).subscribe(() => {
            this.alertService.success('Message un-archived.');
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

    private updateMessages() {
        this.messageService.getArchived().subscribe((messages: Message[]) => {
            this.messages = messages;
        });
    }
}
