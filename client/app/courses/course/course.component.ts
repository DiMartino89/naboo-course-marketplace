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

    image: any;
    imageModal: any;

    reviewModal: any;

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
                    this.courseOwner = course.owner;
                });

        this.reviewForm = this.formBuilder.group({
            rating: [0, Validators.required],
            description: ['', [Validators.maxLength(500), Validators.required]]
        });

        this.imageModal = $('#image-modal');
        this.reviewModal = $('#review-modal');
    }

    bookCourse() {
        this.courseService.getById(this.courseId)
            .subscribe(
                course => {
                    course.members.push(this.currentUser);
                    this.courseService.update(course).subscribe(() => {
                            this.alertService.success('Course-Booking successful', true);
                        },
                        error => {
                            this.alertService.error(error._body);
                        });
                });
    }

    cancelCourse() {
        this.courseService.getById(this.courseId)
            .subscribe(
                course => {
                    course.members.splice(this.currentUser, 1);
                    this.courseService.update(course).subscribe(() => {
                            this.alertService.success('Course-Booking successful', true);
                        },
                        error => {
                            this.alertService.error(error._body);
                        });
                });
    }

    reviewCourse() {
        this.courseService.getById(this.courseId)
            .subscribe(
                course => {
                    if(course.reviews.indexOf(this.currentUser._id)) {
                        const review = this.reviewForm.value;
                        review.user = this.currentUser;
                        let date = new Date();
                        review.createdAt = this.changeDateFormat(date);
                        review.updatedAt = this.changeDateFormat(date);
                        this.reviewService.create(review).subscribe(review => {
                                course.rating += (review.rating / course.reviews.length);
                                course.reviews.push(review);
                                this.courseService.update(course).subscribe(() => {
                                        this.alertService.success('Course-Rating successful', true);
                                    },
                                    error => {
                                        this.alertService.error(error._body);
                                    });
                            },
                            error => {
                                this.alertService.error(error._body);
                            });
                    } else {
                        this.alertService.error('You already rated the course!');
                    }
                });
    }

    isValid() {
        return this.reviewForm.valid;
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

    openReviewModal() {
        this.reviewModal.modal('show');
    }

    closeReviewModal() {
        this.reviewModal.modal('hide');
    }
}