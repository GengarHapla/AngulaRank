import * as angular from "angular";

import SessionStorageService from './sessionStorageService/sessionStorage.service';
import RepoService from './repoService/repo.service';
import ContributorService from './contributorService/contributor.service';
import SortService from './sortService/sort.service';

angular.module('app.services', [])
    .service('SessionStorageService', SessionStorageService)
    .service('RepoService', RepoService)
    .service('ContributorService', ContributorService)
    .service('SortService', SortService)
    ;
