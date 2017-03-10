(function(angular) {
    'use strict';


    function factory(editSpouseService, authSvc, alertss, commonFactory, uibModal, filter) {
        var model = {};
        model.scope = {};
        var logincustid = authSvc.getCustId();
        var custID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        model.spouseArray = [];
        model.ChildArray = [];
        model.spouObj = {};
        model.childObj = {};
        model.noofChldrenAray = commonFactory.numbersBind('', 0, 10);


        model.init = function() {
            model.pageload();
            return model;
        };

        model.pageload = function() {
            editSpouseService.getSpouseData(custID).then(function(response) {
                if (response.data.length > 0) {
                    model.spouseArray = response.data[0].length > 0 ? JSON.parse(response.data[0]) : [];
                    model.ChildArray = response.data[1].length > 0 ? JSON.parse(response.data[1]) : [];
                    console.log(model.spouseArray);
                    console.log(model.ChildArray);
                }

            });
        };


        model.populatepopup = function(type, item) {
            switch (type) {

                case 'Spouse':
                    model.spouObj.Cust_Spouse_ID = null;
                    model.spouObj = {};
                    if (item !== undefined) {
                        model.spouObj.Cust_Spouse_ID = item.Cust_Spouse_ID;
                        model.spouObj.txtSpousename = item.NAME;
                        model.spouObj.txtSpoueEducation = item.EducationDetails;
                        model.spouObj.txtspouseProfession = item.ProfessionDetails;
                        model.spouObj.txtHouseFlatnumber = item.HouseFlatNumberID;
                        model.spouObj.txtApartmentname = item.AppartmentName;
                        model.spouObj.txtStreetname = item.StreetName;
                        model.spouObj.txtAreaname = item.AreaName;
                        model.spouObj.txtLandmark = item.LandMark;
                        model.spouObj.ddlspouseCountry = item.Country;
                        model.spouObj.ddlspouseState = item.STATE;
                        model.spouObj.ddlspouseDistrict = item.District;
                        model.spouObj.ddlspouseCity = item.City;
                        model.spouObj.txtspouseZip = item.Zip;
                        model.spouObj.txtMarriedon = item.MarriageDate;
                        model.spouObj.txtSeparateddate = item.SeperatedDate;
                        model.spouObj.rbtspousediverse = item.LeagallyDivorceID;
                        model.spouObj.txtLegalDivorsedate = item.DateofLegallDivorce;
                        model.spouObj.txtspousefather = item.FatherFirstName;
                        model.spouObj.txtspouselastname = item.FatherLastName;
                        model.spouObj.txtpreviousmarriage = item.ReasonforDivorce;
                        model.spouObj.rbtnspousefamily = item.MyFamilyPlanningID;
                        model.spouObj.ddlspousechidrens = item.NoOfChildrens;
                    }

                    commonFactory.open('SpouseContent.html', model.scope, uibModal);
                    break;

                case 'Child':

                    model.childObj.Cust_Children_ID = null;
                    model.childObj = {};
                    if (item !== undefined) {
                        model.childObj.Cust_Children_ID = item.Cust_Children_ID;
                        model.childObj.txtchildname = item.ChildName;
                        model.childObj.rdlgenderchild = item.ChildGender;
                        debugger;
                        model.childObj.txtdobchild = commonFactory.convertDateFormat(item.ChildDOB, 'DD-MM-YYYY');
                        model.childObj.rbtChildstayingWith = item.ChildStayingWithID;
                        model.childObj.ddlrelation = item.ChildStayingWithRelation;
                    }
                    commonFactory.open('spouseChildContent.html', model.scope, uibModal);

                    break;
            }

        };

        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.spouseSubmit = function(obj) {
            model.SpouseData = {
                GetDetails: {
                    CustID: custID,
                    NAME: obj.txtSpousename,
                    Education: obj.txtSpoueEducation,
                    Profession: obj.txtspouseProfession,
                    HouseFlatnumber: obj.txtHouseFlatnumber,
                    Apartmentname: obj.txtApartmentname,
                    Streetname: obj.txtStreetname,
                    Areaname: obj.txtAreaname,
                    Landmark: obj.txtLandmark,
                    Country: obj.ddlspouseCountry,
                    STATE: obj.ddlspouseState,
                    District: obj.ddlspouseDistrict,
                    City: obj.ddlspouseCity,
                    Zip: obj.txtspouseZip,
                    Marriedon: obj.txtMarriedon !== '' && obj.txtMarriedon !== 'Invalid date' ? filter('date')(obj.txtMarriedon, 'yyyy-MM-dd') : null,
                    Separateddate: obj.txtSeparateddate !== '' && obj.txtSeparateddate !== 'Invalid date' ? filter('date')(obj.txtSeparateddate, 'yyyy-MM-dd') : null,
                    Legallydivorced: obj.rbtspousediverse,
                    Dateoflegaldivorce: obj.txtLegalDivorsedate !== '' && obj.txtLegalDivorsedate !== 'Invalid date' ? filter('date')(obj.txtLegalDivorsedate, 'yyyy-MM-dd') : null,
                    Uploaddivorcedocument: null,
                    Fatherfirstname: obj.txtspousefather,
                    Fatherlastname: obj.txtspouselastname,
                    Notesaboutpreviousmarriage: obj.txtpreviousmarriage,
                    Familyplanning: obj.rbtnspousefamily,
                    Noofchildren: obj.ddlspousechidrens,
                    Cust_Spouse_ID: model.spouObj.Cust_Spouse_ID
                },
                customerpersonaldetails: {
                    intCusID: custID,
                    EmpID: null,
                    Admin: null
                }
            };
            debugger;
            console.log(JSON.stringify(model.SpouseData));

            editSpouseService.submitSpouseData(model.SpouseData).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                model.pageload();
            });



        };

        model.childSubmit = function(obj) {
            model.childData = {
                GetDetails: {
                    CustID: custID,
                    Nameofthechild: obj.txtchildname,
                    Genderofthechild: obj.rdlgenderchild,
                    DOB: obj.txtdobchild !== '' && obj.txtdobchild !== 'Invalid date' ? filter('date')(obj.txtdobchild, 'yyyy-MM-dd') : null,
                    Childstayingwith: obj.rbtChildstayingWith,
                    Childstayingwithrelation: obj.ddlrelation,
                    Cust_Children_ID: model.childObj.Cust_Children_ID
                },
                customerpersonaldetails: {
                    intCusID: custID,
                    EmpID: null,
                    Admin: null
                }
            };

            editSpouseService.submitChildeData(model.childData).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                model.pageload();
            });


        };



        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editSpouseModel', factory)

    factory.$inject = ['editSpouseService', 'authSvc', 'alert', 'commonFactory', '$uibModal', '$filter'];

})(angular);