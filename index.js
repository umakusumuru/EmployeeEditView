/**
 * AngularJS 
 * @author vinu <vinodanasuri@gmail.com>
 */

/**
 * Main App Creation
 */


var editviewapp = angular.module('KaakateeyaEmpEdit', ['ui.router', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'ngIdle', 'ngMaterial',
    'ngMessages', 'ngAria', 'ngPassword', 'jcs-autoValidate', 'angularPromiseButtons', 'KaakateeyaRegistration', 'oc.lazyLoad'
]);
// editviewapp.apipath = 'http://183.82.0.58:8025/Api/';
editviewapp.apipath = 'http://183.82.0.58:8010/Api/';

editviewapp.GlobalImgPath = 'http://d16o2fcjgzj2wp.cloudfront.net/';
editviewapp.GlobalImgPathforimage = 'https://s3.ap-south-1.amazonaws.com/kaakateeyaprod/';

editviewapp.prefixPath = 'Images/ProfilePics/';
editviewapp.S3PhotoPath = '';
editviewapp.Mnoimage = editviewapp.GlobalImgPath + "Images/customernoimages/Mnoimage.jpg";
editviewapp.Fnoimage = editviewapp.GlobalImgPath + "Images/customernoimages/Fnoimage.jpg";
editviewapp.accesspathdots = editviewapp.GlobalImgPathforimage + editviewapp.prefixPath;

editviewapp.BucketName = 'kaakateeyaprod';

editviewapp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {

    var states = [
        // { name: 'editEducation', url: '/' },
        { name: 'editEducation', url: '/', subname: ['common/directives/datePickerDirective.js'] },
        { name: 'editManagePhoto', url: '/editManagePhoto', subname: ['common/services/selectBindServices.js'] },
        { name: 'editParent', url: '/editParent', subname: [] },
        { name: 'editPartnerpreference', url: '/editPartnerpreference', subname: [] },
        { name: 'editSibbling', url: '/editSibbling', subname: [] },
        { name: 'editAstro', url: '/editAstro', subname: [] }


    ];
    $ocLazyLoadProvider.config({
        debug: true
    });
    $urlRouterProvider.otherwise('/editEducation');

    _.each(states, function(item) {

        var innerView = {};

        innerView = {
            "lazyLoadView@": {
                templateUrl: item.name + '/index.html',
                controller: item.name + 'Ctrl as page'
            }
        };

        $stateProvider.state(item.name, {
            url: item.url,
            views: innerView,
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load(['' + item.name + '/controller/' + item.name + 'ctrl.js', '' + item.name + '/model/' + item.name + 'Mdl.js', '' + item.name + '/service/' + item.name + 'service.js', item.subname]);
                }]
            }
        });
        $locationProvider.html5Mode(true);
    });
}]);