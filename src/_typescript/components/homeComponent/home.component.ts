import RepoService from '../../services/repoService/repo.service';
import ContributorService, { SORTED_USERS_LIST_NAME } from '../../services/contributorService/contributor.service';
import SessionStorageService from '../../services/sessionStorageService/sessionStorage.service';
import * as _ from 'lodash';
import SortService from '../../services/sortService/sort.service';

export class HomeComponent {

    static componentName  : string = "home";
    static componentConfig:ng.IComponentOptions = {
        bindings: {
        },
        controller: HomeComponent,
        controllerAs: '$homeCtrl',
        templateUrl: "_typescript/components/homeComponent/home.component.html"
    };

    currentFilter: string = 'contributors';

    constructor(
        private repoService: RepoService,
        private contributorService: ContributorService,
        private sessionStorageService: SessionStorageService,
        private sortService: SortService
        ) {
        console.log('Home Component init');
    }

    $onInit() {
        if (_.isEmpty(this.sessionStorageService.get(SORTED_USERS_LIST_NAME))) {
            this.repoService.getAndSaveRepoList()
                .then((response: any) => {
                    return response;
                })
                .then((response: any) => {
                    return this.contributorService.handleEachRepoContributorsList(response);
                })
                .then((list: any) => {
                    console.log('DONE!');
                });
        }
    }

    get userList() {
        // console.log(this.sessionStorageService.get(SORTED_USERS_LIST_NAME));
        return this.sessionStorageService.get(SORTED_USERS_LIST_NAME);
    }

    sortByFollowers() {
        this.sortService.getFollowers(this.userList);
    }

    goTo(state: string) {
        console.log(state);
        this.currentFilter = state;
    }
 
}

HomeComponent.$inject = ['RepoService', 'ContributorService', 'SessionStorageService', 'SortService'];
