import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Course, Category, Review } from '../../_models/index';
import { AuthenticationService, UserService, CourseService, CategoryService, ReviewService, AlertService } from '../../_services/index';

@Component({
	styleUrls: ['./course.css'],
    moduleId: module.id,
    templateUrl: 'course.component.html'
})

export class CourseComponent implements OnInit {
    updateOfferForm: FormGroup;
	
	currentUser: any = {};
	users: User[] = [];
	courses: Course[] = [];
	categories: Category[] = [];
	reviews: Review[] = [];
	
	courseId: string;
	course: any = {};

    constructor(private formBuilder: FormBuilder,
				private userService: UserService, 
				private courseService: CourseService,
				private categoryService: CategoryService,
				private reviewService: ReviewService,
				private alertService: AlertService, 
				private activatedRoute: ActivatedRoute,
				private authenticationService: AuthenticationService) {
					if (this.authenticationService.userLoggedIn("user_token") != null) {
						this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => { this.currentUser = user; });
					}
	}

    ngOnInit() {
        this.loadAllUsers();
		this.loadAllCourses();
		this.loadAllCategories();
		this.activatedRoute.params.subscribe((params: Params) => {
			this.courseId = params['id'];
		});
		
		this.updateOfferForm = this.formBuilder.group({
            name: ['', Validators.required, [Validators.minLength(3), Validators.maxLength(63)]],
            description: ['', [Validators.maxLength(500)]],
			categories: ['', Validators.required],
			file_image: '',
			default_image: '',
			address_name: ['', Validators.required],
			street: '',
			district: '',
			city: '',
			country: '',
			latitude: ['', Validators.required],
			longitude: ['', Validators.required],
			link: '',
			date: ['', Validators.required],
			duration: '',
			pictures: ''
        });
    }
	
	/* User Stuff */
	private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
	
	/* Course Stuff */
	private loadAllCourses() {
        this.courseService.getAll().subscribe(courses => { this.courses = courses; });
    }

	deleteCourse(_id: string) {
        this.courseService.delete(_id).subscribe(() => { this.loadAllCourses() });
    }
	
	/* Category Stuff */
	private loadAllCategories() {
        this.categoryService.getAll().subscribe(categories => { this.categories = categories; });
    }
	
	/* Review Stuff */
	private loadAllReviews() {
        this.reviewService.getAll().subscribe(reviews => { this.reviews = reviews; });
    }
	
	updateCourse() {
		var course: any = {};
		
		this.courseService.update(course).subscribe(
			course => { 
				this.alertService.success('course successfully updated', true);
			},
			error => {
                this.alertService.error(error._body);
            });
    }
	
	getPictures() {
		var files = (<HTMLInputElement>document.getElementById('pictures')).files;
		for (var i = 0; i < files.length; i++) {
			let file: File = files[i];
			(function(file) {
				var reader = new FileReader();  
				reader.onload = function(e:any) {  
					var input = (<HTMLInputElement>document.createElement("input"));
					input.type = "text";
					input.className = "form-control picture";
					input.value = 'data:' + file.type + ';base64,' + btoa(e.target.result);
					document.getElementById('filelist').appendChild(input);
				}
				reader.readAsBinaryString(file);
			})(file);
		}
	}
	
	edit() {
		(<HTMLElement>document.getElementById('course-update')).className += " active";
		(<HTMLElement>document.getElementById('naboo-content')).style.height = '2215px';
	}
	
	close() {
		(<HTMLElement>document.getElementById('course-update')).classList.remove("active");
		(<HTMLElement>document.getElementById('naboo-content')).style.height = 'auto';
	}
	
	showRatingPanel() {
		(<HTMLElement>document.getElementById('naboo-rating-panel')).classList.toggle('active');
	}
	
	setRating() {
		var review: any = {};
		review.user = this.currentUser;
		review.rating = +(<HTMLInputElement>document.getElementById('rating')).value;
		review.description = (<HTMLInputElement>document.getElementById('rating-description')).value;
		var date = new Date();
		review.createdAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + date.getMonth()).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		review.updatedAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + date.getMonth()).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		
		this.courseService.getById(this.courseId).subscribe(course => { this.course = course; });
		var rating = +(<HTMLInputElement>document.getElementById('rating')).value;
		this.course.rating = (this.course.rating + rating) / (this.course.reviews.length + 1);
		
		this.reviewService.create(review).subscribe(
			review => { 
				this.alertService.success('Review successfully set', true);
				this.course.reviews.push(review);
				this.courseService.update(this.course).subscribe(
					course => { 
						this.alertService.success('Course successfully updated', true);
					},
					error => {
						this.alertService.error(error._body);
					});
			},
			error => {
                this.alertService.error(error._body);
            });
	}
}