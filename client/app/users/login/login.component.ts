import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService, AuthenticationService} from '../../_services/index';
import {TranslateService} from "../../translate/translate.service";

@Component({
    moduleId: module.id,
    styleUrls: ['./login.css'],
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private _translate: TranslateService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            stay_loggedIn: true
        });
    }

    login() {
        let user: any = this.loginForm.value;
        this.authenticationService.login(user.email, user.password, user.stay_loggedIn)
            .subscribe(
                data => {
                    this.router.navigate(['/']);
                    location.reload();
                },
                error => {
                    if (error.status == 404) {
                        this.alertService.error(this._translate.instant('Email oder Passwort nicht korrekt!'));
                    }
                });
    }
}
