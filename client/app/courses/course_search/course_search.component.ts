import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationStart} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserService, CourseService, AlertService} from '../../_services/index';
import {ReviewService} from "../../_services/review/review.service";
import {CategoryService} from "../../_services/category/category.service";
import {Select2OptionData} from "ng2-select2";
import {NouisliderComponent} from 'ng2-nouislider';
import {Course} from "../../_models/course/course";

declare var $: any;

@Component({
    styleUrls: ['./course_search.css'],
    moduleId: module.id,
    templateUrl: 'course_search.component.html'
})

export class SearchCourseComponent implements OnInit {

    @ViewChild('sliderRef') sliderRef: NouisliderComponent;

    searchForm: FormGroup;

    currentUser: any = {};
    courses: Course[] = [];

    public sliderMax: number;

    public categories: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private courseService: CourseService,
                private categoryService: CategoryService,
                private authenticationService: AuthenticationService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
            });
        }
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            fulltext: ['', [Validators.maxLength(63)]],
            categories: [[]],
            min_price: [0],
            max_price: [Infinity],
        });

        this.sliderMax = 100;

        this.searchCourses();

        this.categories = this.categoryService.getCategoriesList();

        this.options = {
            multiple: true,
            closeOnSelect: false
        };
    }

    searchCourses() {
        this.courseService.getAll().subscribe(courses => {
            this.courses = courses;
            const search = this.searchForm.value;
            let searchedCourses: any = [];
            for (let i = 0; i < this.courses.length; i++) {
                let fulltext = false;
                let categories = false;
                let price = false;
                Object.keys(this.courses[i]).forEach((ckey) => {
                    if (search.fulltext.length > 0) {
                        if (ckey === 'name' || ckey === 'description') {
                            if (this.courses[i][ckey].includes(search.fulltext)) {
                                fulltext = true;
                            }
                        }
                    } else {
                        fulltext = true;
                    }
                    if (search.categories.length > 0) {
                        if (ckey === 'categories') {
                            for (let j = 0; j < search.categories.length; j++) {
                                if (this.courses[i][ckey].includes(search.categories[j])) {
                                    categories = true;
                                }
                            }
                        }
                    } else {
                        categories = true;
                    }
                    if (search.max_price > 0) {
                        if (ckey === 'price') {
                            if (this.courses[i][ckey] >= search.min_price && this.courses[i][ckey] <= search.max_price) {
                                price = true;
                            } else {
                                price = false;
                            }
                        }
                    } else {
                        price = false;
                    }
                });
                if (fulltext && categories && price) {
                    searchedCourses.push(this.courses[i]);
                }
            }

            this.courses = searchedCourses;
        });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}