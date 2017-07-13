import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';
import { HomeComponent } from './home/index';
import { UserComponent, UserConfirmationComponent, LoginComponent, RegisterComponent } from './users/index';
import { CourseComponent, CreateCourseComponent } from './courses/index';
import { CategoryComponent, CreateCategoryComponent } from './categories/index';
import { ReviewComponent } from './reviews/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
	{ path: 'user_confirmation/:id', component: UserConfirmationComponent },
	{ path: 'users/:id', component: UserComponent, canActivate: [AuthGuard] },
	{ path: 'course/create', component: CreateCourseComponent, canActivate: [AuthGuard] },
	{ path: 'courses/:id', component: CourseComponent, canActivate: [AuthGuard] },
	{ path: 'category/create', component: CreateCategoryComponent, canActivate: [AuthGuard] },
	{ path: 'categories/:id', component: CategoryComponent, canActivate: [AuthGuard] },
	{ path: 'reviews/:id', component: ReviewComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);