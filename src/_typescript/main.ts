import * as angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ngstorage';

import './services/services.module';
import './components/components.module';
import * as _ from 'lodash';

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
        $mdThemingProvider:angular.material.IThemingProvider,
        $provide: any,
        $httpProvider: any
    ){
        var states = [
            {
                name: 'home',
                url: '/home',
                template: '<home></home>'
            }
        ];

        states.forEach(function(state) {
            $stateProvider.state(state);
        });

        $urlRouterProvider.otherwise('/home',);
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('purple');

        $provide.factory('myHttpInterceptor', () => {
            return {
                'request': function (config: any) {
                    if (_.includes(config.url, 'https://api.github.com') && !_.includes(config.url, 'client_id')) {
                        const client_id = `a5544520ac13faff5b7c`;
                        const client_secret = `bcb240b6dc179a05be406e1b64497de2377d7067`;
                        config.url += `?client_id=${client_id}&client_secret=${client_secret}`;
                    }
                    return config;
                },
            };
        });
        $httpProvider.interceptors.push('myHttpInterceptor');
    });
}
