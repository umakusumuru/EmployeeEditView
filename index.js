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
editviewapp.apipath = 'http://183.82.0.58:8025/Api/';
// editviewapp.apipath = 'http://183.82.0.58:8010/Api/';

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
        { name: 'editview', url: '', subname: [], abstract: true },
        { name: 'editview.editEducation', url: '/editEducation', subname: ['common/directives/datePickerDirective.js'] },
        { name: 'editview.editManagePhoto', url: '/editManagePhoto', subname: ['common/services/selectBindServices.js'] },
        { name: 'editview.editParent', url: '/editParent', subname: [] },
        { name: 'editview.editPartnerpreference', url: '/editPartnerpreference', subname: [] },
        { name: 'editview.editSibbling', url: '/editSibbling', subname: [] },
        { name: 'editview.editAstro', url: '/editAstro', subname: [] },
        { name: 'editview.editProperty', url: '/editProperty', subname: [] },
        { name: 'editview.editRelative', url: '/editRelative', subname: [] },
        { name: 'editview.editReference', url: '/editReference', subname: [] },
        { name: 'editview.editSpouse', url: '/editSpouse', subname: [] },
        { name: 'editview.editContact', url: '/editContact', subname: [] },
        { name: 'editview.editOfcePurpose', url: '/editOfcePurpose', subname: [] },
        { name: 'editview.editProfileSetting', url: '/editProfileSetting', subname: [] }

    ];
    $ocLazyLoadProvider.config({
        debug: true
    });
    $urlRouterProvider.otherwise('/editEducation');

    _.each(states, function(item) {

        var innerView = {};
        var edititem = item.name.slice(9);
        innerView = {
            "lazyLoadView@": {
                templateUrl: edititem + '/index.html',
                controller: edititem + 'Ctrl as page'
            }
        };

        $stateProvider.state(item.name, {
            url: item.url,
            views: innerView,
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    var edit = item.name.slice(9);
                    console.log(edit);
                    return $ocLazyLoad.load(['' + edit + '/controller/' + edit + 'ctrl.js', '' + edit + '/model/' + edit + 'Mdl.js', '' + edit + '/service/' + edit + 'service.js', item.subname]);
                }]
            }
        });
        $locationProvider.html5Mode(true);
    });
}]);