import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationStart} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserService, CourseService, AlertService} from '../../_services/index';
import {ReviewService} from "../../_services/review/review.service";

declare var $: any;

@Component({
    styleUrls: ['./course.css'],
    moduleId: module.id,
    templateUrl: 'course.component.html'
})

export class CourseComponent implements OnInit {
    reviewForm: FormGroup;

    currentUser: any = {};
    courseOwner: any = {};
    course: any = {};
    courseId: string;

    courseMembers: any = [];
    courseReviews: any = [];

    image: any;
    imageModal: any;
    reviewModal: any;

    messageForm: FormGroup;
    messageModal: any;

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
            if (evt instanceof NavigationStart && this.reviewModal && this.reviewModal.is(':visible')) {
                this.reviewModal.modal('hide');
            }
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.courseId = params['id'];
        });
        this.courseService.getById(this.courseId)
            .subscribe(
                course => {
                    this.course = course;
                    this.userService.getById(course.owner).subscribe(user => {
                        this.courseOwner = user;
                    });
                    for (let i = 0; i < course.members.length; i++) {
                        this.userService.getById(course.members[i]).subscribe(user => {
                            this.courseMembers.push(user);
                        });
                    }
                    for (let i = 0; i < course.reviews.length; i++) {
                        this.reviewService.getById(course.reviews[i]).subscribe(review => {
                            this.courseReviews.push(review);
                        });
                    }
                    if (course.owner !== this.currentUser._id) {
                        this.courseService.addViewedCourse(this.currentUser._id, this.courseId);
                    }
                });

        this.messageForm = this.formBuilder.group({
            from: [this.currentUser._id, Validators.required],
            to: [this.courseOwner._id, Validators.required],
            course: [this.courseId, Validators.required],
            subject: ['', [Validators.required, Validators.maxLength(100)]],
            text: ['', [Validators.required, Validators.maxLength(500)]],
            read: false,
            archived: false,
            createdAt: this.changeDateFormat(new Date())
        });

        this.reviewForm = this.formBuilder.group({
            user: [this.currentUser._id, Validators.required],
            course: [this.courseId, Validators.required],
            rating: [0, Validators.required],
            description: ['', [Validators.required, Validators.maxLength(500)]],
            createdAt: this.changeDateFormat(new Date())
        });

        this.messageModal = $('#send-message-modal');
        this.imageModal = $('#image-modal');
        this.reviewModal = $('#review-modal');
    }

    bookCourse(userId: any) {
        this.currentUser.bookedCourses.push(this.courseId);
        this.userService.update(this.currentUser).subscribe(() => {
        });
        this.courseService.getById(this.courseId)
            .subscribe(
                course => {
                    course.members.push(userId);
                    this.courseService.update(course).subscribe(() => {
                        this.alertService.success('Course-Booking successful', true);
                    });
                });
    }

    cancelCourse(userId: any) {
        this.currentUser.bookedCourses.slice(this.courseId, 1);
        this.userService.update(this.currentUser).subscribe(() => {
        });
        this.courseService.getById(this.courseId)
            .subscribe(
                course => {
                    course.members.slice(userId, 1);
                    this.courseService.update(course).subscribe(() => {
                        this.alertService.success('Course-Booking successful', true);
                    });
                });
    }

    sendMessage() {
        this.userService.getById(this.currentUser._id).subscribe(user => {
            const message = this.messageForm.value;
            user.inboxMessages.push(message);
            this.userService.update(user).subscribe(() => {
            });
        });
    }

    reviewCourse() {
        this.courseService.getById(this.courseId).subscribe(course => {
            if (course.reviews.includes(this.currentUser._id)) {
                const review = this.reviewForm.value;
                this.reviewService.create(review).subscribe(review => {
                    course.rating += (review.rating / course.reviews.length);
                    course.reviews.push(review._id);
                    this.courseService.update(course).subscribe(() => {});
                });
            } else {
                this.alertService.error('You already rated the course!');
            }
        });
    }

    changeDateFormat(dateInput: any) {
        var date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }

    openMessageModal() {
        this.messageModal.modal('show');
    }

    closeMessageModal() {
        this.messageModal.modal('hide');
    }

    openImageModal(image: any) {
        this.image = '/uploads/' + image;
        this.imageModal.modal('show');
    }

    closeImageModal() {
        this.imageModal.modal('hide');
    }

    openReviewModal() {
        this.reviewModal.modal('show');
    }

    closeReviewModal() {
        this.reviewModal.modal('hide');
    }
}