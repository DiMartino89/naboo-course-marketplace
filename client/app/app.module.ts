import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Select2Module } from 'ng2-select2';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AlertComponent, PushNotificationComponent, InputComponent, ButtonComponent, ModalLinkComponent, LoadingComponent, MapComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { OrderByPipe, TruncatePipe, SafePipe } from './_helpers/index';
import { TranslatePipe, TranslateService, TRANSLATION_PROVIDERS } from './translate/index';
import { AlertService, AuthenticationService, UserService, CourseService, CategoryService, ReviewService } from './_services/index';
import { HomeComponent } from './home/index';
import { UserComponent, UserConfirmationComponent, LoginComponent, RegisterComponent } from './users/index';
import { CourseComponent, CreateCourseComponent } from './courses/index';
import { ReviewComponent } from './reviews/index';

@NgModule({
    imports: [
        BrowserModule,
		ReactiveFormsModule,
        FormsModule,
        HttpModule,
		Select2Module,
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
        HomeComponent,
		UserComponent,
		UserConfirmationComponent,
		CourseComponent,
		CreateCourseComponent,
		ReviewComponent,
        LoginComponent,
        RegisterComponent,
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
		TRANSLATION_PROVIDERS,
        TranslateService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }