import { ngStorage } from 'ngstorage';
import StorageService = ngStorage.StorageService;

export default class SessionStorageService {

    constructor(private $sessionStorage: StorageService) {
        console.log('SessionStorageService init!1');
    }

    set(key: string, value: any) {
        this.$sessionStorage[key] = value;
    }

    get(key: string) {
        return this.$sessionStorage[key];
    }

}

SessionStorageService.$inject = ['$sessionStorage'];
