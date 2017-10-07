import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../_services/authentication/authentication.service";
import {UserService} from "../../_services/user/user.service";

@Component({
    moduleId: module.id,
    styleUrls: ['./messages.css'],
    templateUrl: 'messages.component.html'
})

export class MessagesComponent implements OnInit {
    currentUser: any = {};

    messages: any = [];
    messagesLength: number = 0;
    difference: number = 0;
    chatNames: any = [];
	chatAvatars: any = [];

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
                Object.keys(user.messages).forEach((key) => {
					//alert(JSON.stringify());
					this.messages.push(key);
                    this.userService.getById(key).subscribe(user => {
						let userObj = {name: user.name, avatar: user.avatar};
                        this.chatNames.push(user.name);
						this.chatAvatars.push(user.avatar);
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
	
	/*sortMessages(property1,property2) {
		return function (a,b) {
			let result = (a[property1][property2] < b[property1][property2]) ? -1 : (a[property1][property2] > b[property1][property2]) ? 1 : 0;
			return result * 1;
		}
	}*/
	
	formatDate(dateInput: any) {
        let date = new Date(dateInput);
        return [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join(
            '-') + 'T' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}