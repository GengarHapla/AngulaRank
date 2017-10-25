import RepoService from '../../services/repo/repo.service';
import ContributorService from '../../services/contributor/contributor.service';
import SessionStorageService from '../../services/sessionStorage/sessionStorage.service';
import * as _ from 'lodash';
import * as hello from 'hellojs';
import SortService, {
    SORTED_USERS_LIST_NAME, SORT_BY_CONTRIBUTIONS_NAME,
    SORT_BY_FOLLOWERS_NAME, SORT_BY_REPOS_NAME, SORT_BY_GISTS_NAME
} from '../../services/sort/sort.service';

export class HomeComponent {

    static componentName: string = 'home';
    static componentConfig: ng.IComponentOptions = {
        bindings: {},
        controller: HomeComponent,
        controllerAs: '$homeCtrl',
        templateUrl: 'typescript/components/home/home.template.html'
    };

    hello: any = hello;
    _currentFilter: string;

    constructor(private repoService: RepoService,
                private contributorService: ContributorService,
                private sessionStorageService: SessionStorageService,
                private sortService: SortService) {}

    $onInit() {
        if (_.isEmpty(this.sessionStorageService.get(SORTED_USERS_LIST_NAME))) {
            this.repoService.getAndSaveRepoList()
                .then((response: any) => {
                    return this.contributorService.handleEachRepoContributorsList(response);
                })
                .then((list: any) => {
                    return this.sortService.getEveryUserDetails(list);
                })
                .then((list: any) => {
                    this.sortService.sortAndSaveUsersList(list, this.currentFilter)
                });
        }
    }

    get userList() {
        return this.sessionStorageService.get(SORTED_USERS_LIST_NAME);
    }

    set currentFilter(value: string) {
        this.sortService.sortAndSaveUsersList(this.userList, value);
        this._currentFilter = value;
    }

    get currentFilter() {
        return this._currentFilter;
    }

    get userFilter() {
        if (!this.currentFilter) {
            this.currentFilter = SORT_BY_CONTRIBUTIONS_NAME;
        }
        return this.currentFilter;
    }

    textFromNameMap(value: string) {
        const _map = {
            [SORT_BY_CONTRIBUTIONS_NAME]: 'Contributions',
            [SORT_BY_FOLLOWERS_NAME]: 'Followers',
            [SORT_BY_REPOS_NAME]: 'Repos',
            [SORT_BY_GISTS_NAME]: 'Gists'
        };
        return _map[value];
    }

    sortByFollowers() {
        this.currentFilter = SORT_BY_FOLLOWERS_NAME;
    }

    sortByRepos() {
        this.currentFilter = SORT_BY_REPOS_NAME;
    }

    sortByGists() {
        this.currentFilter = SORT_BY_GISTS_NAME;
    }

    sortByContributors() {
        this.currentFilter = SORT_BY_CONTRIBUTIONS_NAME;
    }

    goTo(state: string) {
        this.currentFilter = state;
    }

}

HomeComponent.$inject = ['RepoService', 'ContributorService', 'SessionStorageService', 'SortService'];
