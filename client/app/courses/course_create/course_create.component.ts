import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Params, Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select2OptionData} from 'ng2-select2';
import {User, Course} from '../../_models/index';
import {
    AuthenticationService,
    UserService,
    CourseService,
    CategoryService,
    AlertService,
    DataService
} from '../../_services/index';
import {ArrayNotEmptyValidator} from "../../_helpers/arrayNotEmptyValidator/array-not-empty.validator";
import {TranslateService} from "../../translate/translate.service";

declare var $: any;

@Component({
    moduleId: module.id,
    styleUrls: ['./course_create.css'],
    templateUrl: 'course_create.component.html'
})

export class CreateCourseComponent implements OnInit {
    createCourseForm: FormGroup;

    currentUser: any = {};
    users: User[] = [];

    course: any = {};
    courseId: any;

    public categories: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];

    deleteFiles: any = [];

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cdRef: ChangeDetectorRef,
                private _translate: TranslateService,
                private dataService: DataService,
                private userService: UserService,
                private courseService: CourseService,
                private categoryService: CategoryService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
            });
        }
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.courseId = params['id'];
        });

        this.createCourseForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(63)]],
            description: ['', [Validators.maxLength(500)]],
            categories: [[], ArrayNotEmptyValidator()],
            link: '',
            price: [0, Validators.required],
            duration: 0,
            maxMembers: [0, Validators.required]
        });

        this.categories = this.categoryService.getCategoriesList();

        this.options = {
            multiple: true,
            closeOnSelect: false
        };

        if (this.courseId) {
            this.courseService.getById(this.courseId).subscribe((course) => {
                    this.course = course;
                    this.cdRef.detectChanges();
                    this.setValuesFromCourse(this.course);
                },
                error => {
                    this.alertService.error(error.body);
                });
        }
    }

    createCourse() {
        //Create New Course
        if (!this.courseId) {
            if (this.datesValid($('.signin_deadline').val())) {
                const course = this.createCourseForm.value;
                course.latitude = this.dataService.latitude;
                course.longitude = this.dataService.longitude;
                course.owner = this.currentUser._id;
                course.titleImage = this.dataService.titleImage;
                course.pictures = this.dataService.pictures.split(',').slice(0, -1);
                course.signInDeadline = $('.signin_deadline').val();
                course.members = [];
                course.reviews = [];
                course.rating = 0;
                course.appointments = [];
                for (let i = 0; i < $('.event').length; i++) {
                    course.appointments[i] = $('.event').get(i).value;
                }
                let date = new Date();
                course.createdAt = this.changeDateFormat(date);
                course.updatedAt = this.changeDateFormat(date);

                this.courseService.create(course).subscribe(course => {
                    this.alertService.success(this._translate.instant('Kurs erfolgreich erstellt!'), true);
                    this.currentUser.courses.push(course._id);
                    this.userService.update(this.currentUser).subscribe(() => {
                    });
                    this.router.navigate(['/course', course._id]);
                });
            }
            //Edit Course
        } else {
            if (this.datesValid($('.signin_deadline').val())) {
                this.courseService.getById(this.courseId).subscribe((course) => {
                    course = this.createCourseForm.value;
                    course._id = this.courseId;
                    course.latitude = this.dataService.latitude;
                    course.longitude = this.dataService.longitude;
                    course.titleImage = this.dataService.titleImage;
                    course.signInDeadline = $('.signin_deadline').val();
                    course.pictures = this.dataService.pictures.split(',').slice(0, -1);
                    for (let i = 0; i < this.deleteFiles.length; i++) {
                        let index = course.pictures.indexOf(this.deleteFiles[i]);
                        course.pictures.splice(index, 1);
                    }
                    course.appointments = [];
                    for (let i = 0; i < $('.event').length; i++) {
                        course.appointments[i] = $('.event').get(i).value;
                    }
                    let date = new Date();
                    course.updatedAt = this.changeDateFormat(date);

                    this.courseService.update(course).subscribe(() => {
                        this.alertService.success(this._translate.instant('Kurs erfolgreich aktualisiert!'), true);
                        this.router.navigate(['/course', this.courseId]);
                    });
                });
            }
        }
    }

    private setValuesFromCourse(course: Course) {
        Object.keys(course).forEach((key) => {
            if (course[key] && this.createCourseForm.get(key)) {
                this.createCourseForm.get(key).setValue(course[key]);
            } else {
                if (key === 'titleImage') {
                    this.dataService.titleImage = course[key];
                }
                if (key === 'pictures') {
                    for (let i = 0; i < course[key].length; i++) {
                        this.dataService.pictures += course[key][i] + ',';
                    }
                }
                if (key === 'latitude') {
                    this.dataService.latitude = course[key];
                }
                if (key === 'longitude') {
                    this.dataService.longitude = course[key];
                }
                if (key === 'signInDeadline') {
                    $('.signin_deadline').val(course[key]);
                }
                if (key === 'appointments') {
                    for (let i = 0; i < course[key].length; i++) {
                        $('.eventlist').append('<p><input type="datetime-local" class="event form-control ng-pristine ng-valid ng-touched"/>' +
                            '<button type="button" class="btn btn-danger btn-s removeEvent"><span class="glyphicon glyphicon-trash"></span></button></p>');
                        $('.event').last().val(course[key][i]);
                        $('.removeEvent').click(function () {
                            $(this).parent().remove();
                        });
                    }
                }
            }
        });

        this.cdRef.detectChanges();
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }

    removeTitleImage() {
        this.dataService.titleImage = '';
        $('.image-preview').remove();
    }

    removePicture(file: string, index: number) {
        this.deleteFiles.push(file);
        $('.image-preview' + index).remove();
    }

    datesValid(value: string) {
        for (let i = 0; i < $('.event').length; i++) {
            if ($('.event').get(i).value < value) {
                return false;
            } else {
                return true;
            }
        }
    }
}