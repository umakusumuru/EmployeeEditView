 (function(angular) {
     'use strict';

     function controller(basicRegistrationModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = basicRegistrationModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpReg')
         .controller('basicRegistrationCtrl', controller)

     controller.$inject = ['basicRegistrationModel', '$scope'];
 })(angular);