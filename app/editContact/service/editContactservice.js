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
            },
            submitPrimaryRelationData: function(obj) {
                console.log(JSON.stringify(obj));

                return http.get(editviewapp.apipath + 'CustomerPersonal/getCandidateContactdetailsRelationName', {
                    params: { CustID: obj.CustID, PrimaryMobileRel: obj.PrimaryMobileRel, PrimaryEmailRel: obj.PrimaryEmailRel, iflage: obj.iflage }
                });
            },

            sendMobileCode: function(obj) {
                return http.get(editviewapp.apipath + 'StaticPages/getResendmobile', { params: { iCountryID: obj.iCountryID, iCCode: obj.iCCode, MobileNumber: obj.MobileNumber, CustContactNumbersID: obj.CustContactNumbersID } });
            },
            verifyEmail: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCandidateContactsendmailtoemailverify', { params: { CustID: obj } });
            },
            verifyMobile: function(VCode, flag, CustContactnumID) {
                return http.get(editviewapp.apipath + 'StaticPages/getEmilVerificationCode', { params: { VerificationCode: VCode, i_EmilMobileVerification: flag, CustContactNumbersID: CustContactnumID } });
            },
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editContactService', factory)

    factory.$inject = ['$http'];
})(angular);