/**
 * AngularJS 
 * @author vinu <vinodanasuri@gmail.com>
 */

/**
 * Main App Creation
 */

<<<<<<< HEAD
var editviewapp = angular.module('KaakateeyaEmpEdit', ['ui.router', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'ngIdle', 'ngMaterial',
    'ngMessages', 'ngAria', 'ngPassword', 'jcs-autoValidate', 'angularPromiseButtons', 'KaakateeyaRegistration', 'oc.lazyLoad'
]);
editviewapp.apipath = 'http://183.82.0.58:8025/Api/';
// editviewapp.apipath = 'http://183.82.0.58:8010/Api/';
editviewapp.env = 'dev';
=======
var regapp = angular.module('KaakateeyaEmpReg', ['ui.router', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'ngIdle', 'ngMaterial',
    'ngMessages', 'ngAria', 'ngPassword', 'jcs-autoValidate', 'angularPromiseButtons', 'KaakateeyaRegistration', 'oc.lazyLoad'
]);
regapp.apipath = 'http://183.82.0.58:8025/Api/';
// regapp.apipath = 'http://183.82.0.58:8010/Api/';
regapp.env = 'dev';
>>>>>>> d43c54e4e3d91d181712ba9e4a4e2f94ead83678

regapp.GlobalImgPath = 'http://d16o2fcjgzj2wp.cloudfront.net/';
regapp.GlobalImgPathforimage = 'https://s3.ap-south-1.amazonaws.com/kaakateeyaprod/';

regapp.prefixPath = 'Images/ProfilePics/';
regapp.S3PhotoPath = '';
regapp.Mnoimage = regapp.GlobalImgPath + "Images/customernoimages/Mnoimage.jpg";
regapp.Fnoimage = regapp.GlobalImgPath + "Images/customernoimages/Fnoimage.jpg";
regapp.accesspathdots = regapp.GlobalImgPathforimage + regapp.prefixPath;

regapp.BucketName = 'kaakateeyaprod';
regapp.editName = 'edit/:custId/';

regapp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {
    var states = [
        { name: 'reg', url: '', subname: [], abstract: true },
        { name: 'reg.basicRegistration', url: '/Education', subname: ['common/directives/datePickerDirective.js'] },
        { name: 'reg.secondaryRegistration', url: '/secondaryRegistrationurl', subname: ['common/directives/datePickerDirective.js'] }

    ];
    $ocLazyLoadProvider.config({
        debug: true
    });
    $urlRouterProvider.otherwise('/Education');

    _.each(states, function(item) {

        var innerView = {};
        var regitem = item.name.slice(4);
        innerView = {
            "topbar@": {
                templateUrl: "templates/topheader.html"
            },
            "lazyLoadView@": {
                templateUrl: 'app/' + regitem + '/index.html',
                controller: regitem + 'Ctrl as page'
            },
            "bottompanel@": {
                templateUrl: "templates/footer.html"
            }
        };

        $stateProvider.state(item.name, {
            url: item.url,
<<<<<<< HEAD
            views: innerView
                // resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                //     loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                //         // you can lazy load files for an existing module
                //         var edit = item.name.slice(9);
                //         if (editviewapp.env === 'dev') {
                //             return $ocLazyLoad.load(['app/' + edit + '/controller/' + edit + 'ctrl.js', 'app/' + edit + '/model/' + edit + 'Mdl.js', 'app/' + edit + '/service/' + edit + 'service.js', item.subname]);

            //         } else {
            //             return $ocLazyLoad.load(['app/' + edit + '/src/script.min.js', item.subname]);
            //         }
=======
            views: innerView,
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    // var edit = item.name.slice(9);
                    if (regapp.env === 'dev') {
                        return $ocLazyLoad.load(['app/' + regitem + '/controller/' + regitem + 'ctrl.js', 'app/' + regitem + '/model/' + regitem + 'Mdl.js', 'app/' + regitem + '/service/' + regitem + 'service.js', item.subname]);
                    } else {
                        return $ocLazyLoad.load(['app/' + regitem + '/src/script.min.js', item.subname]);
                    }
>>>>>>> d43c54e4e3d91d181712ba9e4a4e2f94ead83678

            //         // return $ocLazyLoad.load(['app/' + edit + '/controller/' + edit + 'ctrl.js', 'app/' + edit + '/model/' + edit + 'Mdl.js', 'app/' + edit + '/service/' + edit + 'service.js', item.subname]);
            //     }]
            // }
        });
        $locationProvider.html5Mode(true);
    });

}]);