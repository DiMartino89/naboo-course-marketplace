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

    constructor(private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private authenticationService: AuthenticationService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
                Object.keys(user.messages).forEach((key) => {
                    this.messages.push(key);
                });
            });
        }
    }

    ngOnInit() {

    }
}