import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatchOtherValidator} from '../../_helpers/index';
import {AuthenticationService, AlertService, UserService,} from '../../_services/index';
import {TranslateService} from "../../translate/translate.service";

@Component({
    moduleId: module.id,
    styleUrls: ['./register.css'],
    templateUrl: 'register.component.html'
})

export class RegisterComponent implements OnInit {
    registrationForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private _translate: TranslateService,
                private userService: UserService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.registrationForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
            email_repeat: ['', [Validators.required, MatchOtherValidator('email')]],
            name: ['', Validators.maxLength(63)],
            password: ['', [Validators.required, Validators.minLength(8)]],
            enabled: false,
            description: '',
            avatar: '',
            titleImage: '',
            pictures: [[]],
            courses: [[]],
            bookedCourses: [[]],
            friendRequests: [[]],
            friends: [[]],
            messages: [{}],
            createdAt: this.changeDateFormat(new Date()),
            updatedAt: this.changeDateFormat(new Date())
        });
    }

    register() {
        let user: any = {};
        user = this.registrationForm.value;

        delete user.email_repeat;

        this.userService.create(user)
            .subscribe(
                data => {
                    this.alertService.success(this._translate.instant('Registration successful! To use course features please confirm your email!'), true);
                    this.authenticationService.login(user.email, user.password, false)
                        .subscribe(
                            data => {
                                this.router.navigate(['/']);
                                location.reload();
                                localStorage.setItem(this.authenticationService.getUserParam('user_id') + '_messages', JSON.stringify(0));
                            },
                            error => {                               
                                this.alertService.error(this._translate.instant('Email oder Passwort nicht korrekt!'));
								$('alert').first().hide();
                            });
                },
                error => {
                    this.alertService.error(this._translate.instant('Registrierung fehlgeschlagen! Ein Nutzer mit der Email ') + user.email + this._translate.instant(' existiert möglicherweise bereits!'));
                });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}