import * as _ from 'lodash';
import { IHttpService, IQService } from 'angular';
import ConnectService from '../connectService/connect.service';
import { CONTRIBUTOR_LIST_NAME } from '../contributorService/contributor.service';
import SessionStorageService from '../sessionStorageService/sessionStorage.service';

export const USER_REPO_LIST_NAME = 'userRepoList';

export default class UserRepoService {

    constructor(
        private $q: IQService,
        private $http: IHttpService,
        private connectService: ConnectService,
        private sessionStorageService: SessionStorageService) {
        if (!this.sessionStorageService.get(USER_REPO_LIST_NAME)) {
            this.sessionStorageService.set(USER_REPO_LIST_NAME, {});
        }
    }

    get(url: string) {
        return this.connectService.get(url);
    }

    getPageUrl(url: string, index: number) {
        const pageUrl = this.extractPageUrl(url);
        const pageRegExp = new RegExp('(page=)[0-9]+');

        return pageUrl.replace(pageRegExp, `page=${index}`);
    }

    getPagesCountFromHeaders(link: any) {
        const splittedPageLinks = this.splitPageLinks(link);
        const lastPageIndex = splittedPageLinks.length - 1;

        return this.extractNumberFromPageLink(splittedPageLinks[lastPageIndex]);
    }

    getLastPageUrl(link: any) {
        const splittedPageLinks = this.splitPageLinks(link);
        const lastPageIndex = splittedPageLinks.length - 1;

        return splittedPageLinks[lastPageIndex];
    }

    getAndSaveEveryUserRepo(user: any) {
        const defer = this.$q.defer();
        let promises: any = [];
        let sessionUserRepoList = this.sessionStorageService.get(USER_REPO_LIST_NAME);

        if (sessionUserRepoList[user.id]) {
            return this.$q.all([])
                .then(() => {
                    defer.resolve();
                });
        }
        return this.get(user.repos_url)
            .then((response: any) => {
                const pagesLink = response.headers().link;

                if (!pagesLink) {
                    return this.saveUserRepos(user, response.data);
                } else {
                    const count = +this.getPagesCountFromHeaders(pagesLink);
                    const lastPageUrl = this.getLastPageUrl(pagesLink);

                    for (let i = 2; i <= count; i++) {
                        promises.push(
                            this.get(this.getPageUrl(lastPageUrl, i))
                                .then((resp: any) => {
                                    return this.saveUserRepos(user, resp.data);
                                })
                        );
                    }

                    return this.$q.all(promises)
                        .then(() => {
                            defer.resolve();
                        });

                }
            });
    }

    saveUserRepos(user: any, repos: any) {
        _.forEach(repos, (repo: any) => {
            let sessionUserRepoList = this.sessionStorageService.get(USER_REPO_LIST_NAME);
            const { name, html_url } = repo;

            if (!sessionUserRepoList[user.id]) {
                sessionUserRepoList[user.id] = [];
            }
            sessionUserRepoList[user.id].push({ name, html_url });

            this.sessionStorageService.set(USER_REPO_LIST_NAME, sessionUserRepoList);
        });
        return this.sessionStorageService.get(USER_REPO_LIST_NAME);
    }

    extractPageUrl(page: string): string {
        return page.match(new RegExp('(<.+>)'))[0]
            .replace('<', '')
            .replace('>', '');
    }

    splitPageLinks(link: string): Array<string> {
        return link.split(',');
    }

    extractNumberFromPageLink(page: string): string | boolean {
        const pageRegExp = new RegExp('(page=[0-9]+)');
        const extractedPageString = page.match(pageRegExp)[0];

        return extractedPageString ? this.extractPageNumber(extractedPageString) : false;
    }

    extractPageNumber(page: string): string {
        const numberRegExp = new RegExp('[0-9]+');

        return page.match(numberRegExp)[0];
    }

}

UserRepoService.$inject = ['$q', '$http', 'ConnectService', 'SessionStorageService'];
