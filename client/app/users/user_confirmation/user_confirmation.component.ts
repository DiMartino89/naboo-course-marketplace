﻿import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {AlertService, UserService} from '../../_services/index';


@Component({
    moduleId: module.id,
    styleUrls: ['./user_confirmation.css'],
    templateUrl: 'user_confirmation.component.html'
})

export class UserConfirmationComponent implements OnInit {
    userId: string;

    constructor(private userService: UserService,
                private alertService: AlertService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userId = params['id'];
        });
        setTimeout(this.enableUser(this.userId), 5000);
    }

    private enableUser(user_id: string) {
        let user: any = {};
        user._id = user_id;
        user.enabled = true;
        let date = new Date();
        user.updatedAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
        this.userService.update(user).subscribe(
            user => {
                this.alertService.success('Account successfully activated', true);
                this.router.navigate(['/']);
            },
            error => {
                this.alertService.error(error._body, true);
                this.router.navigate(['/registration']);
            });
    }
}