import SessionStorageService from '../sessionStorage/sessionStorage.service';
import { IHttpService } from 'angular';
import * as _ from 'lodash';

export const REPO_LIST_NAME: string = 'repoList';

export default class RepoService {

    constructor(
        private $http: IHttpService,
        private sessionStorageService: SessionStorageService
    ) {
        if (!this.sessionStorageService.get(REPO_LIST_NAME)) {
            this.sessionStorageService.set(REPO_LIST_NAME, {});
        }
    }

    getAndSaveRepoList() {
        return this.$http.get('https://api.github.com/users/angular/repos')
            .then((response: any) => {
                this.handleRepoList(response.data);
                return response.data;
            });
    }

    handleRepoList(repoList: any) {
        _.forEach(repoList, (repo: any) => {
            let sessionRepoList = this.sessionStorageService.get(REPO_LIST_NAME);
            sessionRepoList[repo.name] = repo;
            this.sessionStorageService.set(REPO_LIST_NAME, sessionRepoList);
        });
    }

}

RepoService.$inject = ['$http', 'SessionStorageService'];
