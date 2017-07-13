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
            'email': ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
			'email_repeat': ['', [Validators.required, MatchOtherValidator('email')]],
			'name': ['', Validators.maxLength(63)],
            'password': ['', [Validators.required, Validators.minLength(8)]],
           
        });
	}
	
	register() {
		var user: any = {};
		user = this.registrationForm.value;		
		
		delete user.email_repeat;
		
		user.enabled = false;
		user.role = 'user';
		user.description = '';
		user.avatar = 'app/_assets/images/default-avatar.png';
		user.titleImage = 'app/_assets/images/default-titleImage.png';
		user.pictures = [];
		user.courses = [];
		user.friendRequests = [];
		user.friends = [];
		user.reviews = [];
		user.rating = 0;
		var date = new Date();
		user.createdAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth()+1)).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		user.updatedAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth()+1)).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		
        this.userService.create(user)
            .subscribe(
                data => {
					this.alertService.success('Registration successful! To use course features please confirm your email!', true);
					this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error('Registration failed! A user with email ' + user.email + ' may already exist!');
                });
    }
	
	isValid() {
        return this.registrationForm.valid;
    }
}
