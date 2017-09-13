import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService, AlertService, AuthenticationService } from './_services/index';
import { User } from './_models/index';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent {
	currentUser: any = {};
	
	constructor(
		private router: Router,
		private userService: UserService,
		private authenticationService: AuthenticationService,
		private alertService: AlertService) { 
			if (this.authenticationService.userLoggedIn("user_token") != null) {
				this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => { this.currentUser = user; });
			}
		}
	
	showPanel() {
		(<HTMLElement>document.getElementById('naboo-user-panel')).classList.toggle('active');
	}
	
	private logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
		this.alertService.success('Erfolgreich ausgeloggt!', true);
	}
	
	isLoggedIn() {
		if (this.authenticationService.userLoggedIn("user_token") != null) {
			return true;
		} else {
			return false;
		}
	}

	private showSub(classname: string, selector: string) {
		$(classname).slideToggle();
        $(selector).toggleClass('active');
	}
}