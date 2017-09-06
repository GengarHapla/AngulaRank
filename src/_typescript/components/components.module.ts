import * as angular from "angular";

import { AppComponent } from './appComponent/app.component';
import { HomeComponent } from './homeComponent/home.component';
import { UserListComponent } from './userListComponent/userList.component';

angular.module('app.components', [])
    .component(AppComponent.componentName, AppComponent.componentConfig)
    .component(HomeComponent.componentName, HomeComponent.componentConfig)
    .component(UserListComponent.componentName, UserListComponent.componentConfig)
;
