import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../_services/authentication/authentication.service";
import {UserService} from "../../_services/user/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    styleUrls: ['./messages.css'],
    moduleId: module.id,
    templateUrl: 'messages.component.html'
})

export class MessagesComponent implements OnInit {
    currentUser: any = {};

    messages: any = [];
    messagesLength: number = 0;
    difference: number = 0;
    users: any = [];

    constructor(private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private authenticationService: AuthenticationService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
                Object.keys(user.messages).forEach((key) => {
                    this.messages.push(key);
                    this.userService.getById(key).subscribe(user => {
                       this.users.push(user.name);
                    });
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

    }
}