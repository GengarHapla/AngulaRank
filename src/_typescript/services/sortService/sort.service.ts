import SessionStorageService from '../sessionStorageService/sessionStorage.service';
import { IHttpService, IQService } from 'angular';
import * as _ from 'lodash';
import { CONTRIBUTOR_LIST_NAME } from '../contributorService/contributor.service';
import ConnectService from '../connectService/connect.service';

export const SORTED_USERS_LIST_NAME: string = 'usersList';
export const SORT_BY_CONTRIBUTIONS_NAME: string = 'contributions';
export const SORT_BY_FOLLOWERS_NAME: string = 'followers';
export const SORT_BY_REPOS_NAME: string = 'public_repos';
export const SORT_BY_GISTS_NAME: string = 'public_gists';

export default class SortService {

    constructor(private $q: IQService,
                private $http: IHttpService,
                private sessionStorageService: SessionStorageService,
                private connectService: ConnectService) {
        if (!this.sessionStorageService.get(SORTED_USERS_LIST_NAME)) {
            this.sessionStorageService.set(SORTED_USERS_LIST_NAME, []);
        }
    }

    getUserDetails(user: any) {
        return this.get(user.url)
            .then((response: any) => {
                return response.data;
            })
    }

    getEveryUserDetails(userList: any) {
        const defer = this.$q.defer();
        let promises: any = [];

        _.forEach(userList, (user: any) => {
            promises.push(
                this.getUserDetails(user)
                    .then((response: any) => {
                        this.saveUserDetails(response);
                    })
            );
        });

        return this.$q.all(promises)
            .then(() => {
                defer.resolve();
                return this.getContributorList();
            });
    }

    saveUserDetails(contributor: any) {
        let sessionContributorsList = this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME);

        sessionContributorsList[contributor.id] = _.assign({}, sessionContributorsList[contributor.id], contributor);

        this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, sessionContributorsList);
    }

    get(followersURL: string) {
        return this.connectService.get(followersURL);
    }

    updateSortedUserList(user: any) {
        let sessionSortedUsersList = this.getSortedUsersList();
        const contributorList = this.getContributorList();
        const userToUpdate: any = contributorList[user.id];
        const { id } = userToUpdate;
        const index = _.findIndex(sessionSortedUsersList, { id });

        sessionSortedUsersList[index] = _.merge({}, sessionSortedUsersList[index], userToUpdate);
        this.saveSortedUsersList(sessionSortedUsersList);
    }

    sortAndSaveUsersList(usersList: Array<Object>, sortBy: string) {
        this.saveSortedUsersList(this.reorderUsersList(usersList, sortBy));
    }

    saveSortedUsersList(usersList: Array<Object>) {
        return this.sessionStorageService.set(SORTED_USERS_LIST_NAME, usersList);
    }

    saveContributorList(usersList: Array<Object>) {
        return this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, usersList);
    }

    getSortedUsersList(): Array<Object> {
        return this.sessionStorageService.get(SORTED_USERS_LIST_NAME);
    }

    getContributorList(): Array<Object> {
        return this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME);
    }

    reorderUsersList(contributorsList: any, by: string = SORT_BY_CONTRIBUTIONS_NAME): Array<Object> {
        return _.orderBy(contributorsList, [by], ['desc']);
    }


}

SortService.$inject = ['$q', '$http', 'SessionStorageService', 'ConnectService'];
