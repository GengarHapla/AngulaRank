export class AppComponent {

    static componentName  : string = "app";
    static componentConfig:ng.IComponentOptions = {
        bindings: {
        },
        controller: AppComponent,
        controllerAs: "$AppCtrl",
        templateUrl: "typescript/components/app/app.component.html"
    };

    constructor() {}
 
}
