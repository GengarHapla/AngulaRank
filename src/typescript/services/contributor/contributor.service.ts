import SessionStorageService from '../sessionStorage/sessionStorage.service';
import { IHttpService, IQService } from 'angular';
import * as _ from 'lodash';
import SortService from '../sort/sort.service';

export const CONTRIBUTOR_LIST_NAME: string = 'contributorList';

export default class ContributorService {

    constructor(
        private $q: IQService,
        private $http: IHttpService,
        private sessionStorageService: SessionStorageService,
        private sortService: SortService
    ) {
        if (!this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME)) {
            this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, {});
        }
    }

    getContributorList(repoContributorsURL: string) {
        return this.$http.get(repoContributorsURL)
            .then((response: any) => {
                return response.data;
            });
    }

    saveContributorsList(contributorsList: any) {
        _.forEach(contributorsList, (contributor: any) => {
            let sessionContributorsList = this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME);

            if (sessionContributorsList[contributor.id]) {
                sessionContributorsList[contributor.id].contributions += contributor.contributions;
            } else {
                sessionContributorsList[contributor.id] = contributor;
            }
            this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, sessionContributorsList);
        });
        return this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME);
    }

    handleEachRepoContributorsList(repoList: any) {
        const defer = this.$q.defer();
        let promises: any = [];

        _.forEach(repoList, (repo: any) => {
            promises.push(
                this.getContributorList(repo.contributors_url)
                    .then((contributorList: any) => this.saveContributorsList(contributorList))
                    .then((contributorsList: any) => {
                        this.sortService.sortAndSaveUsersList(contributorsList, 'contributions')
                    })
            );
        });

        return this.$q.all(promises)
            .then(() => {
                defer.resolve();
                return this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME);
            });
    }

}

ContributorService.$inject = ['$q', '$http', 'SessionStorageService', 'SortService'];
