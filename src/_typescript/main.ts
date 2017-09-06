import * as angular from "angular";
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ngstorage';

import './services/services.module';
import './components/components.module';

module App {
    
	angular.module('app', [
	    'ngMaterial',
	    'ngSanitize',
	    'ui.router',
        'ngStorage',
        'app.services',
        'app.components'
    ])
    .config(function(
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        $mdThemingProvider:angular.material.IThemingProvider
    ){
        var states = [
            {
                name: 'home',
                url: '/home',
                template: '<home></home>'
            },
            {
                name: 'about',
                url: '/about',
                template: '<about>AAABout page</about>'
            }        
        ];

        states.forEach(function(state) {
            $stateProvider.state(state);
        });

        $urlRouterProvider.otherwise('/home',);
        // $locationProvider.html5Mode(true).hashPrefix("!");
        console.log($mdThemingProvider);
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('purple');
    });
}
