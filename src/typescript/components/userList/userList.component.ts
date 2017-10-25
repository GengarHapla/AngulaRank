import DialogService from '../../services/dialog/dialog.service';
import { IAngularEvent } from 'angular';

export class UserListComponent {

    static componentName: string = "userList";
    static componentConfig: ng.IComponentOptions = {
        bindings: {
            users: '<',
            showProperty: '<'
        },
        controller: UserListComponent,
        templateUrl: "typescript/components/userList/userList.template.html"
    };

    constructor(private dialogService: DialogService) {}

    users: any;
    showProperty: string;

    get userList() {
        return this.users;
    }

    getScore(user: any) {
        return user[this.showProperty];
    }

    onUserClick($event: IAngularEvent, user: any) {
        this.dialogService.showUserDetailsDialog($event, user);
    }
 
}

UserListComponent.$inject = ['DialogService'];
