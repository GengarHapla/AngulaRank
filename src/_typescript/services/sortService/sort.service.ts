import SessionStorageService from '../sessionStorageService/sessionStorage.service';
import { IHttpService, IQService } from 'angular';
import * as _ from 'lodash';

export const REPO_LIST_NAME: string = 'repoList';

export default class SortService {

    constructor(
        private $q: IQService,
        private $http: IHttpService,
        private sessionStorageService: SessionStorageService
    ) {
        if (!this.sessionStorageService.get(REPO_LIST_NAME)) {
            this.sessionStorageService.set(REPO_LIST_NAME, {});
        }
    }

    getFollowers(userList: any) {
        const defer = this.$q.defer();
        let promises: any = [];

        _.forEach(userList, (user: any) => {
            promises.push(
                this.getFollowersList(user.followers_url)
                    .then((followersList: any) => {
                        //here I also need the headers to know the number of the pages left
                        //then I can determine how much followers the user has by downloading the first and last page
                        //so that makes 2 requests per user, the request limit can be increased and time can be known
                        this.saveFollowersList(followersList, user);
                        // this.saveSortedUsersList(
                        //     this.reorderContributorsList(
                        //         this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME)
                        //     )
                        // );
                    })
            );
        });

        return this.$q.all(promises)
            .then(() => {
                defer.resolve();
            });
    }

    getFollowersList(followersURL: string) {
        return this.$http.get(followersURL)
            .then((response: any) => {
                return response.data;
            });
    }

    saveFollowersList(followersList: any, user: any) {
        console.log(followersList);
        console.log(user);
        // _.forEach(followersList, (contributor: any) => {
        //     let sessionContributorsList = this.sessionStorageService.get(CONTRIBUTOR_LIST_NAME);
        //
        //     if (sessionContributorsList[user.id]) {
        //         sessionContributorsList[user.id].followers++;
        //     }
        //     this.sessionStorageService.set(CONTRIBUTOR_LIST_NAME, sessionContributorsList);
        // });
    }

}

SortService.$inject = ['$q', '$http', 'SessionStorageService'];
