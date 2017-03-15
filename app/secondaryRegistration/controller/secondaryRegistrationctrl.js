 (function(angular) {
     'use strict';

     function controller($location) {
         /* jshint validthis:true */
         var vm = this;

         activate();

         function activate() {}
     }
     angular
         .module('KaakateeyaEmpReg')
         .controller('secondaryRegistrationCtrl', controller)

     controller.$inject = ['$location'];
 })(angular);