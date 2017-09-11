import { ngStorage } from 'ngstorage';
import StorageService = ngStorage.StorageService;

export default class SessionStorageService {

    constructor(private $sessionStorage: StorageService) {}

    set(key: string, value: any) {
        this.$sessionStorage[key] = value;
    }

    get(key: string) {
        return this.$sessionStorage[key];
    }

}

SessionStorageService.$inject = ['$sessionStorage'];
