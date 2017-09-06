import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Params, Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select2TemplateFunction, Select2OptionData} from 'ng2-select2';
import {User, Course} from '../../_models/index';
import {
    AuthenticationService,
    UserService,
    CourseService,
    CategoryService,
    AlertService,
    DataService
} from '../../_services/index';
import {MapComponent, UploadComponent} from "../../_directives/index";
import {ArrayNotEmptyValidator} from "../../_helpers/arrayNotEmptyValidator/array-not-empty.validator";

declare var $: any;

@Component({
    styleUrls: ['./course_create.css'],
    moduleId: module.id,
    templateUrl: 'course_create.component.html'
})

export class CreateCourseComponent implements OnInit {
    @ViewChild('uploadComp') uploadComp: any;
    @ViewChild('uploadComp2') uploadComp2: any;

    createCourseForm: FormGroup;

    currentUser: any = {};
    users: User[] = [];

    course: any = {};
    courseId: any;

    public categories: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];
    public current: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cdRef: ChangeDetectorRef,
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
        const course = this.createCourseForm.value;
        course.latitude = this.dataService.latitude;
        course.longitude = this.dataService.longitude;
        course.owner = this.currentUser;
        course.appointments = [];
        for (let i = 0; i < $('.event').length; i++) {
            let eventDate = $('.event').get(i).value;
            course.appointments[i] = eventDate;
        }
        course.titleImage = this.dataService.file;
        course.pictures = this.dataService.files.split(',').slice(0, -1);
        course.signInDeadline = $('.signin_deadline').val();
        course.members = [];
        course.reviews = [];
        course.rating = 0;
        let date = new Date();
        course.createdAt = this.changeDateFormat(date);
        course.updatedAt = this.changeDateFormat(date);

        alert(JSON.stringify(course));
        this.courseService.create(course).subscribe(
            course => {
                this.alertService.success('Course successfully created', true);
                this.currentUser.courses.push(course);
                this.userService.update(this.currentUser).subscribe(() => {
                });
                this.router.navigate(['/course', course._id]);
            },
            error => {
                this.alertService.error(error._body);
            });
        /*} else {
            this.courseService.getById(this.courseId).subscribe((course) => {

                alert('test2');
                this.uploadComp.uploader.uploadAll();
                this.uploadComp2.multipleUploader.uploadAll();

                course = this.createCourseForm.value;
                course.latitude = this.dataService.latitude;
                course.longitude = this.dataService.longitude;
                course.titleImage = this.dataService.file;
                course.pictures = this.dataService.files.split(',').pop();
                course.appointments = [];
                for (let i = 0; i < $('.event').length; i++) {
                    let eventDate = $('.event').get(i).value;
                    course.appointments[i] = eventDate;
                }
                course.signInDeadline = $('.signin_deadline').val();
                let date = new Date();
                course.updatedAt = this.changeDateFormat(date);

                alert(JSON.stringify(course));
                this.courseService.update(course).subscribe(() => {
                    this.alertService.success('Updated Course successfully');
                }, error => {
                    this.alertService.error(error.body);
                });
            });
        }*/
    }

    changeDateFormat(dateInput: any) {
        var date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }

    private setValuesFromCourse(course: Course) {
        Object.keys(course).forEach((key) => {
            if (course[key] && this.createCourseForm.get(key)) {
                this.createCourseForm.get(key).setValue(course[key]);
            } else {
                if (key === 'titleImage') {
                    this.dataService.file = course[key];
                }
                if (key === 'pictures') {
                    for (let i = 0; i < course[key].length; i++) {
                        this.dataService.files += course[key][i] + ',';
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

    removeTitleImage(file: string) {
        this.dataService.file = '';
        function remove() {
            var object;
            object = new ActiveXObject("Scripting.FileSystemObject");
            var f = object.GetFile('../uploads/' + file);
            f.Delete();
        }
    }

    removePicture(file: string, index: number) {
        this.dataService.files.split(',').splice(index, 1);
        function remove() {
            var object;
            object = new ActiveXObject("Scripting.FileSystemObject");
            var f = object.GetFile('../uploads/' + file);
            f.Delete();
        }
    }

    isValid() {
        return this.createCourseForm.valid;
    }

    filesValid() {
        if ($('.course-titleImage').length > 0 && $('.course-titleImage').val().length == 0 || $('.course-pictures').length > 0 && $('.course-pictures').val().length == 0) {
            return false;
        } else {
            return true;
        }
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