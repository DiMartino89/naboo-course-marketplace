import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Course, Category, Review } from '../_models/index';
import { AuthenticationService, AlertService, UserService, CourseService, CategoryService, ReviewService } from '../_services/index';
import { OrderByPipe, TruncatePipe } from '../_helpers/index';

declare var $: any;

@Component({
	styleUrls: ['./home.css'],
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: any = {};
	
	/* USER-COMPONENTS */
	users: User[] = [];
	user: any = {};
	
	/* COURSE-COMPONENTS */
	courses: Course[] = [];
	course: any = {};
	
	/* CATEGORY-COMPONENTS */
	categories: Category[] = [];
	category: any = {};
	
	/* REVIEW-COMPONENTS */
	reviews: Review[] = [];
	review: any = {};
	
    constructor(private router: Router,
				private authenticationService: AuthenticationService,
				private userService: UserService, 
				private courseService: CourseService,
				private categoryService: CategoryService,
				private reviewService: ReviewService,					
				private alertService: AlertService) {
					if (this.authenticationService.userLoggedIn("user_token") != null) {
						this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => { this.currentUser = user; });
					}
				}

    ngOnInit() {
        this.loadAllUsers();
		this.loadAllCourses();
		this.loadAllCategories();
		this.loadAllReviews();
    }
	
	/* USER STUFF */
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }	
	
	private getUserById(userId: string) {
		this.courseService.getById(userId).subscribe(user => { this.user = user; });
	}	
	
	deleteUser(userId: string) {
        this.userService.delete(userId).subscribe(() => { this.loadAllUsers(); });
    }
	
	/* COURSE STUFF */
	private loadAllCourses() {
        this.courseService.getAll().subscribe(courses => { this.courses = courses; });
    }
	
	private getCourseById(courseId: string) {
		this.courseService.getById(courseId).subscribe(course => { this.course = course; });
	}	
	
	deleteCourse(courseId: string) {
        this.courseService.delete(courseId).subscribe(() => { this.loadAllCourses(); });
    }
	
	
	/* CATEGORY STUFF */
	private loadAllCategories() {
        this.categoryService.getAll().subscribe(categories => { this.categories = categories; });
    }
	
	private getCategoryById(categoryId: string) {
		this.categoryService.getById(categoryId).subscribe(category => { this.category = category; });
	}
	
	deleteCategory(categoryId: string) {
        this.categoryService.delete(categoryId).subscribe(() => { this.loadAllCategories(); });
    }
	
	
	/* REVIEW STUFF */
	private loadAllReviews() {
        this.reviewService.getAll().subscribe(reviews => { this.reviews = reviews; });
    }
	
	private getReviewById(reviewId: string) {
		this.reviewService.getById(reviewId).subscribe(review => { this.review = review; });
	}
}