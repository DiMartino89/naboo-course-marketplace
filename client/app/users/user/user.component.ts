import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationStart} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserService, CourseService, AlertService} from '../../_services/index';
import {ReviewService} from "../../_services/review/review.service";
import {User} from "../../_models/user/user";

declare var $: any;

@Component({
    styleUrls: ['./user.css'],
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
    currentUser: any = {};
    user: any = {};
    userId: string;
    users: any;

    requester: any;
    receiver: any;

    image: any;
    imageModal: any;

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private courseService: CourseService,
                private alertService: AlertService,
                private reviewService: ReviewService,
                private activatedRoute: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private router: Router) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
            });
        }

        router.events.subscribe((evt) => {
            if (evt instanceof NavigationStart && this.imageModal && this.imageModal.is(':visible')) {
                this.imageModal.modal('hide');
            }
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userId = params['id'];
        });
        this.userService.getById(this.userId)
            .subscribe(
                user => {
                    this.user = user;
                });

        this.imageModal = $('#image-modal');
    }

    changeDateFormat(dateInput: any) {
        var date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }

    openImageModal(image: any) {
        this.image = '/uploads/' + image;
        this.imageModal.modal('show');
    }

    closeImageModal() {
        this.imageModal.modal('hide');
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
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
		this.receiver = this.userService.getById(this.currentUser._id);
		this.requester = this.userService.getById(_id);
		this.receiver.friends.push(this.requester._id);
		this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
		this.requester.friends.push(this.receiver._id);
		this.userService.update(this.requester).subscribe(() => { this.loadAllUsers(); });
	}

	refuseFriendRequest(_id: string) {
		this.receiver = this.userService.getById(this.currentUser._id);
		this.requester = this.userService.getById(_id);
		this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
	}

	removeFriend(_id: string) {
		this.receiver = this.userService.getById(_id);
		this.requester = this.userService.getById(this.currentUser._id);
		this.receiver.friends.splice(this.receiver.friends.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => { this.loadAllUsers(); });
		this.requester.friends.splice(this.requester.friends.indexOf(this.receiver._id), 1);
		this.userService.update(this.requester).subscribe(() => { this.loadAllUsers(); });
	}
}