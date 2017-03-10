(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getofficeData: function(iflag, obj, text) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonaloffice_purpose', { params: { flag: iflag, ID: obj, AboutProfile: text } });
            }

        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editOfcePurposeService', factory)

    factory.$inject = ['$http'];
})(angular);