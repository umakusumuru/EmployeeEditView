(function(angular) {
    'use strict';


    function factory(baseService, authSvc) {
        var model = {};
        var logincustid = authSvc.getCustId();
        var CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;

        model.init = function() {
            baseService.personalDetails(CustID).then(function(response) {
                debugger;
                model.PersonalObj = response.data;
                model.imgsrc = authSvc.getprofilepic();

                console.log(response.data);

                if (model.PersonalObj != null && model.PersonalObj != undefined) {
                    baseService.nodatastatus(model.PersonalObj.ProfileID).then(function(res) {
                        model.rev = res.data;
                    });
                }
            });

            model.unreviewedLinks();
            return model;
        };

        model.unreviewedLinks = function() {
            baseService.menuReviewstatus(CustID).then(function(response) {
                model.menuReviewdata = JSON.parse(response.data);
                _.each(model.menuReviewdata, function(item) {
                    var SectionID = item.SectionID;
                    if (SectionID === 11 || SectionID === 12 || SectionID === 13 || SectionID == 15) {
                        model.lnkparentsReview = true;
                    }
                    if (SectionID === 14 || SectionID === 25 || SectionID === 26) {
                        model.lnksiblingsReview = true;
                    }
                    if (SectionID === 27 || SectionID === 28 || SectionID === 32 || SectionID === 33) {
                        model.lnkrelativesReview = true;
                    }
                    if (SectionID === 6 || SectionID === 7 || SectionID === 8) {
                        model.lnkeducationandprofReview = true;
                    }
                    if (SectionID === 16 || SectionID === 22) {
                        model.lnkpartnerReview = true;
                    }
                    if (SectionID === 23) {
                        model.lnkastroReview = true;
                    }
                    if (SectionID === 29) {
                        model.lnkreferenceReview = true;
                    }
                    if (SectionID === 34) {
                        model.lnkpropertyReview = true;
                    }
                });
            });
        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('baseModel', factory)
    factory.$inject = ['baseService', 'authSvc'];

})(angular);