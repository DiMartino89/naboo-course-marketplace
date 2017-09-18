import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationStart} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserService, CourseService, AlertService} from '../../_services/index';
import {ReviewService} from "../../_services/review/review.service";

declare var $: any;
declare var Circles: any;

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

    image: any;
    imageModal: any;
    reviewModal: any;

    messageModal: any;

    today: Date;

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private courseService: CourseService,
                private alertService: AlertService,
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
                    if (course.owner !== this.currentUser._id) {
                        this.courseService.addViewedCourse(this.currentUser._id, this.courseId);
                    }
                    let members = course.members ? ((course.members.length * 100)/course.maxMembers) : 0;
                    Circles.create({
                        id:           'circles-4',
                        radius:       60,
                        value:        members,
                        maxValue:     100,
                        width:        10,
                        text:         function(value){return value + '%';},
                        colors:       ['#FFF', '#3A87AD'],
                        duration:     400,
                        wrpClass:     'circles-wrp',
                        textClass:    'circles-text',
                        styleWrapper: true,
                        styleText:    true
                    });
                });

        this.reviewForm = this.formBuilder.group({
            rating: [0, Validators.required],
            description: ['', [Validators.required, Validators.maxLength(500)]],
            createdAt: this.changeDateFormat(new Date())
        });

        this.messageModal = $('#send-message-modal');
        this.imageModal = $('#image-modal');
        this.reviewModal = $('#review-modal');

        this.today = new Date();
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

    reviewCourse() {
        this.courseService.getById(this.courseId).subscribe(course => {
            if (!course.reviews.includes(this.currentUser._id)) {
                const review = this.reviewForm.value;
                review.user = this.currentUser._id;
                course.rating += (review.rating / (course.reviews.length + 1));
                course.reviews.push(review);
                this.courseService.update(course).subscribe(() => {});
                this.reviewModal.modal('hide');
            } else {
                this.alertService.error('You already rated the course!');
            }
        });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
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

    openReviewModal() {
        this.reviewModal.modal('show');
    }

    closeReviewModal() {
        this.reviewModal.modal('hide');
    }
}