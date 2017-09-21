import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../_services/authentication/authentication.service";
import {UserService} from "../../_services/user/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    moduleId: module.id,
    styleUrls: ['./single_chat.css'],
    templateUrl: 'single_chat.component.html'
})

export class SingleChatComponent implements OnInit {
    currentUser: any = {};
    userId: any;
    user: any = {};

    messages: any = [];
    messagesLength: number = 0;
    difference: number = 0;

    messageForm: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private userService: UserService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
                Object.keys(user.messages).forEach((key) => {
                    if (user.messages[key] && this.userId) {
                        this.messages = user.messages[key];
                    }
                });

                Object.keys(user.messages).forEach((key) => {
                    for (let i = 0; i < user.messages[key].length; i++) {
                        this.messagesLength++;
                    }
                });

                this.difference = this.messagesLength - parseInt(JSON.parse(localStorage.getItem(user._id + '_messages')));

                if (this.difference > 0) {
                    localStorage.setItem(user._id + '_messages', JSON.stringify(this.messagesLength));
                }
            });
        }
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userId = params['id'];
        });
        this.userService.getById(this.userId)
            .subscribe(
                user => {
                    this.user = user;
                });

        this.messageForm = this.formBuilder.group({
            from: this.currentUser._id,
            text: ['', Validators.required],
            createdAt: this.changeDateFormat(new Date())
        });
    }

    sendMessage() {
        this.userService.getById(this.userId).subscribe(user => {
            const message = this.messageForm.value;
            message.from = this.currentUser._id;
            if (user.messages[this.currentUser._id] != null) {
                user.messages[this.currentUser._id].push(message);
            } else {
                user.messages[this.currentUser._id] = [message];
            }
            this.userService.update(user).subscribe(() => {
            });
            if (this.currentUser.messages[this.userId] != null) {
                this.currentUser.messages[this.userId].push(message);
            } else {
                this.currentUser.messages[this.userId] = [message];
            }
            this.userService.update(this.currentUser).subscribe(() => {
            });
            localStorage.setItem(this.currentUser._id + '_messages', JSON.stringify(this.messagesLength++));
        });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}