import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchOtherValidator } from '../../_helpers/index';
import { AuthenticationService, AlertService, UserService } from '../../_services/index';

@Component({
	styleUrls: ['./register.css'],
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent implements OnInit {
	registrationForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
				private router: Router,
				private userService: UserService,
				private alertService: AlertService,
				private authenticationService: AuthenticationService) { }
		
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
		var user: any = {};
		user = this.registrationForm.value;		
		
		delete user.email_repeat;

        this.userService.create(user)
            .subscribe(
                data => {
					this.alertService.success('Registration successful! To use course features please confirm your email!', true);
					this.authenticationService.login(user.email, user.password, false)
                        .subscribe(
							data => {
								this.router.navigate(['/']);
								location.reload();
							},
							error => {
								if(error.status == 404) {
									this.alertService.error('Email or Password is incorrect.');
								}
							});
                },
                error => {
                    this.alertService.error('Registration failed! A user with email ' + user.email + ' may already exist!');
                });
    }

	changeDateFormat(dateInput: any) {
		var date = new Date(dateInput);
		return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
				'.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
	}
}
