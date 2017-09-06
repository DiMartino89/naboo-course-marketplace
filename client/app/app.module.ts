import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Select2Module } from 'ng2-select2';
import { AgmCoreModule } from '@agm/core';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AlertComponent, PushNotificationComponent, InputComponent, ButtonComponent, ModalLinkComponent, LoadingComponent, MapComponent, ReviewComponent, UploadComponent, CalendarComponent, Select2Component } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { OrderByPipe, TruncatePipe, SafePipe } from './_helpers/index';
import { TranslatePipe, TranslateService, TRANSLATION_PROVIDERS } from './translate/index';
import { AlertService, AuthenticationService, UserService, CourseService, CategoryService, ReviewService, DataService, MessageService } from './_services/index';
import { HomeComponent } from './home/index';
import { UserComponent, UserConfirmationComponent, LoginComponent, RegisterComponent, DashboardComponent } from './users/index';
import { CourseComponent, CreateCourseComponent } from './courses/index';
import { ViewMessageComponent, InboxComponent, OutboxComponent, ArchiveComponent } from './messages/index';

require('node_modules/popper.js/dist/umd/popper.js');


@NgModule({
    imports: [
        BrowserModule,
		ReactiveFormsModule,
        FormsModule,
        HttpModule,
		Select2Module,
		FileUploadModule,
		AgmCoreModule.forRoot({
		  apiKey: "AIzaSyBH7ieUgzsyimICmHsXyN4Ba7AaxrmVHUg",
		  libraries: ["places"]
		}),
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
		PushNotificationComponent,
		InputComponent,
        ButtonComponent,
		ModalLinkComponent,
		LoadingComponent,
		MapComponent,
		UploadComponent,
        CalendarComponent,
        Select2Component,
        HomeComponent,
		UserComponent,
		UserConfirmationComponent,
		CourseComponent,
		CreateCourseComponent,
		ReviewComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        ViewMessageComponent,
		InboxComponent,
		OutboxComponent,
		ArchiveComponent,
		OrderByPipe,
		TruncatePipe,
		SafePipe,
		TranslatePipe
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
		CourseService,
		CategoryService,
		ReviewService,
		DataService,
        MessageService,
		MapComponent,
		UploadComponent,
		TRANSLATION_PROVIDERS,
        TranslateService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }