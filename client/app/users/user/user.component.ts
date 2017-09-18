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

    userCourses: any = [];

    requester: any;
    receiver: any;

    image: any;
    imageModal: any;

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private alertService: AlertService,
                private reviewService: ReviewService,
                private activatedRoute: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private router: Router,
                public courseService: CourseService) {
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
                    for(let i=0; i < user.courses.length; i++) {
                        this.courseService.getById(user.courses[i]).subscribe(course => {
                            this.userCourses.push(course);
                        });
                    }
                    if (user._id != this.currentUser._id) {
                        this.userService.addViewedUser(this.currentUser._id, user._id);
                    }
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

	sendFriendRequest(user: User) {
		this.receiver = user;
		this.receiver.friendRequests.push(this.currentUser._id);
		this.userService.update(this.receiver).subscribe(() => { this.alertService.success('Successfully sent Friendrequest'); });
	}

	cancelFriendRequest(user: User) {
		this.receiver = user;
		this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.currentUser._id), 1);
		this.userService.update(this.receiver).subscribe(() => {});
	}

	removeFriend(user: User) {
		this.receiver = user;
		this.requester = this.currentUser;
		this.receiver.friends.splice(this.receiver.friends.indexOf(this.requester._id), 1);
		this.userService.update(this.receiver).subscribe(() => {});
		this.requester.friends.splice(this.requester.friends.indexOf(this.receiver._id), 1);
		this.userService.update(this.requester).subscribe(() => { this.alertService.success('Removed this user as a friend.'); });
	}
}