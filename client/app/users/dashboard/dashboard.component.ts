import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user/user.service';
import { AlertService } from '../../_services/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../app.config';
import { CourseService } from "../../_services/course/course.service";
import { Course } from "../../_models/course/course";
import { AuthenticationService } from "../../_services/authentication/authentication.service";
import { MessageService } from "../../_services/message/message.service";
import { Message } from "../../_models/message/message";
import { DataService } from "../../_services/data/data.service";

@Component({
    moduleId: module.id,
    selector: 'app-view-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
    currentUser: any = {};
    userId: number;

    courses: Course[];
    viewedCourses: Course[];

    inboxMessages: Message[];
    outboxMessages: Message[];
    messageForm: FormGroup;
    messageModal: any;

    constructor(private userService: UserService,
                private alertService: AlertService,
                private courseService: CourseService,
                private messageService: MessageService,
                public authenticationService: AuthenticationService,
                private dataService: DataService,
                private formBuilder: FormBuilder,
                private config: AppConfig) {
        this.inboxMessages = null;
        this.outboxMessages = null;
        this.viewedCourses = [];

        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
            });
        }
    }

    ngOnInit() {
        this.authenticationService.checkIfEnabled();
        if (this.authenticationService.isEnabled) {
            this.updateInboxMessages();
            this.updateOutboxMessages();
        }

        this.messageModal = $('#send-message-modal');
        this.messageForm = this.formBuilder.group({
            offer_id: [0, Validators.required],
            subject: ['', [Validators.required, Validators.maxLength(100)]],
            text: ['', [Validators.required, Validators.maxLength(1000)]]
        });
    }

    private updateInboxMessages() {
        this.messageService.getReceived().subscribe((messages: Message[]) => {
            this.inboxMessages = messages;
        });
    }

    private updateOutboxMessages() {
        this.messageService.getSent().subscribe((messages: Message[]) => {
            this.outboxMessages = messages;
        });
    }

    openMessageModal(course: Course) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.messageForm.get('course_id').setValue(course._id);
            this.messageForm.get('subject').setValue(`Anfrage zu "${course.name}"`);
            this.messageModal.modal('show');
        }
    }

    sendMessage() {
        this.messageService.send(this.messageForm.value).subscribe(() => {
            this.messageModal.modal('hide');
            this.alertService.success('Nachricht erfolgreich versandt!');
        }, error => {
            this.alertService.error(error._body);
        });
    }
}
