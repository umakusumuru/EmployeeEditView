(function(angular) {
    'use strict';

    function factory(http) {
        return {
            personalDetails: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getpersonalMenuDetails', { params: { CustID: obj } });
            },
            menuReviewstatus: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonalMenuReviewStatus', { params: { CustID: obj } });
            },
            nodatastatus: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonalMenuReviewStatus', { params: { CustID: obj } });
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('baseService', factory)

    factory.$inject = ['$http'];
})(angular);