(function(angular) {
    'use strict';


    function factory(editProfileSettingService, authSvc, alertss, commonFactory, uibModal) {

        var model = {};
        model.scope = {};

        var logincustid = authSvc.getCustId();
        var custID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;

        model.profileSettingArr = [];
        model.ConfidentialArr = [];
        model.profileDisplayArr = [];
        model.gradeSelectionArr = [];

        model.psObj = {};
        model.csObj = {};
        model.psdObj = {};
        model.gradeObj = {};


        model.init = function() {

            model.pageload();
            return model;
        };


        model.pageload = function() {

            editProfileSettingService.getProfileSettingData(custID).then(function(response) {
                debugger;
                if (response.data.length > 0) {
                    model.profileSettingArr = response.data[0].length > 0 ? JSON.parse(response.data[0]) : [];
                    model.ConfidentialArr = response.data[1].length > 0 ? JSON.parse(response.data[1]) : [];
                    model.profileDisplayArr = response.data[2].length > 0 ? JSON.parse(response.data[2]) : [];
                    model.gradeSelectionArr = response.data[3] !== undefined && response.data[3].length > 0 ? JSON.parse(response.data[3]) : [];
                    console.log(model.profileSettingArr);
                }
            });
        };


        model.populategrade = function(item) {
            return item === 'A' ? '216' : (item === 'B' ? '217' : (item === 'C' ? '218' : (item === 'D' ? '219' : 0)));
        };

        model.showprofilepopup = function(type, item) {

            switch (type) {

                case 'profileSetting':

                    if (item !== undefined) {
                        model.psObj.rdlapplicationstatus = item.ProfileStatusID;
                        model.psObj.txtnoofdaysinactive = item.NoofDaysinactivated;
                        model.psObj.txtreasonforinactive = item.Reason4InActive;
                        model.psObj.ddlrequestedby = item.RequestedByGenericID;
                        model.psObj.rdlprofilegrade = item.ProfileGradeID;

                    }

                    commonFactory.open('profileSettingContent.html', model.scope, uibModal);

                    break;

                case 'profileDisplay':


                    if (item !== undefined) {
                        model.psdObj.rdldisplayin = item.ProfileDisplayNameID;
                        model.psdObj.rdlpwdblock = item.LoginStatusNameID;
                        model.psdObj.txtblockedreason = item.ProfileBlockReason;

                    }


                    commonFactory.open('profileDisplayContent.html', model.scope, uibModal);

                    break;

                case 'confidential':
                    commonFactory.open('confidentialContent.html', model.scope, uibModal);

                    break;

                case 'grading':
                    debugger;
                    if (item !== undefined) {

                        model.gradeObj.ddlfamilyGrade = model.populategrade(item.FamilyGrade);
                        model.gradeObj.ddlphotoGrade = model.populategrade(item.PhotoGrade);
                        model.gradeObj.ddlEducationgrade = model.populategrade(item.EducationGrade);
                        model.gradeObj.ddlProfessionGrade = model.populategrade(item.ProfileGrade);
                        model.gradeObj.ddlpropertyGrade = model.populategrade(item.PropertyGrade);
                    }

                    commonFactory.open('gradeSelectionContent.html', model.scope, uibModal);

                    break;
            }
        };

        model.cancel = function() {
            commonFactory.closepopup();
        };


        model.gradeSubmit = function(obj) {
            model.Mobj = {
                CustID: custID,
                EmpID: '2',
                GFamily: obj.ddlfamilyGrade,
                GPhotos: obj.ddlphotoGrade,
                GEducation: obj.ddlEducationgrade,
                GProfession: obj.ddlProfessionGrade,
                GProperty: obj.ddlpropertyGrade
            };

            editProfileSettingService.submitGradeData(model.Mobj).then(function(response) {
                console.log(response);
                model.pageload();
                commonFactory.closepopup();

            });
        };

        model.profileSettingAndDispalySubmit = function(IProfileDisplayName, ILoginStatusName, IBlockedreason, ITypeofReport, Icurrentprofilestatusid, Iprofilegrade, INoofDaysinactivated, IReason4InActive,
            IRequestedBy) {

            model.Mobj = {
                intCusID: custID,
                EmpID: '2',
                currentprofilestatusid: Icurrentprofilestatusid,
                profilegrade: Iprofilegrade,
                NoofDaysinactivated: INoofDaysinactivated,
                Reason4InActive: IReason4InActive,
                RequestedBy: Icurrentprofilestatusid === 55 || Icurrentprofilestatusid === '55' ? IRequestedBy : null,
                TypeofReport: ITypeofReport,

                ProfileDisplayName: IProfileDisplayName,
                LoginStatusName: ILoginStatusName,
                Admin: null,
                Blockedreason: IBlockedreason
            };
            debugger;
            editProfileSettingService.submitProfileSettingAndDispalyData(model.Mobj).then(function(response) {
                console.log(response);
                model.pageload();
                commonFactory.closepopup();
            });

        };


        model.profileSettingSubmit = function(obj) {
            model.profileSettingAndDispalySubmit('', '', '', "ProfileSettings", obj.rdlapplicationstatus, obj.rdlprofilegrade, obj.txtnoofdaysinactive, obj.txtreasonforinactive,
                obj.ddlrequestedby);
        };

        model.profileSettingDisplaySubmit = function(obj) {
            model.profileSettingAndDispalySubmit(obj.rdldisplayin, obj.rdlpwdblock, obj.txtblockedreason, 'DisplaySettings');
        };


        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editProfileSettingModel', factory)

    factory.$inject = ['editProfileSettingService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);