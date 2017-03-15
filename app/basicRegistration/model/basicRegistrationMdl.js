(function(angular) {
    'use strict';


    function factory(basicRegistrationService, getArray, commondependency, filter, authSvc, timeout, route, SelectBindServicereg) {

        var model = {};
        model.scope = {};
        model.init = function() {
            model.pageload();
            return model;
        };
        // start declaretion
        // model.childStayingWith = 'childStayingWith';
        // model.Religion = 'Religion';

        // model.Caste = 'Caste';
        // model.Country = 'Country';

        // model.month = 'month';
        model.reg = {};
        model.monthArr = [];
        model.reg.Chkprivacy = true;
        model.emailrequired = true;
        model.mobilenumberrequired = true;
        model.mobilecountrycoderequired = true;
        var monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        //end declaration

        model.monthBind = function() {

            var option = [];

            _.each(monthArr, function(item) {
                option.push({ "label": item, "title": item, "value": item });
            });
            return option;
        };
        model.date = function(str, from, to) {
            var Arr = [];
            // Arr.push({ "label": str, "title": str, "value": '' });
            for (var i = from; i <= to; i++) {
                var strValue = null;
                if (i <= 9) {
                    strValue = "0" + i;
                } else {
                    strValue = i;
                }
                Arr.push({ "label": strValue, "title": strValue, "value": strValue });
            }
            return Arr;
        };

        model.year = function(str, from, to) {
            var Arr = [];
            // Arr.push({ "label": str, "title": str, "value": '' });
            for (var i = to; i >= from; i--) {
                Arr.push({ "label": i, "title": i, "value": i });
            }
            return Arr;
        };



        model.pageload = function() {
            model.monthArr = model.monthBind();
            model.dateArr = model.date('', 1, 31);
            model.yearArr = model.year('', 1936, 1998);

            timeout(function() {
                model.postedby = getArray.GArray('childStayingWith');

                console.log('arrayyyyy');
                console.log(model.postedby);

                model.religion = getArray.GArray('Religion');
                model.Mothertongue = getArray.GArray('Mothertongue');
                model.Caste = getArray.GArray('Caste');
                // model.countryCode = getArray.GArray('countryCode');
            }, 1000);
            timeout(function() {

                // model.Country = getArray.GArray('Country');
                var Country = [],
                    CountryCode = [];
                SelectBindServicereg.CountryWithCode().then(function(response) {

                    _.each(response.data, function(item) {
                        Country.push({ "label": item.Name, "title": item.Name, "value": item.ID });
                        CountryCode.push({ "label": item.CountryCode, "title": item.CountryCode, "value": item.ID });
                    });

                    console.log('test..');
                    console.log(Country);

                    model.Country = Country;
                    model.countryCode = CountryCode;
                });

            }, 100);

        };









        model.statuses = ['Planned', 'Confirmed', 'Cancelled'];

        model.dayChange = function(obj, type) {

            var months31 = 'Jan,Mar,May,Jul,Aug,Oct,Dec';
            var minth30 = 'Apr,Jun,Sep,Nov';
            var month28 = 'Feb';
            if ((obj.ddlDD <= 30 && minth30.indexOf(obj.ddlMM) !== -1) || (obj.ddlDD <= 31 && months31.indexOf(obj.ddlMM) !== -1) || ((obj.ddlDD <= 28 && month28.indexOf(obj.ddlMM) !== -1))) {

            } else {
                if (type === 'day') {
                    obj.ddlMM = '';
                } else {
                    model.dateArr = [];
                    model.dateArr = model.date('DD', 1, 31);
                    obj.ddlDD = '';
                }
            }
        };

        model.changeBind = function(parentval, parentval2) {
            if (parentval !== undefined && parentval !== null && parentval !== '' && parentval2 !== undefined && parentval2 !== null && parentval2 !== '')
                model.casteArr = commondependency.casteDepedency(commondependency.listSelectedVal(parentval), commondependency.listSelectedVal(parentval2));

        };

        model.regSubmit = function(obj) {

            var valmm = _.indexOf(monthArr, obj.ddlMM);

            valmm = (valmm != -1 ? parseInt(valmm) + 1 : 0);
            valmm = valmm >= 10 ? valmm : '0' + valmm;
            var date = obj.ddlDD + '-' + valmm + '-' + obj.ddlYear;
            var inputObj = {
                strFirstName: obj.txtfirstname,
                strLastName: obj.txtlastname,
                dtDOB: date !== '' ? filter('date')(date, 'yyyy-MM-dd') : null,
                intGenderID: obj.rbtngender,
                intReligionID: obj.ddlreligion,
                intMotherTongueID: obj.ddlmothertongue,
                intCasteID: obj.ddlcaste,
                intCountryLivingID: obj.ddlcountry,
                intMobileCode: obj.ddlmobilecountry,
                intLandCode: obj.ddllandcountry,
                IsCustomer: 0,
                strMobileNo: (obj.txtMobileNo !== '') && (obj.txtMobileNo !== null) && (obj.txtMobileNo !== undefined) ? (obj.txtMobileNo) : "0000000000",
                ID: 1,
                strAreaCode: (obj.txtArea !== '') && (obj.txtArea !== null) && (obj.txtArea !== undefined) ? obj.txtArea : '',
                strLandNo: (obj.txtlandNum !== '') && (obj.txtlandNum !== null) && (obj.txtlandNum !== undefined) ? obj.txtlandNum : '',
                strEmail: (obj.txtEmail !== '') && ((obj.txtEmail) !== null) && ((obj.txtEmail) !== undefined) ? obj.txtEmail : "kmpl@gmail.com",
                strPassword: (obj.txtpassword !== '') && (obj.txtpassword !== null) && (obj.txtpassword !== undefined) ? obj.txtpassword : "Admin@123",
                intProfileRegisteredBy: null,
                intEmpID: 2,
                intCustPostedBY: obj.ddlpostedby,
                //strMobileVerificationCode: obj.
            };
            console.log(inputObj);
            basicRegistrationService.submitBasicRegistration(inputObj).then(function(res) {
                console.log(res);
                model.genderID = 0;
                authSvc.login(model.reg.txtEmail, "Admin@123").then(function(response) {
                    console.log(response);
                    authSvc.user(response.response !== null ? response.response[0] : null);
                    model.genderID = response.response[0].GenderID;
                    //  window.location = "registration/seconadryRegistration/" + obj.txtfirstname + "/" + obj.txtlastname + "/" + obj.ddlcountry + "/" + response.response[0].GenderID;
                    route.go('registration.seconadryRegistration', { fn: obj.txtfirstname, ln: obj.txtlastname, countryID: obj.ddlcountry, genderID: response.response[0].GenderID });
                    return false;
                });
            });
        };

        model.valueExists = function(type, flag, val) {
            if (val !== undefined) {
                basicRegistrationService.emailExists({ iflagEmailmobile: flag, EmailMobile: val }).then(function(response) {

                    console.log(response);
                    if (response.data === 1) {
                        if (type === 'email') {
                            model.reg.txtEmail = '';
                            alert('Email Already Exists');
                        } else {
                            model.reg.txtMobileNo = '';
                            alert('Mobile number Already Exists');
                        }
                    } else {
                        if (model.reg.Chkfree_reg === true) {
                            if (type === 'email') {
                                model.emailrequired = true;
                                model.mobilenumberrequired = false;
                                model.mobilecountrycoderequired = false;
                            } else {
                                model.emailrequired = false;
                                model.mobilenumberrequired = true;
                                model.mobilecountrycoderequired = true;
                            }
                        }
                    }
                });
            }
        };
        model.mobilemailvalidation = function() {
            if (model.reg.Chkfree_reg === true) {

                if ((model.reg.txtEmail === null || model.reg.txtEmail === "" || model.reg.txtEmail === undefined) && (model.reg.txtMobileNo === null || model.reg.txtMobileNo === "" || model.reg.txtMobileNo === undefined)) {
                    model.emailrequired = false;
                    model.mobilenumberrequired = true;
                    model.mobilecountrycoderequired = true;
                } else if ((model.reg.txtEmail !== null && model.reg.txtEmail !== "" && model.reg.txtEmail !== undefined) || (model.reg.txtMobileNo !== null && model.reg.txtMobileNo !== "" && model.reg.txtMobileNo !== undefined)) {
                    model.emailrequired = false;
                    model.mobilenumberrequired = false;
                    model.mobilecountrycoderequired = false;
                }
            } else {
                model.emailrequired = true;
                model.mobilenumberrequired = true;
                model.mobilecountrycoderequired = true;

            }
        };

        // model.scope.$watch(function() {
        //     return model.reg.ddlcountry;
        // }, function(current, original) {
        //     model.reg.ddllandcountry = model.reg.ddlmobilecountry = current;
        // });



        model.redirectprivacy = function(type) {
            window.open('registration/privacyPolicy', '_blank');
        };





        return model.init();
    }

    angular
        .module('KaakateeyaEmpReg')
        .factory('basicRegistrationModel', factory)

    factory.$inject = ['basicRegistrationService', 'getArray', 'Commondependency',
        '$filter', 'authSvc', '$timeout', 'route', 'SelectBindServicereg'
    ];



    // factory.$inject = ['basicRegistrationService', '$scope', 'getArray', 'Commondependency',
    //     '$filter', 'authSvc', '$timeout', 'route', 'SelectBindServicereg',
    // ];

})(angular);