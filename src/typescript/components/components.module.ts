import * as angular from "angular";

import { AppComponent } from './app/app.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './userList/userList.component';
import { UserDetailsComponent } from './userDetails/userDetails.component';

angular.module('app.components', [])
    .component(AppComponent.componentName, AppComponent.componentConfig)
    .component(HomeComponent.componentName, HomeComponent.componentConfig)
    .component(UserListComponent.componentName, UserListComponent.componentConfig)
    .component(UserDetailsComponent.componentName, UserDetailsComponent.componentConfig)
;
