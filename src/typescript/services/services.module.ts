import * as angular from "angular";

import SessionStorageService from './sessionStorage/sessionStorage.service';
import RepoService from './repo/repo.service';
import ContributorService from './contributor/contributor.service';
import SortService from './sort/sort.service';
import ConnectService from './connect/connect.service';
import DialogService from './dialog/dialog.service';
import UserRepoService from './userRepo/userRepo.service';

angular.module('app.services', [])
    .service('SessionStorageService', SessionStorageService)
    .service('RepoService', RepoService)
    .service('ContributorService', ContributorService)
    .service('SortService', SortService)
    .service('ConnectService', ConnectService)
    .service('DialogService', DialogService)
    .service('UserRepoService',UserRepoService)
    ;
