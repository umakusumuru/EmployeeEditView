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
         .controller('parametervalueCtrl', controller)

     controller.$inject = ['$location'];
 })(angular);