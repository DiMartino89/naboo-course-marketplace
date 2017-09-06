import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';
import { HomeComponent } from './home/index';
import { UserComponent, UserConfirmationComponent, LoginComponent, RegisterComponent, DashboardComponent } from './users/index';
import { CourseComponent, CreateCourseComponent } from './courses/index';
import { InboxComponent, OutboxComponent, ArchiveComponent, ViewMessageComponent } from "./messages/index";

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
	{ path: 'user_confirmation/:id', component: UserConfirmationComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'user/:id/edit', component: UserComponent, canActivate: [AuthGuard] },
	{ path: 'course/create', component: CreateCourseComponent, canActivate: [AuthGuard] },
	{ path: 'course/:id', component: CourseComponent, canActivate: [AuthGuard] },
    { path: 'course/:id/edit', component: CreateCourseComponent, canActivate: [AuthGuard] },
    { path: 'messages/inbox', component: InboxComponent, canActivate: [AuthGuard] },
    { path: 'messages/outbox', component: OutboxComponent, canActivate: [AuthGuard] },
    { path: 'messages/archive', component: ArchiveComponent, canActivate: [AuthGuard] },
    { path: 'messages/:id', component: ViewMessageComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);