export class UserListComponent {

    static componentName: string = "userList";
    static componentConfig: ng.IComponentOptions = {
        bindings: {
            users: '<'
        },
        controller: UserListComponent,
        templateUrl: "_typescript/components/userListComponent/userList.html"
    };

    users: any;

    get userList() {
        console.log(this.users)
        return this.users;
    }

    onUserClick(value: any) {
        console.log(value);
    }
 
}
