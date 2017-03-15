(function(angular) {
    'use strict';

    function factory(http) {
        return {
            submitBasicRegistration: function(obj) {
                console.log(obj);
                return http.post(regApp.apipath + 'Registration/RegisterCustomerHomepages', JSON.stringify(obj));
            },
            emailExists: function(obj) {
                return http.get(regApp.apipath + 'StaticPages/getEmailMobilenumberexists', { params: obj });
            }
        };
    }

    angular
        .module('KaakateeyaEmpReg')
        .factory('basicRegistrationService', factory)

    factory.$inject = ['$http'];
})(angular);