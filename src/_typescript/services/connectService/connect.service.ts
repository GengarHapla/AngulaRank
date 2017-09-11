import { IHttpService } from 'angular';

export default class ConnectService {

    constructor(private $http: IHttpService) {}

    get(url: string) {
        return this.$http.get(url)
            .then((response: any) => {
                const { data, headers } = response;
                return { data, headers };
            });
    }

}

ConnectService.$inject = ['$http'];
