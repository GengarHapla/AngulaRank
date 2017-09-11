import * as angular from 'angular';
import UserRepoService, { USER_REPO_LIST_NAME } from '../userRepoService/userRepo.service';
import SortService from '../sortService/sort.service';
import SessionStorageService from '../sessionStorageService/sessionStorage.service';

export default class DialogService {

    constructor(
        private $mdDialog: any,
        private userRepoService: UserRepoService,
        private sortService: SortService,
        private sessionStorageService: SessionStorageService) {}

    showDialog($event: any, options: any) {
        const parentEl = angular.element(document.body);
        const { template, locals, controller } = options;

        this.$mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            template,
            locals,
            controller,
            clickOutsideToClose: true
        });
    }

    showUserDetailsDialog($event: any, user: any) {
        this.userRepoService.getAndSaveEveryUserRepo(user)
            .then(() => {
                this.sortService.updateSortedUserList(user);
            });


        function DialogController($scope: any, $mdDialog: any, userDetails: any, repoList: any) {
            $scope.userDetails = userDetails;
            $scope.repoList = repoList
        }

        this.showDialog($event, {
            template: `<user-details details="userDetails" repos="repoList"></user-details>`,
            locals: {
                userDetails: user,
                repoList: this.sessionStorageService.get(USER_REPO_LIST_NAME)
            },
            controller: DialogController
        })
    }
}

DialogService.$inject = ['$mdDialog', 'UserRepoService', 'SortService', 'SessionStorageService'];
