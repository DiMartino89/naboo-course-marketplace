import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import { User, Course, Category } from '../../_models/index';
import { AuthenticationService, UserService, CourseService, CategoryService, AlertService } from '../../_services/index';

@Component({
	styleUrls: ['./course_create.css'],
    moduleId: module.id,
    templateUrl: 'course_create.component.html'
})

export class CreateCourseComponent implements OnInit {	
	createCourseForm: FormGroup;

	currentUser: any = {};
	users: User[] = [];
	
	public categories: Array<Select2OptionData>;
	public options: Select2Options;
	
	constructor(private formBuilder: FormBuilder,
				private router: Router,
				private userService: UserService, 
				private courseService: CourseService,
				private categoryService: CategoryService,					
				private alertService: AlertService,
				private authenticationService: AuthenticationService) {
					if (this.authenticationService.userLoggedIn("user_token") != null) {
						this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => { this.currentUser = user; });
					}
	}

    ngOnInit() {
		this.loadAllUsers();
		
		this.createCourseForm = this.formBuilder.group({
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
		
		this.categories = this.categoryService.getCategoriesList();
		
		this.options = {
			multiple: true,
			closeOnSelect: false
		};
		
		(<HTMLInputElement>document.getElementById('preview-image')).src = 'app/_assets/images/default-titleImage.png';
    }
	
	changed(data: {value: string[]}) {
		this.current = data.value.join('|');
		this.createCourseForm.get('categories').setValue(this.current);
	}
	
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }		
	
	createCourse() {	
		var course: any = {};
		
		course = this.createCourseForm.value;
		
		delete course.file_image;
		delete course.default_image;
		
		offer.categories = this.getCategories();
		
		course.image = (<HTMLInputElement>document.getElementById('preview-image')).src;
		course.pictures = this.getPictures();
		
		var date = new Date();
		course.createdAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth()+1)).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		course.updatedAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth()+1)).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		
		this.courseService.create(course).subscribe(
			course => { 
				this.alertService.success('Course successfully created', true);
				this.currentUser.courses.push(course);
				this.userService.update(this.currentUser).subscribe(() => { this.loadAllUsers(); });
			},
			error => {
                this.alertService.error(error._body);
            });	
    }
	
	getCategory() {
		let categories = this.createCourseForm.get('categories').value.split('|');
		let courseCategories = [];
		for(var i = 0; i < categories.length; i++) {
			courseCategories.push(categories[i]);
		}
		return courseCategories;
	}
	
	setImage(event: EventTarget) {
		let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let file: File = files[0];
		
		var reader = new FileReader();
		
		reader.onloadend = function () {
			var binaryString = reader.result;
			(<HTMLInputElement>document.getElementById('preview-image')).src = 'data:' + file.type + ';base64,' + btoa(binaryString);
		};
		reader.readAsBinaryString(file);
	}
	
	setDefaultImage() {
		if(this.createCourseForm.get('default_image').value == true) {
			(<HTMLInputElement>document.getElementById('preview-image')).src = 'app/_assets/images/default-titleImage.png';
		} else {
			(<HTMLInputElement>document.getElementById('preview-image')).src = 'app/_assets/images/default-titleImage.png';
		}
	}
	
	setPictures() {
		var files = (<HTMLInputElement>document.getElementById('pictures')).files;
		for (var i = 0; i < files.length; i++) {
			let file: File = files[i];
			(function(file) {
				var reader = new FileReader();  
				reader.onload = function(e:any) { 
					var imgWrap = (<HTMLElement>document.createElement("div"));
					imgWrap.className = "image-wrapper";
					
					var imgDel = (<HTMLElement>document.createElement("button"));
					imgDel.className = "image-delete";
					imgDel.innerHTML = 'X';
					imgDel.addEventListener("click", function(){
						imgDel.parentNode.parentNode.removeChild(imgDel.parentNode);
						(<HTMLInputElement>document.getElementById('pictures')).value = "";
					});
					
					var img = (<HTMLImageElement>document.createElement("img"));
					img.className = "image-preview";
					img.src = 'data:' + file.type + ';base64,' + btoa(e.target.result);
					
					imgWrap.appendChild(imgDel);
					imgWrap.appendChild(img);
					document.getElementById('filelist').appendChild(imgWrap);
				}
				reader.readAsBinaryString(file);
			})(file);
		}
	}
	
	getPictures() {
		var pictures = [];
		var images = document.getElementById('filelist').querySelectorAll('img');
		for(var i=0; i < images.length; i++) {
			var image = images[i].src;
			pictures.push(image);
		}
		return pictures;
	}
	
	isValid() {
        return this.createCourseForm.valid;
    }
}