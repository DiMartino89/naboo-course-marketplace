import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserService, CourseService} from '../../_services/index';
import {CategoryService} from "../../_services/category/category.service";
import {Select2OptionData} from "ng2-select2";
import {NouisliderComponent} from 'ng2-nouislider';
import {Course} from "../../_models/course/course";

@Component({
    styleUrls: ['./course_search.css'],
    moduleId: module.id,
    templateUrl: 'course_search.component.html'
})

export class SearchCourseComponent implements OnInit, AfterViewInit {

    @ViewChild('sliderRef') sliderRef: NouisliderComponent;

    searchForm: FormGroup;
    sortForm: FormGroup;

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

        this.setupSort();

        this.searchCourses();

        this.categories = this.categoryService.getCategoriesList();

        this.options = {
            multiple: true,
            closeOnSelect: false
        };
    }

    ngAfterViewInit() {
        this.adjustSliderToOffers();
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

    private sortCourses() {
        const field = this.sortForm.get('field').value;
        const direction = this.sortForm.get('order').value;

        this.courses = this.courses.sort((a, b) => {
            if (a[field] > b[field] && direction === 'desc' || a[field] < b[field] && direction === 'asc') {
                return -1;
            } else if (a[field] < b[field] && direction === 'desc' || a[field] > b[field] && direction === 'asc') {
                return 1;
            } else {
                return 0;
            }
        });
    }

    private setupSort() {
        this.sortForm = this.formBuilder.group({
            field: 'createdAt',
            order: 'desc'
        });

        this.sortForm.statusChanges.subscribe(this.sortCourses.bind(this));
    }

    private adjustSliderToOffers() {
        if (this.courses.length) {
            this.sliderMax = this.courses.reduce((p, c) => p.price > c.price ? p : c).price;

            // for some reason, angular likes to set the default value over and over again...
            setTimeout(() => {
                this.searchForm.get('min_price').setValue(0);
                this.searchForm.get('max_price').setValue(this.sliderMax);
            }, 500);
        }
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}