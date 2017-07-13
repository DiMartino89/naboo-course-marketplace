import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../_models/index';
import { AuthenticationService, AlertService, UserService } from '../../_services/index';

declare var $: any;

@Component({
	styleUrls: ['./user.css'],
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
	userForm: FormGroup;

    currentUser: any = {};
	currentProfile: any = {};
	userId: string;
	users: User[] = [];
	
	receiver: any = {};
	requester: any = {};
	
	newAvatar: any;
	newPictures: any[];

    constructor(private formBuilder: FormBuilder,
				private userService: UserService,				
				private alertService: AlertService, 
				private activatedRoute: ActivatedRoute,
				private authenticationService: AuthenticationService,
				private router: Router) {
					if (this.authenticationService.userLoggedIn("user_token") != null) {
						this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => { this.currentUser = user; });
					}
				}

    ngOnInit() {
		this.loadAllUsers();
		this.activatedRoute.params.subscribe((params: Params) => {
			this.userId = params['id'];
		});
		
		this.userService.getById(this.userId)
			.subscribe(
				user => { 
					this.currentProfile = user; 
					this.setValuesFromUser(this.currentProfile);
				});
		
		this.userForm = this.formBuilder.group({
            name: ['', [Validators.minLength(3), Validators.maxLength(63)]],
            description: ['', [Validators.maxLength(500)]],
			file_avatar: '',
			default_avatar: '',
			file_titleImage: '',
			default_titleImage: ''
        });
    }
	
	/* USER STUFF */
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }	
	
	private getUserById(userId: string) {
		this.userService.getById(userId).subscribe(user => { this.currentProfile = user; });
	}	
	
	deleteUser(userId: string) {
        this.userService.delete(userId).subscribe(() => { this.loadAllUsers(); });
    }
	
	sendFriendRequest(user: User) {
		this.receiver = user;
		this.receiver.friendRequests.push(this.currentUser._id);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
	}
	
	cancelFriendRequest(user: User) {
		this.receiver = user;
		this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.currentUser._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
	}
	
	acceptFriendRequest(_id: string) {
		this.receiver = this.getUserById(this.currentUser._id);	
		this.requester = this.getUserById(_id);
		this.receiver.friends.push(this.requester._id);
		this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
		this.requester.friends.push(this.receiver._id);
		this.userService.update(this.requester).subscribe(() => { this.loadAllUsers(); });
	}
	
	refuseFriendRequest(_id: string) {
		this.receiver = this.getUserById(this.currentUser._id);
		this.requester = this.getUserById(_id);
		this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
	}
	
	removeFriend(_id: string) {
		this.receiver = this.getUserById(_id);
		this.requester = this.getUserById(this.currentUser._id);
		this.receiver.friends.splice(this.receiver.friends.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
		this.requester.friends.splice(this.requester.friends.indexOf(this.receiver._id), 1);
		this.userService.update(this.requester).subscribe(() => { this.loadAllUsers(); });
	}
	
	updateUser() {
		var user: any = this.userForm.value;
		user._id = this.userId;
		user.avatar = (<HTMLInputElement>document.getElementById('preview-avatar')).src;
		user.titleImage = (<HTMLInputElement>document.getElementById('preview-titleImage')).src
			
		var date = new Date();
		user.updatedAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth()+1)).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
		
		delete user.file_avatar;
		delete user.default_avatar;
        delete user.file_titleImage;
		delete user.default_titleImage;
		
		this.userService.update(user).subscribe(
			user => { 
				this.alertService.success('User successfully updated', true);
				this.loadAllUsers();
			},
			response => {
                this.alertService.error(response.body);
            });
    }
	
	setAvatar(event: EventTarget) {
		let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let file: File = files[0];
		
		var reader = new FileReader();
		
		reader.onloadend = function () {
			var binaryString = reader.result;
			(<HTMLInputElement>document.getElementById('preview-avatar')).src = 'data:' + file.type + ';base64,' + btoa(binaryString);
		};
		reader.readAsBinaryString(file);
	}
	
	setDefaultAvatar() {
		if(this.userForm.get('default_avatar').value == true) {
			(<HTMLInputElement>document.getElementById('preview-avatar')).src = 'app/_assets/images/default-avatar.png';
		} else {
			(<HTMLInputElement>document.getElementById('preview-avatar')).src = this.currentUser.avatar;
		}
	}
	
	setTitleImage(event: EventTarget) {
		let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let file: File = files[0];
		
		var reader = new FileReader();
		
		reader.onloadend = function () {
			var binaryString = reader.result;
			(<HTMLInputElement>document.getElementById('preview-titleImage')).src = 'data:' + file.type + ';base64,' + btoa(binaryString);
		};
		reader.readAsBinaryString(file);
	}
	
	setDefaultTitleImage() {
		if(this.userForm.get('default_titleImage').value == true) {
			(<HTMLInputElement>document.getElementById('preview-titleImage')).src = 'app/_assets/images/default-titleImage.png';
		} else {
			(<HTMLInputElement>document.getElementById('preview-titleImage')).src = this.currentUser.titleImage;	
		}
	}
	
	private setValuesFromUser(user: any) {
        Object.keys(user).forEach((key) => {
            if (user[key] && this.userForm.get(key)) {
                this.userForm.get(key).setValue(user[key]);
            }
        });
    }
	
	edit() {
		(<HTMLElement>document.getElementById('profile-update')).className += " active";
		(<HTMLElement>document.getElementById('naboo-content')).style.height = '1715px';
	}
	
	close() {
		(<HTMLElement>document.getElementById('profile-update')).classList.remove("active");
		(<HTMLElement>document.getElementById('naboo-content')).style.height = 'auto';
	}
	
	isValid() {
        return this.userForm.valid;
    }
}