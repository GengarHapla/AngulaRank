export const userDetailsMap = {
    bio: 'Bio',
    company: 'Company',
    email: 'Email',
    hireable: 'Hireable',
    location: 'Location',
    blog: 'Blog',
    contributions: 'Contributions',
    followers: 'Followers',
    public_gists: 'Gists',
    public_repos: 'Repos'
};

export class UserDetailsComponent {
    static componentName: string = 'userDetails';
    static componentConfig: ng.IComponentOptions = {
        bindings: {
            details: '<',
            repos: '<'
        },
        controller: UserDetailsComponent,
        controllerAs: '$ctrl',
        templateUrl: 'typescript/components/userDetails/userDetails.template.html'
    };


    constructor(
        private $mdDialog: any) {}

    details: any;
    repos: any;
    userDetailsMap: any = userDetailsMap;

    get data() {
        return this.details;
    }

    get repoData() {
        return this.repos[this.data.id];
    }

    get sortedData() {
        return this.details;
    }

    closeDialog() {
        this.$mdDialog.hide();
    }

    onRepoClick(repo: any) {
        const url = repo.html_url + '/graphs/contributors';
        window.open(url, '_blank')
    }

}

UserDetailsComponent.$inject = ['$mdDialog'];
