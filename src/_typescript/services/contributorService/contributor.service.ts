import SessionStorageService from '../sessionStorageService/sessionStorage.service';
import { IHttpService, IQService } from 'angular';
import { IContributor } from './contributor';
import * as _ from 'lodash';

export const CONTRIBUTOR_LIST_NAME: string = 'contributorList';
export const SORTED_USERS_LIST_NAME: string = 'usersList';

export default class ContributorService {

    constructor(
        private $q: IQService,
        private $http: IHttpService,
        private sessionStorageService: SessionStorageService
    ) {
        if (!this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME) ||
            !this.sessionStorageService.get(SORTED_USERS_LIST_NAME)) {
            this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, {});
            this.sessionStorageService.set(SORTED_USERS_LIST_NAME, []);
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
                sessionContributorsList[contributor.id] = this.createContributorObject(contributor);
            }
            this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, sessionContributorsList);
        });
    }

    reorderContributorsList(contributorsList: any) {
        return _.orderBy(contributorsList, ['contributions'], ['desc']);
    }

    handleEachRepoContributorsList(repoList: any) {
        const defer = this.$q.defer();
        let promises: any = [];

        _.forEach(repoList, (repo: any) => {
            promises.push(
                this.getContributorList(repo.contributors_url)
                    .then((contributorList: any) => {
                        this.saveContributorsList(contributorList);
                        this.saveSortedUsersList(
                            this.reorderContributorsList(
                                this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME)
                            )
                        );
                    })
            );
        });

        return this.$q.all(promises)
            .then(() => {
                defer.resolve();
            });
    }

    createContributorObject(user: IContributor): IContributor {
        const { login, id, contributions, followers_url, repos_url, gists_url, avatar_url } = user;
        return {
            login,
            id,
            contributions,
            followers_url,
            followers: 0,
            repos_url,
            gists_url,
            avatar_url
        }
    }

    saveSortedUsersList(usersList: Array<Object>) {
        this.sessionStorageService.set(SORTED_USERS_LIST_NAME, usersList);
    }

    getSortedUsersList() {
        this.sessionStorageService.get(SORTED_USERS_LIST_NAME);
    }

}

ContributorService.$inject = ['$q', '$http', 'SessionStorageService'];
