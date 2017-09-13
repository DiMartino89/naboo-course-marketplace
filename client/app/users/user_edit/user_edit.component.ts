import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Params, Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Select2OptionData} from 'ng2-select2';
import {User} from '../../_models/index';
import {
    AuthenticationService,
    UserService,
    CategoryService,
    AlertService,
    DataService
} from '../../_services/index';

declare var $: any;

@Component({
    styleUrls: ['./user_edit.css'],
    moduleId: module.id,
    templateUrl: 'user_edit.component.html'
})

export class UserEditComponent implements OnInit {
    editUserForm: FormGroup;

    currentUser: any = {};
    users: User[] = [];

    user: any = {};
    userId: any;

    public categories: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];

    deleteFiles: any = [];

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cdRef: ChangeDetectorRef,
                private dataService: DataService,
                private userService: UserService,
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
            this.userId = params['id'];
        });

        this.editUserForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(63)]],
            description: ['', [Validators.maxLength(500)]]
        });

        this.categories = this.categoryService.getCategoriesList();

        this.options = {
            multiple: true,
            closeOnSelect: false
        };

        if (this.userId) {
            this.userService.getById(this.userId).subscribe((user) => {
                    this.user = user;
                    this.cdRef.detectChanges();
                    this.setValuesFromUser(this.user);
                },
                error => {
                    this.alertService.error(error.body);
                });
        }
    }

    editUser() {
        this.userService.getById(this.userId).subscribe((user) => {
            user = this.editUserForm.value;
            user._id = this.userId;
            user.avatar = this.dataService.avatar;
            user.titleImage = this.dataService.titleImage;
            user.pictures = this.dataService.pictures.split(',').slice(0, -1);
            for (let i = 0; i < this.deleteFiles.length; i++) {
                let index = user.pictures.indexOf(this.deleteFiles[i]);
                user.pictures.splice(index, 1);
            }
            let date = new Date();
            user.updatedAt = this.changeDateFormat(date);

            this.userService.update(user).subscribe(() => {
                this.alertService.success('Updated user successfully');
                this.router.navigate(['/user', this.userId]);
            }, error => {
                this.alertService.error(error.body);
            });
        });
    }

    private setValuesFromUser(user: User) {
        Object.keys(user).forEach((key) => {
            if (user[key] && this.editUserForm.get(key)) {
                this.editUserForm.get(key).setValue(user[key]);
            } else {
                if (key === 'avatar') {
                    this.dataService.avatar = user[key];
                }
                if (key === 'titleImage') {
                    this.dataService.titleImage = user[key];
                }
                if (key === 'pictures') {
                    for (let i = 0; i < user[key].length; i++) {
                        this.dataService.pictures += user[key][i] + ',';
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

    removeAvatar() {
        this.dataService.avatar = '';
        $('.avatar-preview').remove();
    }

    removeTitleImage() {
        this.dataService.titleImage = '';
        $('.image-preview').remove();
    }

    removePicture(file: string, index: number) {
        this.deleteFiles.push(file);
        $('.image-preview' + index).remove();
    }

    isValid() {
        return this.editUserForm.valid;
    }
}