import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';
import { HomeComponent } from './home/index';
import { UserComponent, UserEditComponent, UserConfirmationComponent, LoginComponent, RegisterComponent, DashboardComponent, SearchUserComponent } from './users/index';
import { CourseComponent, CreateCourseComponent, SearchCourseComponent } from './courses/index';
import { MessagesComponent, SingleChatComponent } from "./messages/index";

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
	{ path: 'user_confirmation/:id', component: UserConfirmationComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'user/search', component: SearchUserComponent },
	{ path: 'user/:id', component: UserComponent },
    { path: 'user/:id/edit', component: UserEditComponent, canActivate: [AuthGuard] },
	{ path: 'course/create', component: CreateCourseComponent, canActivate: [AuthGuard] },
    { path: 'course/search', component: SearchCourseComponent },
	{ path: 'course/:id', component: CourseComponent },
    { path: 'course/:id/edit', component: CreateCourseComponent, canActivate: [AuthGuard] },
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
    { path: 'messages/:id', component: SingleChatComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);