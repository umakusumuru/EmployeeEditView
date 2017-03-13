(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getContactData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonalContact_Details', { params: { CustID: obj } });
            },
            submitContactData: function(obj1) {
                console.log(JSON.stringify(obj1));
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerContactDetails_Update', JSON.stringify(obj1));
            },
            submitContactReferenceData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/UpdateContactdetails_Reference', JSON.stringify(obj1));
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editContactService', factory)

    factory.$inject = ['$http'];
})(angular);