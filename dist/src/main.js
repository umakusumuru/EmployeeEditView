'use strict';
/**
 * Main App Creation
 */

var editviewapp = angular.module('KaakateeyaEmpEdit', ['ui.router', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'ngIdle', 'ngMaterial',
    'ngMessages', 'ngAria', 'ngPassword', 'jcs-autoValidate', 'angularPromiseButtons', 'KaakateeyaRegistration', 'oc.lazyLoad'
]);
editviewapp.apipath = 'http://183.82.0.58:8025/Api/';
// editviewapp.apipath = 'http://183.82.0.58:8010/Api/';
editviewapp.env = 'dev';

editviewapp.GlobalImgPath = 'http://d16o2fcjgzj2wp.cloudfront.net/';
editviewapp.GlobalImgPathforimage = 'https://s3.ap-south-1.amazonaws.com/kaakateeyaprod/';

editviewapp.prefixPath = 'Images/ProfilePics/';
editviewapp.S3PhotoPath = '';
editviewapp.Mnoimage = editviewapp.GlobalImgPath + "Images/customernoimages/Mnoimage.jpg";
editviewapp.Fnoimage = editviewapp.GlobalImgPath + "Images/customernoimages/Fnoimage.jpg";
editviewapp.accesspathdots = editviewapp.GlobalImgPathforimage + editviewapp.prefixPath;

editviewapp.BucketName = 'kaakateeyaprod';
editviewapp.editName = 'edit/:custId/';

editviewapp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {
    var states = [
        { name: 'editview', url: '', subname: [], abstract: true },
        { name: 'editview.editEducation', url: '/Education', subname: ['common/directives/datePickerDirective.js'] },
        { name: 'editview.editManagePhoto', url: '/ManagePhoto', subname: ['common/services/selectBindServices.js'] },
        { name: 'editview.editParent', url: '/Parent', subname: [] },
        { name: 'editview.editPartnerpreference', url: '/Partnerpreference', subname: [] },
        { name: 'editview.editSibbling', url: '/Sibbling', subname: [] },
        { name: 'editview.editAstro', url: '/Astro', subname: [] },
        { name: 'editview.editProperty', url: '/Property', subname: [] },
        { name: 'editview.editRelative', url: '/Relative', subname: [] },
        { name: 'editview.editReference', url: '/Reference', subname: [] },
        { name: 'editview.editSpouse', url: '/Spouse', subname: ['common/directives/datePickerDirective.js'] },
        { name: 'editview.editContact', url: '/Contact', subname: [] },
        { name: 'editview.editOfcePurpose', url: '/OfcePurpose', subname: [] },
        { name: 'editview.editProfileSetting', url: '/ProfileSetting', subname: [] }
    ];
    $ocLazyLoadProvider.config({
        debug: true
    });
    $urlRouterProvider.otherwise('/Education');

    _.each(states, function(item) {

        var innerView = {};
        var edititem = item.name.slice(9);
        innerView = {
            "lazyLoadView@": {
                templateUrl: 'app/' + edititem + '/index.html',
                controller: edititem + 'Ctrl as page'
            }
        };

        $stateProvider.state(item.name, {
            url: item.url,
            views: innerView
                // resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                //     loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                //         // you can lazy load files for an existing module
                //         var edit = item.name.slice(9);
                //         if (editviewapp.env === 'dev') {
                //             return $ocLazyLoad.load(['app/' + edit + '/controller/' + edit + 'ctrl.js', 'app/' + edit + '/model/' + edit + 'Mdl.js', 'app/' + edit + '/service/' + edit + 'service.js', item.subname]);

            //         } else {
            //             return $ocLazyLoad.load(['app/' + edit + '/src/script.min.js', item.subname]);
            //         }

            //         // return $ocLazyLoad.load(['app/' + edit + '/controller/' + edit + 'ctrl.js', 'app/' + edit + '/model/' + edit + 'Mdl.js', 'app/' + edit + '/service/' + edit + 'service.js', item.subname]);
            //     }]
            // }
        });
        $locationProvider.html5Mode(true);
    });

}]);
 (function(angular) {
     'use strict';

     function controller(editAstroModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.scope = scope;
         vm.init = function() {
             vm.model = editAstroModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editAstroCtrl', controller)

     controller.$inject = ['editAstroModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editAstroService, authSvc, alertss, commonFactory, uibModal, fileUpload, http) {

        var model = {};
        model.scope = {};

        // declaration part

        model.atroObj = [];
        model.generateData = [];
        model.ImageUrl = '';
        model.iframeShow = false;
        var s3obj = {};

        var logincustid = authSvc.getCustId();
        var custID = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        var isSubmit = true;

        model.loginpaidstatus = authSvc.getpaidstatus();

        // end declaration part

        model.init = function() {
            model.astropageload();

            return model;
        };

        model.astropageload = function() {

            editAstroService.getAstroData(custID).then(function(response) {

                if (commonFactory.checkvals(response.data[0])) {
                    model.AstroArr = JSON.parse(response.data[0]);
                    model.generateData = JSON.parse(response.data[1]);
                    debugger;
                    if (commonFactory.checkvals(model.AstroArr[0] && commonFactory.checkvals(model.AstroArr[0].Horoscopeimage))) {

                        if (commonFactory.checkvals(model.AstroArr[0].Horoscopeimage) && (model.AstroArr[0].Horoscopeimage).indexOf('Horo_no') === -1) {
                            var extension = "jpg";
                            if ((model.AstroArr[0].Horoscopeimage).indexOf('.html') !== -1) {
                                extension = "html";
                            } else {
                                model.iframeShow = false;
                                extension = "jpg";
                            }

                            model.ImageUrl = editviewapp.GlobalImgPathforimage + "Images/Horoscopeimages/" + custID + "_HaromodelImage/" + custID + "_HaromodelImage." + extension;
                            if (extension === "html") {
                                model.iframeShow = true;
                                $('#iframe').attr('src', model.ImageUrl);
                            }
                        }
                    } else if (commonFactory.checkvals(model.generateData[0].Horoscopeimage) && (model.generateData[0].Horoscopeimage).indexOf('Horo_no') === -1) {
                        if (commonFactory.checkvals(model.generateData[0].Horoscopeimage) && (model.generateData[0].Horoscopeimage).indexOf('Horo_no') === -1) {
                            var extensn = "jpg";
                            if ((model.generateData[0].Horoscopeimage).indexOf('.html') !== -1) {
                                extensn = "html";
                            } else {
                                model.iframeShow = false;
                                extensn = "jpg";
                            }
                            model.ImageUrl = editviewapp.GlobalImgPathforimage + "Images/Horoscopeimages/" + custID + "_HaromodelImage/" + custID + "_HaromodelImage." + extensn;
                            if (extensn === "html") {
                                model.iframeShow = true;
                                $('#iframe').attr('src', model.ImageUrl);
                            }
                        }
                    }



                }

            });

        };

        model.populateAstro = function(item) {

            model.hrsbindArr = commonFactory.numberBindWithZeros('Hours', 0, 23);
            model.minbindArr = commonFactory.numberBindWithZeros('Minutes', 0, 59);
            model.secbindArr = commonFactory.numberBindWithZeros('Seconds', 0, 59);
            isSubmit = true;
            if (item !== undefined) {
                model.starArr = commonFactory.starBind(item.StarLanguageID);

                if (item.TimeOfBirth !== undefined) {
                    model.strdot = ((item.TimeOfBirth).split(' '))[0].split(':');
                    model.atroObj.ddlFromHours = parseInt(model.strdot[0]);
                    model.atroObj.ddlFromMinutes = parseInt(model.strdot[1]);
                    model.atroObj.ddlFromSeconds = parseInt(model.strdot[2]);
                }
                model.atroObj.ddlCountryOfBirthID = item.CountryOfBirthID;
                model.atroObj.ddlStateOfBirthID = item.StateOfBirthID;
                model.atroObj.ddlDistrictOfBirthID = item.DistrictOfBirthID;
                model.atroObj.ddlcity = item.CityOfBirthID;
                model.atroObj.ddlstarlanguage = item.StarLanguageID;
                model.atroObj.ddlstar = item.StarID;
                model.atroObj.ddlpaadam = item.PaadamID;
                model.atroObj.ddlLagnam = item.LagnamID;
                model.atroObj.ddlRaasiMoonsign = item.RaasiID;
                model.atroObj.txtGothramGotra = item.Gothram;
                model.atroObj.txtMaternalgothram = item.MeternalGothramID;
                model.atroObj.rdlkujaDosham = item.manglikID;
            }
            commonFactory.open('astroContent.html', model.scope, uibModal);


        };

        model.changeBind = function(type, parentval) {

            switch (type) {

                case 'star':

                    model.starArr = commonFactory.starBind(parentval);
                    break;
            }
        };

        model.astroSubmit = function(obj) {
            if (isSubmit) {
                isSubmit = false;
                $('#ssss').prop('disabled', true);
                var strFromTimeOfBirth = obj.ddlFromHours + ":" + obj.ddlFromMinutes + ":" + obj.ddlFromSeconds;

                model.astroData = {
                    GetDetails: {
                        CustID: custID,
                        TimeofBirth: strFromTimeOfBirth,
                        CountryOfBirthID: obj.ddlCountryOfBirthID,
                        StateOfBirthID: obj.ddlStateOfBirthID,
                        DistrictOfBirthID: obj.ddlDistrictOfBirthID,
                        CityOfBirthID: obj.ddlcity,
                        Starlanguage: obj.ddlstarlanguage,
                        Star: obj.ddlstar,
                        Paadam: obj.ddlpaadam,
                        Lagnam: obj.ddlLagnam,
                        RasiMoonsign: obj.ddlRaasiMoonsign,
                        GothramGotra: obj.txtGothramGotra,
                        Maternalgothram: obj.txtMaternalgothram,
                        ManglikKujadosham: obj.rdlkujaDosham,
                        Pblongitude: obj.PBlongitude,
                        pblatitude: obj.PBlatitude,
                        TimeZone: null
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editAstroService.submitAstroData(model.astroData).then(function(response) {
                    commonFactory.closepopup();
                    if (response.data === 1) {
                        if (model.datagetInStatus === 1) {
                            sessionStorage.removeItem('missingStatus');
                            route.go('mobileverf', {});
                        }
                        model.astropageload(custID);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);

                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }
        };

        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.uploadGenerateHoro = function(val) {
            debugger;
            if (val === '0') {
                commonFactory.open('AddHoroPopup.html', model.scope, uibModal, 'sm');
            } else {
                if (model.AstroArr.length > 0) {
                    model.generateHoro();
                } else {
                    model.populateAstro();
                }

            }
        };

        model.upload = function(obj) {


            var extension = (obj.myFile.name !== '' && obj.myFile.name !== undefined && obj.myFile.name !== null) ? (obj.myFile.name.split('.'))[1] : null;
            var gifFormat = "gif, jpeg, png,jpg";

            if (typeof(obj.myFile.name) != "undefined") {

                var size = parseFloat(obj.myFile.size / 1024).toFixed(2);
                if (extension !== null && gifFormat.indexOf(angular.lowercase(extension)) === -1) {
                    alert('Your uploaded image contains an unapproved file formats.');
                } else if (size > 4 * 1024) {
                    alert('Sorry,Upload Photo Size Must Be Less than 1 mb');
                } else {
                    // var extension = ((obj.myFile.name).split('.'))[1];
                    var keyname = "Images/Horoscopeimages/" + custID + "_HaromodelImage/" + custID + "_HaromodelImage." + extension;

                    fileUpload.uploadFileToUrl(obj.myFile, '/photoUplad', keyname).then(function(res) {

                        if (res.status == 200) {
                            commonFactory.closepopup();
                            model.uploadData = {
                                Cust_ID: custID,
                                Horopath: '../../' + keyname,
                                ModifiedByEmpID: '',
                                VisibleToID: keyname.indexOf('html') !== -1 ? 1 : '',
                                Empid: '',
                                IsActive: keyname.indexOf('html') !== -1 ? 1 : 0,
                                i_flag: 1
                            };



                            editAstroService.uploadDeleteAstroData(model.uploadData).then(function(response) {

                                commonFactory.closepopup();

                                model.astropageload(custID);

                                model.ImageUrl = editviewapp.GlobalImgPathforimage + "Images/Horoscopeimages/" + custID + "_HaromodelImage/" + custID + "_HaromodelImage." + extension;
                            });
                        }
                    });

                }
            } else {
                alert("This browser does not support HTML5.");
            }
        };

        model.generateHoro = function(astrocity) {
            var check = moment((model.generateData)[0].DateOfBirth, 'YYYY/MM/DD');
            var month = check.format('M');
            var day = check.format('D');
            var year = check.format('YYYY');

            var inputobj = { customerid: custID, EmpIDQueryString: "2", intDay: day, intMonth: month, intYear: year, CityID: commonFactory.checkvals(astrocity) ? astrocity : "" };

            editAstroService.generateHoroscope(inputobj).then(function(response) {
                console.log(response);
                if (commonFactory.checkvals(response.data.AstroGeneration)) {

                    s3obj = { Path: response.data.Path, KeyName: response.data.KeyName };
                    window.open('' + response.data.AstroGeneration + '', '_blank');
                    commonFactory.closepopup();
                    commonFactory.open('RefreshPopup.html', model.scope, uibModal);
                } else {
                    model.AstrocityArr = commonFactory.AstroCity(model.AstroArr[0].CountryOfBirth, model.AstroArr[0].StateOfBirth);
                    commonFactory.open('AstroCityPopup.html', model.scope, uibModal);
                }
            });
        };

        model.deleteHoroImage = function() {

            var extension = "jpg";

            // if ((model.AstroArr[0].Horoscopeimage).indexOf('.html')) {
            //     extension = "html";
            // } else {
            //     extension = "jpg";
            // }
            var keynameq = "Images/Horoscopeimages/" + custID + "_HaromodelImage/" + custID + "_HaromodelImage." + extension;
            http.post('/photoDelete', JSON.stringify({ keyname: keynameq })).then(function(data) {

            });

            model.uploadData = {
                Cust_ID: custID,
                i_flag: 0
            };

            editAstroService.uploadDeleteAstroData(model.uploadData).then(function(response) {

                if (response.data === 1 || response.data === '1') {
                    model.astropageload(custID);
                    commonFactory.closepopup();
                    model.ImageUrl = '';
                    model.atroObj.rdlUploadGenerate = '';
                }
            });
        };
        model.shoedeletePopup = function() {
            commonFactory.open('deletehoroPopup.html', model.scope, uibModal, 'sm');
        };


        model.AstroCityChange = function(val) {
            model.generateHoro(val);
        };

        model.vewHoro = function() {

            if (model.ImageUrl !== null && model.ImageUrl !== '' && model.ImageUrl !== undefined) {
                if (model.ImageUrl.indexOf('.html') !== -1) {
                    window.open('' + model.ImageUrl + '', '_blank');
                } else {
                    commonFactory.open('AstroimagePopup.html', model.scope, uibModal);
                }
            }
        };

        model.generatedhoroS3Upload = function() {
            console.log('s3obj');
            console.log(s3obj);
            editAstroService.GenerateHoroS3(s3obj).then(function(response) {
                console.log(response);
            });
            model.astropageload(custID);
            commonFactory.closepopup();
        };









        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editAstroModel', factory)

    factory.$inject = ['editAstroService', 'authSvc', 'alert', 'commonFactory', '$uibModal', 'fileUpload', '$http'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getAstroData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getAstroDetailsDisplay', { params: { CustID: obj } });
            },
            submitAstroData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerAstrodetailsUpdatedetails', JSON.stringify(obj1));
            },
            uploadDeleteAstroData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/AstroDetailsUpdateDelete', JSON.stringify(obj1));
            },
            generateHoroscope: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonalUpdate/getGenerateHoroscorpe', { params: { customerid: obj.customerid, EmpIDQueryString: obj.EmpIDQueryString, intDay: obj.intDay, intMonth: obj.intMonth, intYear: obj.intYear, CityID: obj.CityID } });
            },

            GenerateHoroS3: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonalUpdate/getAstroGenerationS3Update', { params: { Path: JSON.stringify(obj.Path), KeyName: JSON.stringify(obj.KeyName) } });
            }

        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editAstroService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editAstroModel,scope){var vm=this;vm.scope=scope,vm.init=function(){vm.model=editAstroModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editAstroCtrl",controller),controller.$inject=["editAstroModel","$scope"]}(angular),function(angular){"use strict";function factory(editAstroService,authSvc,alertss,commonFactory,uibModal,fileUpload,http){var model={};model.scope={},model.atroObj=[],model.generateData=[],model.ImageUrl="",model.iframeShow=!1;var s3obj={},logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null,isSubmit=!0;return model.loginpaidstatus=authSvc.getpaidstatus(),model.init=function(){return model.astropageload(),model},model.astropageload=function(){editAstroService.getAstroData(custID).then(function(response){if(commonFactory.checkvals(response.data[0]))if(model.AstroArr=JSON.parse(response.data[0]),model.generateData=JSON.parse(response.data[1]),commonFactory.checkvals(model.AstroArr[0]&&commonFactory.checkvals(model.AstroArr[0].Horoscopeimage))){if(commonFactory.checkvals(model.AstroArr[0].Horoscopeimage)&&model.AstroArr[0].Horoscopeimage.indexOf("Horo_no")===-1){var extension="jpg";model.AstroArr[0].Horoscopeimage.indexOf(".html")!==-1?extension="html":(model.iframeShow=!1,extension="jpg"),model.ImageUrl=editviewapp.GlobalImgPathforimage+"Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extension,"html"===extension&&(model.iframeShow=!0,$("#iframe").attr("src",model.ImageUrl))}}else if(commonFactory.checkvals(model.generateData[0].Horoscopeimage)&&model.generateData[0].Horoscopeimage.indexOf("Horo_no")===-1&&commonFactory.checkvals(model.generateData[0].Horoscopeimage)&&model.generateData[0].Horoscopeimage.indexOf("Horo_no")===-1){var extensn="jpg";model.generateData[0].Horoscopeimage.indexOf(".html")!==-1?extensn="html":(model.iframeShow=!1,extensn="jpg"),model.ImageUrl=editviewapp.GlobalImgPathforimage+"Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extensn,"html"===extensn&&(model.iframeShow=!0,$("#iframe").attr("src",model.ImageUrl))}})},model.populateAstro=function(item){model.hrsbindArr=commonFactory.numberBindWithZeros("Hours",0,23),model.minbindArr=commonFactory.numberBindWithZeros("Minutes",0,59),model.secbindArr=commonFactory.numberBindWithZeros("Seconds",0,59),isSubmit=!0,void 0!==item&&(model.starArr=commonFactory.starBind(item.StarLanguageID),void 0!==item.TimeOfBirth&&(model.strdot=item.TimeOfBirth.split(" ")[0].split(":"),model.atroObj.ddlFromHours=parseInt(model.strdot[0]),model.atroObj.ddlFromMinutes=parseInt(model.strdot[1]),model.atroObj.ddlFromSeconds=parseInt(model.strdot[2])),model.atroObj.ddlCountryOfBirthID=item.CountryOfBirthID,model.atroObj.ddlStateOfBirthID=item.StateOfBirthID,model.atroObj.ddlDistrictOfBirthID=item.DistrictOfBirthID,model.atroObj.ddlcity=item.CityOfBirthID,model.atroObj.ddlstarlanguage=item.StarLanguageID,model.atroObj.ddlstar=item.StarID,model.atroObj.ddlpaadam=item.PaadamID,model.atroObj.ddlLagnam=item.LagnamID,model.atroObj.ddlRaasiMoonsign=item.RaasiID,model.atroObj.txtGothramGotra=item.Gothram,model.atroObj.txtMaternalgothram=item.MeternalGothramID,model.atroObj.rdlkujaDosham=item.manglikID),commonFactory.open("astroContent.html",model.scope,uibModal)},model.changeBind=function(type,parentval){switch(type){case"star":model.starArr=commonFactory.starBind(parentval)}},model.astroSubmit=function(obj){if(isSubmit){isSubmit=!1,$("#ssss").prop("disabled",!0);var strFromTimeOfBirth=obj.ddlFromHours+":"+obj.ddlFromMinutes+":"+obj.ddlFromSeconds;model.astroData={GetDetails:{CustID:custID,TimeofBirth:strFromTimeOfBirth,CountryOfBirthID:obj.ddlCountryOfBirthID,StateOfBirthID:obj.ddlStateOfBirthID,DistrictOfBirthID:obj.ddlDistrictOfBirthID,CityOfBirthID:obj.ddlcity,Starlanguage:obj.ddlstarlanguage,Star:obj.ddlstar,Paadam:obj.ddlpaadam,Lagnam:obj.ddlLagnam,RasiMoonsign:obj.ddlRaasiMoonsign,GothramGotra:obj.txtGothramGotra,Maternalgothram:obj.txtMaternalgothram,ManglikKujadosham:obj.rdlkujaDosham,Pblongitude:obj.PBlongitude,pblatitude:obj.PBlatitude,TimeZone:null},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editAstroService.submitAstroData(model.astroData).then(function(response){commonFactory.closepopup(),1===response.data?(1===model.datagetInStatus&&(sessionStorage.removeItem("missingStatus"),route.go("mobileverf",{})),model.astropageload(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})}},model.cancel=function(){commonFactory.closepopup()},model.uploadGenerateHoro=function(val){"0"===val?commonFactory.open("AddHoroPopup.html",model.scope,uibModal,"sm"):model.AstroArr.length>0?model.generateHoro():model.populateAstro()},model.upload=function(obj){var extension=""!==obj.myFile.name&&void 0!==obj.myFile.name&&null!==obj.myFile.name?obj.myFile.name.split(".")[1]:null;if(void 0!==obj.myFile.name){var size=parseFloat(obj.myFile.size/1024).toFixed(2);if(null!==extension&&"gif, jpeg, png,jpg".indexOf(angular.lowercase(extension))===-1)alert("Your uploaded image contains an unapproved file formats.");else if(size>4096)alert("Sorry,Upload Photo Size Must Be Less than 1 mb");else{var keyname="Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extension;fileUpload.uploadFileToUrl(obj.myFile,"/photoUplad",keyname).then(function(res){200==res.status&&(commonFactory.closepopup(),model.uploadData={Cust_ID:custID,Horopath:"../../"+keyname,ModifiedByEmpID:"",VisibleToID:keyname.indexOf("html")!==-1?1:"",Empid:"",IsActive:keyname.indexOf("html")!==-1?1:0,i_flag:1},editAstroService.uploadDeleteAstroData(model.uploadData).then(function(response){commonFactory.closepopup(),model.astropageload(custID),model.ImageUrl=editviewapp.GlobalImgPathforimage+"Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extension}))})}}else alert("This browser does not support HTML5.")},model.generateHoro=function(astrocity){var check=moment(model.generateData[0].DateOfBirth,"YYYY/MM/DD"),month=check.format("M"),day=check.format("D"),year=check.format("YYYY"),inputobj={customerid:custID,EmpIDQueryString:"2",intDay:day,intMonth:month,intYear:year,CityID:commonFactory.checkvals(astrocity)?astrocity:""};editAstroService.generateHoroscope(inputobj).then(function(response){console.log(response),commonFactory.checkvals(response.data.AstroGeneration)?(s3obj={Path:response.data.Path,KeyName:response.data.KeyName},window.open(""+response.data.AstroGeneration,"_blank"),commonFactory.closepopup(),commonFactory.open("RefreshPopup.html",model.scope,uibModal)):(model.AstrocityArr=commonFactory.AstroCity(model.AstroArr[0].CountryOfBirth,model.AstroArr[0].StateOfBirth),commonFactory.open("AstroCityPopup.html",model.scope,uibModal))})},model.deleteHoroImage=function(){var keynameq="Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage.jpg";http.post("/photoDelete",JSON.stringify({keyname:keynameq})).then(function(data){}),model.uploadData={Cust_ID:custID,i_flag:0},editAstroService.uploadDeleteAstroData(model.uploadData).then(function(response){1!==response.data&&"1"!==response.data||(model.astropageload(custID),commonFactory.closepopup(),model.ImageUrl="",model.atroObj.rdlUploadGenerate="")})},model.shoedeletePopup=function(){commonFactory.open("deletehoroPopup.html",model.scope,uibModal,"sm")},model.AstroCityChange=function(val){model.generateHoro(val)},model.vewHoro=function(){null!==model.ImageUrl&&""!==model.ImageUrl&&void 0!==model.ImageUrl&&(model.ImageUrl.indexOf(".html")!==-1?window.open(""+model.ImageUrl,"_blank"):commonFactory.open("AstroimagePopup.html",model.scope,uibModal))},model.generatedhoroS3Upload=function(){console.log("s3obj"),console.log(s3obj),editAstroService.GenerateHoroS3(s3obj).then(function(response){console.log(response)}),model.astropageload(custID),commonFactory.closepopup()},model.init()}angular.module("KaakateeyaEmpEdit").factory("editAstroModel",factory),factory.$inject=["editAstroService","authSvc","alert","commonFactory","$uibModal","fileUpload","$http"]}(angular),function(angular){"use strict";function factory(http){return{getAstroData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getAstroDetailsDisplay",{params:{CustID:obj}})},submitAstroData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerAstrodetailsUpdatedetails",JSON.stringify(obj1))},uploadDeleteAstroData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/AstroDetailsUpdateDelete",JSON.stringify(obj1))},generateHoroscope:function(obj){return http.get(editviewapp.apipath+"CustomerPersonalUpdate/getGenerateHoroscorpe",{params:{customerid:obj.customerid,EmpIDQueryString:obj.EmpIDQueryString,intDay:obj.intDay,intMonth:obj.intMonth,intYear:obj.intYear,CityID:obj.CityID}})},GenerateHoroS3:function(obj){return http.get(editviewapp.apipath+"CustomerPersonalUpdate/getAstroGenerationS3Update",{params:{Path:JSON.stringify(obj.Path),KeyName:JSON.stringify(obj.KeyName)}})}}}angular.module("KaakateeyaEmpEdit").factory("editAstroService",factory),factory.$inject=["$http"]}(angular),function(angular){"use strict";function controller(editAstroModel,scope){var vm=this;vm.scope=scope,vm.init=function(){vm.model=editAstroModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editAstroCtrl",controller),controller.$inject=["editAstroModel","$scope"]}(angular),function(angular){"use strict";function factory(editAstroService,authSvc,alertss,commonFactory,uibModal,fileUpload,http){var model={};model.scope={},model.atroObj=[],model.generateData=[],model.ImageUrl="",model.iframeShow=!1;var s3obj={},logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null,isSubmit=!0;return model.loginpaidstatus=authSvc.getpaidstatus(),model.init=function(){return model.astropageload(),model},model.astropageload=function(){editAstroService.getAstroData(custID).then(function(response){if(commonFactory.checkvals(response.data[0]))if(model.AstroArr=JSON.parse(response.data[0]),model.generateData=JSON.parse(response.data[1]),commonFactory.checkvals(model.AstroArr[0]&&commonFactory.checkvals(model.AstroArr[0].Horoscopeimage))){if(commonFactory.checkvals(model.AstroArr[0].Horoscopeimage)&&model.AstroArr[0].Horoscopeimage.indexOf("Horo_no")===-1){var extension="jpg";model.AstroArr[0].Horoscopeimage.indexOf(".html")!==-1?extension="html":(model.iframeShow=!1,extension="jpg"),model.ImageUrl=editviewapp.GlobalImgPathforimage+"Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extension,"html"===extension&&(model.iframeShow=!0,$("#iframe").attr("src",model.ImageUrl))}}else if(commonFactory.checkvals(model.generateData[0].Horoscopeimage)&&model.generateData[0].Horoscopeimage.indexOf("Horo_no")===-1&&commonFactory.checkvals(model.generateData[0].Horoscopeimage)&&model.generateData[0].Horoscopeimage.indexOf("Horo_no")===-1){var extensn="jpg";model.generateData[0].Horoscopeimage.indexOf(".html")!==-1?extensn="html":(model.iframeShow=!1,extensn="jpg"),model.ImageUrl=editviewapp.GlobalImgPathforimage+"Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extensn,"html"===extensn&&(model.iframeShow=!0,$("#iframe").attr("src",model.ImageUrl))}})},model.populateAstro=function(item){model.hrsbindArr=commonFactory.numberBindWithZeros("Hours",0,23),model.minbindArr=commonFactory.numberBindWithZeros("Minutes",0,59),model.secbindArr=commonFactory.numberBindWithZeros("Seconds",0,59),isSubmit=!0,void 0!==item&&(model.starArr=commonFactory.starBind(item.StarLanguageID),void 0!==item.TimeOfBirth&&(model.strdot=item.TimeOfBirth.split(" ")[0].split(":"),model.atroObj.ddlFromHours=parseInt(model.strdot[0]),model.atroObj.ddlFromMinutes=parseInt(model.strdot[1]),model.atroObj.ddlFromSeconds=parseInt(model.strdot[2])),model.atroObj.ddlCountryOfBirthID=item.CountryOfBirthID,model.atroObj.ddlStateOfBirthID=item.StateOfBirthID,model.atroObj.ddlDistrictOfBirthID=item.DistrictOfBirthID,model.atroObj.ddlcity=item.CityOfBirthID,model.atroObj.ddlstarlanguage=item.StarLanguageID,model.atroObj.ddlstar=item.StarID,model.atroObj.ddlpaadam=item.PaadamID,model.atroObj.ddlLagnam=item.LagnamID,model.atroObj.ddlRaasiMoonsign=item.RaasiID,model.atroObj.txtGothramGotra=item.Gothram,model.atroObj.txtMaternalgothram=item.MeternalGothramID,model.atroObj.rdlkujaDosham=item.manglikID),commonFactory.open("astroContent.html",model.scope,uibModal)},model.changeBind=function(type,parentval){switch(type){case"star":model.starArr=commonFactory.starBind(parentval)}},model.astroSubmit=function(obj){if(isSubmit){isSubmit=!1,$("#ssss").prop("disabled",!0);var strFromTimeOfBirth=obj.ddlFromHours+":"+obj.ddlFromMinutes+":"+obj.ddlFromSeconds;model.astroData={GetDetails:{CustID:custID,TimeofBirth:strFromTimeOfBirth,CountryOfBirthID:obj.ddlCountryOfBirthID,StateOfBirthID:obj.ddlStateOfBirthID,DistrictOfBirthID:obj.ddlDistrictOfBirthID,CityOfBirthID:obj.ddlcity,Starlanguage:obj.ddlstarlanguage,Star:obj.ddlstar,Paadam:obj.ddlpaadam,Lagnam:obj.ddlLagnam,RasiMoonsign:obj.ddlRaasiMoonsign,GothramGotra:obj.txtGothramGotra,Maternalgothram:obj.txtMaternalgothram,ManglikKujadosham:obj.rdlkujaDosham,Pblongitude:obj.PBlongitude,pblatitude:obj.PBlatitude,TimeZone:null},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editAstroService.submitAstroData(model.astroData).then(function(response){commonFactory.closepopup(),1===response.data?(1===model.datagetInStatus&&(sessionStorage.removeItem("missingStatus"),route.go("mobileverf",{})),model.astropageload(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})}},model.cancel=function(){commonFactory.closepopup()},model.uploadGenerateHoro=function(val){"0"===val?commonFactory.open("AddHoroPopup.html",model.scope,uibModal,"sm"):model.AstroArr.length>0?model.generateHoro():model.populateAstro()},model.upload=function(obj){var extension=""!==obj.myFile.name&&void 0!==obj.myFile.name&&null!==obj.myFile.name?obj.myFile.name.split(".")[1]:null;if(void 0!==obj.myFile.name){var size=parseFloat(obj.myFile.size/1024).toFixed(2);if(null!==extension&&"gif, jpeg, png,jpg".indexOf(angular.lowercase(extension))===-1)alert("Your uploaded image contains an unapproved file formats.");else if(size>4096)alert("Sorry,Upload Photo Size Must Be Less than 1 mb");else{var keyname="Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extension;fileUpload.uploadFileToUrl(obj.myFile,"/photoUplad",keyname).then(function(res){200==res.status&&(commonFactory.closepopup(),model.uploadData={Cust_ID:custID,Horopath:"../../"+keyname,ModifiedByEmpID:"",VisibleToID:keyname.indexOf("html")!==-1?1:"",Empid:"",IsActive:keyname.indexOf("html")!==-1?1:0,i_flag:1},editAstroService.uploadDeleteAstroData(model.uploadData).then(function(response){commonFactory.closepopup(),model.astropageload(custID),model.ImageUrl=editviewapp.GlobalImgPathforimage+"Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage."+extension}))})}}else alert("This browser does not support HTML5.")},model.generateHoro=function(astrocity){var check=moment(model.generateData[0].DateOfBirth,"YYYY/MM/DD"),month=check.format("M"),day=check.format("D"),year=check.format("YYYY"),inputobj={customerid:custID,EmpIDQueryString:"2",intDay:day,intMonth:month,intYear:year,CityID:commonFactory.checkvals(astrocity)?astrocity:""};editAstroService.generateHoroscope(inputobj).then(function(response){console.log(response),commonFactory.checkvals(response.data.AstroGeneration)?(s3obj={Path:response.data.Path,KeyName:response.data.KeyName},window.open(""+response.data.AstroGeneration,"_blank"),commonFactory.closepopup(),commonFactory.open("RefreshPopup.html",model.scope,uibModal)):(model.AstrocityArr=commonFactory.AstroCity(model.AstroArr[0].CountryOfBirth,model.AstroArr[0].StateOfBirth),commonFactory.open("AstroCityPopup.html",model.scope,uibModal))})},model.deleteHoroImage=function(){var keynameq="Images/Horoscopeimages/"+custID+"_HaromodelImage/"+custID+"_HaromodelImage.jpg";http.post("/photoDelete",JSON.stringify({keyname:keynameq})).then(function(data){}),model.uploadData={Cust_ID:custID,i_flag:0},editAstroService.uploadDeleteAstroData(model.uploadData).then(function(response){1!==response.data&&"1"!==response.data||(model.astropageload(custID),commonFactory.closepopup(),model.ImageUrl="",model.atroObj.rdlUploadGenerate="")})},model.shoedeletePopup=function(){commonFactory.open("deletehoroPopup.html",model.scope,uibModal,"sm")},model.AstroCityChange=function(val){model.generateHoro(val)},model.vewHoro=function(){null!==model.ImageUrl&&""!==model.ImageUrl&&void 0!==model.ImageUrl&&(model.ImageUrl.indexOf(".html")!==-1?window.open(""+model.ImageUrl,"_blank"):commonFactory.open("AstroimagePopup.html",model.scope,uibModal))},model.generatedhoroS3Upload=function(){console.log("s3obj"),console.log(s3obj),editAstroService.GenerateHoroS3(s3obj).then(function(response){console.log(response)}),model.astropageload(custID),commonFactory.closepopup()},model.init()}angular.module("KaakateeyaEmpEdit").factory("editAstroModel",factory),factory.$inject=["editAstroService","authSvc","alert","commonFactory","$uibModal","fileUpload","$http"]}(angular),function(angular){"use strict";function factory(http){return{getAstroData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getAstroDetailsDisplay",{params:{CustID:obj}})},submitAstroData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerAstrodetailsUpdatedetails",JSON.stringify(obj1))},uploadDeleteAstroData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/AstroDetailsUpdateDelete",JSON.stringify(obj1))},generateHoroscope:function(obj){return http.get(editviewapp.apipath+"CustomerPersonalUpdate/getGenerateHoroscorpe",{params:{customerid:obj.customerid,EmpIDQueryString:obj.EmpIDQueryString,intDay:obj.intDay,intMonth:obj.intMonth,intYear:obj.intYear,CityID:obj.CityID}})},GenerateHoroS3:function(obj){return http.get(editviewapp.apipath+"CustomerPersonalUpdate/getAstroGenerationS3Update",{params:{Path:JSON.stringify(obj.Path),KeyName:JSON.stringify(obj.KeyName)}})}}}angular.module("KaakateeyaEmpEdit").factory("editAstroService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editContactModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editContactModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editContactCtrl', controller)

     controller.$inject = ['editContactModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editContactService, authSvc, alertss, commonFactory, uibModal) {
        var model = {};
        model.scope = {};

        var logincustid = authSvc.getCustId();
        var custID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        model.candidateContactArr = [];
        model.candidateAddrArr = [];
        model.parentContactArr = [];
        model.SiiblingContactArr = [];
        model.relativeContactArr = [];
        model.referenceContactArr = [];

        model.candidateobj = {};
        model.sibobj = {};
        model.parentobj = {};
        model.relativeobj = {};
        model.referenceobj = {};
        model.canAddrobj = {};
        model.sibFlag = '';
        model.setrelObj = {};
        model.popupMobilenumber = '';
        model.mobileVerificationCode = "";
        model.ID = 0;
        model.init = function() {
            model.pageload();
            return model;
        };

        model.pageload = function() {
            editContactService.getContactData(custID).then(function(response) {
                console.log(response);
                if (response.data.length > 0) {
                    model.candidateContactArr = response.data[0].length > 0 ? JSON.parse(response.data[0]) : [];
                    model.candidateAddrArr = response.data[1].length > 0 ? JSON.parse(response.data[1]) : [];
                    model.parentContactArr = response.data[2].length > 0 ? JSON.parse(response.data[2]) : [];
                    model.SiiblingContactArr = response.data[3].length > 0 ? JSON.parse(response.data[3]) : [];
                    model.relativeContactArr = response.data[4].length > 0 ? JSON.parse(response.data[4]) : [];
                    model.referenceContactArr = response.data[5].length > 0 ? JSON.parse(response.data[5]) : [];

                    console.log(model.candidateContactArr);
                }

            });
            model.primaryRelationSubmit(0, 0, '0');
        };

        model.commonContactSubmit = function(Icustfamiliyid, IName, IMoblieCountryCode, IMobileNumber, IMoblieCountryCode2, IMobileNumber2, ILandCountryCode,
            ILandAreaCode, ILandNumber, IEmail, ISibblingFlag) {
            model.Mobj = {
                familyID: Icustfamiliyid,
                Name: IName,
                MoblieCountryCode: IMoblieCountryCode,
                MobileNumber: IMobileNumber,
                LandCountryCode: commonFactory.checkvals(IMoblieCountryCode2) ? IMoblieCountryCode2 : commonFactory.checkvals(ILandCountryCode) ? ILandCountryCode : null,
                LandAreaCode: commonFactory.checkvals(IMobileNumber2) ? null : (commonFactory.checkvals(ILandAreaCode) ? ILandAreaCode : null),
                LandNumber: commonFactory.checkvals(IMobileNumber2) ? IMobileNumber2 : commonFactory.checkvals(ILandNumber) ? ILandNumber : null,
                Email: IEmail,
                intCusID: custID,
                EmpID: '2',
                Admin: 1,
                SibblingFlag: ISibblingFlag

            };
            debugger;

            editContactService.submitContactData(model.Mobj).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }
            });

        };

        model.CandidateAddressSubmit = function(obj) {
            model.Mobj = {

                CandidateAddressID: model.canAddrobj.Custfamilyid,
                HouseFlatNum: obj.txtCandidateHouse_flat,
                Apartmentname: obj.txtCandidateApartmentName,
                Streetname: obj.txtCandidateStreetName,
                AreaName: obj.txtCandidateAreaName,
                Landmark: obj.txtCandidateLandmark,
                Country: obj.ddlCandidateCountryContact,
                State: obj.ddlCandidateStateContact,
                District: obj.ddlCandidateDistricContact,
                City: obj.txtCandidateCity,
                ZipPin: obj.txtCandidateZip_no,
                addresstype: model.canAddrobj.Addresstype,
                intCusID: custID,
                EmpID: '2',
                Admin: null

            };
            debugger;
            editContactService.submitContactData(model.Mobj).then(function(response) {
                console.log(response);
                commonFactory.closepopup();

                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }

            });


        };

        model.showContactPopup = function(type, item, sibFlag) {
            debugger;
            switch (type) {

                case 'Candidate':
                    model.candidateobj = {};
                    if (item !== undefined) {
                        model.candidateobj.emaILcust_family_id = item.emaILcust_family_id;
                        debugger;


                        model.candidateobj.ddlcandidateMobileCountryID = commonFactory.checkvals(item.Candidatemobilecountrycode) ? parseInt(item.Candidatemobilecountrycode) : 0;
                        model.candidateobj.txtcandidatemobilenumber = item.CandidateMobileNumber;
                        if (commonFactory.checkvals(item.Candidatelandareacode)) {

                            model.candidateobj.ddlcandidateLandLineCountry = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0;
                            model.candidateobj.txtcandidateAreCode = item.Candidatelandareacode;
                            model.candidateobj.txttxtcandidateAreCodeLandNumber = item.CandidateLandlinenumber;
                        } else {
                            model.candidateobj.ddlcandidateMobileCountryID2 = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0;
                            model.candidateobj.txtFBMobileNumber2 = item.CandidateLandlinenumber;
                        }
                        model.candidateobj.txtcandidateEmails = item.CandidateEmail;

                    }
                    commonFactory.open('candidateContactContent.html', model.scope, uibModal);

                    break;

                case 'sibbling':
                    model.sibFlag = sibFlag;
                    model.sibobj = {};

                    model.sibobj.SiblingemaILcust_family_id = item.SiblingemaILcust_family_id;

                    if (sibFlag === 'SelfFlag') {

                        model.sibobj.ddlSiblingmob = commonFactory.checkvals(item.Siblingmobilecountrycode) ? parseInt(item.Siblingmobilecountrycode) : 0;
                        model.sibobj.txtSiblingmob = item.Siblingmobilenumber;
                        debugger;
                        if (commonFactory.checkvals(item.Siblinglandareacode)) {

                            model.sibobj.ddlsiblinglandcode = commonFactory.checkvals(item.SiblingLandlinecountrycode) ? parseInt(item.SiblingLandlinecountrycode) : 0;
                            model.sibobj.txtsiblinglandarea = item.Siblinglandareacode;
                            model.sibobj.txtsiblinglandnumber = item.SiblingLandlinenumber;
                        } else {
                            model.sibobj.ddlsiblingmob2 = commonFactory.checkvals(item.SiblingLandlinecountrycode) ? parseInt(item.SiblingLandlinecountrycode) : 0;
                            model.sibobj.txtsiblingmob2 = item.SiblingLandlinenumber;
                        }

                        model.sibobj.txtsiblinglemail = item.SiblingEmail;
                        model.sibobj.txtsiblingname = item.SiblingName;


                    } else {

                        model.sibobj.ddlSiblingmob = commonFactory.checkvals(item.SiblingSPousemobilecode) ? parseInt(item.SiblingSPousemobilecode) : 0;
                        model.sibobj.txtSiblingmob = item.SiblingSpousemobilenumber;

                        if (commonFactory.checkvals(item.SiblingSPouseLAndareaCode)) {

                            model.sibobj.ddlsiblinglandcode = commonFactory.checkvals(item.SiblingSPouseLandcountryCode) ? parseInt(item.SiblingSPouseLandcountryCode) : 0;
                            model.sibobj.txtsiblinglandarea = item.SiblingSPouseLAndareaCode;
                            model.sibobj.txtsiblinglandnumber = item.SiblingSPouseLandnumber;
                        } else {
                            model.sibobj.ddlsiblingmob2 = commonFactory.checkvals(item.SiblingSPouseLandcountryCode) ? parseInt(item.SiblingSPouseLandcountryCode) : 0;
                            model.sibobj.txtsiblingmob2 = item.SiblingSPouseLandnumber;
                        }

                        model.sibobj.txtsiblinglemail = item.SiblingSpouseEmail;
                        model.sibobj.txtsiblingname = item.SiblingSpouseNAme;

                    }


                    commonFactory.open('SibContactContent.html', model.scope, uibModal);

                    break;

                case 'parent':
                    model.parentobj = {};
                    model.parentobj.MotheremaILcust_family_id = item.MotheremaILcust_family_id;

                    model.parentobj.ddlcandidatefathermobcode = commonFactory.checkvals(item.mobilecountrycode) ? parseInt(item.mobilecountrycode) : 0;
                    model.parentobj.txtcandidatefathermob = item.mobilenumber;

                    if (commonFactory.checkvals(item.landareacode)) {
                        model.parentobj.ddlcandidatefathelandcode = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0;
                        model.parentobj.txtcandidatefathelandareacode = item.landareacode;
                        model.parentobj.txtcandidatefathelandnumber = item.Landlinenumber;
                    } else {
                        model.parentobj.ddlcandidatefathermob2code = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0;
                        model.parentobj.txtcandidatefathermob2 = item.Landlinenumber;
                    }

                    model.parentobj.txtcandidatefatheremail = item.Email;
                    model.parentobj.txtFathername = item.NAME;

                    commonFactory.open('parentContactContent.html', model.scope, uibModal);

                    break;

                case 'relative':
                    model.relativeobj = {};

                    model.relativeobj.emaILcust_family_id = item.emaILcust_family_id;


                    model.relativeobj.ddlRelativemob = commonFactory.checkvals(item.mobilecountrycode) ? parseInt(item.mobilecountrycode) : 0;
                    model.relativeobj.txtRelativemob = item.mobilenumber;

                    if (commonFactory.checkvals(item.landareacode)) {
                        model.relativeobj.ddllandRelativecode = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0;
                        model.relativeobj.txtRelativeareacode = item.landareacode;
                        model.relativeobj.txtlandnumberRelative = item.Landlinenumber;
                    } else {
                        model.relativeobj.ddlRelativemob2 = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0;
                        model.relativeobj.txtRelativemob2 = item.Landlinenumber;
                    }

                    model.relativeobj.txtRelativeemail = item.Email;
                    model.relativeobj.txtrelativename = item.NAME;

                    commonFactory.open('relativeContactContent.html', model.scope, uibModal);

                    break;

                case 'reference':
                    model.referenceobj = {};
                    model.referenceobj.emaILcust_family_id = item.emaILcust_family_id;

                    model.referenceobj.ddlreferencemobile = commonFactory.checkvals(item.Candidatemobilecountrycode) ? parseInt(item.Candidatemobilecountrycode) : 0;
                    model.referenceobj.txtreferencemobile = item.CandidateMobileNumber;

                    if (commonFactory.checkvals(item.Candidatelandareacode)) {
                        model.referenceobj.ddlreferencelandnumber = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0;
                        model.referenceobj.txtreferenceAreCode = item.Candidatelandareacode;
                        model.referenceobj.txtreferencelandnumber = item.CandidateLandlinenumber;
                    } else {
                        model.referenceobj.ddlreferencemobile2 = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0;
                        model.referenceobj.txtreferencemobile2 = item.CandidateLandlinenumber;
                    }

                    model.referenceobj.txtreferenceemail = item.CandidateEmail;
                    model.referenceobj.txtreferencename = item.CandidateName;

                    commonFactory.open('referenceContactContent.html', model.scope, uibModal);

                    break;

                case 'candidateAddr':
                    model.canAddrobj = {};
                    model.canAddrobj.Custfamilyid = item.Custfamilyid;
                    model.canAddrobj.Addresstype = item.Addresstype;
                    model.canAddrobj.txtCandidateHouse_flat = item.Flatno;
                    model.canAddrobj.txtCandidateApartmentName = item.Apartmentno;
                    model.canAddrobj.txtCandidateStreetName = item.Streetname;
                    model.canAddrobj.txtCandidateAreaName = item.Areaname;
                    model.canAddrobj.txtCandidateLandmark = item.Landmark;
                    model.canAddrobj.ddlCandidateCountryContact = item.Country;
                    model.canAddrobj.ddlCandidateStateContact = item.STATE;
                    model.canAddrobj.ddlCandidateDistricContact = item.District;
                    model.canAddrobj.txtCandidateCity = item.CityName;
                    model.canAddrobj.txtCandidateZip_no = item.ZipCode;

                    commonFactory.open('candidateAddrContent.html', model.scope, uibModal);

                    break;

            }

        };

        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.submitContactReference = function(obj) {
            model.Mobj = {

                Cust_Reference_ID: model.referenceobj.emaILcust_family_id,
                Cust_ID: custID,
                FirstName: obj.txtreferencename,
                MobileCode: obj.ddlreferencemobile,
                Number: obj.txtreferencemobile,
                CountryCode: commonFactory.checkvals(obj.ddlreferencemobile2) ? obj.ddlreferencemobile2 : commonFactory.checkvals(obj.ddlreferencelandnumber) ? obj.ddlreferencelandnumber : null,
                AreaCode: commonFactory.checkvals(obj.txtreferencemobile2) ? null : (commonFactory.checkvals(obj.txtreferenceAreCode) ? obj.txtreferenceAreCode : null),
                Landlinenumber: commonFactory.checkvals(obj.txtreferencemobile2) ? obj.txtreferencemobile2 : commonFactory.checkvals(obj.txtreferencelandnumber) ? obj.txtreferencelandnumber : null,
                Email: obj.txtreferenceemail
            };

            editContactService.submitContactReferenceData(model.Mobj).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }
            });

        };

        model.setprimaryrelationPopup = function() {
            commonFactory.open('primaryRelationContent.html', model.scope, uibModal);
        };


        model.primaryRelationSubmit = function(mob, email, flag) {
            var inObj = {
                CustID: custID,
                PrimaryMobileRel: mob,
                PrimaryEmailRel: email,
                iflage: flag
            };

            editContactService.submitPrimaryRelationData(inObj).then(function(response) {
                console.log(response);

                if (flag === '1') {
                    commonFactory.closepopup();
                    model.pageload();
                } else {
                    model.primaryRel = JSON.parse(response.data[0])[0];
                    console.log(model.primaryRel);
                    debugger;
                    model.setrelObj.ddlPrimaryMobileRel = model.primaryRel.PrimaryMobileRel;
                    model.setrelObj.ddlPrimaryEmailRel = model.primaryRel.PrimaryEmailRel;

                }

            });

        };


        model.sendMobileCode = function(CountryID, CCode, MobileNumber, familyID) {
            model.popupMobilenumber = MobileNumber;
            model.ID = familyID;
            var inputOBj = {
                iCountryID: CountryID,
                iCCode: CCode,
                MobileNumber: MobileNumber,
                CustFamilyID: familyID
            };

            editContactService.sendMobileCode(inputOBj).then(function(response) {
                console.log(response);
                model.mobileVerificationCode = response.data;
                commonFactory.open('verifyMobileContent.html', model.scope, uibModal);
            });




        };


        model.verifymail = function() {
            editContactService.verifyEmail(custID).then(function(response) {
                console.log(response);

                if (response.data !== undefined) {
                    if (response.data === 1) {
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'Email verify mail send Successfully', 4500);
                    }
                }
            });
        };

        model.verifyMobCode = function(val) {
            if (val === "") {
                alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Please enter Mobile verify Code', 4500);
            } else if (model.mobileVerificationCode === val) {
                editContactService.verifyMobile(model.mobileVerificationCode, model.ID).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                });
            } else {
                alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Please Enter Valid Verification code', 4500);
            }

        };




        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editContactModel', factory)

    factory.$inject = ['editContactService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);
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
                return http.get(editviewapp.apipath + 'StaticPages/getCustomerdmobileVerfCodesend', {
                    params: { iCountryID: obj.iCountryID, iCCode: obj.iCCode, MobileNumber: obj.MobileNumber, CustFamilyID: obj.CustFamilyID }
                });
            },
            verifyEmail: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCandidateContactsendmailtoemailverify', { params: { CustID: obj } });
            },
            verifyMobile: function(VCode, CustFamilyid) {
                return http.get(editviewapp.apipath + 'StaticPages/getCustomerEmilVerificationCodeUpdate', { params: { VerificationCode: VCode, CustFamilyID: CustFamilyid } });
            },
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editContactService', factory)

    factory.$inject = ['$http'];
})(angular);
! function(angular) {
    "use strict";

    function controller(editContactModel, scope) {
        var vm = this;
        vm.init = function() { vm.model = editContactModel, vm.model.scope = scope }, vm.init()
    }
    angular.module("KaakateeyaEmpEdit").controller("editContactCtrl", controller), controller.$inject = ["editContactModel", "$scope"]
}(angular),
function(angular) {
    "use strict";

    function factory(editContactService, authSvc, alertss, commonFactory, uibModal) {
        var model = {};
        model.scope = {};
        var logincustid = authSvc.getCustId(),
            custID = void 0 !== logincustid && null !== logincustid && "" !== logincustid ? logincustid : null;
        return model.candidateContactArr = [], model.candidateAddrArr = [], model.parentContactArr = [], model.SiiblingContactArr = [], model.relativeContactArr = [], model.referenceContactArr = [], model.candidateobj = {}, model.sibobj = {}, model.parentobj = {}, model.relativeobj = {}, model.referenceobj = {}, model.canAddrobj = {}, model.sibFlag = "", model.setrelObj = {}, model.popupMobilenumber = "", model.mobileVerificationCode = "", model.ID = 0, model.init = function() { return model.pageload(), model }, model.pageload = function() { editContactService.getContactData(custID).then(function(response) { console.log(response), response.data.length > 0 && (model.candidateContactArr = response.data[0].length > 0 ? JSON.parse(response.data[0]) : [], model.candidateAddrArr = response.data[1].length > 0 ? JSON.parse(response.data[1]) : [], model.parentContactArr = response.data[2].length > 0 ? JSON.parse(response.data[2]) : [], model.SiiblingContactArr = response.data[3].length > 0 ? JSON.parse(response.data[3]) : [], model.relativeContactArr = response.data[4].length > 0 ? JSON.parse(response.data[4]) : [], model.referenceContactArr = response.data[5].length > 0 ? JSON.parse(response.data[5]) : [], console.log(model.candidateContactArr)) }), model.primaryRelationSubmit(0, 0, "0") }, model.commonContactSubmit = function(Icustfamiliyid, IName, IMoblieCountryCode, IMobileNumber, IMoblieCountryCode2, IMobileNumber2, ILandCountryCode, ILandAreaCode, ILandNumber, IEmail, ISibblingFlag) { model.Mobj = { familyID: Icustfamiliyid, Name: IName, MoblieCountryCode: IMoblieCountryCode, MobileNumber: IMobileNumber, LandCountryCode: commonFactory.checkvals(IMoblieCountryCode2) ? IMoblieCountryCode2 : commonFactory.checkvals(ILandCountryCode) ? ILandCountryCode : null, LandAreaCode: commonFactory.checkvals(IMobileNumber2) ? null : commonFactory.checkvals(ILandAreaCode) ? ILandAreaCode : null, LandNumber: commonFactory.checkvals(IMobileNumber2) ? IMobileNumber2 : commonFactory.checkvals(ILandNumber) ? ILandNumber : null, Email: IEmail, intCusID: custID, EmpID: "2", Admin: 1, SibblingFlag: ISibblingFlag }, editContactService.submitContactData(model.Mobj).then(function(response) { console.log(response), commonFactory.closepopup(), 1 === response.data ? (model.pageload(), alertss.timeoutoldalerts(model.scope, "alert-success", "submitted Succesfully", 4500)) : alertss.timeoutoldalerts(model.scope, "alert-danger", "Updation failed", 4500) }) }, model.CandidateAddressSubmit = function(obj) { model.Mobj = { CandidateAddressID: model.canAddrobj.Custfamilyid, HouseFlatNum: obj.txtCandidateHouse_flat, Apartmentname: obj.txtCandidateApartmentName, Streetname: obj.txtCandidateStreetName, AreaName: obj.txtCandidateAreaName, Landmark: obj.txtCandidateLandmark, Country: obj.ddlCandidateCountryContact, State: obj.ddlCandidateStateContact, District: obj.ddlCandidateDistricContact, City: obj.txtCandidateCity, ZipPin: obj.txtCandidateZip_no, addresstype: model.canAddrobj.Addresstype, intCusID: custID, EmpID: "2", Admin: null }, editContactService.submitContactData(model.Mobj).then(function(response) { console.log(response), commonFactory.closepopup(), 1 === response.data ? (model.pageload(), alertss.timeoutoldalerts(model.scope, "alert-success", "submitted Succesfully", 4500)) : alertss.timeoutoldalerts(model.scope, "alert-danger", "Updation failed", 4500) }) }, model.showContactPopup = function(type, item, sibFlag) {
            switch (type) {
                case "Candidate":
                    model.candidateobj = {}, void 0 !== item && (model.candidateobj.emaILcust_family_id = item.emaILcust_family_id, model.candidateobj.ddlcandidateMobileCountryID = commonFactory.checkvals(item.Candidatemobilecountrycode) ? parseInt(item.Candidatemobilecountrycode) : 0, model.candidateobj.txtcandidatemobilenumber = item.CandidateMobileNumber, commonFactory.checkvals(item.Candidatelandareacode) ? (model.candidateobj.ddlcandidateLandLineCountry = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0, model.candidateobj.txtcandidateAreCode = item.Candidatelandareacode, model.candidateobj.txttxtcandidateAreCodeLandNumber = item.CandidateLandlinenumber) : (model.candidateobj.ddlcandidateMobileCountryID2 = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0, model.candidateobj.txtFBMobileNumber2 = item.CandidateLandlinenumber), model.candidateobj.txtcandidateEmails = item.CandidateEmail), commonFactory.open("candidateContactContent.html", model.scope, uibModal);
                    break;
                case "sibbling":
                    model.sibFlag = sibFlag, model.sibobj = {}, model.sibobj.SiblingemaILcust_family_id = item.SiblingemaILcust_family_id, "SelfFlag" === sibFlag ? (model.sibobj.ddlSiblingmob = commonFactory.checkvals(item.Siblingmobilecountrycode) ? parseInt(item.Siblingmobilecountrycode) : 0, model.sibobj.txtSiblingmob = item.Siblingmobilenumber, commonFactory.checkvals(item.Siblinglandareacode) ? (model.sibobj.ddlsiblinglandcode = commonFactory.checkvals(item.SiblingLandlinecountrycode) ? parseInt(item.SiblingLandlinecountrycode) : 0, model.sibobj.txtsiblinglandarea = item.Siblinglandareacode, model.sibobj.txtsiblinglandnumber = item.SiblingLandlinenumber) : (model.sibobj.ddlsiblingmob2 = commonFactory.checkvals(item.SiblingLandlinecountrycode) ? parseInt(item.SiblingLandlinecountrycode) : 0, model.sibobj.txtsiblingmob2 = item.SiblingLandlinenumber), model.sibobj.txtsiblinglemail = item.SiblingEmail, model.sibobj.txtsiblingname = item.SiblingName) : (model.sibobj.ddlSiblingmob = commonFactory.checkvals(item.SiblingSPousemobilecode) ? parseInt(item.SiblingSPousemobilecode) : 0, model.sibobj.txtSiblingmob = item.SiblingSpousemobilenumber, commonFactory.checkvals(item.SiblingSPouseLAndareaCode) ? (model.sibobj.ddlsiblinglandcode = commonFactory.checkvals(item.SiblingSPouseLandcountryCode) ? parseInt(item.SiblingSPouseLandcountryCode) : 0, model.sibobj.txtsiblinglandarea = item.SiblingSPouseLAndareaCode, model.sibobj.txtsiblinglandnumber = item.SiblingSPouseLandnumber) : (model.sibobj.ddlsiblingmob2 = commonFactory.checkvals(item.SiblingSPouseLandcountryCode) ? parseInt(item.SiblingSPouseLandcountryCode) : 0, model.sibobj.txtsiblingmob2 = item.SiblingSPouseLandnumber), model.sibobj.txtsiblinglemail = item.SiblingSpouseEmail, model.sibobj.txtsiblingname = item.SiblingSpouseNAme), commonFactory.open("SibContactContent.html", model.scope, uibModal);
                    break;
                case "parent":
                    model.parentobj = {}, model.parentobj.MotheremaILcust_family_id = item.MotheremaILcust_family_id, model.parentobj.ddlcandidatefathermobcode = commonFactory.checkvals(item.mobilecountrycode) ? parseInt(item.mobilecountrycode) : 0, model.parentobj.txtcandidatefathermob = item.mobilenumber, commonFactory.checkvals(item.landareacode) ? (model.parentobj.ddlcandidatefathelandcode = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0, model.parentobj.txtcandidatefathelandareacode = item.landareacode, model.parentobj.txtcandidatefathelandnumber = item.Landlinenumber) : (model.parentobj.ddlcandidatefathermob2code = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0, model.parentobj.txtcandidatefathermob2 = item.Landlinenumber), model.parentobj.txtcandidatefatheremail = item.Email, model.parentobj.txtFathername = item.NAME, commonFactory.open("parentContactContent.html", model.scope, uibModal);
                    break;
                case "relative":
                    model.relativeobj = {}, model.relativeobj.emaILcust_family_id = item.emaILcust_family_id, model.relativeobj.ddlRelativemob = commonFactory.checkvals(item.mobilecountrycode) ? parseInt(item.mobilecountrycode) : 0, model.relativeobj.txtRelativemob = item.mobilenumber, commonFactory.checkvals(item.landareacode) ? (model.relativeobj.ddllandRelativecode = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0, model.relativeobj.txtRelativeareacode = item.landareacode, model.relativeobj.txtlandnumberRelative = item.Landlinenumber) : (model.relativeobj.ddlRelativemob2 = commonFactory.checkvals(item.Landlinecountrycode) ? parseInt(item.Landlinecountrycode) : 0, model.relativeobj.txtRelativemob2 = item.Landlinenumber), model.relativeobj.txtRelativeemail = item.Email, model.relativeobj.txtrelativename = item.NAME, commonFactory.open("relativeContactContent.html", model.scope, uibModal);
                    break;
                case "reference":
                    model.referenceobj = {}, model.referenceobj.emaILcust_family_id = item.emaILcust_family_id, model.referenceobj.ddlreferencemobile = commonFactory.checkvals(item.Candidatemobilecountrycode) ? parseInt(item.Candidatemobilecountrycode) : 0, model.referenceobj.txtreferencemobile = item.CandidateMobileNumber, commonFactory.checkvals(item.Candidatelandareacode) ? (model.referenceobj.ddlreferencelandnumber = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0, model.referenceobj.txtreferenceAreCode = item.Candidatelandareacode, model.referenceobj.txtreferencelandnumber = item.CandidateLandlinenumber) : (model.referenceobj.ddlreferencemobile2 = commonFactory.checkvals(item.CandidateLandlinecountrycode) ? parseInt(item.CandidateLandlinecountrycode) : 0, model.referenceobj.txtreferencemobile2 = item.CandidateLandlinenumber), model.referenceobj.txtreferenceemail = item.CandidateEmail, model.referenceobj.txtreferencename = item.CandidateName, commonFactory.open("referenceContactContent.html", model.scope, uibModal);
                    break;
                case "candidateAddr":
                    model.canAddrobj = {}, model.canAddrobj.Custfamilyid = item.Custfamilyid, model.canAddrobj.Addresstype = item.Addresstype, model.canAddrobj.txtCandidateHouse_flat = item.Flatno, model.canAddrobj.txtCandidateApartmentName = item.Apartmentno, model.canAddrobj.txtCandidateStreetName = item.Streetname, model.canAddrobj.txtCandidateAreaName = item.Areaname, model.canAddrobj.txtCandidateLandmark = item.Landmark, model.canAddrobj.ddlCandidateCountryContact = item.Country, model.canAddrobj.ddlCandidateStateContact = item.STATE, model.canAddrobj.ddlCandidateDistricContact = item.District, model.canAddrobj.txtCandidateCity = item.CityName, model.canAddrobj.txtCandidateZip_no = item.ZipCode, commonFactory.open("candidateAddrContent.html", model.scope, uibModal)
            }
        }, model.cancel = function() { commonFactory.closepopup() }, model.submitContactReference = function(obj) { model.Mobj = { Cust_Reference_ID: model.referenceobj.emaILcust_family_id, Cust_ID: custID, FirstName: obj.txtreferencename, MobileCode: obj.ddlreferencemobile, Number: obj.txtreferencemobile, CountryCode: commonFactory.checkvals(obj.ddlreferencemobile2) ? obj.ddlreferencemobile2 : commonFactory.checkvals(obj.ddlreferencelandnumber) ? obj.ddlreferencelandnumber : null, AreaCode: commonFactory.checkvals(obj.txtreferencemobile2) ? null : commonFactory.checkvals(obj.txtreferenceAreCode) ? obj.txtreferenceAreCode : null, Landlinenumber: commonFactory.checkvals(obj.txtreferencemobile2) ? obj.txtreferencemobile2 : commonFactory.checkvals(obj.txtreferencelandnumber) ? obj.txtreferencelandnumber : null, Email: obj.txtreferenceemail }, editContactService.submitContactReferenceData(model.Mobj).then(function(response) { console.log(response), commonFactory.closepopup(), 1 === response.data ? (model.pageload(), alertss.timeoutoldalerts(model.scope, "alert-success", "submitted Succesfully", 4500)) : alertss.timeoutoldalerts(model.scope, "alert-danger", "Updation failed", 4500) }) }, model.setprimaryrelationPopup = function() { commonFactory.open("primaryRelationContent.html", model.scope, uibModal) }, model.primaryRelationSubmit = function(mob, email, flag) {
            var inObj = { CustID: custID, PrimaryMobileRel: mob, PrimaryEmailRel: email, iflage: flag };
            editContactService.submitPrimaryRelationData(inObj).then(function(response) { console.log(response), "1" === flag ? (commonFactory.closepopup(), model.pageload()) : (model.primaryRel = JSON.parse(response.data[0])[0], console.log(model.primaryRel), model.setrelObj.ddlPrimaryMobileRel = model.primaryRel.PrimaryMobileRel, model.setrelObj.ddlPrimaryEmailRel = model.primaryRel.PrimaryEmailRel) })
        }, model.sendMobileCode = function(CountryID, CCode, MobileNumber, familyID) {
            model.popupMobilenumber = MobileNumber, model.ID = familyID;
            var inputOBj = { iCountryID: CountryID, iCCode: CCode, MobileNumber: MobileNumber, CustFamilyID: familyID };
            editContactService.sendMobileCode(inputOBj).then(function(response) { console.log(response), model.mobileVerificationCode = response.data, commonFactory.open("verifyMobileContent.html", model.scope, uibModal) })
        }, model.verifymail = function() { editContactService.verifyEmail(custID).then(function(response) { console.log(response), void 0 !== response.data && 1 === response.data && alertss.timeoutoldalerts(model.scope, "alert-success", "Email verify mail send Successfully", 4500) }) }, model.verifyMobCode = function(val) { "" === val ? alertss.timeoutoldalerts(model.scope, "alert-danger", "Please enter Mobile verify Code", 4500) : model.mobileVerificationCode === val ? editContactService.verifyMobile(model.mobileVerificationCode, model.ID).then(function(response) { console.log(response), commonFactory.closepopup() }) : alertss.timeoutoldalerts(model.scope, "alert-danger", "Please Enter Valid Verification code", 4500) }, model.init()
    }
    angular.module("KaakateeyaEmpEdit").factory("editContactModel", factory), factory.$inject = ["editContactService", "authSvc", "alert", "commonFactory", "$uibModal"]
}(angular),
function(angular) {
    "use strict";

    function factory(http) { return { getContactData: function(obj) { return http.get(editviewapp.apipath + "CustomerPersonal/getCustomerPersonalContact_Details", { params: { CustID: obj } }) }, submitContactData: function(obj1) { return console.log(JSON.stringify(obj1)), http.post(editviewapp.apipath + "CustomerPersonalUpdate/CustomerContactDetails_Update", JSON.stringify(obj1)) }, submitContactReferenceData: function(obj1) { return http.post(editviewapp.apipath + "CustomerPersonalUpdate/UpdateContactdetails_Reference", JSON.stringify(obj1)) }, submitPrimaryRelationData: function(obj) { return console.log(JSON.stringify(obj)), http.get(editviewapp.apipath + "CustomerPersonal/getCandidateContactdetailsRelationName", { params: { CustID: obj.CustID, PrimaryMobileRel: obj.PrimaryMobileRel, PrimaryEmailRel: obj.PrimaryEmailRel, iflage: obj.iflage } }) }, sendMobileCode: function(obj) { return http.get(editviewapp.apipath + "StaticPages/getCustomerdmobileVerfCodesend", { params: { iCountryID: obj.iCountryID, iCCode: obj.iCCode, MobileNumber: obj.MobileNumber, CustFamilyID: obj.CustFamilyID } }) }, verifyEmail: function(obj) { return http.get(editviewapp.apipath + "CustomerPersonal/getCandidateContactsendmailtoemailverify", { params: { CustID: obj } }) }, verifyMobile: function(VCode, CustFamilyid) { return http.get(editviewapp.apipath + "StaticPages/getCustomerEmilVerificationCodeUpdate", { params: { VerificationCode: VCode, CustFamilyID: CustFamilyid } }) } } }
    angular.module("KaakateeyaEmpEdit").factory("editContactService", factory), factory.$inject = ["$http"]
}(angular);
 (function(angular) {
     'use strict';

     function controller(editEducationModel, scope) {
         var vm = this,
             model;
         vm.scope = scope;
         vm.init = function() {
             vm.model = model = editEducationModel.init();
             model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editEducationCtrl', controller)

     controller.$inject = ['editEducationModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory($http, authSvc, editEducationService, commonFactory, uibModal, filter, alertss, baseService) {
        var model = {};
        var logincustid = authSvc.getCustId();

        model.scope = {};

        //start declaration block
        model.stateArr = [];
        model.districtArr = [];
        model.cityeArr = [];
        model.passOfyearArr = [];
        model.eduGroupArr = [];
        model.eduSpecialisationArr = [];
        model.ProfSpecialisationArr = [];
        model.ProfstateArr = [];
        model.ProfdistrictArr = [];
        model.ProfcityeArr = [];
        model.profObj = {};
        model.edoObj = {};
        model.aboutObj = {};
        model.custObj = {};
        model.edoObj.IsHighestDegree = '';
        var isSubmit = true;
        model.educationID = 0;
        model.CustomerDataArr = [];
        model.reviewdisplay = 'Education details';
        //end declaration block


        var CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        model.CustID = CustID;
        model.init = function() {
            model.getdata();
            return model;
        };

        model.getdata = function() {
            model.eduPageload();
            model.ProfPageload();
            model.aboutPageload();
            model.custdatapageload();
        };

        model.eduPageload = function() {
            editEducationService.getEducationData(CustID).then(function(response) {
                if (commonFactory.checkvals(response.data)) {
                    model.educationSelectArray = response.data;
                    model.eduEmpLastModificationDate = model.educationSelectArray[0].EmpLastModificationDate;
                }

            });
        };
        model.ProfPageload = function() {

            editEducationService.getProfessionData(CustID).then(function(response) {
                if (commonFactory.checkvals(response.data)) {
                    model.ProfessionSelectArray = response.data;
                    model.profEmpLastModificationDate = model.ProfessionSelectArray[0].EmpLastModificationDate;
                }

            });

        };
        model.aboutPageload = function() {
            editEducationService.getAboutData(CustID).then(function(response) {
                if (commonFactory.checkvals(response.data)) {
                    var AboutData = (response.data).split(';');
                    model.lblaboutUrself = (AboutData[0].split(':'))[1];
                    model.AboutReviewStatusID = (AboutData[1].split(':'))[1];
                }
            });

        };
        model.custdatapageload = function() {
            editEducationService.getCustomerData(CustID).then(function(response) {
                model.CustomerDataArr = response.data !== undefined && response.data.length > 0 ? JSON.parse(response.data) : [];
                model.custEmpLastModificationDate = model.CustomerDataArr[0].EmpLastModificationDate;
            });
        };

        model.passOfYear = function(maxyr, no_year) {
            var yr = 1;
            model.passOfyearArr.push({ "label": "--select--", "title": "--select--", "value": 0 });
            for (var i = maxyr; i >= no_year; i--) {
                model.passOfyearArr.push({ "label": i, "title": i, "value": i });
                yr += 1;
            }
        };

        model.showpopup = function(type, item) {
            isSubmit = true;
            switch (type) {
                case 'showEduModal':
                    model.passOfYear(2020, 1975);
                    model.edoObj.EducationID = null;
                    model.edoObj = {};
                    if (item !== undefined) {

                        model.eduGroupArr = commonFactory.checkvals(item.EducationCategoryID) ? commonFactory.educationGroupBind(item.EducationCategoryID) : [];
                        model.eduSpecialisationArr = commonFactory.checkvals(item.EducationGroupID) ? commonFactory.educationSpeciakisationBind(item.EducationGroupID) : [];

                        model.edoObj.IsHighestDegree = item.EduHighestDegree;
                        console.log(item.EduPassOfYear);

                        model.edoObj.ddlEduCatgory = commonFactory.checkvals(item.EducationCategoryID) ? parseInt(item.EducationCategoryID) : null;
                        model.edoObj.ddlEdugroup = item.EducationGroupID;
                        model.edoObj.ddlEduspecialization = item.EducationSpecializationID;
                        model.edoObj.txtuniversity = item.EduUniversity;
                        model.edoObj.txtcollege = item.EduCollege;
                        model.edoObj.ddlpassOfyear = commonFactory.checkvals(item.EduPassOfYear) ? parseInt(item.EduPassOfYear) : null;
                        model.edoObj.ddlCountry = item.CountryID;
                        model.edoObj.ddlState = item.StateID;
                        model.edoObj.ddlDistrict = item.DistrictID;
                        model.edoObj.ddlcity = item.CityID;
                        model.edoObj.txtcity = "";
                        model.edoObj.txtEdumerits = item.Educationdesc;
                        model.edoObj.intCusID = item.intCusID;
                        model.edoObj.EducationID = item.EducationID;
                    }


                    commonFactory.open('EduModalContent.html', model.scope, uibModal);
                    break;

                case 'showProfModal':
                    model.profObj.Cust_Profession_ID = null;
                    model.profObj = {};
                    if (item !== undefined) {

                        model.ProfSpecialisationArr = commonFactory.professionBind(item.ProfessionGroupID);

                        model.profObj.intCusID = item.intCusID;
                        model.profObj.ddlemployedin = item.ProfessionCategoryID;
                        model.profObj.ddlprofgroup = item.ProfessionGroupID;
                        model.profObj.ddlprofession = item.ProfessionID;
                        model.profObj.txtcmpyname = item.CompanyName;
                        model.profObj.txtsalary = item.Salary;

                        model.profObj.ddlcurreny = item.SalaryCurrency;
                        model.profObj.ddlCountryProf = item.CountryID;
                        model.profObj.ddlStateProf = item.StateID;
                        model.profObj.ddlDistrictProf = item.DistrictID;
                        model.profObj.ddlcityworkingprofession = item.CityID;
                        model.profObj.txtcityprofession = item.CityWorkingIn;
                        model.profObj.txtworkingfrom = commonFactory.convertDateFormat(item.WorkingFromDate, 'DD-MM-YYYY');
                        model.profObj.ddlvisastatus = item.VisaTypeID;
                        model.profObj.txtssincedate = commonFactory.convertDateFormat(item.ResidingSince, 'DD-MM-YYYY');
                        model.profObj.txtarrivaldate = commonFactory.convertDateFormat(item.ArrivingDate, 'DD-MM-YYYY');
                        model.profObj.txtdeparture = commonFactory.convertDateFormat(item.DepartureDate, 'DD-MM-YYYY');
                        model.profObj.txtoccupation = item.OccupationDetails;
                        model.profObj.Cust_Profession_ID = item.Cust_Profession_ID;
                    }

                    commonFactory.open('profModalContent.html', model.scope, uibModal);
                    break;

                case 'showAboutModal':

                    if (item !== undefined) {
                        model.aboutObj.txtAboutUS = item;
                    }
                    commonFactory.open('AboutModalContent.html', model.scope, uibModal);
                    break;

                case 'custData':
                    if (item !== undefined) {
                        model.custObj.rdlGender = item.GenderID;
                        model.custObj.txtSurName = item.LastName;
                        model.custObj.txtName = item.FirstName;
                        model.custObj.dropmaritalstatus = item.MaritalStatusID;
                        model.custObj.txtdobcandidate = commonFactory.convertDateFormat(item.DateofBirthwithoutAge, 'DD-MM-YYYY');
                        model.custObj.ddlHeightpersonal = item.HeightID;
                        model.custObj.ddlcomplexion = item.ComplexionID;
                        model.custObj.ddlreligioncandadate = item.ReligionID;
                        model.custObj.ddlmothertongue = item.MotherTongueID;
                        model.custObj.ddlcaste = item.CasteID;
                        model.custObj.ddlsubcaste = item.SubCasteID;
                        model.custObj.ddlBornCitizenship = item.CitizenshipID;
                    }
                    commonFactory.open('CustomerDataContent.html', model.scope, uibModal);
                    break;
            }

        };

        model.cancel = function() {
            commonFactory.closepopup();
        };


        model.ProfchangeBind = function(type, parentval) {

            switch (type) {

                case 'ProfessionGroup':
                    model.ProfSpecialisationArr = commonFactory.professionBind(parentval);
                    model.profObj.ddlprofession = "";
                    break;
            }
        };

        model.changeBind = function(type, parentval) {

            debugger;
            if (commonFactory.checkvals(parentval)) {

                switch (type) {

                    case 'EducationCatgory':

                        model.eduGroupArr = commonFactory.educationGroupBind(parentval);
                        model.edoObj.ddlEdugroup = "";

                        break;

                    case 'EducationGroup':

                        model.eduSpecialisationArr = commonFactory.educationSpeciakisationBind(parentval);
                        model.edoObj.ddlEduspecialization = "";

                        break;

                    case 'caste':

                        model.subcasteArr = commonFactory.subCaste(parentval);

                        break;
                }
            }
        };

        model.eduSubmit = function(objitem) {

            if (isSubmit) {
                isSubmit = false;
                model.myData = {
                    customerEducation: {
                        CustID: CustID,
                        Educationcategory: objitem.ddlEduCatgory,
                        Educationgroup: objitem.ddlEdugroup,
                        EducationSpecialization: objitem.ddlEduspecialization,
                        University: objitem.txtuniversity,
                        College: objitem.txtcollege,
                        Passofyear: objitem.ddlpassOfyear,
                        Countrystudyin: objitem.ddlCountry,
                        Statestudyin: objitem.ddlState,
                        Districtstudyin: objitem.ddlDistrict,
                        CitystudyIn: objitem.ddlcity,
                        OtherCity: objitem.txtcity,
                        Highestdegree: objitem.IsHighestDegree,
                        Educationalmerits: objitem.txtEdumerits,
                        Cust_Education_ID: model.edoObj.EducationID,
                        intEduID: model.edoObj.EducationID,
                    },
                    customerpersonaldetails: {
                        intCusID: CustID,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editEducationService.submitEducationData(model.myData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.eduPageload();
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                        if (model.datagetInStatus === 1) {
                            sessionStorage.removeItem('missingStatus');
                            route.go('mobileverf', {});
                        }
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.ProfSubmit = function(objitem) {

            if (isSubmit) {
                isSubmit = false;
                model.myprofData = {
                    customerProfession: {
                        CustID: CustID,
                        EmployedIn: objitem.ddlemployedin,
                        Professionalgroup: objitem.ddlprofgroup,
                        Profession: objitem.ddlprofession,
                        Companyname: objitem.txtcmpyname,
                        Currency: objitem.ddlcurreny,
                        Monthlysalary: objitem.txtsalary,
                        CountryID: objitem.ddlCountryProf,
                        StateID: objitem.ddlStateProf,
                        DistrictID: objitem.ddlDistrictProf,
                        CityID: objitem.ddlcityworkingprofession,
                        OtherCity: objitem.txtcityprofession,
                        Workingfromdate: filter('date')(objitem.txtworkingfrom, 'yyyy-MM-dd'),
                        OccupationDetails: objitem.txtoccupation,
                        visastatus: objitem.ddlvisastatus,
                        Sincedate: objitem.txtssincedate !== '' && objitem.txtssincedate !== 'Invalid date' ? filter('date')(objitem.txtssincedate, 'yyyy-MM-dd') : null,
                        ArrivalDate: objitem.txtarrivaldate !== '' && objitem.txtarrivaldate !== 'Invalid date' ? filter('date')(objitem.txtarrivaldate, 'yyyy-MM-dd') : null,
                        DepartureDate: objitem.txtdeparture !== '' && objitem.txtdeparture !== 'Invalid date' ? filter('date')(objitem.txtdeparture, 'yyyy-MM-dd') : null,
                        profGridID: model.profObj.Cust_Profession_ID,
                        ProfessionID: model.profObj.Cust_Profession_ID,
                    },
                    customerpersonaldetails: {
                        intCusID: CustID,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editEducationService.submitProfessionData(model.myprofData).then(function(response) {

                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.ProfPageload();

                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                        if (scope.datagetInStatus === 1) {
                            sessionStorage.removeItem('missingStatus');
                            route.go('mobileverf', {});
                        }

                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }
        };

        model.AboutUrselfSubmit = function(obj) {
            if (isSubmit) {
                isSubmit = false;
                model.submitPromise = editEducationService.submitAboutUrData({ CustID: CustID, AboutYourself: obj.txtAboutUS, flag: 1 }).then(function(response) {
                    commonFactory.closepopup();
                    if (response.data === '1') {
                        model.aboutPageload();
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.DeleteEduPopup = function(id) {
            model.educationID = id;
            commonFactory.open('deleteEduContent.html', model.scope, uibModal, 'sm');
        };

        model.deleteEduSubmit = function() {
            editEducationService.DeleteSection({ sectioname: 'Education', CustID: CustID, identityid: model.educationID }).then(function(response) {
                console.log(response);
                model.eduPageload();
                commonFactory.closepopup();
            });
        };

        model.custdataSubmit = function(obj) {

            model.custData = {
                GetDetails: {
                    CustID: CustID,
                    MaritalStatusID: obj.dropmaritalstatus,
                    DateofBirth: obj.txtdobcandidate !== '' && obj.txtdobcandidate !== 'Invalid date' ? filter('date')(obj.txtdobcandidate, 'MM/dd/yyyy hh:mm:ss a') : null,
                    HeightID: obj.ddlHeightpersonal,
                    ComplexionID: obj.ddlcomplexion,
                    ReligionID: obj.ddlreligioncandadate,
                    MotherTongueID: obj.ddlmothertongue,
                    CasteID: obj.ddlcaste,
                    CitizenshipID: obj.ddlBornCitizenship,
                    SubcasteID: obj.ddlsubcaste,
                    LastName: obj.txtSurName,
                    FirstName: obj.txtName,
                    Gender: obj.rdlGender
                },
                customerpersonaldetails: {
                    intCusID: CustID,
                    EmpID: null,
                    Admin: null
                }
            };

            editEducationService.submitCustomerData(model.custData).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                model.custdatapageload();
            });


        };


        // model.reviewonchange = function(booltype) {
        //     if (booltype === true)
        //         commonFactory.open('common/templates/reviewConfirmationPopup.html', model.scope, uibModal, 'sm');
        // };


        // model.reviewSubmit = function() {
        //     baseService.menuReviewstatus(CustID, '1', '6,7,8').then(function(response) {
        //         console.log(response.data);
        //     });
        // };


        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editEducationModel', factory)

    factory.$inject = ['$http', 'authSvc', 'editEducationService', 'commonFactory', '$uibModal', '$filter', 'alert', 'baseService'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getEducationData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerEducationdetails', { params: { CustID: obj } });
            },
            getProfessionData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerProfessiondetails', { params: { CustID: obj } });
            },
            getAboutData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getEducationProfession_AboutYourself', { params: { CustID: obj, AboutYourself: '', flag: 0 } });
            },
            submitEducationData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerPersonalUpdateEducationdetail', JSON.stringify(obj1));
            },
            submitProfessionData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerPersonalUpdateProfessionDetails', JSON.stringify(obj1));
            },
            submitAboutUrData: function(obj1) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getEducationProfession_AboutYourself', { params: obj1 });
            },

            getCustomerData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getpersonaldetails_Customer', { params: { CustID: obj } });
            },
            submitCustomerData: function(obj1) {
                console.log(JSON.stringify(obj1));
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/UpdatePersonalDetails_Customersetails', JSON.stringify(obj1));
            }

        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editEducationService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editEducationModel,scope){var model,vm=this;vm.scope=scope,vm.init=function(){vm.model=model=editEducationModel.init(),model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editEducationCtrl",controller),controller.$inject=["editEducationModel","$scope"]}(angular),function(angular){"use strict";function factory($http,authSvc,editEducationService,commonFactory,uibModal,filter,alertss,baseService){var model={},logincustid=authSvc.getCustId();model.scope={},model.stateArr=[],model.districtArr=[],model.cityeArr=[],model.passOfyearArr=[],model.eduGroupArr=[],model.eduSpecialisationArr=[],model.ProfSpecialisationArr=[],model.ProfstateArr=[],model.ProfdistrictArr=[],model.ProfcityeArr=[],model.profObj={},model.edoObj={},model.aboutObj={},model.custObj={},model.edoObj.IsHighestDegree="";var isSubmit=!0;model.educationID=0,model.CustomerDataArr=[],model.reviewdisplay="Education details";var CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.CustID=CustID,model.init=function(){return model.getdata(),model},model.getdata=function(){model.eduPageload(),model.ProfPageload(),model.aboutPageload(),model.custdatapageload()},model.eduPageload=function(){editEducationService.getEducationData(CustID).then(function(response){commonFactory.checkvals(response.data)&&(model.educationSelectArray=response.data,model.eduEmpLastModificationDate=model.educationSelectArray[0].EmpLastModificationDate)})},model.ProfPageload=function(){editEducationService.getProfessionData(CustID).then(function(response){commonFactory.checkvals(response.data)&&(model.ProfessionSelectArray=response.data,model.profEmpLastModificationDate=model.ProfessionSelectArray[0].EmpLastModificationDate)})},model.aboutPageload=function(){editEducationService.getAboutData(CustID).then(function(response){if(commonFactory.checkvals(response.data)){var AboutData=response.data.split(";");model.lblaboutUrself=AboutData[0].split(":")[1],model.AboutReviewStatusID=AboutData[1].split(":")[1]}})},model.custdatapageload=function(){editEducationService.getCustomerData(CustID).then(function(response){model.CustomerDataArr=void 0!==response.data&&response.data.length>0?JSON.parse(response.data):[],model.custEmpLastModificationDate=model.CustomerDataArr[0].EmpLastModificationDate})},model.passOfYear=function(maxyr,no_year){var yr=1;model.passOfyearArr.push({label:"--select--",title:"--select--",value:0});for(var i=maxyr;i>=no_year;i--)model.passOfyearArr.push({label:i,title:i,value:i}),yr+=1},model.showpopup=function(type,item){switch(isSubmit=!0,type){case"showEduModal":model.passOfYear(2020,1975),model.edoObj.EducationID=null,model.edoObj={},void 0!==item&&(model.eduGroupArr=commonFactory.checkvals(item.EducationCategoryID)?commonFactory.educationGroupBind(item.EducationCategoryID):[],model.eduSpecialisationArr=commonFactory.checkvals(item.EducationGroupID)?commonFactory.educationSpeciakisationBind(item.EducationGroupID):[],model.edoObj.IsHighestDegree=item.EduHighestDegree,console.log(item.EduPassOfYear),model.edoObj.ddlEduCatgory=commonFactory.checkvals(item.EducationCategoryID)?parseInt(item.EducationCategoryID):null,model.edoObj.ddlEdugroup=item.EducationGroupID,model.edoObj.ddlEduspecialization=item.EducationSpecializationID,model.edoObj.txtuniversity=item.EduUniversity,model.edoObj.txtcollege=item.EduCollege,model.edoObj.ddlpassOfyear=commonFactory.checkvals(item.EduPassOfYear)?parseInt(item.EduPassOfYear):null,model.edoObj.ddlCountry=item.CountryID,model.edoObj.ddlState=item.StateID,model.edoObj.ddlDistrict=item.DistrictID,model.edoObj.ddlcity=item.CityID,model.edoObj.txtcity="",model.edoObj.txtEdumerits=item.Educationdesc,model.edoObj.intCusID=item.intCusID,model.edoObj.EducationID=item.EducationID),commonFactory.open("EduModalContent.html",model.scope,uibModal);break;case"showProfModal":model.profObj.Cust_Profession_ID=null,model.profObj={},void 0!==item&&(model.ProfSpecialisationArr=commonFactory.professionBind(item.ProfessionGroupID),model.profObj.intCusID=item.intCusID,model.profObj.ddlemployedin=item.ProfessionCategoryID,model.profObj.ddlprofgroup=item.ProfessionGroupID,model.profObj.ddlprofession=item.ProfessionID,model.profObj.txtcmpyname=item.CompanyName,model.profObj.txtsalary=item.Salary,model.profObj.ddlcurreny=item.SalaryCurrency,model.profObj.ddlCountryProf=item.CountryID,model.profObj.ddlStateProf=item.StateID,model.profObj.ddlDistrictProf=item.DistrictID,model.profObj.ddlcityworkingprofession=item.CityID,model.profObj.txtcityprofession=item.CityWorkingIn,model.profObj.txtworkingfrom=commonFactory.convertDateFormat(item.WorkingFromDate,"DD-MM-YYYY"),model.profObj.ddlvisastatus=item.VisaTypeID,model.profObj.txtssincedate=commonFactory.convertDateFormat(item.ResidingSince,"DD-MM-YYYY"),model.profObj.txtarrivaldate=commonFactory.convertDateFormat(item.ArrivingDate,"DD-MM-YYYY"),model.profObj.txtdeparture=commonFactory.convertDateFormat(item.DepartureDate,"DD-MM-YYYY"),model.profObj.txtoccupation=item.OccupationDetails,model.profObj.Cust_Profession_ID=item.Cust_Profession_ID),commonFactory.open("profModalContent.html",model.scope,uibModal);break;case"showAboutModal":void 0!==item&&(model.aboutObj.txtAboutUS=item),commonFactory.open("AboutModalContent.html",model.scope,uibModal);break;case"custData":void 0!==item&&(model.custObj.rdlGender=item.GenderID,model.custObj.txtSurName=item.LastName,model.custObj.txtName=item.FirstName,model.custObj.dropmaritalstatus=item.MaritalStatusID,model.custObj.txtdobcandidate=commonFactory.convertDateFormat(item.DateofBirthwithoutAge,"DD-MM-YYYY"),model.custObj.ddlHeightpersonal=item.HeightID,model.custObj.ddlcomplexion=item.ComplexionID,model.custObj.ddlreligioncandadate=item.ReligionID,model.custObj.ddlmothertongue=item.MotherTongueID,model.custObj.ddlcaste=item.CasteID,model.custObj.ddlsubcaste=item.SubCasteID,model.custObj.ddlBornCitizenship=item.CitizenshipID),commonFactory.open("CustomerDataContent.html",model.scope,uibModal)}},model.cancel=function(){commonFactory.closepopup()},model.ProfchangeBind=function(type,parentval){switch(type){case"ProfessionGroup":model.ProfSpecialisationArr=commonFactory.professionBind(parentval),model.profObj.ddlprofession=""}},model.changeBind=function(type,parentval){if(commonFactory.checkvals(parentval))switch(type){case"EducationCatgory":model.eduGroupArr=commonFactory.educationGroupBind(parentval),model.edoObj.ddlEdugroup="";break;case"EducationGroup":model.eduSpecialisationArr=commonFactory.educationSpeciakisationBind(parentval),model.edoObj.ddlEduspecialization="";break;case"caste":model.subcasteArr=commonFactory.subCaste(parentval)}},model.eduSubmit=function(objitem){isSubmit&&(isSubmit=!1,model.myData={customerEducation:{CustID:CustID,Educationcategory:objitem.ddlEduCatgory,Educationgroup:objitem.ddlEdugroup,EducationSpecialization:objitem.ddlEduspecialization,University:objitem.txtuniversity,College:objitem.txtcollege,Passofyear:objitem.ddlpassOfyear,Countrystudyin:objitem.ddlCountry,Statestudyin:objitem.ddlState,Districtstudyin:objitem.ddlDistrict,CitystudyIn:objitem.ddlcity,OtherCity:objitem.txtcity,Highestdegree:objitem.IsHighestDegree,Educationalmerits:objitem.txtEdumerits,Cust_Education_ID:model.edoObj.EducationID,intEduID:model.edoObj.EducationID},customerpersonaldetails:{intCusID:CustID,EmpID:null,Admin:null}},model.submitPromise=editEducationService.submitEducationData(model.myData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.eduPageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500),1===model.datagetInStatus&&(sessionStorage.removeItem("missingStatus"),route.go("mobileverf",{}))):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.ProfSubmit=function(objitem){isSubmit&&(isSubmit=!1,model.myprofData={customerProfession:{CustID:CustID,EmployedIn:objitem.ddlemployedin,Professionalgroup:objitem.ddlprofgroup,Profession:objitem.ddlprofession,Companyname:objitem.txtcmpyname,Currency:objitem.ddlcurreny,Monthlysalary:objitem.txtsalary,CountryID:objitem.ddlCountryProf,StateID:objitem.ddlStateProf,DistrictID:objitem.ddlDistrictProf,CityID:objitem.ddlcityworkingprofession,OtherCity:objitem.txtcityprofession,Workingfromdate:filter("date")(objitem.txtworkingfrom,"yyyy-MM-dd"),OccupationDetails:objitem.txtoccupation,visastatus:objitem.ddlvisastatus,Sincedate:""!==objitem.txtssincedate&&"Invalid date"!==objitem.txtssincedate?filter("date")(objitem.txtssincedate,"yyyy-MM-dd"):null,ArrivalDate:""!==objitem.txtarrivaldate&&"Invalid date"!==objitem.txtarrivaldate?filter("date")(objitem.txtarrivaldate,"yyyy-MM-dd"):null,DepartureDate:""!==objitem.txtdeparture&&"Invalid date"!==objitem.txtdeparture?filter("date")(objitem.txtdeparture,"yyyy-MM-dd"):null,profGridID:model.profObj.Cust_Profession_ID,ProfessionID:model.profObj.Cust_Profession_ID},customerpersonaldetails:{intCusID:CustID,EmpID:null,Admin:null}},model.submitPromise=editEducationService.submitProfessionData(model.myprofData).then(function(response){commonFactory.closepopup(),1===response.data?(model.ProfPageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500),1===scope.datagetInStatus&&(sessionStorage.removeItem("missingStatus"),route.go("mobileverf",{}))):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.AboutUrselfSubmit=function(obj){isSubmit&&(isSubmit=!1,model.submitPromise=editEducationService.submitAboutUrData({CustID:CustID,AboutYourself:obj.txtAboutUS,flag:1}).then(function(response){commonFactory.closepopup(),"1"===response.data?(model.aboutPageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.DeleteEduPopup=function(id){model.educationID=id,commonFactory.open("deleteEduContent.html",model.scope,uibModal,"sm")},model.deleteEduSubmit=function(){editEducationService.DeleteSection({sectioname:"Education",CustID:CustID,identityid:model.educationID}).then(function(response){console.log(response),model.eduPageload(),commonFactory.closepopup()})},model.custdataSubmit=function(obj){model.custData={GetDetails:{CustID:CustID,MaritalStatusID:obj.dropmaritalstatus,DateofBirth:""!==obj.txtdobcandidate&&"Invalid date"!==obj.txtdobcandidate?filter("date")(obj.txtdobcandidate,"MM/dd/yyyy hh:mm:ss a"):null,HeightID:obj.ddlHeightpersonal,ComplexionID:obj.ddlcomplexion,ReligionID:obj.ddlreligioncandadate,MotherTongueID:obj.ddlmothertongue,CasteID:obj.ddlcaste,CitizenshipID:obj.ddlBornCitizenship,SubcasteID:obj.ddlsubcaste,LastName:obj.txtSurName,FirstName:obj.txtName,Gender:obj.rdlGender},customerpersonaldetails:{intCusID:CustID,EmpID:null,Admin:null}},editEducationService.submitCustomerData(model.custData).then(function(response){console.log(response),commonFactory.closepopup(),model.custdatapageload()})},model.init()}angular.module("KaakateeyaEmpEdit").factory("editEducationModel",factory),factory.$inject=["$http","authSvc","editEducationService","commonFactory","$uibModal","$filter","alert","baseService"]}(angular),function(angular){"use strict";function factory(http){return{getEducationData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerEducationdetails",{params:{CustID:obj}})},getProfessionData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerProfessiondetails",{params:{CustID:obj}})},getAboutData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getEducationProfession_AboutYourself",{params:{CustID:obj,AboutYourself:"",flag:0}})},submitEducationData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerPersonalUpdateEducationdetail",JSON.stringify(obj1))},submitProfessionData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerPersonalUpdateProfessionDetails",JSON.stringify(obj1))},submitAboutUrData:function(obj1){return http.get(editviewapp.apipath+"CustomerPersonal/getEducationProfession_AboutYourself",{params:obj1})},getCustomerData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getpersonaldetails_Customer",{params:{CustID:obj}})},submitCustomerData:function(obj1){return console.log(JSON.stringify(obj1)),http.post(editviewapp.apipath+"CustomerPersonalUpdate/UpdatePersonalDetails_Customersetails",JSON.stringify(obj1))}}}angular.module("KaakateeyaEmpEdit").factory("editEducationService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editManagePhotoModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {

             vm.model = editManagePhotoModel;
             vm.model.scope = scope;
         };


         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editManagePhotoCtrl', controller)

     controller.$inject = ['editManagePhotoModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editManagePhotoService, authSvc, alertss, commonFactory, uibModal, http, fileUpload) {
        var model = {};
        model.scope = {};
        //start declaration block
        var logincustid = authSvc.getCustId();
        var CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        model.loginpaidstatus = authSvc.getpaidstatus();
        var genderID = authSvc.getGenderID();

        model.photorowID = 0;

        //end declaration block

        model.init = function() {
            model.getData();
            return model;
        };

        model.getData = function() {
            editManagePhotoService.getPhotoData(CustID).then(function(response) {
                var StrCustID = CustID;
                console.log(response.data);
                model.manageArr = response.data;
                model.refreshPageLoad(model.manageArr);
            });
        };
        model.refreshPageLoad = function(Arr) {

            _.each(Arr, function(item) {

                model.rbtProtectPassword = item.PhotoPassword === 'Admin@123' ? '1' : '0';
                var imagepath = editviewapp.accesspathdots;

                if (item.IsActive === 0 && item.PhotoName !== null) {
                    var strCustDirName1 = "KMPL_" + CustID + "_Images";
                    var path1 = imagepath + strCustDirName1 + "/" + item.PhotoName;
                    item.ImageUrl = path1 + '?decache=' + Math.random();

                    item.addButtonvisible = false;
                    item.keyname = strCustDirName1 + "/" + item.PhotoName;

                } else if (item.IsActive === 1 && item.IsThumbNailCreated === 1) {

                    var strCustDirName = "KMPL_" + CustID + "_Images";
                    item.addButtonvisible = false;

                    switch (item.DisplayOrder) {
                        case 1:
                            var photoshoppath = "Img1_Images/" + item.ProfileID + "_ApplicationPhoto.jpg";
                            var path11 = imagepath + strCustDirName + "/" + photoshoppath;
                            item.ImageUrl = path11;
                            item.keyname = strCustDirName + "/" + photoshoppath;
                            break;
                        case 2:
                            var photoshoppathnew = "Img2_Images/" + item.ProfileID + "_ApplicationPhoto.jpg";
                            var pathnew = imagepath + strCustDirName + "/" + photoshoppathnew;
                            item.ImageUrl = pathnew;
                            item.keyname = strCustDirName + "/" + photoshoppathnew;
                            break;
                        case 3:
                            var photoshoppathneew3 = "Img3_Images/" + item.ProfileID + "_ApplicationPhoto.jpg";
                            var pathneww = imagepath + strCustDirName + "/" + photoshoppathneew3;
                            item.ImageUrl = pathneww;
                            item.keyname = strCustDirName + "/" + photoshoppathneew3;
                            break;
                    }
                } else if (item.IsActive === 0 && item.PhotoName === null) {
                    item.addButtonvisible = true;


                    item.ImageUrl = genderID === '1' || genderID === 1 ? editviewapp.Mnoimage : editviewapp.Fnoimage;
                }
            });
            return Arr;
        };

        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.AddImage = function(index, Cust_Photos_ID, DisplayOrder, IsActive) {
            model.photorowID = index;
            model.Cust_Photos_ID = Cust_Photos_ID;
            model.DisplayOrder = DisplayOrder;
            model.IsActive = IsActive;
            commonFactory.open('AddimagePopup.html', model.scope, uibModal, 'sm');
        };
        model.upload = function(obj) {
            console.log(obj.myFile);
            var extension = (obj.myFile.name !== '' && obj.myFile.name !== undefined && obj.myFile.name !== null) ? (obj.myFile.name.split('.'))[1] : null;

            extension = angular.lowercase(extension);

            var gifFormat = "gif, jpeg, png,jpg";

            if (typeof(obj.myFile.name) != "undefined") {

                var size = parseFloat(obj.myFile.size / 1024).toFixed(2);
                if (extension !== null && gifFormat.indexOf(angular.lowercase(extension)) === -1) {
                    alert('Your uploaded image contains an unapproved file formats.');
                } else if (size > 4 * 1024) {
                    alert('Sorry,Upload Photo Size Must Be Less than 1 mb');
                } else {
                    // var extension = ((obj.myFile.name).split('.'))[1];
                    var keyname = editviewapp.prefixPath + 'KMPL_' + CustID + '_Images/Img' + model.photorowID + '.' + extension;
                    fileUpload.uploadFileToUrl(obj.myFile, '/photoUplad', keyname).then(function(res) {
                        console.log(res.status);
                        if (res.status == 200) {
                            commonFactory.closepopup();
                            model.uploadData = {
                                GetDetails: {
                                    ID: model.Cust_Photos_ID,
                                    url: 'Img' + model.photorowID + '.' + extension,
                                    order: model.DisplayOrder,
                                    IsProfilePic: 0,
                                    DisplayStatus: model.DisplayOrder,
                                    Password: 0,
                                    IsReviewed: 0,
                                    TempImageUrl: editviewapp.GlobalImgPath + keyname,
                                    IsTempActive: commonFactory.checkvals(model.IsActive) ? model.IsActive : '0',
                                    DeletedImageurl: null,
                                    IsImageDeleted: 0,
                                    PhotoStatus: null,
                                    PhotoID: model.DisplayOrder,
                                    PhotoPassword: null
                                },
                                customerpersonaldetails: {
                                    intCusID: CustID,
                                    EmpID: null,
                                    Admin: null
                                }
                            };

                            editManagePhotoService.submituploadData(model.uploadData).then(function(response) {
                                console.log(response);
                                if (response.status === 200) {

                                    model.manageArr = response.data;
                                    model.refreshPageLoad(model.manageArr);


                                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                                } else {
                                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'Updation failed', 4500);
                                }
                            });
                        }
                    });
                }
            } else {
                alert("This browser does not support HTML5.");
            }

        };

        model.DeleteImage = function(key, Cust_Photoid) {
            model.deleteKey = key;
            model.DCust_Photos_ID = Cust_Photoid;
            commonFactory.open('deleteimagePopup.html', model.scope, uibModal, 'sm');
        };

        model.Delete = function() {
            var keynameq = editviewapp.prefixPath + model.deleteKey;
            http.post('/photoDelete', JSON.stringify({ keyname: keynameq })).then(function(data) {

            });

            editManagePhotoService.linqSubmits(model.DCust_Photos_ID, 3).then(function(response) {
                if (response.data === 1) {
                    commonFactory.closepopup();
                    model.getData();
                }
            });
        };

        model.setAsProfilePic = function(cust_photoID) {
            editManagePhotoService.linqSubmits(cust_photoID, 2).then(function(response) {
                console.log(response.data);

                if (response.data === 1) {
                    model.getData();
                }
            });
        };

        model.setPhotoPassword = function(obj) {

            editManagePhotoService.linqSubmits(CustID, obj).then(function(response) {
                console.log(response);
                if (response.data === 1) {

                    if (obj === '1') {
                        alert('Protect with Password  Uploaded Successfully');
                    } else {
                        alert('Protect with Password Removed Successfully');
                    }
                }
            });

        };

        model.redirectPage = function(type) {

            switch (type) {
                case 'PhotoGuideLines':
                    window.open('#/registration/photoGuideLines', '_blank');
                    break;
                case 'Faqs':
                    window.open('#/faqs', '_blank');
                    break;
                case 'uploadTips':
                    window.open('#/registration/uploadTips', '_blank');
                    break;
            }
        };


        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editManagePhotoModel', factory)

    factory.$inject = ['editManagePhotoService', 'authSvc', 'alert', 'commonFactory', '$uibModal', '$http', 'fileUpload'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getPhotoData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/GetphotosofCustomer', { params: { Custid: obj, EmpID: 2 } });
            },
            submituploadData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/Savephotosofcustomer', JSON.stringify(obj1));
            },
            linqSubmits: function(Custid, iflag) {
                return http.get(editviewapp.apipath + 'CustomerPersonalUpdate/getPhotoPassword', { params: { CustID: Custid, ipassword: iflag } });
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editManagePhotoService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editManagePhotoModel,scope){var vm=this;vm.init=function(){vm.model=editManagePhotoModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editManagePhotoCtrl",controller),controller.$inject=["editManagePhotoModel","$scope"]}(angular),function(angular){"use strict";function factory(editManagePhotoService,authSvc,alertss,commonFactory,uibModal,http,fileUpload){var model={};model.scope={};var logincustid=authSvc.getCustId(),CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;model.loginpaidstatus=authSvc.getpaidstatus();var genderID=authSvc.getGenderID();return model.photorowID=0,model.init=function(){return model.getData(),model},model.getData=function(){editManagePhotoService.getPhotoData(CustID).then(function(response){console.log(response.data),model.manageArr=response.data,model.refreshPageLoad(model.manageArr)})},model.refreshPageLoad=function(Arr){return _.each(Arr,function(item){model.rbtProtectPassword="Admin@123"===item.PhotoPassword?"1":"0";var imagepath=editviewapp.accesspathdots;if(0===item.IsActive&&null!==item.PhotoName){var strCustDirName1="KMPL_"+CustID+"_Images",path1=imagepath+strCustDirName1+"/"+item.PhotoName;item.ImageUrl=path1+"?decache="+Math.random(),item.addButtonvisible=!1,item.keyname=strCustDirName1+"/"+item.PhotoName}else if(1===item.IsActive&&1===item.IsThumbNailCreated){var strCustDirName="KMPL_"+CustID+"_Images";switch(item.addButtonvisible=!1,item.DisplayOrder){case 1:var photoshoppath="Img1_Images/"+item.ProfileID+"_ApplicationPhoto.jpg",path11=imagepath+strCustDirName+"/"+photoshoppath;item.ImageUrl=path11,item.keyname=strCustDirName+"/"+photoshoppath;break;case 2:var photoshoppathnew="Img2_Images/"+item.ProfileID+"_ApplicationPhoto.jpg",pathnew=imagepath+strCustDirName+"/"+photoshoppathnew;item.ImageUrl=pathnew,item.keyname=strCustDirName+"/"+photoshoppathnew;break;case 3:var photoshoppathneew3="Img3_Images/"+item.ProfileID+"_ApplicationPhoto.jpg",pathneww=imagepath+strCustDirName+"/"+photoshoppathneew3;item.ImageUrl=pathneww,item.keyname=strCustDirName+"/"+photoshoppathneew3}}else 0===item.IsActive&&null===item.PhotoName&&(item.addButtonvisible=!0,item.ImageUrl="1"===genderID||1===genderID?editviewapp.Mnoimage:editviewapp.Fnoimage)}),Arr},model.cancel=function(){commonFactory.closepopup()},model.AddImage=function(index,Cust_Photos_ID,DisplayOrder,IsActive){model.photorowID=index,model.Cust_Photos_ID=Cust_Photos_ID,model.DisplayOrder=DisplayOrder,model.IsActive=IsActive,commonFactory.open("AddimagePopup.html",model.scope,uibModal,"sm")},model.upload=function(obj){console.log(obj.myFile);var extension=""!==obj.myFile.name&&void 0!==obj.myFile.name&&null!==obj.myFile.name?obj.myFile.name.split(".")[1]:null;if(extension=angular.lowercase(extension),void 0!==obj.myFile.name){var size=parseFloat(obj.myFile.size/1024).toFixed(2);if(null!==extension&&"gif, jpeg, png,jpg".indexOf(angular.lowercase(extension))===-1)alert("Your uploaded image contains an unapproved file formats.");else if(size>4096)alert("Sorry,Upload Photo Size Must Be Less than 1 mb");else{var keyname=editviewapp.prefixPath+"KMPL_"+CustID+"_Images/Img"+model.photorowID+"."+extension;fileUpload.uploadFileToUrl(obj.myFile,"/photoUplad",keyname).then(function(res){console.log(res.status),200==res.status&&(commonFactory.closepopup(),model.uploadData={GetDetails:{ID:model.Cust_Photos_ID,url:"Img"+model.photorowID+"."+extension,order:model.DisplayOrder,IsProfilePic:0,DisplayStatus:model.DisplayOrder,Password:0,IsReviewed:0,TempImageUrl:editviewapp.GlobalImgPath+keyname,IsTempActive:commonFactory.checkvals(model.IsActive)?model.IsActive:"0",DeletedImageurl:null,IsImageDeleted:0,PhotoStatus:null,PhotoID:model.DisplayOrder,PhotoPassword:null},customerpersonaldetails:{intCusID:CustID,EmpID:null,Admin:null}},editManagePhotoService.submituploadData(model.uploadData).then(function(response){console.log(response),200===response.status?(model.manageArr=response.data,model.refreshPageLoad(model.manageArr),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-success","Updation failed",4500)}))})}}else alert("This browser does not support HTML5.")},model.DeleteImage=function(key,Cust_Photoid){model.deleteKey=key,model.DCust_Photos_ID=Cust_Photoid,commonFactory.open("deleteimagePopup.html",model.scope,uibModal,"sm")},model.Delete=function(){var keynameq=editviewapp.prefixPath+model.deleteKey;http.post("/photoDelete",JSON.stringify({keyname:keynameq})).then(function(data){}),editManagePhotoService.linqSubmits(model.DCust_Photos_ID,3).then(function(response){1===response.data&&(commonFactory.closepopup(),model.getData())})},model.setAsProfilePic=function(cust_photoID){editManagePhotoService.linqSubmits(cust_photoID,2).then(function(response){console.log(response.data),1===response.data&&model.getData()})},model.setPhotoPassword=function(obj){editManagePhotoService.linqSubmits(CustID,obj).then(function(response){console.log(response),1===response.data&&("1"===obj?alert("Protect with Password  Uploaded Successfully"):alert("Protect with Password Removed Successfully"))})},model.redirectPage=function(type){switch(type){case"PhotoGuideLines":window.open("#/registration/photoGuideLines","_blank");break;case"Faqs":window.open("#/faqs","_blank");break;case"uploadTips":window.open("#/registration/uploadTips","_blank")}},model.init()}angular.module("KaakateeyaEmpEdit").factory("editManagePhotoModel",factory),factory.$inject=["editManagePhotoService","authSvc","alert","commonFactory","$uibModal","$http","fileUpload"]}(angular),function(angular){"use strict";function factory(http){return{getPhotoData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/GetphotosofCustomer",{params:{Custid:obj,EmpID:2}})},submituploadData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/Savephotosofcustomer",JSON.stringify(obj1))},linqSubmits:function(Custid,iflag){return http.get(editviewapp.apipath+"CustomerPersonalUpdate/getPhotoPassword",{params:{CustID:Custid,ipassword:iflag}})}}}angular.module("KaakateeyaEmpEdit").factory("editManagePhotoService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editOfcePurposeModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editOfcePurposeModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editOfcePurposeCtrl', controller)

     controller.$inject = ['editOfcePurposeModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editOfcePurposeService, authSvc, alertss, commonFactory, uibModal) {
        var model = {};
        model.scope = {};
        var logincustid = authSvc.getCustId();
        var custID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        model.dataval = '';
        model.aboutObj = {};

        model.init = function() {
            model.pageload();
            return model;
        };

        model.pageload = function() {
            editOfcePurposeService.getofficeData('1', custID, '').then(function(response) {
                console.log(response);
                if (response.data.length > 0) {
                    model.dataval = response.data[0].length > 0 ? (JSON.parse(response.data[0]))[0].AboutProfile : '';
                }
                console.log(model.dataval);
            });
        };

        model.cancel = function() {
            commonFactory.closepopup();
        };
        model.showPopup = function(val) {
            model.aboutObj.txtAboutprofile = '';
            if (val !== undefined) {
                model.aboutObj.txtAboutprofile = val;
            }
            commonFactory.open('AboutModalContent.html', model.scope, uibModal);
        };

        model.AboutProfleSubmit = function(str) {
            editOfcePurposeService.getofficeData('2', custID, str).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                if (response.data === 1) {
                    model.dataval = str;
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }

            });

        };


        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editOfcePurposeModel', factory)

    factory.$inject = ['editOfcePurposeService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getofficeData: function(iflag, obj, text) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonaloffice_purpose', { params: { flag: iflag, ID: obj, AboutProfile: text, IsConfidential: '', HighConfendential: '' } });
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editOfcePurposeService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editOfcePurposeModel,scope){var vm=this;vm.init=function(){vm.model=editOfcePurposeModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editOfcePurposeCtrl",controller),controller.$inject=["editOfcePurposeModel","$scope"]}(angular),function(angular){"use strict";function factory(editOfcePurposeService,authSvc,alertss,commonFactory,uibModal){var model={};model.scope={};var logincustid=authSvc.getCustId(),custID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.dataval="",model.aboutObj={},model.init=function(){return model.pageload(),model},model.pageload=function(){editOfcePurposeService.getofficeData("1",custID,"").then(function(response){console.log(response),response.data.length>0&&(model.dataval=response.data[0].length>0?JSON.parse(response.data[0])[0].AboutProfile:""),console.log(model.dataval)})},model.cancel=function(){commonFactory.closepopup()},model.showPopup=function(val){model.aboutObj.txtAboutprofile="",void 0!==val&&(model.aboutObj.txtAboutprofile=val),commonFactory.open("AboutModalContent.html",model.scope,uibModal)},model.AboutProfleSubmit=function(str){editOfcePurposeService.getofficeData("2",custID,str).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.dataval=str,alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})},model.init()}angular.module("KaakateeyaEmpEdit").factory("editOfcePurposeModel",factory),factory.$inject=["editOfcePurposeService","authSvc","alert","commonFactory","$uibModal"]}(angular),function(angular){"use strict";function factory(http){return{getofficeData:function(iflag,obj,text){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerPersonaloffice_purpose",{params:{flag:iflag,ID:obj,AboutProfile:text,IsConfidential:"",HighConfendential:""}})}}}angular.module("KaakateeyaEmpEdit").factory("editOfcePurposeService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editParentModel, scope) {
         /* jshint validthis:true */
         var vm = this;

         vm.init = function() {
             vm.model = editParentModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editParentCtrl', controller)

     controller.$inject = ['editParentModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editParentService, authSvc, alertss, commonFactory, uibModal) {
        var model = {};
        model.model = {};
        //start declarion block
        model.parent = {};
        model.AdrrObj = {};
        model.physicalObj = {};
        model.lblaboutMyfamily = null;
        model.aboutFamilyObj = {};
        model.dcountry = '1';
        model.parentArr = [];
        model.AboutFamilyReviewStatus = null;
        var isSubmit = true;

        //end declarion block

        var logincustid = authSvc.getCustId();
        var custID = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;


        model.init = function() {
            model.parentBindData();
            model.AboutPageloadData();
            return model;
        }

        model.parentBindData = function() {
            editParentService.getParentData(custID).then(function(response) {
                if (commonFactory.checkvals(response.data)) {
                    model.parentArr = commonFactory.checkvals(response.data[0]) ? JSON.parse(response.data[0]) : [];
                    model.addressArr = commonFactory.checkvals(response.data[1]) ? JSON.parse(response.data[1]) : [];
                    model.physicalArr = commonFactory.checkvals(response.data[2]) ? JSON.parse(response.data[2]) : [];
                    model.AboutFamily = commonFactory.checkvals(response.data[3]) ? JSON.parse(response.data[3]) : [];

                    model.parentmodifiedby = model.parentArr[0].EmpLastModificationDate;
                    model.addrmodifiedby = model.addressArr[0].EmpLastModificationDate;
                    model.physicalmodifiedby = model.physicalArr[0].EmpLastModificationDate;

                }

                if (commonFactory.checkvals(model.AboutFamily[0])) {
                    model.AboutFamilyReviewStatus = model.AboutFamily[0].reviewstatus;
                }
            });
        };

        model.AboutPageloadData = function() {
            editParentService.getAboutFamilyData(custID).then(function(response) {
                console.log(response);
                model.lblaboutMyfamily = response.data;
            });
        };


        model.populateModel = function(type, item) {
            isSubmit = true;
            switch (type) {
                case "parent":
                    model.parent.FatherCust_family_id = null;
                    model.parent.MotherCust_family_id = null;
                    model.parent = {};

                    if (item !== undefined) {
                        model.parent = [];

                        model.parent.cust_id = item.cust_id;
                        model.parent.FatherCust_family_id = item.FatherCust_family_id;
                        model.parent.MotherCust_family_id = item.MotherCust_family_id;

                        model.parent.txtFathername = item.FatherName;
                        model.parent.txtFEducation = item.FatherEducationDetails;
                        model.parent.txtFProfession = item.FatherProfDetails;
                        model.parent.txtCompany = item.FathercompanyName;
                        model.parent.txtJobLocation = item.FatherJoblocation;

                        model.parent.ddlMobile = item.FatherMobileCountryCodeId;
                        model.parent.txtMobile = item.FathermobilenumberID;

                        if (commonFactory.checkvals(item.FatherLandAreaCodeId)) {
                            model.parent.ddlLandLineCountry = item.FatherLandCountryCodeId;
                            model.parent.txtAreCode = item.FatherLandAreaCodeId;
                            model.parent.txtLandNumber = item.FatherLandNumberID;
                        } else {
                            model.parent.ddlfathermobile2 = item.FatherLandCountryCodeId;
                            model.parent.txtfathermobile2 = item.FatherLandNumberID;
                        }

                        model.parent.txtEmail = item.FatherEmail;
                        model.parent.txtFatherFname = item.FatherFathername;

                        model.parent.ddlFatherfatherMobileCountryCode = item.FatherfatherMobileCountryID;
                        model.parent.txtMobileFatherfather = item.FatherFatherMobileNumber;

                        if (commonFactory.checkvals(item.FatherFatherLandAreaCode)) {
                            model.parent.ddlFatherFatherLandLineCode = item.FatherfatherLandCountryCodeID;
                            model.parent.txtGrandFatherArea = item.FatherFatherLandAreaCode;
                            model.parent.txtGrandFatherLandLinenum = item.FatherFatherLandNumber;
                        } else {
                            model.parent.ddlfatherfatherAlternative = item.FatherfatherMobileCountrycode1;
                            model.parent.txtfatherfatherAlternative = item.FatherFatherLandNumber;
                        }

                        model.parent.ddlFState = item.FatherStateID;
                        model.parent.ddlFDistric = item.FatherDistrictID;
                        model.parent.txtFNativePlace = item.FatherNativeplace;
                        model.parent.txtMName = item.MotherName;
                        model.parent.txtMEducation = item.MotherEducationDetails;
                        model.parent.txtMProfession = item.MotherProfedetails;
                        model.parent.chkbox = item.MotherProfedetails == 'HouseWife' ? true : false;
                        model.parent.txtMCompanyName = item.MothercompanyName;
                        model.parent.txtMJobLocation = item.MotherJoblocation;

                        model.parent.ddlMMobileCounCodeID = item.MotherMobileCountryCodeId;
                        model.parent.txtMMobileNum = item.MotherMobilenumberID;

                        if (commonFactory.checkvals(item.MotherLandAreaCodeId)) {
                            model.parent.ddlMLandLineCounCode = item.MotherLandCountryCodeId;
                            model.parent.txtmAreaCode = item.MotherLandAreaCodeId;
                            model.parent.txtMLandLineNum = item.MotherLandNumberID;
                        } else {
                            model.parent.ddlMMobileCounCodeID2 = item.MotherMobileCountryCodeId;
                            model.parent.txtMMobileNum2 = item.MotherLandNumberID;

                        }

                        model.parent.txtMEmail = item.MotherEmail;
                        model.parent.txtMFatherFname = item.MotherFatherName;
                        model.parent.txtMFatherLname = item.MotherFatherLastName;

                        model.parent.ddlMotherfatheMobileCountryCode = item.MotherfatherMobileCountryID;
                        model.parent.txtMotherfatheMobilenumber = item.MotherFatherMobileNumber;

                        if (commonFactory.checkvals(item.MotherFatherLandAreaCode)) {
                            model.parent.ddlMotherFatherLandLineCode = item.motherfatherLandCountryID;
                            model.parent.txtMotherFatherLandLineareacode = item.MotherFatherLandAreaCode;
                            model.parent.txtMotherFatherLandLinenum = item.MotherFatherLandNumber;
                        } else {
                            model.parent.ddlmotherfatheralternative = item.MotherfatherMobileCountryID1;
                            model.parent.txtmotherfatheralternative = item.MotherFatherLandNumber;
                        }
                        model.parent.ddlMState = item.motherStateID;
                        model.parent.ddlMDistrict = item.motherDistricID;
                        model.parent.txtMNativePlace = item.MotherNativeplace;
                        model.parent.rbtlParentIntercaste = item.Intercaste === 'Yes' ? 1 : 0;
                        model.parent.ddlFatherCaste = item.FatherCasteID;
                        model.parent.ddlMotherCaste = item.MotherCasteID;

                        model.parent.ddlFprofessionCatgory = item.FatherProfessionCategoryID;
                        model.parent.ddlMprofessionCatgory = item.MotherProfessionCategoryID;

                    }
                    commonFactory.open('parentModalContent.html', model.scope, uibModal);

                    break;

                case "Address":
                    model.AdrrObj.Cust_Family_ID = null;
                    model.AdrrObj = {};
                    if (item !== undefined) {
                        model.AdrrObj.Cust_ID = item.Cust_ID;
                        model.AdrrObj.Cust_Family_ID = item.Cust_Family_ID;

                        model.AdrrObj.txtHouse_flat = item.FlatNumber;
                        model.AdrrObj.txtApartmentName = item.ApartmentName;
                        model.AdrrObj.txtStreetName = item.StreetName;
                        model.AdrrObj.txtAreaName = item.AreaName;
                        model.AdrrObj.txtLandmark = item.LandMark;
                        model.AdrrObj.ddlCountryContact = item.ParentCountryId;
                        model.AdrrObj.ddlStateContact = item.ParentStateid;
                        model.AdrrObj.ddlDistricContact = item.ParentDistrictId;
                        model.AdrrObj.txtCity = item.CityName;
                        model.AdrrObj.txtZip_no = item.Zip;
                    }
                    commonFactory.open('AddressModalContent.html', model.scope, uibModal);


                    break;

                case "physicalAttributes":
                    model.physicalObj = {};

                    if (item !== undefined) {
                        model.physicalObj.Cust_ID = item.Cust_ID;

                        model.physicalObj.rbtlDiet = item.DietID;
                        model.physicalObj.rbtlDrink = item.DrinkID;
                        model.physicalObj.rbtlSmoke = item.SmokeID;
                        model.physicalObj.ddlBodyType = item.BodyTypeID;
                        model.physicalObj.txtBWKgs = item.BodyWeight;
                        model.physicalObj.ddlBloodGroup = item.BloodGroupID;
                        model.physicalObj.ddlHealthConditions = item.HealthConditionID;
                        model.physicalObj.txtHealthCondition = item.HealthConditionDescription;
                    }
                    commonFactory.open('PhysicalAttributeModalContent.html', model.scope, uibModal);


                    break;

                case "AboutFamily":

                    if (item !== undefined) {
                        model.aboutFamilyObj.txtAboutUs = item;
                    }
                    commonFactory.open('AboutFamilyModalContent.html', model.scope, uibModal);

                    break;
            }
        };

        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.ParentSubmit = function(objitem) {
            if (isSubmit) {
                isSubmit = false;

                model.myData = {
                    GetDetails: {
                        CustID: custID,
                        FatherName: objitem.txtFathername,
                        Educationcategory: null,
                        Educationgroup: null,
                        Educationspecialization: null,
                        Employedin: null,
                        Professiongroup: null,
                        Profession: null,
                        CompanyName: objitem.txtCompany,
                        JobLocation: objitem.txtJobLocation,
                        Professiondetails: objitem.txtFProfession,
                        MobileCountry: objitem.ddlMobile,
                        MobileNumber: objitem.txtMobile,
                        LandlineCountry: commonFactory.checkvals(objitem.ddlfathermobile2) ? objitem.ddlfathermobile2 : (commonFactory.checkvals(objitem.ddlLandLineCountry) ? objitem.ddlLandLineCountry : null),
                        LandAreCode: commonFactory.checkvals(objitem.txtfathermobile2) ? null : (commonFactory.checkvals(objitem.txtAreCode) ? objitem.txtAreCode : null),
                        landLineNumber: commonFactory.checkvals(objitem.txtfathermobile2) ? objitem.txtfathermobile2 : (commonFactory.checkvals(objitem.txtLandNumber) ? objitem.txtLandNumber : null),
                        Email: objitem.txtEmail,
                        FatherFatherName: objitem.txtFatherFname,

                        MotherName: objitem.txtMName,
                        MotherEducationcategory: null,
                        MotherEducationgroup: null,
                        MotherEducationspecialization: null,
                        MotherEmployedIn: null,
                        MotherProfessiongroup: null,
                        MotherProfession: null,
                        MotherCompanyName: objitem.txtMCompanyName,
                        MotherJobLocation: objitem.txtMJobLocation,
                        MotherProfessiondetails: objitem.txtMProfession,
                        MotherMobileCountryID: objitem.ddlMMobileCounCodeID,
                        MotherMobileNumber: objitem.txtMMobileNum,
                        MotherLandCountryID: commonFactory.checkvals(objitem.ddlMMobileCounCodeID2) ? objitem.ddlMMobileCounCodeID2 : commonFactory.checkvals(objitem.ddlMLandLineCounCode) ? objitem.ddlMLandLineCounCode : null,
                        MotherLandAreaCode: commonFactory.checkvals(objitem.txtMMobileNum2) ? null : (commonFactory.checkvals(objitem.txtmAreaCode) ? objitem.txtmAreaCode : null),
                        MotherLandNumber: commonFactory.checkvals(objitem.txtMMobileNum2) ? objitem.txtMMobileNum2 : commonFactory.checkvals(objitem.txtMLandLineNum) ? objitem.txtMLandLineNum : null,
                        MotherEmail: objitem.txtMEmail,
                        MotherFatherFistname: objitem.txtMFatherFname,
                        MotherFatherLastname: objitem.txtMFatherLname,
                        FatherCustFamilyID: model.parent.FatherCust_family_id,
                        MotherCustFamilyID: model.parent.MotherCust_family_id,
                        FatherEducationDetails: objitem.txtFEducation,
                        MotherEducationDetails: objitem.txtMEducation,
                        FatherCountry: 1,
                        FatherState: objitem.ddlFState,
                        FatherDistric: objitem.ddlFDistric,
                        FatherCity: objitem.txtFNativePlace,
                        MotherCountry: 1,
                        MotherState: objitem.ddlMState,
                        MotherDistric: objitem.ddlMDistrict,
                        MotherCity: objitem.txtMNativePlace,
                        AreParentsInterCaste: objitem.rbtlParentIntercaste,
                        FatherfatherMobileCountryID: objitem.ddlFatherfatherMobileCountryCode,
                        FatherFatherMobileNumber: objitem.txtMobileFatherfather,
                        FatherFatherLandCountryID: commonFactory.checkvals(objitem.ddlfatherfatherAlternative) ? objitem.ddlfatherfatherAlternative : (commonFactory.checkvals(objitem.ddlFatherFatherLandLineCode) ? objitem.ddlFatherFatherLandLineCode : null),
                        FatherFatherLandAreaCode: commonFactory.checkvals(objitem.txtfatherfatherAlternative) ? null : (commonFactory.checkvals(objitem.txtGrandFatherArea) ? objitem.txtGrandFatherArea : null),
                        FatherFatherLandNumber: commonFactory.checkvals(objitem.txtfatherfatherAlternative) ? objitem.txtfatherfatherAlternative : (commonFactory.checkvals(objitem.txtGrandFatherLandLinenum) ? objitem.txtGrandFatherLandLinenum : null),
                        MotherfatherMobileCountryID: objitem.ddlMotherfatheMobileCountryCode,
                        MotherFatherMobileNumber: objitem.txtMotherfatheMobilenumber,
                        MotherFatherLandCountryID: commonFactory.checkvals(objitem.ddlmotherfatheralternative) ? objitem.ddlmotherfatheralternative : (commonFactory.checkvals(objitem.ddlMotherFatherLandLineCode) ? objitem.ddlMotherFatherLandLineCode : null),
                        MotherFatherLandAreaCode: commonFactory.checkvals(objitem.txtmotherfatheralternative) ? null : (commonFactory.checkvals(objitem.txtMotherFatherLandLineareacode) ? objitem.txtMotherFatherLandLineareacode : null),
                        MotherFatherLandNumber: commonFactory.checkvals(objitem.txtmotherfatheralternative) ? objitem.txtmotherfatheralternative : (commonFactory.checkvals(objitem.txtMotherFatherLandLinenum) ? objitem.txtMotherFatherLandLinenum : null),
                        FatherCaste: objitem.ddlMotherCaste,
                        MotherCaste: objitem.ddlFatherCaste,
                        FatherProfessionCategoryID: objitem.ddlFprofessionCatgory,
                        MotherProfessionCategoryID: objitem.ddlMprofessionCatgory
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }

                };

                console.log(JSON.stringify(model.myData));
                model.submitPromise = editParentService.submitParentData(model.myData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {
                        model.parentBindData(custID);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);

                        if (model.datagetInStatus === 1) {
                            sessionStorage.removeItem('missingStatus');
                            route.go('mobileverf', {});


                        }
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });

            }

        };

        model.contactAddressSubmit = function(objitem) {

            if (isSubmit) {
                isSubmit = false;

                model.myAddrData = {
                    GetDetails: {
                        CustID: custID,
                        HouseFlateNumber: objitem.txtHouse_flat,
                        Apartmentname: objitem.txtApartmentName,
                        Streetname: objitem.txtStreetName,
                        AreaName: objitem.txtAreaName,
                        Landmark: objitem.txtLandmark,
                        Country: objitem.ddlCountryContact,
                        STATE: objitem.ddlStateContact,
                        District: objitem.ddlDistricContact,
                        othercity: null,
                        city: objitem.txtCity,
                        ZipPin: objitem.txtZip_no,
                        Cust_Family_ID: model.AdrrObj.Cust_Family_ID
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }

                };
                model.submitPromise = editParentService.submitAddressData(model.myAddrData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.parentBindData(custID);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });

            }

        };

        model.physicalAtrrSubmit = function(objitem) {

            if (isSubmit) {
                isSubmit = false;
                model.myPhysicalData = {
                    GetDetails: {
                        CustID: custID,
                        BWKgs: objitem.txtBWKgs,
                        BWlbs: objitem.txtlbs,
                        BloodGroup: objitem.ddlBloodGroup,
                        HealthConditions: objitem.ddlHealthConditions,
                        HealthConditiondesc: objitem.txtHealthCondition,
                        DietID: objitem.rbtlDiet,
                        SmokeID: objitem.rbtlSmoke,
                        DrinkID: objitem.rbtlDrink,
                        BodyTypeID: objitem.ddlBodyType,
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }

                };

                model.submitPromise = editParentService.submitPhysicalData(model.myPhysicalData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.parentBindData(custID);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.AboutMyfamilySubmit = function(obj) {
            if (isSubmit) {
                isSubmit = false;

                model.submitPromise = editParentService.submitAboutFamilyData({ CustID: custID, AboutYourself: obj.txtAboutUs, flag: 1 }).then(function(response) {
                    console.log(response);
                    model.lblaboutMyfamily = obj.txtAboutUs;
                    commonFactory.closepopup();
                    if (response.data === '1') {

                        model.AboutPageloadData(custID);
                        model.$broadcast("showAlertPopupccc", 'alert-success', 'submitted Succesfully', 1500);
                    } else {
                        model.$broadcast("showAlertPopupccc", 'alert-danger', 'Updation failed', 1500);
                    }
                });
            }
        };




        model.housewiseChk = function(item) {
            if (item.chkbox === true) {
                item.txtMProfession = 'HouseWife';
            } else {
                item.txtMProfession = '';
            }
        };

        model.roundVal = function(val) {
            var dec = 2;
            var result = Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec);
            return result;
        };
        model.converttolbs = function(item) {
            var value = item.txtBWKgs;
            item.txtlbs = '';
            if (value.length > 0) {
                var lbs = value * 2.2;
                lbs = model.roundVal(lbs);
                item.txtlbs = lbs;
                if (lbs.toString() == 'NaN') {
                    //jAlert("", 'Alert Dialog', x);
                    alert("invalid Number");
                    item.txtlbs = '';
                    item.txtBWKgs = '';
                }
            } else {
                item.txtBWKgs = '';
                item.txtlbs = '';
            }
        };














        return model.init();

    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editParentModel', factory)

    factory.$inject = ['editParentService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getParentData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getParentDetailsDisplay', { params: { CustID: obj } });
            },
            getAboutFamilyData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getParents_AboutMyFamily', { params: { CustID: obj, AboutYourself: '', flag: 0 } });
            },
            submitParentData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerParentUpdatedetails', JSON.stringify(obj1));
            },
            submitAddressData: function(obj1) {
                console.log(JSON.stringify(obj1));
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerContactAddressUpdatedetails', JSON.stringify(obj1));
            },
            submitPhysicalData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerPhysicalAttributesUpdatedetails', JSON.stringify(obj1));
            },
            submitAboutFamilyData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getParents_AboutMyFamily', { params: obj });
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editParentService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editParentModel,scope){var vm=this;vm.init=function(){vm.model=editParentModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editParentCtrl",controller),controller.$inject=["editParentModel","$scope"]}(angular),function(angular){"use strict";function factory(editParentService,authSvc,alertss,commonFactory,uibModal){var model={};model.model={},model.parent={},model.AdrrObj={},model.physicalObj={},model.lblaboutMyfamily=null,model.aboutFamilyObj={},model.dcountry="1",model.parentArr=[],model.AboutFamilyReviewStatus=null;var isSubmit=!0,logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.init=function(){return model.parentBindData(),model.AboutPageloadData(),model},model.parentBindData=function(){editParentService.getParentData(custID).then(function(response){commonFactory.checkvals(response.data)&&(model.parentArr=commonFactory.checkvals(response.data[0])?JSON.parse(response.data[0]):[],model.addressArr=commonFactory.checkvals(response.data[1])?JSON.parse(response.data[1]):[],model.physicalArr=commonFactory.checkvals(response.data[2])?JSON.parse(response.data[2]):[],model.AboutFamily=commonFactory.checkvals(response.data[3])?JSON.parse(response.data[3]):[],model.parentmodifiedby=model.parentArr[0].EmpLastModificationDate,model.addrmodifiedby=model.addressArr[0].EmpLastModificationDate,model.physicalmodifiedby=model.physicalArr[0].EmpLastModificationDate),commonFactory.checkvals(model.AboutFamily[0])&&(model.AboutFamilyReviewStatus=model.AboutFamily[0].reviewstatus)})},model.AboutPageloadData=function(){editParentService.getAboutFamilyData(custID).then(function(response){console.log(response),model.lblaboutMyfamily=response.data})},model.populateModel=function(type,item){switch(isSubmit=!0,type){case"parent":model.parent.FatherCust_family_id=null,model.parent.MotherCust_family_id=null,model.parent={},void 0!==item&&(model.parent=[],model.parent.cust_id=item.cust_id,model.parent.FatherCust_family_id=item.FatherCust_family_id,model.parent.MotherCust_family_id=item.MotherCust_family_id,model.parent.txtFathername=item.FatherName,model.parent.txtFEducation=item.FatherEducationDetails,model.parent.txtFProfession=item.FatherProfDetails,model.parent.txtCompany=item.FathercompanyName,model.parent.txtJobLocation=item.FatherJoblocation,model.parent.ddlMobile=item.FatherMobileCountryCodeId,model.parent.txtMobile=item.FathermobilenumberID,commonFactory.checkvals(item.FatherLandAreaCodeId)?(model.parent.ddlLandLineCountry=item.FatherLandCountryCodeId,model.parent.txtAreCode=item.FatherLandAreaCodeId,model.parent.txtLandNumber=item.FatherLandNumberID):(model.parent.ddlfathermobile2=item.FatherLandCountryCodeId,model.parent.txtfathermobile2=item.FatherLandNumberID),model.parent.txtEmail=item.FatherEmail,model.parent.txtFatherFname=item.FatherFathername,model.parent.ddlFatherfatherMobileCountryCode=item.FatherfatherMobileCountryID,model.parent.txtMobileFatherfather=item.FatherFatherMobileNumber,commonFactory.checkvals(item.FatherFatherLandAreaCode)?(model.parent.ddlFatherFatherLandLineCode=item.FatherfatherLandCountryCodeID,model.parent.txtGrandFatherArea=item.FatherFatherLandAreaCode,model.parent.txtGrandFatherLandLinenum=item.FatherFatherLandNumber):(model.parent.ddlfatherfatherAlternative=item.FatherfatherMobileCountrycode1,model.parent.txtfatherfatherAlternative=item.FatherFatherLandNumber),model.parent.ddlFState=item.FatherStateID,model.parent.ddlFDistric=item.FatherDistrictID,model.parent.txtFNativePlace=item.FatherNativeplace,model.parent.txtMName=item.MotherName,model.parent.txtMEducation=item.MotherEducationDetails,model.parent.txtMProfession=item.MotherProfedetails,model.parent.chkbox="HouseWife"==item.MotherProfedetails,model.parent.txtMCompanyName=item.MothercompanyName,model.parent.txtMJobLocation=item.MotherJoblocation,model.parent.ddlMMobileCounCodeID=item.MotherMobileCountryCodeId,model.parent.txtMMobileNum=item.MotherMobilenumberID,commonFactory.checkvals(item.MotherLandAreaCodeId)?(model.parent.ddlMLandLineCounCode=item.MotherLandCountryCodeId,model.parent.txtmAreaCode=item.MotherLandAreaCodeId,model.parent.txtMLandLineNum=item.MotherLandNumberID):(model.parent.ddlMMobileCounCodeID2=item.MotherMobileCountryCodeId,model.parent.txtMMobileNum2=item.MotherLandNumberID),model.parent.txtMEmail=item.MotherEmail,model.parent.txtMFatherFname=item.MotherFatherName,model.parent.txtMFatherLname=item.MotherFatherLastName,model.parent.ddlMotherfatheMobileCountryCode=item.MotherfatherMobileCountryID,model.parent.txtMotherfatheMobilenumber=item.MotherFatherMobileNumber,commonFactory.checkvals(item.MotherFatherLandAreaCode)?(model.parent.ddlMotherFatherLandLineCode=item.motherfatherLandCountryID,model.parent.txtMotherFatherLandLineareacode=item.MotherFatherLandAreaCode,model.parent.txtMotherFatherLandLinenum=item.MotherFatherLandNumber):(model.parent.ddlmotherfatheralternative=item.MotherfatherMobileCountryID1,model.parent.txtmotherfatheralternative=item.MotherFatherLandNumber),model.parent.ddlMState=item.motherStateID,model.parent.ddlMDistrict=item.motherDistricID,model.parent.txtMNativePlace=item.MotherNativeplace,model.parent.rbtlParentIntercaste="Yes"===item.Intercaste?1:0,model.parent.ddlFatherCaste=item.FatherCasteID,model.parent.ddlMotherCaste=item.MotherCasteID,model.parent.ddlFprofessionCatgory=item.FatherProfessionCategoryID,model.parent.ddlMprofessionCatgory=item.MotherProfessionCategoryID),commonFactory.open("parentModalContent.html",model.scope,uibModal);break;case"Address":model.AdrrObj.Cust_Family_ID=null,model.AdrrObj={},void 0!==item&&(model.AdrrObj.Cust_ID=item.Cust_ID,model.AdrrObj.Cust_Family_ID=item.Cust_Family_ID,model.AdrrObj.txtHouse_flat=item.FlatNumber,model.AdrrObj.txtApartmentName=item.ApartmentName,model.AdrrObj.txtStreetName=item.StreetName,model.AdrrObj.txtAreaName=item.AreaName,model.AdrrObj.txtLandmark=item.LandMark,model.AdrrObj.ddlCountryContact=item.ParentCountryId,model.AdrrObj.ddlStateContact=item.ParentStateid,model.AdrrObj.ddlDistricContact=item.ParentDistrictId,model.AdrrObj.txtCity=item.CityName,model.AdrrObj.txtZip_no=item.Zip),commonFactory.open("AddressModalContent.html",model.scope,uibModal);break;case"physicalAttributes":model.physicalObj={},void 0!==item&&(model.physicalObj.Cust_ID=item.Cust_ID,model.physicalObj.rbtlDiet=item.DietID,model.physicalObj.rbtlDrink=item.DrinkID,model.physicalObj.rbtlSmoke=item.SmokeID,model.physicalObj.ddlBodyType=item.BodyTypeID,model.physicalObj.txtBWKgs=item.BodyWeight,model.physicalObj.ddlBloodGroup=item.BloodGroupID,model.physicalObj.ddlHealthConditions=item.HealthConditionID,model.physicalObj.txtHealthCondition=item.HealthConditionDescription),commonFactory.open("PhysicalAttributeModalContent.html",model.scope,uibModal);break;case"AboutFamily":void 0!==item&&(model.aboutFamilyObj.txtAboutUs=item),commonFactory.open("AboutFamilyModalContent.html",model.scope,uibModal)}},model.cancel=function(){commonFactory.closepopup()},model.ParentSubmit=function(objitem){isSubmit&&(isSubmit=!1,model.myData={GetDetails:{CustID:custID,FatherName:objitem.txtFathername,Educationcategory:null,Educationgroup:null,Educationspecialization:null,Employedin:null,Professiongroup:null,Profession:null,CompanyName:objitem.txtCompany,JobLocation:objitem.txtJobLocation,Professiondetails:objitem.txtFProfession,MobileCountry:objitem.ddlMobile,MobileNumber:objitem.txtMobile,LandlineCountry:commonFactory.checkvals(objitem.ddlfathermobile2)?objitem.ddlfathermobile2:commonFactory.checkvals(objitem.ddlLandLineCountry)?objitem.ddlLandLineCountry:null,LandAreCode:commonFactory.checkvals(objitem.txtfathermobile2)?null:commonFactory.checkvals(objitem.txtAreCode)?objitem.txtAreCode:null,landLineNumber:commonFactory.checkvals(objitem.txtfathermobile2)?objitem.txtfathermobile2:commonFactory.checkvals(objitem.txtLandNumber)?objitem.txtLandNumber:null,Email:objitem.txtEmail,FatherFatherName:objitem.txtFatherFname,MotherName:objitem.txtMName,MotherEducationcategory:null,MotherEducationgroup:null,MotherEducationspecialization:null,MotherEmployedIn:null,MotherProfessiongroup:null,MotherProfession:null,MotherCompanyName:objitem.txtMCompanyName,MotherJobLocation:objitem.txtMJobLocation,MotherProfessiondetails:objitem.txtMProfession,MotherMobileCountryID:objitem.ddlMMobileCounCodeID,MotherMobileNumber:objitem.txtMMobileNum,MotherLandCountryID:commonFactory.checkvals(objitem.ddlMMobileCounCodeID2)?objitem.ddlMMobileCounCodeID2:commonFactory.checkvals(objitem.ddlMLandLineCounCode)?objitem.ddlMLandLineCounCode:null,MotherLandAreaCode:commonFactory.checkvals(objitem.txtMMobileNum2)?null:commonFactory.checkvals(objitem.txtmAreaCode)?objitem.txtmAreaCode:null,MotherLandNumber:commonFactory.checkvals(objitem.txtMMobileNum2)?objitem.txtMMobileNum2:commonFactory.checkvals(objitem.txtMLandLineNum)?objitem.txtMLandLineNum:null,MotherEmail:objitem.txtMEmail,MotherFatherFistname:objitem.txtMFatherFname,MotherFatherLastname:objitem.txtMFatherLname,FatherCustFamilyID:model.parent.FatherCust_family_id,MotherCustFamilyID:model.parent.MotherCust_family_id,FatherEducationDetails:objitem.txtFEducation,MotherEducationDetails:objitem.txtMEducation,FatherCountry:1,FatherState:objitem.ddlFState,FatherDistric:objitem.ddlFDistric,FatherCity:objitem.txtFNativePlace,MotherCountry:1,MotherState:objitem.ddlMState,MotherDistric:objitem.ddlMDistrict,MotherCity:objitem.txtMNativePlace,AreParentsInterCaste:objitem.rbtlParentIntercaste,FatherfatherMobileCountryID:objitem.ddlFatherfatherMobileCountryCode,FatherFatherMobileNumber:objitem.txtMobileFatherfather,FatherFatherLandCountryID:commonFactory.checkvals(objitem.ddlfatherfatherAlternative)?objitem.ddlfatherfatherAlternative:commonFactory.checkvals(objitem.ddlFatherFatherLandLineCode)?objitem.ddlFatherFatherLandLineCode:null,FatherFatherLandAreaCode:commonFactory.checkvals(objitem.txtfatherfatherAlternative)?null:commonFactory.checkvals(objitem.txtGrandFatherArea)?objitem.txtGrandFatherArea:null,FatherFatherLandNumber:commonFactory.checkvals(objitem.txtfatherfatherAlternative)?objitem.txtfatherfatherAlternative:commonFactory.checkvals(objitem.txtGrandFatherLandLinenum)?objitem.txtGrandFatherLandLinenum:null,MotherfatherMobileCountryID:objitem.ddlMotherfatheMobileCountryCode,MotherFatherMobileNumber:objitem.txtMotherfatheMobilenumber,MotherFatherLandCountryID:commonFactory.checkvals(objitem.ddlmotherfatheralternative)?objitem.ddlmotherfatheralternative:commonFactory.checkvals(objitem.ddlMotherFatherLandLineCode)?objitem.ddlMotherFatherLandLineCode:null,MotherFatherLandAreaCode:commonFactory.checkvals(objitem.txtmotherfatheralternative)?null:commonFactory.checkvals(objitem.txtMotherFatherLandLineareacode)?objitem.txtMotherFatherLandLineareacode:null,MotherFatherLandNumber:commonFactory.checkvals(objitem.txtmotherfatheralternative)?objitem.txtmotherfatheralternative:commonFactory.checkvals(objitem.txtMotherFatherLandLinenum)?objitem.txtMotherFatherLandLinenum:null,FatherCaste:objitem.ddlMotherCaste,MotherCaste:objitem.ddlFatherCaste,FatherProfessionCategoryID:objitem.ddlFprofessionCatgory,MotherProfessionCategoryID:objitem.ddlMprofessionCatgory},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},console.log(JSON.stringify(model.myData)),model.submitPromise=editParentService.submitParentData(model.myData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.parentBindData(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500),1===model.datagetInStatus&&(sessionStorage.removeItem("missingStatus"),route.go("mobileverf",{}))):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.contactAddressSubmit=function(objitem){isSubmit&&(isSubmit=!1,model.myAddrData={GetDetails:{CustID:custID,HouseFlateNumber:objitem.txtHouse_flat,Apartmentname:objitem.txtApartmentName,Streetname:objitem.txtStreetName,AreaName:objitem.txtAreaName,Landmark:objitem.txtLandmark,Country:objitem.ddlCountryContact,STATE:objitem.ddlStateContact,District:objitem.ddlDistricContact,othercity:null,city:objitem.txtCity,ZipPin:objitem.txtZip_no,Cust_Family_ID:model.AdrrObj.Cust_Family_ID},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editParentService.submitAddressData(model.myAddrData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.parentBindData(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.physicalAtrrSubmit=function(objitem){isSubmit&&(isSubmit=!1,model.myPhysicalData={GetDetails:{CustID:custID,BWKgs:objitem.txtBWKgs,BWlbs:objitem.txtlbs,BloodGroup:objitem.ddlBloodGroup,HealthConditions:objitem.ddlHealthConditions,HealthConditiondesc:objitem.txtHealthCondition,DietID:objitem.rbtlDiet,SmokeID:objitem.rbtlSmoke,DrinkID:objitem.rbtlDrink,BodyTypeID:objitem.ddlBodyType},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editParentService.submitPhysicalData(model.myPhysicalData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.parentBindData(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.AboutMyfamilySubmit=function(obj){isSubmit&&(isSubmit=!1,model.submitPromise=editParentService.submitAboutFamilyData({CustID:custID,AboutYourself:obj.txtAboutUs,flag:1}).then(function(response){console.log(response),model.lblaboutMyfamily=obj.txtAboutUs,commonFactory.closepopup(),"1"===response.data?(model.AboutPageloadData(custID),model.$broadcast("showAlertPopupccc","alert-success","submitted Succesfully",1500)):model.$broadcast("showAlertPopupccc","alert-danger","Updation failed",1500)}))},model.housewiseChk=function(item){item.chkbox===!0?item.txtMProfession="HouseWife":item.txtMProfession=""},model.roundVal=function(val){return Math.round(val*Math.pow(10,2))/Math.pow(10,2)},model.converttolbs=function(item){var value=item.txtBWKgs;if(item.txtlbs="",value.length>0){var lbs=2.2*value;lbs=model.roundVal(lbs),item.txtlbs=lbs,"NaN"==lbs.toString()&&(alert("invalid Number"),item.txtlbs="",item.txtBWKgs="")}else item.txtBWKgs="",item.txtlbs=""},model.init()}angular.module("KaakateeyaEmpEdit").factory("editParentModel",factory),factory.$inject=["editParentService","authSvc","alert","commonFactory","$uibModal"]}(angular),function(angular){"use strict";function factory(http){return{getParentData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getParentDetailsDisplay",{params:{CustID:obj}})},getAboutFamilyData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getParents_AboutMyFamily",{params:{CustID:obj,AboutYourself:"",flag:0}})},submitParentData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerParentUpdatedetails",JSON.stringify(obj1))},submitAddressData:function(obj1){return console.log(JSON.stringify(obj1)),http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerContactAddressUpdatedetails",JSON.stringify(obj1))},submitPhysicalData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerPhysicalAttributesUpdatedetails",JSON.stringify(obj1))},submitAboutFamilyData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getParents_AboutMyFamily",{params:obj})}}}angular.module("KaakateeyaEmpEdit").factory("editParentService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editPartnerpreferenceModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editPartnerpreferenceModel;
             vm.model.scope = scope;
         };

         vm.init();

     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editPartnerpreferenceCtrl', controller)

     controller.$inject = ['editPartnerpreferenceModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';

    function factory(editPartnerpreferenceService, authSvc, alertss, commonFactory, uibModal) {
        var model = {};
        model.scope = {};

        //start declaration block
        model.partnerPrefArr = [];
        model.partnerObj = {};
        model.ageGapArr = [];
        model.partnerDescObj = {};
        var isSubmit = true;

        var logincustid = authSvc.getCustId();
        var custID = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;
        model.partnerDescription = '';

        //end declaration block

        model.init = function() {
            model.pageload();

            return model;
        };

        model.pageload = function() {
            editPartnerpreferenceService.getPartnerPreferenceData(custID).then(function(response) {
                model.partnerPrefArr = response.data;
                model.partnerDescription = (model.partnerPrefArr.length > 0 && model.partnerPrefArr[0].PartnerDescripition !== undefined && model.partnerPrefArr[0].PartnerDescripition !== null) ? model.partnerPrefArr[0].PartnerDescripition : '';

                model.partnermodifiedby = (model.partnerPrefArr.length > 0 && model.partnerPrefArr[0].EmpLastModificationDate !== undefined && model.partnerPrefArr[0].EmpLastModificationDate !== null) ? model.partnerPrefArr[0].EmpLastModificationDate : '';

            });
        };
        model.removeSelect = function(data) {
            if (data[0] !== undefined && angular.lowercase(data[0].title) === '--select--') {
                data.splice(0, 1);
            }

            return data;
        };
        model.SplitstringintoArray = function(string) {
            var array = [];
            if (string !== null && string !== "") {
                _.each(string.split(','), function(item) {
                    array.push(parseInt(item));
                });
            }
            return array;
        };
        model.partnerprefPopulate = function(item) {
            isSubmit = true;
            model.partnerObj = {};

            if (item !== undefined) {
                model.casteArr = model.removeSelect(commonFactory.casteDepedency(item.religionid, item.MotherTongueID));
                model.stateArr = model.removeSelect(commonFactory.StateBind(item.CountryID));
                model.eduGroupArr = model.removeSelect(commonFactory.educationGroupBind(item.EducationCategoryID));
                model.starArr = model.removeSelect(commonFactory.starBind(item.StarLanguageID));
                model.subCasteArr = model.removeSelect(commonFactory.subCaste(commonFactory.listSelectedVal(item.casteid)));

                model.partnerObj.intCusID = item.intCusID;
                model.ageGapArr = commonFactory.numbersBind('years', 1, 80);

                model.partnerObj.rbtlGender = item.Gender === 'Female' ? 2 : 1;
                model.partnerObj.ddlFromAge = item.Agemin;
                model.partnerObj.ddlToAge = item.AgeMax;
                model.partnerObj.ddlFromheight = item.MinHeight;
                model.partnerObj.ddltoHeight = item.MaxHeight;
                model.partnerObj.lstReligion = model.SplitstringintoArray(item.religionid);
                model.partnerObj.lstMothertongue = model.SplitstringintoArray(item.MotherTongueID);
                model.partnerObj.lstCaste = model.SplitstringintoArray(item.casteid);
                model.partnerObj.lstSubcaste = model.SplitstringintoArray(item.subcasteid);
                model.partnerObj.lstMaritalstatus = item.maritalstatusid;
                model.partnerObj.lstEducationcategory = model.SplitstringintoArray(item.EducationCategoryID);
                model.partnerObj.lstEducationgroup = model.SplitstringintoArray(item.EducationGroupID);
                model.partnerObj.lstEmployedin = model.SplitstringintoArray(item.ProfessionCategoryID);
                model.partnerObj.lstProfessiongroup = model.SplitstringintoArray(item.ProfessionGroupID);
                model.partnerObj.lstPreferredcountry = model.SplitstringintoArray(item.CountryID);
                model.partnerObj.lstPreferredstate = model.SplitstringintoArray(item.StateID);
                model.partnerObj.lstRegion = model.SplitstringintoArray(item.regionId);
                model.partnerObj.lstBranch = model.SplitstringintoArray(item.branchid);
                model.partnerObj.rbtDiet = item.DietID;
                model.partnerObj.rbtManglikKujadosham = item.KujaDoshamID;
                model.partnerObj.rbtPreferredstarLanguage = item.StarLanguageID;
                model.partnerObj.rbtPreferredstars = item.TypeOfStar;
                model.partnerObj.lstpreferedstars = model.SplitstringintoArray(item.PreferredStars);
                model.partnerObj.rbtDomacile = item.Domicel === 'India' ? 0 : (item.Domicel === 'abroad' ? 1 : (item.Domicel === 'All' ? 2 : ''));

            }
            commonFactory.open('partnerPrefContent.html', model.scope, uibModal);


        };

        model.partnerdescPopulate = function(item) {
            isSubmit = true;
            model.partnerDescObj = {};
            if (item !== undefined) {
                model.partnerDescObj.txtpartnerdescription = item.PartnerDescripition;
            }
            commonFactory.open('partnerDescContent.html', model.scope, uibModal);

        };
        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.changeBind = function(type, parentval, parentval2) {

            switch (type) {
                case 'Country':
                    model.stateArr = model.removeSelect(commonFactory.StateBind(commonFactory.listSelectedVal(parentval)));
                    break;

                case 'EducationCatgory':
                    model.eduGroupArr = model.removeSelect(commonFactory.educationGroupBind(commonFactory.listSelectedVal(parentval)));
                    break;

                case 'caste':
                    model.casteArr = model.removeSelect(commonFactory.casteDepedency(commonFactory.listSelectedVal(parentval), commonFactory.listSelectedVal(parentval2)));
                    break;

                case 'subCaste':
                    model.subCasteArr = model.removeSelect(commonFactory.subCaste(commonFactory.listSelectedVal(parentval)));
                    break;

                case 'star':
                    model.starArr = model.removeSelect(commonFactory.starBind(commonFactory.listSelectedVal(parentval)));
                    break;

                case 'region':
                    model.branchArr = model.removeSelect(commonFactory.branch(commonFactory.listSelectedVal(parentval)));
                    break;
            }
        };


        model.partnerPrefSubmit = function(objitem) {

            if (isSubmit) {
                isSubmit = false;
                model.partnerPrefData = {
                    GetDetails: {
                        CustID: custID,
                        AgeGapFrom: objitem.ddlFromAge,
                        AgeGapTo: objitem.ddlToAge,
                        HeightFrom: objitem.ddlFromheight,
                        HeightTo: objitem.ddltoHeight,
                        Religion: commonFactory.listSelectedVal(objitem.lstReligion),
                        Mothertongue: commonFactory.listSelectedVal(objitem.lstMothertongue),
                        Caste: commonFactory.listSelectedVal(objitem.lstCaste),
                        Subcaste: commonFactory.listSelectedVal(objitem.lstSubcaste),
                        Maritalstatus: commonFactory.listSelectedVal(objitem.lstMaritalstatus),
                        ManglikKujadosham: objitem.rbtManglikKujadosham,
                        PreferredstarLanguage: objitem.rbtPreferredstarLanguage,
                        Educationcategory: commonFactory.listSelectedVal(objitem.lstEducationcategory),
                        Educationgroup: commonFactory.listSelectedVal(objitem.lstEducationgroup),
                        Employedin: commonFactory.listSelectedVal(objitem.lstEmployedin),
                        Professiongroup: commonFactory.listSelectedVal(objitem.lstProfessiongroup),
                        Diet: objitem.rbtDiet,
                        Preferredcountry: commonFactory.listSelectedVal(objitem.lstPreferredcountry),
                        Preferredstate: commonFactory.listSelectedVal(objitem.lstPreferredstate),
                        Preferreddistrict: null,
                        Preferredlocation: null,
                        TypeofStar: objitem.rbtPreferredstars,
                        PrefredStars: commonFactory.listSelectedVal(objitem.lstpreferedstars),
                        GenderID: objitem.rbtlGender,
                        Region: commonFactory.listSelectedVal(objitem.lstRegion),
                        Branch: commonFactory.listSelectedVal(objitem.lstBranch),
                        Domacile: commonFactory.checkvals(objitem.rbtDomacile) ? parseInt(objitem.rbtDomacile) : ''
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }
                };

                console.log(JSON.stringify(model.partnerPrefData));
                model.submitPromise = editPartnerpreferenceService.submitPartnerPrefData(model.partnerPrefData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {
                        editPartnerpreferenceService.getPartnerPreferenceData(custID).then(function(response) {
                            model.partnerPrefArr = response.data;
                            console.log(model.partnerPrefArr);
                        });
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });

            }
        };


        model.partnerDescriptionSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.submitPromise = editPartnerpreferenceService.submitPartnerDescData({ CustID: custID, AboutYourself: obj.txtpartnerdescription, flag: 1 }).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === '1') {
                        model.partnerDescription = obj.txtpartnerdescription;
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }
        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editPartnerpreferenceModel', factory)

    factory.$inject = ['editPartnerpreferenceService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getPartnerPreferenceData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerpartnerpreferencesDetailsDisplay', { params: { CustID: obj } });
            },
            submitPartnerPrefData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerPartnerPreferencesUpdatedetails', JSON.stringify(obj1));
            },
            submitPartnerDescData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getPartnerpreference_DiscribeYourPartner', { params: obj });
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editPartnerpreferenceService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editPartnerpreferenceModel,scope){var vm=this;vm.init=function(){vm.model=editPartnerpreferenceModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editPartnerpreferenceCtrl",controller),controller.$inject=["editPartnerpreferenceModel","$scope"]}(angular),function(angular){"use strict";function factory(editPartnerpreferenceService,authSvc,alertss,commonFactory,uibModal){var model={};model.scope={},model.partnerPrefArr=[],model.partnerObj={},model.ageGapArr=[],model.partnerDescObj={};var isSubmit=!0,logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.partnerDescription="",model.init=function(){return model.pageload(),model},model.pageload=function(){editPartnerpreferenceService.getPartnerPreferenceData(custID).then(function(response){model.partnerPrefArr=response.data,model.partnerDescription=model.partnerPrefArr.length>0&&void 0!==model.partnerPrefArr[0].PartnerDescripition&&null!==model.partnerPrefArr[0].PartnerDescripition?model.partnerPrefArr[0].PartnerDescripition:"",model.partnermodifiedby=model.partnerPrefArr.length>0&&void 0!==model.partnerPrefArr[0].EmpLastModificationDate&&null!==model.partnerPrefArr[0].EmpLastModificationDate?model.partnerPrefArr[0].EmpLastModificationDate:""})},model.removeSelect=function(data){return void 0!==data[0]&&"--select--"===angular.lowercase(data[0].title)&&data.splice(0,1),data},model.SplitstringintoArray=function(string){var array=[];return null!==string&&""!==string&&_.each(string.split(","),function(item){array.push(parseInt(item))}),array},model.partnerprefPopulate=function(item){isSubmit=!0,model.partnerObj={},void 0!==item&&(model.casteArr=model.removeSelect(commonFactory.casteDepedency(item.religionid,item.MotherTongueID)),model.stateArr=model.removeSelect(commonFactory.StateBind(item.CountryID)),model.eduGroupArr=model.removeSelect(commonFactory.educationGroupBind(item.EducationCategoryID)),model.starArr=model.removeSelect(commonFactory.starBind(item.StarLanguageID)),model.subCasteArr=model.removeSelect(commonFactory.subCaste(commonFactory.listSelectedVal(item.casteid))),model.partnerObj.intCusID=item.intCusID,model.ageGapArr=commonFactory.numbersBind("years",1,80),model.partnerObj.rbtlGender="Female"===item.Gender?2:1,model.partnerObj.ddlFromAge=item.Agemin,model.partnerObj.ddlToAge=item.AgeMax,model.partnerObj.ddlFromheight=item.MinHeight,model.partnerObj.ddltoHeight=item.MaxHeight,model.partnerObj.lstReligion=model.SplitstringintoArray(item.religionid),model.partnerObj.lstMothertongue=model.SplitstringintoArray(item.MotherTongueID),model.partnerObj.lstCaste=model.SplitstringintoArray(item.casteid),model.partnerObj.lstSubcaste=model.SplitstringintoArray(item.subcasteid),model.partnerObj.lstMaritalstatus=item.maritalstatusid,model.partnerObj.lstEducationcategory=model.SplitstringintoArray(item.EducationCategoryID),model.partnerObj.lstEducationgroup=model.SplitstringintoArray(item.EducationGroupID),model.partnerObj.lstEmployedin=model.SplitstringintoArray(item.ProfessionCategoryID),model.partnerObj.lstProfessiongroup=model.SplitstringintoArray(item.ProfessionGroupID),model.partnerObj.lstPreferredcountry=model.SplitstringintoArray(item.CountryID),model.partnerObj.lstPreferredstate=model.SplitstringintoArray(item.StateID),model.partnerObj.lstRegion=model.SplitstringintoArray(item.regionId),model.partnerObj.lstBranch=model.SplitstringintoArray(item.branchid),model.partnerObj.rbtDiet=item.DietID,model.partnerObj.rbtManglikKujadosham=item.KujaDoshamID,model.partnerObj.rbtPreferredstarLanguage=item.StarLanguageID,model.partnerObj.rbtPreferredstars=item.TypeOfStar,model.partnerObj.lstpreferedstars=model.SplitstringintoArray(item.PreferredStars),model.partnerObj.rbtDomacile="India"===item.Domicel?0:"abroad"===item.Domicel?1:"All"===item.Domicel?2:""),commonFactory.open("partnerPrefContent.html",model.scope,uibModal)},model.partnerdescPopulate=function(item){isSubmit=!0,model.partnerDescObj={},void 0!==item&&(model.partnerDescObj.txtpartnerdescription=item.PartnerDescripition),commonFactory.open("partnerDescContent.html",model.scope,uibModal)},model.cancel=function(){commonFactory.closepopup()},model.changeBind=function(type,parentval,parentval2){switch(type){case"Country":model.stateArr=model.removeSelect(commonFactory.StateBind(commonFactory.listSelectedVal(parentval)));break;case"EducationCatgory":model.eduGroupArr=model.removeSelect(commonFactory.educationGroupBind(commonFactory.listSelectedVal(parentval)));break;case"caste":model.casteArr=model.removeSelect(commonFactory.casteDepedency(commonFactory.listSelectedVal(parentval),commonFactory.listSelectedVal(parentval2)));break;case"subCaste":model.subCasteArr=model.removeSelect(commonFactory.subCaste(commonFactory.listSelectedVal(parentval)));break;case"star":model.starArr=model.removeSelect(commonFactory.starBind(commonFactory.listSelectedVal(parentval)));break;case"region":model.branchArr=model.removeSelect(commonFactory.branch(commonFactory.listSelectedVal(parentval)))}},model.partnerPrefSubmit=function(objitem){isSubmit&&(isSubmit=!1,model.partnerPrefData={GetDetails:{CustID:custID,AgeGapFrom:objitem.ddlFromAge,AgeGapTo:objitem.ddlToAge,HeightFrom:objitem.ddlFromheight,HeightTo:objitem.ddltoHeight,Religion:commonFactory.listSelectedVal(objitem.lstReligion),Mothertongue:commonFactory.listSelectedVal(objitem.lstMothertongue),Caste:commonFactory.listSelectedVal(objitem.lstCaste),Subcaste:commonFactory.listSelectedVal(objitem.lstSubcaste),Maritalstatus:commonFactory.listSelectedVal(objitem.lstMaritalstatus),ManglikKujadosham:objitem.rbtManglikKujadosham,PreferredstarLanguage:objitem.rbtPreferredstarLanguage,Educationcategory:commonFactory.listSelectedVal(objitem.lstEducationcategory),Educationgroup:commonFactory.listSelectedVal(objitem.lstEducationgroup),Employedin:commonFactory.listSelectedVal(objitem.lstEmployedin),Professiongroup:commonFactory.listSelectedVal(objitem.lstProfessiongroup),Diet:objitem.rbtDiet,Preferredcountry:commonFactory.listSelectedVal(objitem.lstPreferredcountry),Preferredstate:commonFactory.listSelectedVal(objitem.lstPreferredstate),Preferreddistrict:null,Preferredlocation:null,TypeofStar:objitem.rbtPreferredstars,PrefredStars:commonFactory.listSelectedVal(objitem.lstpreferedstars),GenderID:objitem.rbtlGender,Region:commonFactory.listSelectedVal(objitem.lstRegion),Branch:commonFactory.listSelectedVal(objitem.lstBranch),Domacile:commonFactory.checkvals(objitem.rbtDomacile)?parseInt(objitem.rbtDomacile):""},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},console.log(JSON.stringify(model.partnerPrefData)),model.submitPromise=editPartnerpreferenceService.submitPartnerPrefData(model.partnerPrefData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(editPartnerpreferenceService.getPartnerPreferenceData(custID).then(function(response){model.partnerPrefArr=response.data,console.log(model.partnerPrefArr)}),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.partnerDescriptionSubmit=function(obj){isSubmit&&(isSubmit=!1,model.submitPromise=editPartnerpreferenceService.submitPartnerDescData({CustID:custID,AboutYourself:obj.txtpartnerdescription,flag:1}).then(function(response){console.log(response),commonFactory.closepopup(),"1"===response.data?(model.partnerDescription=obj.txtpartnerdescription,alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.init()}angular.module("KaakateeyaEmpEdit").factory("editPartnerpreferenceModel",factory),factory.$inject=["editPartnerpreferenceService","authSvc","alert","commonFactory","$uibModal"]}(angular),function(angular){"use strict";function factory(http){return{getPartnerPreferenceData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerpartnerpreferencesDetailsDisplay",{params:{CustID:obj}})},submitPartnerPrefData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerPartnerPreferencesUpdatedetails",JSON.stringify(obj1))},submitPartnerDescData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getPartnerpreference_DiscribeYourPartner",{params:obj})}}}angular.module("KaakateeyaEmpEdit").factory("editPartnerpreferenceService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editProfileSettingModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editProfileSettingModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editProfileSettingCtrl', controller)

     controller.$inject = ['editProfileSettingModel', '$scope'];
 })(angular);
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
                    console.log(model.ConfidentialArr);
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
                    debugger;
                    model.csObj.chkisconfidential = item.ConfindentialStatusID === true ? true : false;
                    model.csObj.chkvryhighconfidential = item.HighConfidentialStatusID === 1 ? true : false;

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

                commonFactory.closepopup();
                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }
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

                commonFactory.closepopup();

                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }
            });

        };

        model.profileSettingSubmit = function(obj) {
            model.profileSettingAndDispalySubmit('', '', '', "ProfileSettings", obj.rdlapplicationstatus, obj.rdlprofilegrade, obj.txtnoofdaysinactive, obj.txtreasonforinactive,
                obj.ddlrequestedby);
        };

        model.profileSettingDisplaySubmit = function(obj) {
            model.profileSettingAndDispalySubmit(obj.rdldisplayin, obj.rdlpwdblock, obj.txtblockedreason, 'DisplaySettings');
        };

        model.getChkVals = function(val) {
            return val === true ? 1 : 0;
        };

        model.confidentialSubmit = function(obj) {
            debugger;
            editProfileSettingService.confidentialSubmit(custID, model.getChkVals(obj.chkisconfidential), model.getChkVals(obj.chkvryhighconfidential), '2').then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                if (response.data != undefined && response.data.length > 0) {
                    if (JSON.parse(response.data[0])[0].STATUS === 1) {
                        model.pageload();
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    }
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }
            });
        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editProfileSettingModel', factory)

    factory.$inject = ['editProfileSettingService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getProfileSettingData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerprofilesettingDetails', { params: { CustID: obj } });
            },
            submitGradeData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerProfileSetting_Gradeselection', JSON.stringify(obj1));
            },
            submitProfileSettingAndDispalyData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerProfileSetting_ProfileSetting', JSON.stringify(obj1));
            },
            confidentialSubmit: function(custid, confidential, Hconfidential, empid) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonaloffice_purpose', {
                    params: { flag: '7', ID: custid, AboutProfile: empid, IsConfidential: confidential, HighConfendential: Hconfidential }
                });
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editProfileSettingService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editProfileSettingModel,scope){var vm=this;vm.init=function(){vm.model=editProfileSettingModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editProfileSettingCtrl",controller),controller.$inject=["editProfileSettingModel","$scope"]}(angular),function(angular){"use strict";function factory(editProfileSettingService,authSvc,alertss,commonFactory,uibModal){var model={};model.scope={};var logincustid=authSvc.getCustId(),custID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.profileSettingArr=[],model.ConfidentialArr=[],model.profileDisplayArr=[],model.gradeSelectionArr=[],model.psObj={},model.csObj={},model.psdObj={},model.gradeObj={},model.init=function(){return model.pageload(),model},model.pageload=function(){editProfileSettingService.getProfileSettingData(custID).then(function(response){response.data.length>0&&(model.profileSettingArr=response.data[0].length>0?JSON.parse(response.data[0]):[],model.ConfidentialArr=response.data[1].length>0?JSON.parse(response.data[1]):[],model.profileDisplayArr=response.data[2].length>0?JSON.parse(response.data[2]):[],model.gradeSelectionArr=void 0!==response.data[3]&&response.data[3].length>0?JSON.parse(response.data[3]):[],console.log(model.ConfidentialArr))})},model.populategrade=function(item){return"A"===item?"216":"B"===item?"217":"C"===item?"218":"D"===item?"219":0},model.showprofilepopup=function(type,item){switch(type){case"profileSetting":void 0!==item&&(model.psObj.rdlapplicationstatus=item.ProfileStatusID,model.psObj.txtnoofdaysinactive=item.NoofDaysinactivated,model.psObj.txtreasonforinactive=item.Reason4InActive,model.psObj.ddlrequestedby=item.RequestedByGenericID,model.psObj.rdlprofilegrade=item.ProfileGradeID),commonFactory.open("profileSettingContent.html",model.scope,uibModal);break;case"profileDisplay":void 0!==item&&(model.psdObj.rdldisplayin=item.ProfileDisplayNameID,model.psdObj.rdlpwdblock=item.LoginStatusNameID,model.psdObj.txtblockedreason=item.ProfileBlockReason),commonFactory.open("profileDisplayContent.html",model.scope,uibModal);break;case"confidential":model.csObj.chkisconfidential=item.ConfindentialStatusID===!0,model.csObj.chkvryhighconfidential=1===item.HighConfidentialStatusID,commonFactory.open("confidentialContent.html",model.scope,uibModal);break;case"grading":void 0!==item&&(model.gradeObj.ddlfamilyGrade=model.populategrade(item.FamilyGrade),model.gradeObj.ddlphotoGrade=model.populategrade(item.PhotoGrade),model.gradeObj.ddlEducationgrade=model.populategrade(item.EducationGrade),model.gradeObj.ddlProfessionGrade=model.populategrade(item.ProfileGrade),model.gradeObj.ddlpropertyGrade=model.populategrade(item.PropertyGrade)),commonFactory.open("gradeSelectionContent.html",model.scope,uibModal)}},model.cancel=function(){commonFactory.closepopup()},model.gradeSubmit=function(obj){model.Mobj={CustID:custID,EmpID:"2",GFamily:obj.ddlfamilyGrade,GPhotos:obj.ddlphotoGrade,GEducation:obj.ddlEducationgrade,GProfession:obj.ddlProfessionGrade,GProperty:obj.ddlpropertyGrade},editProfileSettingService.submitGradeData(model.Mobj).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.pageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})},model.profileSettingAndDispalySubmit=function(IProfileDisplayName,ILoginStatusName,IBlockedreason,ITypeofReport,Icurrentprofilestatusid,Iprofilegrade,INoofDaysinactivated,IReason4InActive,IRequestedBy){model.Mobj={intCusID:custID,EmpID:"2",currentprofilestatusid:Icurrentprofilestatusid,profilegrade:Iprofilegrade,NoofDaysinactivated:INoofDaysinactivated,Reason4InActive:IReason4InActive,RequestedBy:55===Icurrentprofilestatusid||"55"===Icurrentprofilestatusid?IRequestedBy:null,TypeofReport:ITypeofReport,ProfileDisplayName:IProfileDisplayName,LoginStatusName:ILoginStatusName,Admin:null,Blockedreason:IBlockedreason},editProfileSettingService.submitProfileSettingAndDispalyData(model.Mobj).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.pageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})},model.profileSettingSubmit=function(obj){model.profileSettingAndDispalySubmit("","","","ProfileSettings",obj.rdlapplicationstatus,obj.rdlprofilegrade,obj.txtnoofdaysinactive,obj.txtreasonforinactive,obj.ddlrequestedby)},model.profileSettingDisplaySubmit=function(obj){model.profileSettingAndDispalySubmit(obj.rdldisplayin,obj.rdlpwdblock,obj.txtblockedreason,"DisplaySettings")},model.getChkVals=function(val){return val===!0?1:0},model.confidentialSubmit=function(obj){editProfileSettingService.confidentialSubmit(custID,model.getChkVals(obj.chkisconfidential),model.getChkVals(obj.chkvryhighconfidential),"2").then(function(response){console.log(response),commonFactory.closepopup(),void 0!=response.data&&response.data.length>0?1===JSON.parse(response.data[0])[0].STATUS&&(model.pageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})},model.init()}angular.module("KaakateeyaEmpEdit").factory("editProfileSettingModel",factory),factory.$inject=["editProfileSettingService","authSvc","alert","commonFactory","$uibModal"]}(angular),function(angular){"use strict";function factory(http){return{getProfileSettingData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerprofilesettingDetails",{params:{CustID:obj}})},submitGradeData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerProfileSetting_Gradeselection",JSON.stringify(obj1))},submitProfileSettingAndDispalyData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerProfileSetting_ProfileSetting",JSON.stringify(obj1))},confidentialSubmit:function(custid,confidential,Hconfidential,empid){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerPersonaloffice_purpose",{params:{flag:"7",ID:custid,AboutProfile:empid,IsConfidential:confidential,HighConfendential:Hconfidential}})}}}angular.module("KaakateeyaEmpEdit").factory("editProfileSettingService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editPropertyModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editPropertyModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editPropertyCtrl', controller)

     controller.$inject = ['editPropertyModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editPropertyService, authSvc, alertss, commonFactory, uibModal) {
        var model = {};
        model.scope = {};

        //declaration part

        model.propertyArr = [];
        model.proObj = {};

        var isSubmit = true;
        var logincustid = authSvc.getCustId();
        var custID = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;

        //end declaration block

        model.init = function() {
            model.pageload();

            return model;
        };

        model.pageload = function() {
            editPropertyService.getPropertyData(custID).then(function(response) {
                model.propertyArr = response.data;
                model.propertymodifiedby = (model.propertyArr.length > 0 && model.propertyArr[0].EmpLastModificationDate !== undefined && model.propertyArr[0].EmpLastModificationDate !== null) ? model.propertyArr[0].EmpLastModificationDate : '';
            });
        };

        model.populateProperty = function(item) {
            isSubmit = true;
            model.proObj = {};
            model.proObj.Custpropertyid = null;
            if (item !== undefined) {
                model.proObj.Custpropertyid = item.Custpropertyid;
                model.proObj.ddlFamilyStatus = item.FamilyValuesID;
                model.proObj.rdlSharedProperty = item.SharedPropertyID === true ? 1 : 0;
                model.proObj.txtValueofproperty = item.PropertyValue;
                model.proObj.txtPropertydesc = item.PropertyDetails;
            }
            commonFactory.open('propertyContent.html', model.scope, uibModal);

        };


        model.propertySubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.propertyData = {
                    GetDetails: {
                        FamilyStatus: obj.ddlFamilyStatus,
                        Issharedproperty: obj.rdlSharedProperty,
                        Valueofproperty: obj.txtValueofproperty,
                        PropertyType: '281',
                        Propertydescription: obj.txtPropertydesc,
                        Showingviewprofile: obj.rbtShowViewProfile,
                        Custpropertyid: model.proObj.Custpropertyid,
                        PropertyID: model.proObj.Custpropertyid,
                        CustId: custID
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editPropertyService.submitPropertyData(model.propertyData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        editPropertyService.getPropertyData(custID).then(function(response) {
                            model.propertyArr = response.data;
                        });
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.cancel = function() {
            commonFactory.closepopup();
        };
        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editPropertyModel', factory)

    factory.$inject = ['editPropertyService', 'authSvc', 'alert', 'commonFactory', '$uibModal'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getPropertyData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getPropertyDetailsDisplay', { params: { CustID: obj } });
            },
            submitPropertyData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerPropertyUpdatedetails', JSON.stringify(obj1));
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editPropertyService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editPropertyModel,scope){var vm=this;vm.init=function(){vm.model=editPropertyModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editPropertyCtrl",controller),controller.$inject=["editPropertyModel","$scope"]}(angular),function(angular){"use strict";function factory(editPropertyService,authSvc,alertss,commonFactory,uibModal){var model={};model.scope={},model.propertyArr=[],model.proObj={};var isSubmit=!0,logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.init=function(){return model.pageload(),model},model.pageload=function(){editPropertyService.getPropertyData(custID).then(function(response){model.propertyArr=response.data,model.propertymodifiedby=model.propertyArr.length>0&&void 0!==model.propertyArr[0].EmpLastModificationDate&&null!==model.propertyArr[0].EmpLastModificationDate?model.propertyArr[0].EmpLastModificationDate:""})},model.populateProperty=function(item){isSubmit=!0,model.proObj={},model.proObj.Custpropertyid=null,void 0!==item&&(model.proObj.Custpropertyid=item.Custpropertyid,model.proObj.ddlFamilyStatus=item.FamilyValuesID,model.proObj.rdlSharedProperty=item.SharedPropertyID===!0?1:0,model.proObj.txtValueofproperty=item.PropertyValue,model.proObj.txtPropertydesc=item.PropertyDetails),commonFactory.open("propertyContent.html",model.scope,uibModal)},model.propertySubmit=function(obj){isSubmit&&(isSubmit=!1,model.propertyData={GetDetails:{FamilyStatus:obj.ddlFamilyStatus,Issharedproperty:obj.rdlSharedProperty,Valueofproperty:obj.txtValueofproperty,PropertyType:"281",Propertydescription:obj.txtPropertydesc,Showingviewprofile:obj.rbtShowViewProfile,Custpropertyid:model.proObj.Custpropertyid,PropertyID:model.proObj.Custpropertyid,CustId:custID},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editPropertyService.submitPropertyData(model.propertyData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(editPropertyService.getPropertyData(custID).then(function(response){model.propertyArr=response.data}),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.cancel=function(){commonFactory.closepopup()},model.init()}angular.module("KaakateeyaEmpEdit").factory("editPropertyModel",factory),factory.$inject=["editPropertyService","authSvc","alert","commonFactory","$uibModal"]}(angular),function(angular){"use strict";function factory(http){return{getPropertyData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getPropertyDetailsDisplay",{params:{CustID:obj}})},submitPropertyData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerPropertyUpdatedetails",JSON.stringify(obj1))}}}angular.module("KaakateeyaEmpEdit").factory("editPropertyService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editReferenceModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editReferenceModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editReferenceCtrl', controller)

     controller.$inject = ['editReferenceModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editReferenceService, authSvc, alertss, commonFactory, uibModal, SelectBindService) {
        var model = {};
        model.scope = {};

        //declaration part

        model.ReferenceArr = [];
        model.refObj = {};

        model.deleteDisplayTxt = 'reference';
        var isSubmit = true;
        model.identityID = 0;
        var logincustid = authSvc.getCustId();
        var custID = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;

        //end declaration block
        model.init = function() {
            model.pageload();
            return model;
        };


        model.referencePopulate = function(item) {
            isSubmit = true;
            model.refObj.RefrenceCust_Reference_ID = null;
            model.refObj = {};

            if (item !== undefined) {
                model.refObj.intCusID = custID;
                model.refObj.RefrenceCust_Reference_ID = item.RefrenceCust_Reference_ID;
                model.refObj.ddlRelationshiptype = 318;
                model.refObj.txtFname = item.ReferenceFirstName;
                model.refObj.txtLname = item.ReferenceLastName;
                model.refObj.txtProfessiondetails = item.RefrenceProfessionDetails;
                model.refObj.ddlCountry = commonFactory.checkvals(item.RefrenceCountry) ? parseInt(item.RefrenceCountry) : null;
                model.refObj.ddlState = commonFactory.checkvals(item.RefrenceStateID) ? parseInt(item.RefrenceStateID) : null;
                model.refObj.ddlDistrict = commonFactory.checkvals(item.RefrenceDistrictID) ? parseInt(item.RefrenceDistrictID) : null;
                model.refObj.txtNativePlace = item.RefrenceNativePlaceID;
                model.refObj.txtPresentlocation = item.RefenceCurrentLocation;

                model.refObj.ddlMobileCountryID = commonFactory.checkvals(item.RefrenceMobileCountryID) ? parseInt(item.RefrenceMobileCountryID) : null;

                model.refObj.txtMobileNumber = item.RefrenceMobileNumberID;

                if (commonFactory.checkvals(item.RefrenceAreaCode)) {
                    model.refObj.ddlLandLineCountryID = commonFactory.checkvals(item.RefrenceLandCountryId) ? parseInt(item.RefrenceLandCountryId) : null;
                    model.refObj.txtAreCode = item.RefrenceAreaCode;
                    model.refObj.txtLandNumber = item.RefrenceLandNumber;

                } else {
                    model.refObj.ddlMobileCountryID2 = commonFactory.checkvals(item.RefrenceLandCountryId) ? parseInt(item.RefrenceLandCountryId) : null;
                    model.refObj.txtMobileNumber2 = item.RefrenceLandNumber;
                }

                model.refObj.txtEmails = item.RefrenceEmail;
                model.refObj.txtNarrations = item.RefrenceNarration;
            }
            commonFactory.open('referenceContent.html', model.scope, uibModal);

        };

        model.pageload = function() {
            editReferenceService.getReferenceData(custID).then(function(response) {
                model.ReferenceArr = response.data;
                console.log(model.ReferenceArr);
                model.referencemodifiedby = (model.ReferenceArr.length > 0 && model.ReferenceArr[0].EmpLastModificationDate !== undefined && model.ReferenceArr[0].EmpLastModificationDate !== null) ? model.ReferenceArr[0].EmpLastModificationDate : '';
            });
        };

        model.refenceSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;

                model.referenceData = {
                    GetDetails: {
                        CustID: custID,
                        RelationshiptypeID: obj.ddlRelationshiptype,
                        Firstname: obj.txtFname,
                        Lastname: obj.txtLname,
                        Employedin: null,
                        Professiongroup: null,
                        Profession: null,
                        Professiondetails: obj.txtProfessiondetails,
                        CountryID: obj.ddlCountry,
                        StateID: obj.ddlState,
                        DistrictID: obj.ddlDistrict,
                        Nativeplace: obj.txtNativePlace,
                        Presentlocation: obj.txtPresentlocation,
                        MobileCountryID: obj.ddlMobileCountryID,
                        MobileNumber: obj.txtMobileNumber,
                        LandLineCountryID: commonFactory.checkvals(obj.ddlMobileCountryID2) ? obj.ddlMobileCountryID2 : (commonFactory.checkvals(obj.ddlLandLineCountryID) ? obj.ddlLandLineCountryID : null),
                        LandLineAreaCode: commonFactory.checkvals(obj.txtMobileNumber2) ? null : (commonFactory.checkvals(obj.txtAreCode) ? obj.txtAreCode : null),
                        LandLineNumber: commonFactory.checkvals(obj.txtMobileNumber2) ? obj.txtMobileNumber2 : (commonFactory.checkvals(obj.txtLandNumber) ? obj.txtLandNumber : null),
                        Emails: obj.txtEmails,
                        Narration: obj.txtNarrations,
                        Cust_Reference_ID: model.refObj.RefrenceCust_Reference_ID
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }
                };
                model.submitPromise = editReferenceService.submitReferenceData(model.referenceData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {
                        model.pageload();
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });

            }
        };

        model.cancel = function() {
            commonFactory.closepopup();
        };


        model.DeletePopup = function(id) {
            model.identityID = id;
            commonFactory.open('common/templates/deletepopup.html', model.scope, uibModal, 'sm');
        };

        model.deleteSubmit = function(type) {
            SelectBindService.DeleteSection({ sectioname: 'Reference', CustID: custID, identityid: model.identityID }).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                model.pageload();
            });
        };



        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editReferenceModel', factory)

    factory.$inject = ['editReferenceService', 'authSvc', 'alert', 'commonFactory', '$uibModal', 'SelectBindService'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getReferenceData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getReferenceViewDetailsDisplay', { params: { CustID: obj } });
            },
            submitReferenceData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerReferencedetailsUpdatedetails', JSON.stringify(obj1));
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editReferenceService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editReferenceModel,scope){var vm=this;vm.init=function(){vm.model=editReferenceModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editReferenceCtrl",controller),controller.$inject=["editReferenceModel","$scope"]}(angular),function(angular){"use strict";function factory(editReferenceService,authSvc,alertss,commonFactory,uibModal,SelectBindService){var model={};model.scope={},model.ReferenceArr=[],model.refObj={},model.deleteDisplayTxt="reference";var isSubmit=!0;model.identityID=0;var logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.init=function(){return model.pageload(),model},model.referencePopulate=function(item){isSubmit=!0,model.refObj.RefrenceCust_Reference_ID=null,model.refObj={},void 0!==item&&(model.refObj.intCusID=custID,model.refObj.RefrenceCust_Reference_ID=item.RefrenceCust_Reference_ID,model.refObj.ddlRelationshiptype=318,model.refObj.txtFname=item.ReferenceFirstName,model.refObj.txtLname=item.ReferenceLastName,model.refObj.txtProfessiondetails=item.RefrenceProfessionDetails,model.refObj.ddlCountry=commonFactory.checkvals(item.RefrenceCountry)?parseInt(item.RefrenceCountry):null,model.refObj.ddlState=commonFactory.checkvals(item.RefrenceStateID)?parseInt(item.RefrenceStateID):null,model.refObj.ddlDistrict=commonFactory.checkvals(item.RefrenceDistrictID)?parseInt(item.RefrenceDistrictID):null,model.refObj.txtNativePlace=item.RefrenceNativePlaceID,model.refObj.txtPresentlocation=item.RefenceCurrentLocation,model.refObj.ddlMobileCountryID=commonFactory.checkvals(item.RefrenceMobileCountryID)?parseInt(item.RefrenceMobileCountryID):null,model.refObj.txtMobileNumber=item.RefrenceMobileNumberID,commonFactory.checkvals(item.RefrenceAreaCode)?(model.refObj.ddlLandLineCountryID=commonFactory.checkvals(item.RefrenceLandCountryId)?parseInt(item.RefrenceLandCountryId):null,model.refObj.txtAreCode=item.RefrenceAreaCode,model.refObj.txtLandNumber=item.RefrenceLandNumber):(model.refObj.ddlMobileCountryID2=commonFactory.checkvals(item.RefrenceLandCountryId)?parseInt(item.RefrenceLandCountryId):null,model.refObj.txtMobileNumber2=item.RefrenceLandNumber),model.refObj.txtEmails=item.RefrenceEmail,model.refObj.txtNarrations=item.RefrenceNarration),commonFactory.open("referenceContent.html",model.scope,uibModal)},model.pageload=function(){editReferenceService.getReferenceData(custID).then(function(response){model.ReferenceArr=response.data,console.log(model.ReferenceArr),model.referencemodifiedby=model.ReferenceArr.length>0&&void 0!==model.ReferenceArr[0].EmpLastModificationDate&&null!==model.ReferenceArr[0].EmpLastModificationDate?model.ReferenceArr[0].EmpLastModificationDate:""})},model.refenceSubmit=function(obj){isSubmit&&(isSubmit=!1,model.referenceData={GetDetails:{CustID:custID,RelationshiptypeID:obj.ddlRelationshiptype,Firstname:obj.txtFname,Lastname:obj.txtLname,Employedin:null,Professiongroup:null,Profession:null,Professiondetails:obj.txtProfessiondetails,CountryID:obj.ddlCountry,StateID:obj.ddlState,DistrictID:obj.ddlDistrict,Nativeplace:obj.txtNativePlace,Presentlocation:obj.txtPresentlocation,MobileCountryID:obj.ddlMobileCountryID,MobileNumber:obj.txtMobileNumber,LandLineCountryID:commonFactory.checkvals(obj.ddlMobileCountryID2)?obj.ddlMobileCountryID2:commonFactory.checkvals(obj.ddlLandLineCountryID)?obj.ddlLandLineCountryID:null,LandLineAreaCode:commonFactory.checkvals(obj.txtMobileNumber2)?null:commonFactory.checkvals(obj.txtAreCode)?obj.txtAreCode:null,LandLineNumber:commonFactory.checkvals(obj.txtMobileNumber2)?obj.txtMobileNumber2:commonFactory.checkvals(obj.txtLandNumber)?obj.txtLandNumber:null,Emails:obj.txtEmails,Narration:obj.txtNarrations,Cust_Reference_ID:model.refObj.RefrenceCust_Reference_ID},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editReferenceService.submitReferenceData(model.referenceData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.pageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.cancel=function(){commonFactory.closepopup()},model.DeletePopup=function(id){model.identityID=id,commonFactory.open("common/templates/deletepopup.html",model.scope,uibModal,"sm")},model.deleteSubmit=function(type){SelectBindService.DeleteSection({sectioname:"Reference",CustID:custID,identityid:model.identityID}).then(function(response){console.log(response),commonFactory.closepopup(),model.pageload()})},model.init()}angular.module("KaakateeyaEmpEdit").factory("editReferenceModel",factory),factory.$inject=["editReferenceService","authSvc","alert","commonFactory","$uibModal","SelectBindService"]}(angular),function(angular){"use strict";function factory(http){return{getReferenceData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getReferenceViewDetailsDisplay",{params:{CustID:obj}})},submitReferenceData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerReferencedetailsUpdatedetails",JSON.stringify(obj1))}}}angular.module("KaakateeyaEmpEdit").factory("editReferenceService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editRelativeModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editRelativeModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editRelativeCtrl', controller)

     controller.$inject = ['editRelativeModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editRelativeService, authSvc, alertss, commonFactory, uibModal, SelectBindService) {
        var model = {};
        model.scope = {};

        //declaration part
        model.fbObj = {};
        model.fsObj = {};
        model.mbObj = {};
        model.msObj = {};
        var isSubmit = true;
        model.deleteDisplayTxt = '';
        model.identityID = 0;
        var logincustid = authSvc.getCustId();
        var custid = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;


        //end declaration block
        model.init = function() {
            model.relativePageLoad();
            return model;
        };

        model.relativePageLoad = function() {
            editRelativeService.getRelativeeData(custid).then(function(response) {
                model.FBArr = JSON.parse(response.data[0]);
                model.FSArr = JSON.parse(response.data[1]);
                model.MBrr = JSON.parse(response.data[2]);
                model.MSArr = JSON.parse(response.data[3]);

                model.FBemodifiedby = (model.FBArr.length > 0 && model.FBArr[0].EmpLastModificationDate !== undefined && model.FBArr[0].EmpLastModificationDate !== null) ? model.FBArr[0].EmpLastModificationDate : '';
                model.FSmodifiedby = (model.FSArr.length > 0 && model.FSArr[0].EmpLastModificationDate !== undefined && model.FSArr[0].EmpLastModificationDate !== null) ? model.FSArr[0].EmpLastModificationDate : '';
                model.MBmodifiedby = (model.MBrr.length > 0 && model.MBrr[0].EmpLastModificationDate !== undefined && model.MBrr[0].EmpLastModificationDate !== null) ? model.MBrr[0].EmpLastModificationDate : '';
                model.MSmodifiedby = (model.MSArr.length > 0 && model.MSArr[0].EmpLastModificationDate !== undefined && model.MSArr[0].EmpLastModificationDate !== null) ? model.MSArr[0].EmpLastModificationDate : '';

            });
        };

        model.relativePopulatePopulate = function(type, item) {
            isSubmit = true;
            switch (type) {
                case 'FB':
                    model.fbObj.FatherbrotherCustfamilyID = null;
                    model.fbObj = {};

                    if (item !== undefined) {
                        model.fbObj.FatherbrotherCustfamilyID = item.FatherbrotherCustfamilyID;
                        model.fbObj.rdlFBElderORyounger = item.FatherBrotherElderyounger == 'Elder' ? 324 : (item.FatherBrotherElderyounger == 'Younger' ? 323 : '-1');
                        model.fbObj.txtFatherbrothername = item.FatherbrotherName;
                        model.fbObj.txtFBEducationdetails = item.FatherBrotherEducationDetails;
                        model.fbObj.txtFBProfessiondetails = item.FatherbrotherProfessionDetails;

                        model.fbObj.ddlFBMobileCountryID = item.FatherbrotherMobileCode;
                        model.fbObj.txtFBMobileNumber = item.FatherbrotherMobileNumber;

                        if (commonFactory.checkvals(item.FatherbrotherLandaraecode)) {
                            model.fbObj.ddlFBLandLineCountry = item.FatherbrotherLandCountryCode;
                            model.fbObj.txtFBAreCode = item.FatherbrotherLandaraecode;
                            model.fbObj.txtFBLandNumber = item.FatherbrotherLandNumber;
                        } else {
                            model.fbObj.ddlFBMobileCountryID2 = item.FatherbrotherLandCountryCode;
                            model.fbObj.txtFBMobileNumber2 = item.FatherbrotherLandNumber;
                        }

                        model.fbObj.txtFBEmails = item.FatherbrotherEmail;
                        model.fbObj.txtCurrentLocation = item.FatherbrotherCurrentLocation;

                    }
                    commonFactory.open('FBModalContent.html', model.scope, uibModal);

                    break;

                case 'FS':
                    model.fsObj.FatherSisterCustfamilyID = null;
                    model.fsObj = {};

                    if (item !== undefined) {
                        model.fsObj.FatherSisterCustfamilyID = item.FatherSisterCustfamilyID;
                        model.fsObj.rdlFSElderYounger = item.FatherSisterElderyounger == 'Elder' ? 326 : (item.FatherSisterElderyounger == 'Younger' ? 325 : '-1');
                        model.fsObj.txtFathersistername = item.FatherSisterName;
                        model.fsObj.txtFSHusbandfirstname = item.SpouceFName;
                        model.fsObj.txtFSHusbandlastname = item.SpoucelName;
                        model.fsObj.txtFSHEDucation = item.FatherSisterSpouseEducationDetails;
                        model.fsObj.txtFSProfessiondetails = item.FathersisterSpouseProfessionDetails;
                        model.fsObj.ddlFSHStateID = item.FatherSisterspousestateId;
                        model.fsObj.ddlFSHDistrictID = item.FatherSisterspouseDistrictId;
                        model.fsObj.txtFSHNativePlace = item.FathersisterSpouseNativePlace;

                        model.fsObj.ddlFSMObileCountryID = item.FatherSisterMobilecodeid;
                        model.fsObj.txtFSMobileNumber = item.FatherSisterspouseMobileNumber;


                        if (commonFactory.checkvals(item.FatherSisterspouseLandaraecode)) {
                            model.fsObj.ddlFSHLandCountryID = item.FatherSisterlandcontrycodeid;
                            model.fsObj.txtFSHAreaNumber = item.FatherSisterspouseLandaraecode;
                            model.fsObj.txtFSHNUmber = item.FatherSisterspouseLandNumber;

                        } else {
                            model.fsObj.ddlFSMObileCountryID2 = item.FatherSisterlandcontrycodeid;
                            model.fsObj.txtFSMobileNumber2 = item.FatherSisterspouseLandNumber;
                        }

                        model.fsObj.txtFSHEmails = item.FatherSisterspouseEmail;
                        model.fsObj.txtFSHCurrentLocation = item.FatherSisterCurrentLocation;
                    }
                    commonFactory.open('FSModalContent.html', model.scope, uibModal);

                    break;

                case 'MB':
                    model.mbObj.MotherBrotherCustfamilyID = null;
                    model.mbObj = {};

                    if (item !== undefined) {
                        model.mbObj.MotherBrotherCustfamilyID = item.MotherBrotherCustfamilyID;
                        model.mbObj.rdlMBElderYounger = item.MotherBrotherElderyounger == 'Elder' ? 328 : (item.MotherBrotherElderyounger == 'Younger' ? 327 : '-1');
                        model.mbObj.txtMBName = item.MotherBrotherName;
                        model.mbObj.txtMBEducation = item.MotherBrotherEducationDetails;
                        model.mbObj.txtMBProfessiondetails = item.MotherBrotherProfessionDetails;

                        model.mbObj.ddlMBCountriCode = item.MotherBrotherMobileCode;
                        model.mbObj.txtMBMobileNum = item.MotherBrotherMobileNumber;


                        if (commonFactory.checkvals(item.MotherBrotherLandaraecode)) {
                            model.mbObj.ddlMBLandLineCountryCode = item.MotherBrotherLandCountryCode;
                            model.mbObj.txtMBAreaCode = item.MotherBrotherLandaraecode;
                            model.mbObj.txtMBLandLineNum = item.MotherBrotherLandNumber;

                        } else {
                            model.mbObj.ddlMBCountriCode2 = item.MotherBrotherLandCountryCode;
                            model.mbObj.txtMBMobileNum2 = item.MotherBrotherLandNumber;
                        }

                        model.mbObj.txtMBEmails = item.MotherBrotherEmail;
                        model.mbObj.txtMBCurrentLocation = item.MotherBrotherCurrentLocation;
                    }
                    commonFactory.open('MBModalContent.html', model.scope, uibModal);

                    break;
                case 'MS':
                    model.msObj.MotherSisterCustfamilyID = null;
                    model.msObj = {};

                    if (item !== undefined) {
                        model.msObj.MotherSisterCustfamilyID = item.MotherSisterCustfamilyID;
                        model.msObj.rdlMSElderYounger = item.MotherSisterElderyounger == 'Elder' ? 330 : (item.MotherSisterElderyounger == 'Younger' ? 329 : '-1');
                        model.msObj.txtMSName = item.MotherSisterName;
                        model.msObj.txtMsHusbandfirstname = item.SpouceFName;
                        model.msObj.txtMsHusbandlastname = item.SpoucelName;
                        model.msObj.ddlMSisState = item.spousestateid;
                        model.msObj.ddlMsDistrict = item.spousedistrictID;
                        model.msObj.txtMSNativePlace = item.MotherSisterSpouseNativePlace;
                        model.msObj.txtMSHEducation = item.MothersisterspouseEducationdetails;
                        model.msObj.txtMSProfessiondetails = item.MotherSisterProfessionDetails;

                        model.msObj.ddlMSCounCodeID = item.MotherSisterMobileCodeId;
                        model.msObj.txtMSMObileNum = item.MotherSisterspouseMobileNumber;

                        if (commonFactory.checkvals(item.MotherSisterspouseLandaraecode)) {
                            model.msObj.ddlMSLLCounCode = item.MotherSisterSpouselandcodeid;
                            model.msObj.txtMSArea = item.MotherSisterspouseLandaraecode;
                            model.msObj.txtLLNum = item.MotherSisterspouseLandNumber;
                        } else {
                            model.msObj.ddlMSCounCodeID2 = item.MotherSisterSpouselandcodeid;
                            model.msObj.txtMSMObileNum2 = item.MotherSisterspouseLandNumber;
                        }

                        model.msObj.txtMSEmail = item.MotherSisterspouseEmail;
                        model.msObj.txtMSCurrentLocation = item.MotherSisterCurrentLocation;
                    }
                    commonFactory.open('MSModalContent.html', model.scope, uibModal);

                    break;
            }

        };


        model.FBSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.FBData = {
                    GetDetails: {
                        CustID: custid,
                        Fatherbrothername: obj.txtFatherbrothername,
                        FBElderYounger: obj.rdlFBElderORyounger,
                        FBEmployedin: null,
                        FBProfessiongroup: null,
                        FBProfession: null,
                        FBProfessiondetails: obj.txtFBProfessiondetails,
                        FBMobileCountryID: obj.ddlFBMobileCountryID,
                        FBMobileNumber: obj.txtFBMobileNumber,
                        FBLandLineCountryID: commonFactory.checkvals(obj.ddlFBMobileCountryID2) ? obj.ddlFBMobileCountryID2 : (commonFactory.checkvals(obj.ddlFBLandLineCountry) ? obj.ddlFBLandLineCountry : null),
                        FBLandAreaCode: commonFactory.checkvals(obj.txtFBMobileNumber2) ? null : (commonFactory.checkvals(obj.txtFBAreCode) ? obj.txtFBAreCode : null),
                        FBLandNumber: commonFactory.checkvals(obj.txtFBMobileNumber2) ? obj.txtFBMobileNumber2 : (commonFactory.checkvals(obj.txtFBLandNumber) ? obj.txtFBLandNumber : null),
                        FBEmails: obj.txtFBEmails,
                        FBCurrentLocation: obj.txtCurrentLocation,
                        FatherbrotherCust_familyID: model.fbObj.FatherbrotherCustfamilyID,
                        FatherBrotherEducationDetails: obj.txtFBEducationdetails,

                    },
                    customerpersonaldetails: {
                        intCusID: custid,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editRelativeService.submitFBData(model.FBData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.relativePageLoad(custid);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }
        };

        model.FSSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.FSData = {
                    GetDetails: {
                        CustID: custid,
                        FSFathersistername: obj.txtFathersistername,
                        FSElderYounger: obj.rdlFSElderYounger,
                        FSHusbandfirstname: obj.txtFSHusbandfirstname,
                        FSHusbandlastname: obj.txtFSHusbandlastname,
                        FSCountryID: 1,
                        FSHStateID: obj.ddlFSHStateID,
                        FSHDistrict: obj.ddlFSHDistrictID,
                        FSNativeplace: obj.txtFSHNativePlace,
                        FSHEmployedin: null,
                        FSHProfessiongroup: null,
                        FSHProfession: null,
                        FSHProfessiondetails: obj.txtFSProfessiondetails,
                        FSHMobileCountryID: obj.ddlFSMObileCountryID,
                        FSHMObileNumber: obj.txtFSMobileNumber,
                        FSHLandCountryID: commonFactory.checkvals(obj.ddlFSMObileCountryID2) ? obj.ddlFSMObileCountryID2 : (commonFactory.checkvals(obj.ddlFSHLandCountryID) ? obj.ddlFSHLandCountryID : null),
                        FSHLandAreaCode: commonFactory.checkvals(obj.txtFSMobileNumber2) ? null : (commonFactory.checkvals(obj.txtFSHAreaNumber) ? obj.txtFSHAreaNumber : null),
                        FSHLandNumber: commonFactory.checkvals(obj.txtFSMobileNumber2) ? obj.txtFSMobileNumber2 : (commonFactory.checkvals(obj.txtFSHNUmber) ? obj.txtFSHNUmber : null),
                        FSHEmails: obj.txtFSHEmails,
                        FSCurrentLocation: obj.txtFSHCurrentLocation,
                        FatherSisterCust_familyID: model.fsObj.FatherSisterCustfamilyID,
                        FSHEducationdetails: obj.txtFSHEDucation
                    },
                    customerpersonaldetails: {
                        intCusID: custid,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editRelativeService.submitFSData(model.FSData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.relativePageLoad(custid);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }
        };

        model.MBSubmit = function(obj) {
            if (isSubmit) {
                isSubmit = false;

                model.MBData = {
                    GetDetails: {
                        CustID: custid,
                        Motherbrothername: obj.txtMBName,
                        MBElderYounger: obj.rdlMBElderYounger,
                        MBEmployedin: null,
                        MBProfessiongroup: null,
                        MBProfession: null,
                        MBProfessiondetails: obj.txtMBProfessiondetails,
                        MBMobileCountryID: obj.ddlMBCountriCode,
                        MBMObileNumber: obj.txtMBMobileNum,
                        MBLandLineCountryID: commonFactory.checkvals(obj.ddlMBCountriCode2) ? obj.ddlMBCountriCode2 : (commonFactory.checkvals(obj.ddlMBLandLineCountryCode) ? obj.ddlMBLandLineCountryCode : null),
                        MBLandAreaCode: commonFactory.checkvals(obj.txtMBMobileNum2) ? null : (commonFactory.checkvals(obj.txtMBAreaCode) ? obj.txtMBAreaCode : null),
                        MBLandNumber: commonFactory.checkvals(obj.txtMBMobileNum2) ? obj.txtMBMobileNum2 : (commonFactory.checkvals(obj.txtMBLandLineNum) ? obj.txtMBLandLineNum : null),
                        MBEmails: obj.txtMBEmails,
                        MBCurrentLocation: obj.txtMBCurrentLocation,
                        MBMotherBrotherCust_familyID: model.mbObj.MotherBrotherCustfamilyID,
                        MBEducationdetails: obj.txtMBEducation
                    },
                    customerpersonaldetails: {
                        intCusID: custid,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editRelativeService.submitMBData(model.MBData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.relativePageLoad(custid);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.MSSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.MSData = {
                    GetDetails: {
                        CustID: custid,
                        Mothersistername: obj.txtMSName,
                        MSElderYounger: obj.rdlMSElderYounger,
                        MSHusbandfirstname: obj.txtMsHusbandfirstname,
                        MSHusbandlastname: obj.txtMsHusbandlastname,
                        MSCountryID: 1,
                        MSMSHStateID: obj.ddlMSisState,
                        MSMSHDistrictID: obj.ddlMsDistrict,
                        MSNativeplace: obj.txtMSNativePlace,
                        MSEmployedin: null,
                        MSProfession: null,
                        MSProfessiondetails: obj.txtMSProfessiondetails,
                        MSMSHMobileCountryID: obj.ddlMSCounCodeID,
                        MSMObileNumber: obj.txtMSMObileNum,
                        MSHLandlineCountryID: commonFactory.checkvals(obj.ddlMSCounCodeID2) ? obj.ddlMSCounCodeID2 : (commonFactory.checkvals(obj.ddlMSLLCounCode) ? obj.ddlMSLLCounCode : null),
                        MSLandAreaCode: commonFactory.checkvals(obj.txtMSMObileNum2) ? null : (commonFactory.checkvals(obj.txtMSArea) ? obj.txtMSArea : null),
                        MSLandNumber: commonFactory.checkvals(obj.txtMSMObileNum2) ? obj.txtMSMObileNum2 : (commonFactory.checkvals(obj.txtLLNum) ? obj.txtLLNum : null),
                        MSHEmails: obj.txtMSEmail,
                        MSCurrentLocation: obj.txtMSCurrentLocation,
                        MSCust_familyID: model.msObj.MotherSisterCustfamilyID,
                        MSEducationdetails: obj.txtMSHEducation
                    },
                    customerpersonaldetails: {
                        intCusID: custid,
                        EmpID: null,
                        Admin: null
                    }
                };
                model.submitPromise = editRelativeService.submitMSData(model.MSData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.relativePageLoad(custid);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.cancel = function() {
            commonFactory.closepopup();
        };

        model.DeletePopup = function(type, id) {
            model.deleteDisplayTxt = type;
            model.identityID = id;
            commonFactory.open('common/templates/deletepopup.html', model.scope, uibModal, 'sm');
        };

        model.deleteSubmit = function() {
            SelectBindService.DeleteSection({ sectioname: 'Family', CustID: custid, identityid: model.identityID }).then(function(response) {
                console.log(response);
                model.relativePageLoad();
                commonFactory.closepopup();
            });
        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editRelativeModel', factory)

    factory.$inject = ['editRelativeService', 'authSvc', 'alert', 'commonFactory', '$uibModal', 'SelectBindService'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getRelativeeData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getRelativeDetailsDisplay', { params: { CustID: obj } });
            },
            submitFBData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerFathersBrotherUpdatedetails', JSON.stringify(obj1));
            },
            submitFSData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerFathersSisterUpdatedetails', JSON.stringify(obj1));
            },
            submitMBData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerMotherBrotherUpdatedetails', JSON.stringify(obj1));
            },
            submitMSData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerMotherSisterUpdatedetails', JSON.stringify(obj1));
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editRelativeService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editRelativeModel,scope){var vm=this;vm.init=function(){vm.model=editRelativeModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editRelativeCtrl",controller),controller.$inject=["editRelativeModel","$scope"]}(angular),function(angular){"use strict";function factory(editRelativeService,authSvc,alertss,commonFactory,uibModal,SelectBindService){var model={};model.scope={},model.fbObj={},model.fsObj={},model.mbObj={},model.msObj={};var isSubmit=!0;model.deleteDisplayTxt="",model.identityID=0;var logincustid=authSvc.getCustId(),custid=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.init=function(){return model.relativePageLoad(),model},model.relativePageLoad=function(){editRelativeService.getRelativeeData(custid).then(function(response){model.FBArr=JSON.parse(response.data[0]),model.FSArr=JSON.parse(response.data[1]),model.MBrr=JSON.parse(response.data[2]),model.MSArr=JSON.parse(response.data[3]),model.FBemodifiedby=model.FBArr.length>0&&void 0!==model.FBArr[0].EmpLastModificationDate&&null!==model.FBArr[0].EmpLastModificationDate?model.FBArr[0].EmpLastModificationDate:"",model.FSmodifiedby=model.FSArr.length>0&&void 0!==model.FSArr[0].EmpLastModificationDate&&null!==model.FSArr[0].EmpLastModificationDate?model.FSArr[0].EmpLastModificationDate:"",model.MBmodifiedby=model.MBrr.length>0&&void 0!==model.MBrr[0].EmpLastModificationDate&&null!==model.MBrr[0].EmpLastModificationDate?model.MBrr[0].EmpLastModificationDate:"",model.MSmodifiedby=model.MSArr.length>0&&void 0!==model.MSArr[0].EmpLastModificationDate&&null!==model.MSArr[0].EmpLastModificationDate?model.MSArr[0].EmpLastModificationDate:""})},model.relativePopulatePopulate=function(type,item){switch(isSubmit=!0,type){case"FB":model.fbObj.FatherbrotherCustfamilyID=null,model.fbObj={},void 0!==item&&(model.fbObj.FatherbrotherCustfamilyID=item.FatherbrotherCustfamilyID,model.fbObj.rdlFBElderORyounger="Elder"==item.FatherBrotherElderyounger?324:"Younger"==item.FatherBrotherElderyounger?323:"-1",model.fbObj.txtFatherbrothername=item.FatherbrotherName,model.fbObj.txtFBEducationdetails=item.FatherBrotherEducationDetails,model.fbObj.txtFBProfessiondetails=item.FatherbrotherProfessionDetails,model.fbObj.ddlFBMobileCountryID=item.FatherbrotherMobileCode,model.fbObj.txtFBMobileNumber=item.FatherbrotherMobileNumber,commonFactory.checkvals(item.FatherbrotherLandaraecode)?(model.fbObj.ddlFBLandLineCountry=item.FatherbrotherLandCountryCode,model.fbObj.txtFBAreCode=item.FatherbrotherLandaraecode,model.fbObj.txtFBLandNumber=item.FatherbrotherLandNumber):(model.fbObj.ddlFBMobileCountryID2=item.FatherbrotherLandCountryCode,model.fbObj.txtFBMobileNumber2=item.FatherbrotherLandNumber),model.fbObj.txtFBEmails=item.FatherbrotherEmail,model.fbObj.txtCurrentLocation=item.FatherbrotherCurrentLocation),commonFactory.open("FBModalContent.html",model.scope,uibModal);break;case"FS":model.fsObj.FatherSisterCustfamilyID=null,model.fsObj={},void 0!==item&&(model.fsObj.FatherSisterCustfamilyID=item.FatherSisterCustfamilyID,model.fsObj.rdlFSElderYounger="Elder"==item.FatherSisterElderyounger?326:"Younger"==item.FatherSisterElderyounger?325:"-1",model.fsObj.txtFathersistername=item.FatherSisterName,model.fsObj.txtFSHusbandfirstname=item.SpouceFName,model.fsObj.txtFSHusbandlastname=item.SpoucelName,model.fsObj.txtFSHEDucation=item.FatherSisterSpouseEducationDetails,model.fsObj.txtFSProfessiondetails=item.FathersisterSpouseProfessionDetails,model.fsObj.ddlFSHStateID=item.FatherSisterspousestateId,model.fsObj.ddlFSHDistrictID=item.FatherSisterspouseDistrictId,model.fsObj.txtFSHNativePlace=item.FathersisterSpouseNativePlace,model.fsObj.ddlFSMObileCountryID=item.FatherSisterMobilecodeid,model.fsObj.txtFSMobileNumber=item.FatherSisterspouseMobileNumber,commonFactory.checkvals(item.FatherSisterspouseLandaraecode)?(model.fsObj.ddlFSHLandCountryID=item.FatherSisterlandcontrycodeid,model.fsObj.txtFSHAreaNumber=item.FatherSisterspouseLandaraecode,model.fsObj.txtFSHNUmber=item.FatherSisterspouseLandNumber):(model.fsObj.ddlFSMObileCountryID2=item.FatherSisterlandcontrycodeid,model.fsObj.txtFSMobileNumber2=item.FatherSisterspouseLandNumber),model.fsObj.txtFSHEmails=item.FatherSisterspouseEmail,model.fsObj.txtFSHCurrentLocation=item.FatherSisterCurrentLocation),commonFactory.open("FSModalContent.html",model.scope,uibModal);break;case"MB":model.mbObj.MotherBrotherCustfamilyID=null,model.mbObj={},void 0!==item&&(model.mbObj.MotherBrotherCustfamilyID=item.MotherBrotherCustfamilyID,model.mbObj.rdlMBElderYounger="Elder"==item.MotherBrotherElderyounger?328:"Younger"==item.MotherBrotherElderyounger?327:"-1",model.mbObj.txtMBName=item.MotherBrotherName,model.mbObj.txtMBEducation=item.MotherBrotherEducationDetails,model.mbObj.txtMBProfessiondetails=item.MotherBrotherProfessionDetails,model.mbObj.ddlMBCountriCode=item.MotherBrotherMobileCode,model.mbObj.txtMBMobileNum=item.MotherBrotherMobileNumber,commonFactory.checkvals(item.MotherBrotherLandaraecode)?(model.mbObj.ddlMBLandLineCountryCode=item.MotherBrotherLandCountryCode,model.mbObj.txtMBAreaCode=item.MotherBrotherLandaraecode,model.mbObj.txtMBLandLineNum=item.MotherBrotherLandNumber):(model.mbObj.ddlMBCountriCode2=item.MotherBrotherLandCountryCode,model.mbObj.txtMBMobileNum2=item.MotherBrotherLandNumber),model.mbObj.txtMBEmails=item.MotherBrotherEmail,model.mbObj.txtMBCurrentLocation=item.MotherBrotherCurrentLocation),commonFactory.open("MBModalContent.html",model.scope,uibModal);break;case"MS":model.msObj.MotherSisterCustfamilyID=null,model.msObj={},void 0!==item&&(model.msObj.MotherSisterCustfamilyID=item.MotherSisterCustfamilyID,model.msObj.rdlMSElderYounger="Elder"==item.MotherSisterElderyounger?330:"Younger"==item.MotherSisterElderyounger?329:"-1",model.msObj.txtMSName=item.MotherSisterName,model.msObj.txtMsHusbandfirstname=item.SpouceFName,model.msObj.txtMsHusbandlastname=item.SpoucelName,model.msObj.ddlMSisState=item.spousestateid,model.msObj.ddlMsDistrict=item.spousedistrictID,model.msObj.txtMSNativePlace=item.MotherSisterSpouseNativePlace,model.msObj.txtMSHEducation=item.MothersisterspouseEducationdetails,model.msObj.txtMSProfessiondetails=item.MotherSisterProfessionDetails,model.msObj.ddlMSCounCodeID=item.MotherSisterMobileCodeId,model.msObj.txtMSMObileNum=item.MotherSisterspouseMobileNumber,commonFactory.checkvals(item.MotherSisterspouseLandaraecode)?(model.msObj.ddlMSLLCounCode=item.MotherSisterSpouselandcodeid,model.msObj.txtMSArea=item.MotherSisterspouseLandaraecode,model.msObj.txtLLNum=item.MotherSisterspouseLandNumber):(model.msObj.ddlMSCounCodeID2=item.MotherSisterSpouselandcodeid,model.msObj.txtMSMObileNum2=item.MotherSisterspouseLandNumber),model.msObj.txtMSEmail=item.MotherSisterspouseEmail,model.msObj.txtMSCurrentLocation=item.MotherSisterCurrentLocation),commonFactory.open("MSModalContent.html",model.scope,uibModal)}},model.FBSubmit=function(obj){isSubmit&&(isSubmit=!1,model.FBData={GetDetails:{CustID:custid,Fatherbrothername:obj.txtFatherbrothername,FBElderYounger:obj.rdlFBElderORyounger,FBEmployedin:null,FBProfessiongroup:null,FBProfession:null,FBProfessiondetails:obj.txtFBProfessiondetails,FBMobileCountryID:obj.ddlFBMobileCountryID,FBMobileNumber:obj.txtFBMobileNumber,FBLandLineCountryID:commonFactory.checkvals(obj.ddlFBMobileCountryID2)?obj.ddlFBMobileCountryID2:commonFactory.checkvals(obj.ddlFBLandLineCountry)?obj.ddlFBLandLineCountry:null,FBLandAreaCode:commonFactory.checkvals(obj.txtFBMobileNumber2)?null:commonFactory.checkvals(obj.txtFBAreCode)?obj.txtFBAreCode:null,FBLandNumber:commonFactory.checkvals(obj.txtFBMobileNumber2)?obj.txtFBMobileNumber2:commonFactory.checkvals(obj.txtFBLandNumber)?obj.txtFBLandNumber:null,FBEmails:obj.txtFBEmails,FBCurrentLocation:obj.txtCurrentLocation,FatherbrotherCust_familyID:model.fbObj.FatherbrotherCustfamilyID,FatherBrotherEducationDetails:obj.txtFBEducationdetails},customerpersonaldetails:{intCusID:custid,EmpID:null,Admin:null}},model.submitPromise=editRelativeService.submitFBData(model.FBData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.relativePageLoad(custid),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.FSSubmit=function(obj){isSubmit&&(isSubmit=!1,model.FSData={GetDetails:{CustID:custid,FSFathersistername:obj.txtFathersistername,FSElderYounger:obj.rdlFSElderYounger,FSHusbandfirstname:obj.txtFSHusbandfirstname,FSHusbandlastname:obj.txtFSHusbandlastname,FSCountryID:1,FSHStateID:obj.ddlFSHStateID,FSHDistrict:obj.ddlFSHDistrictID,FSNativeplace:obj.txtFSHNativePlace,FSHEmployedin:null,FSHProfessiongroup:null,FSHProfession:null,FSHProfessiondetails:obj.txtFSProfessiondetails,FSHMobileCountryID:obj.ddlFSMObileCountryID,FSHMObileNumber:obj.txtFSMobileNumber,FSHLandCountryID:commonFactory.checkvals(obj.ddlFSMObileCountryID2)?obj.ddlFSMObileCountryID2:commonFactory.checkvals(obj.ddlFSHLandCountryID)?obj.ddlFSHLandCountryID:null,FSHLandAreaCode:commonFactory.checkvals(obj.txtFSMobileNumber2)?null:commonFactory.checkvals(obj.txtFSHAreaNumber)?obj.txtFSHAreaNumber:null,FSHLandNumber:commonFactory.checkvals(obj.txtFSMobileNumber2)?obj.txtFSMobileNumber2:commonFactory.checkvals(obj.txtFSHNUmber)?obj.txtFSHNUmber:null,FSHEmails:obj.txtFSHEmails,FSCurrentLocation:obj.txtFSHCurrentLocation,FatherSisterCust_familyID:model.fsObj.FatherSisterCustfamilyID,FSHEducationdetails:obj.txtFSHEDucation},customerpersonaldetails:{intCusID:custid,EmpID:null,Admin:null}},model.submitPromise=editRelativeService.submitFSData(model.FSData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.relativePageLoad(custid),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.MBSubmit=function(obj){isSubmit&&(isSubmit=!1,model.MBData={GetDetails:{CustID:custid,Motherbrothername:obj.txtMBName,MBElderYounger:obj.rdlMBElderYounger,MBEmployedin:null,MBProfessiongroup:null,MBProfession:null,MBProfessiondetails:obj.txtMBProfessiondetails,MBMobileCountryID:obj.ddlMBCountriCode,MBMObileNumber:obj.txtMBMobileNum,MBLandLineCountryID:commonFactory.checkvals(obj.ddlMBCountriCode2)?obj.ddlMBCountriCode2:commonFactory.checkvals(obj.ddlMBLandLineCountryCode)?obj.ddlMBLandLineCountryCode:null,MBLandAreaCode:commonFactory.checkvals(obj.txtMBMobileNum2)?null:commonFactory.checkvals(obj.txtMBAreaCode)?obj.txtMBAreaCode:null,MBLandNumber:commonFactory.checkvals(obj.txtMBMobileNum2)?obj.txtMBMobileNum2:commonFactory.checkvals(obj.txtMBLandLineNum)?obj.txtMBLandLineNum:null,MBEmails:obj.txtMBEmails,MBCurrentLocation:obj.txtMBCurrentLocation,MBMotherBrotherCust_familyID:model.mbObj.MotherBrotherCustfamilyID,MBEducationdetails:obj.txtMBEducation},customerpersonaldetails:{intCusID:custid,EmpID:null,Admin:null}},model.submitPromise=editRelativeService.submitMBData(model.MBData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.relativePageLoad(custid),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.MSSubmit=function(obj){isSubmit&&(isSubmit=!1,model.MSData={GetDetails:{CustID:custid,Mothersistername:obj.txtMSName,MSElderYounger:obj.rdlMSElderYounger,MSHusbandfirstname:obj.txtMsHusbandfirstname,MSHusbandlastname:obj.txtMsHusbandlastname,MSCountryID:1,MSMSHStateID:obj.ddlMSisState,MSMSHDistrictID:obj.ddlMsDistrict,MSNativeplace:obj.txtMSNativePlace,MSEmployedin:null,MSProfession:null,MSProfessiondetails:obj.txtMSProfessiondetails,MSMSHMobileCountryID:obj.ddlMSCounCodeID,MSMObileNumber:obj.txtMSMObileNum,MSHLandlineCountryID:commonFactory.checkvals(obj.ddlMSCounCodeID2)?obj.ddlMSCounCodeID2:commonFactory.checkvals(obj.ddlMSLLCounCode)?obj.ddlMSLLCounCode:null,MSLandAreaCode:commonFactory.checkvals(obj.txtMSMObileNum2)?null:commonFactory.checkvals(obj.txtMSArea)?obj.txtMSArea:null,MSLandNumber:commonFactory.checkvals(obj.txtMSMObileNum2)?obj.txtMSMObileNum2:commonFactory.checkvals(obj.txtLLNum)?obj.txtLLNum:null,MSHEmails:obj.txtMSEmail,MSCurrentLocation:obj.txtMSCurrentLocation,MSCust_familyID:model.msObj.MotherSisterCustfamilyID,MSEducationdetails:obj.txtMSHEducation},customerpersonaldetails:{intCusID:custid,EmpID:null,Admin:null}},model.submitPromise=editRelativeService.submitMSData(model.MSData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.relativePageLoad(custid),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.cancel=function(){commonFactory.closepopup()},model.DeletePopup=function(type,id){model.deleteDisplayTxt=type,model.identityID=id,commonFactory.open("common/templates/deletepopup.html",model.scope,uibModal,"sm")},model.deleteSubmit=function(){SelectBindService.DeleteSection({sectioname:"Family",CustID:custid,identityid:model.identityID}).then(function(response){console.log(response),model.relativePageLoad(),commonFactory.closepopup()})},model.init()}angular.module("KaakateeyaEmpEdit").factory("editRelativeModel",factory),factory.$inject=["editRelativeService","authSvc","alert","commonFactory","$uibModal","SelectBindService"]}(angular),function(angular){"use strict";function factory(http){return{getRelativeeData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getRelativeDetailsDisplay",{params:{CustID:obj}})},submitFBData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerFathersBrotherUpdatedetails",JSON.stringify(obj1))},submitFSData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerFathersSisterUpdatedetails",JSON.stringify(obj1))},submitMBData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerMotherBrotherUpdatedetails",JSON.stringify(obj1))},submitMSData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerMotherSisterUpdatedetails",JSON.stringify(obj1))}}}angular.module("KaakateeyaEmpEdit").factory("editRelativeService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editSibblingModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editSibblingModel;
             vm.model.scope = scope;
         };

         vm.init();

     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editSibblingCtrl', controller)

     controller.$inject = ['editSibblingModel', '$scope'];
 })(angular);
(function(angular) {
    'use strict';


    function factory(editSibblingService, authSvc, alertss, commonFactory, uibModal, SelectBindService) {
        var model = {};
        model.scope = {};
        //start declaration block

        model.sibblingCountArr = [];
        model.BrotherArr = [];
        model.sisterArr = [];
        model.broObj = [];
        model.sisObj = [];
        model.sibCountsBindArr = commonFactory.numbersBind('', 0, 10);
        model.SibCountObj = {};
        model.BroCount = null;
        model.SisCount = null;
        model.CountryVal = '1';
        model.identityID = 0;

        var isSubmit = true;

        var logincustid = authSvc.getCustId();
        var custID = model.CustID = logincustid !== undefined && logincustid !== null && logincustid !== "" ? logincustid : null;

        //end declaration block

        model.init = function() {
            model.sibPageload();
            return model;
        };

        model.sibPageload = function() {

            editSibblingService.getSibblingeData(custID).then(function(response) {
                model.sibblingCountArr = JSON.parse(response.data[0]);
                model.BrotherArr = JSON.parse(response.data[1]);
                model.sisterArr = JSON.parse(response.data[2]);
                model.BroCount = model.sibblingCountArr[0].NoOfBrothers;
                model.SisCount = model.sibblingCountArr[0].NoOfSisters;

                model.broModifiedby = (model.BrotherArr.length > 0 && model.BrotherArr[0].EmpLastModificationDate !== undefined && model.BrotherArr[0].EmpLastModificationDate !== null) ? model.BrotherArr[0].EmpLastModificationDate : '';
                model.sisModifiedby = (model.sisterArr.length > 0 && model.sisterArr[0].EmpLastModificationDate !== undefined && model.sisterArr[0].EmpLastModificationDate !== null) ? model.sisterArr[0].EmpLastModificationDate : '';
            });

        };

        model.sibblingPopulatePopulate = function(type, item) {
            isSubmit = true;
            switch (type) {
                case 'sibCounrt':

                    if (item !== undefined) {
                        model.SibCountObj.ddlnoofsiblings = item.NoOfBrothers;
                        model.SibCountObj.ddlnoofelderrother = item.NoOfElderBrothers;
                        model.SibCountObj.ddlnoofyoungerbrother = item.NoOfYoungerBrothers;
                        model.SibCountObj.ddlnoofsisters = item.NoOfSisters;
                        model.SibCountObj.ddlnoofeldersisters = item.NoOfElderSisters;
                        model.SibCountObj.ddlnoofyoungersisters = item.NoOfYoungerSisters;
                    }

                    commonFactory.open('SibblingCountPopup.html', model.scope, uibModal);

                    break;

                case 'brother':
                    debugger;
                    if (item !== undefined && model.BrotherArr.length <= parseInt(model.BroCount)) {
                        model.broObj.SibilingCustfamilyID = null;
                        model.broObj = {};
                        if (item !== undefined) {
                            model.broObj.SibilingCustfamilyID = item.SibilingCustfamilyID;
                            model.broObj.rdlBElderYounger = item.brotherYoungerORelder == 'Elder' ? 42 : (item.brotherYoungerORelder == 'Younger' ? 41 : '-1');
                            model.broObj.txtBName = item.SibilingName;
                            model.broObj.txtbrotherreducation = item.SibilingEducationDetails;
                            model.broObj.txtbrotherprofession = item.SibilingProfessionDetails;
                            model.broObj.txtBCompanyname = item.SibilingCompany;
                            model.broObj.txtBJoblocation = item.SibilingJobPLace;

                            model.broObj.ddlBMObileCountryID = item.SibilingMobileCode;
                            model.broObj.txtBmobilenumber = item.SibilingMobileNumber;

                            if (item.SibilingLandaraecode !== '' && item.SibilingLandaraecode !== null) {
                                model.broObj.ddlBLandLineCountryID = item.SibilngLandCountryCode;
                                model.broObj.txtBAreCode = item.SibilingLandaraecode;
                                model.broObj.txtBLandNumber = item.SibilingLandNumber;
                            } else {
                                model.broObj.ddlBMObileCountryID2 = item.SibilngLandCountryCode;
                                model.broObj.txtBmobilenumber2 = item.SibilingLandNumber;

                            }

                            model.broObj.txtBEmails = item.SibilingEmail;
                            model.broObj.rdlBIsMarried = item.SibilingMarried;

                            model.broObj.txtBWifeName = item.SibilingSpouseName;
                            model.broObj.txtbrotherwifeeducation = item.SibilingSpouseEducationDetails;
                            model.broObj.txtbrotherwifeprofession = item.SibilingSpouseProfessionDetails;
                            model.broObj.chkboxbrotherwifeprofession = item.SibilingSpouseProfessionDetails === 'HouseWife' ? true : false;
                            model.broObj.txtBWifeCompanyName = item.spoucecompanyName;
                            model.broObj.txtBwifeJoblocation = item.spoucejobloc;
                            model.broObj.ddlBWMobileCode = item.SibilingSpouseMobileCode;
                            model.broObj.txtBWifeMobileNumber = item.SibilingSpouceMobileNumber;
                            if (item.SibilingSpouseLandareCode !== '' && item.SibilingSpouseLandareCode !== null) {
                                model.broObj.ddlBWifeLandLineCountryCode = item.SibilingSpouseLandCode;
                                model.broObj.txtBWifeLandLineAreaCode = item.SibilingSpouseLandareCode;
                                model.broObj.txtBWifeLandLineNumber = item.SibilngSpouseLandnumber;
                            } else {
                                model.broObj.ddlBWMobileCode2 = item.SibilingSpouseLandCode;
                                model.broObj.txtBWifeMobileNumber2 = item.SibilngSpouseLandnumber;
                            }

                            model.broObj.txtwifeEmail = item.SpouseEmail;
                            model.broObj.txtBWifeFatherSurName = item.SFsurname;
                            model.broObj.txtBWWifeFatherName = item.SFname;
                            model.broObj.ddlborherspousefathercaste = item.SibilingSpouseFatherCasteID;
                            model.broObj.ddlBroSpousefatherState = item.BroSpouseFatherStateID;
                            model.broObj.ddlBroSpousefatherDistrict = item.BroSpouseFatherDistrictID;
                            model.broObj.txtBroSpousefatherCity = item.BroSpouseFatherCity;
                            model.broObj.ddlbroprofessionCatgory = item.ProfessionCategoryID;
                            model.broObj.ddlbroSpouseprofessionCatgory = item.SpouceProfessionCategoryID;
                            //  
                            commonFactory.open('brotherModalContent.html', model.scope, uibModal);
                        }
                    } else if (item === undefined && model.BrotherArr.length < parseInt(model.BroCount)) {
                        model.broObj.SibilingCustfamilyID = null;
                        model.broObj = {};
                        commonFactory.open('brotherModalContent.html', model.scope, uibModal);
                    } else {
                        alertss.timeoutoldalerts(model.model, 'alert-danger', 'Cannot add more brothers', 4500);
                    }

                    break;

                case 'sister':

                    if (item !== undefined && model.sisterArr.length <= parseInt(model.SisCount)) {

                        model.sisObj.SibilingCustfamilyID = null;
                        model.sisObj = {};

                        if (item !== undefined) {

                            model.sisObj.SibilingCustfamilyID = item.SibilingCustfamilyID;
                            model.sisObj.rbtSElderyounger = item.SisterElderORyounger == 'Elder' ? '322' : (item.SisterElderORyounger == 'Younger' ? '321' : '-1');
                            model.sisObj.txtSisterName = item.SibilingName;
                            model.sisObj.txtsisEducation = item.SibilingEducationDetails;
                            model.sisObj.txtsisProfession = item.SibilingProfessionDetails;
                            model.sisObj.chksisProfession = item.SibilingProfessionDetails === 'HouseWife' ? true : false;
                            model.sisObj.txtSCompanyName = item.SibilingCompany;
                            model.sisObj.txtSjobloc = item.SibilingJobPLace;

                            model.sisObj.ddlSMobileCountyCodeID = item.SibilingMobileCode;
                            model.sisObj.txtSMobileNumber = item.SibilingMobileNumber;

                            if (item.SibilingLandaraecode !== '' && item.SibilingLandaraecode !== null) {
                                model.sisObj.ddlSLandLineCountryCodeID = item.SibilngLandCountryCode;
                                model.sisObj.txtSAreacoude = item.SibilingLandaraecode;
                                model.sisObj.txtSNumber = item.SibilingLandNumber;
                            } else {
                                model.sisObj.ddlSMobileCountyCodeID2 = item.SibilngLandCountryCode;
                                model.sisObj.txtSMobileNumber2 = item.SibilingLandNumber;
                            }

                            model.sisObj.txtSEmails = item.SibilingEmail;
                            model.sisObj.rdlSIsMarried = item.SibilingMarried;

                            model.sisObj.txtShusName = item.SibilingName;
                            model.sisObj.txtHusbandEducation = item.SibilingSpouseEducationDetails;
                            model.sisObj.txtHusbandProfession = item.SibilingSpouseProfessionDetails;
                            model.sisObj.txtShusCompanyName = item.spoucecompanyName;
                            model.sisObj.txtShusjobloc = item.spoucejobloc;

                            model.sisObj.ddlSHusMobileCountryID = item.sisterspousemobilecode;
                            model.sisObj.txtSHusMobileNumber = item.SibilingSpouceMobileNumber;

                            if (item.SibilingSpouseLandareCode !== '' && item.SibilingSpouseLandareCode !== null) {
                                model.sisObj.ddlSHusLandCountryID = item.SpousesisterLandCode;
                                model.sisObj.txtSHusLandNumber = item.SibilngSpouseLandnumber;
                                model.sisObj.txtSHusLandArea = item.SibilingSpouseLandareCode;
                            } else {
                                model.sisObj.ddlSHusMobileCountryID2 = item.SpousesisterLandCode;
                                model.sisObj.txtSHusMobileNumber2 = item.SibilngSpouseLandnumber;

                            }

                            model.sisObj.txtHusbandEmail = item.SpouseEmail;
                            model.sisObj.txtHusbandFatherSurName = item.SpouceFatherLName;
                            model.sisObj.txtHusbandFatherName = item.SpouceFatherFName;
                            model.sisObj.ddlsisterspusefathercaste = item.SibilingSpouseFatherCasteId;
                            model.sisObj.ddlSisSpouceFatherState = item.SisSpouseFatherStateID;
                            model.sisObj.ddlSisSpouceFatherDistrict = item.SisSpouseFatherDitrictID;
                            model.sisObj.txtSisSpouceFatherCity = item.SisSpousefatherCity;
                            model.sisObj.ddlsisprofessionCatgory = item.ProfessionCategoryID;
                            model.sisObj.ddlsisSpouseprofessionCatgory = item.SpouceProfessionCategoryID;
                            commonFactory.open('sisterModalContent.html', model.scope, uibModal);
                        }
                    } else if (item === undefined && model.sisterArr.length < parseInt(model.SisCount)) {

                        model.sisObj.SibilingCustfamilyID = null;
                        model.sisObj = {};
                        commonFactory.open('sisterModalContent.html', model.scope, uibModal);
                    } else {
                        alertss.timeoutoldalerts(model.model, 'alert-danger', 'Cannot add more sisters', 4500);
                        break;
                    }
            }

        };


        model.cancel = function() {
            commonFactory.closepopup();
        };


        model.ShousewiseChk = function(item) {
            if (item.chksisProfession === true) {
                item.txtsisProfession = 'HouseWife';
            } else {
                item.txtsisProfession = '';
            }
        };

        model.BhousewiseChk = function(item) {
            if (item.chkboxbrotherwifeprofession === true) {
                item.txtbrotherwifeprofession = 'HouseWife';
            } else {
                item.txtbrotherwifeprofession = '';
            }
        };

        model.checkVal = function(val) {
            return (val !== '' && val !== undefined) ? val : 0;

        };
        model.sibblingCountsSubmit = function(obj) {


            if (isSubmit) {
                isSubmit = false;


                var totalnofBrothers = parseInt(model.checkVal(obj.ddlnoofsiblings));
                var elderBrotherCount = parseInt(model.checkVal(obj.ddlnoofelderrother));
                var youngerBrotherCount = parseInt(model.checkVal(obj.ddlnoofyoungerbrother));

                var totalnoFSister = parseInt(model.checkVal(obj.ddlnoofsisters));
                var elderSisterCount = parseInt(model.checkVal(obj.ddlnoofeldersisters));
                var youngerSisterCount = parseInt(model.checkVal(obj.ddlnoofyoungersisters));

                if ((totalnofBrothers === 0 || totalnofBrothers === (elderBrotherCount + youngerBrotherCount)) && (totalnoFSister === 0 || totalnoFSister === (elderSisterCount + youngerSisterCount))) {

                    var objinput = {
                        CustID: custID,
                        NoOfBrothers: obj.ddlnoofsiblings,
                        NoOfSisters: obj.ddlnoofsisters,
                        NoOfYoungerBrothers: totalnofBrothers === 0 ? '0' : obj.ddlnoofyoungerbrother,
                        NoOfElderBrothers: totalnofBrothers === 0 ? '0' : obj.ddlnoofelderrother,
                        NoOfElderSisters: totalnoFSister === 0 ? '0' : obj.ddlnoofeldersisters,
                        NoOfYoungerSisters: totalnoFSister === 0 ? '0' : obj.ddlnoofyoungersisters
                    };

                    model.BroCount = obj.ddlnoofsiblings;
                    model.SisCount = obj.ddlnoofsisters;

                    model.submitPromise = editSibblingService.submitSibCountsData(objinput).then(function(response) {
                        console.log(response);
                        commonFactory.closepopup();
                        if (response.data === 1) {
                            model.sibPageload(custID);
                            alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                        } else {
                            alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                        }
                    });
                } else {

                    alert('Please enter Correct Sibling count');
                }

            }


        };

        model.BIsMarried = function(val) {
            if (val == '0') {
                model.broObj.txtBWifeName = '';
                model.broObj.txtbrotherwifeeducation = '';
                model.broObj.txtbrotherwifeprofession = '';
                model.broObj.chkboxbrotherwifeprofession = '';
                model.broObj.txtBWifeCompanyName = '';
                model.broObj.txtBwifeJoblocation = '';
                model.broObj.ddlBWMobileCode = '';
                model.broObj.txtBWifeMobileNumber = '';
                model.broObj.ddlBWifeLandLineCountryCode = '';
                model.broObj.txtBWifeLandLineAreaCode = '';
                model.broObj.txtBWifeLandLineNumber = '';
                model.broObj.ddlBWMobileCode2 = '';
                model.broObj.txtBWifeMobileNumber2 = '';
                model.broObj.txtwifeEmail = '';
                model.broObj.txtBWifeFatherSurName = '';
                model.broObj.txtBWWifeFatherName = '';
                model.broObj.ddlborherspousefathercaste = '';
                model.broObj.ddlBroSpousefatherState = '';
                model.broObj.ddlBroSpousefatherDistrict = '';
                model.broObj.txtBroSpousefatherCity = '';
            }
        };

        model.SIsMarried = function(val) {
            if (val == '0') {
                model.sisObj.txtShusName = '';
                model.sisObj.txtHusbandEducation = '';
                model.sisObj.txtHusbandProfession = '';
                model.sisObj.txtShusCompanyName = '';
                model.sisObj.txtShusjobloc = '';
                model.sisObj.ddlSHusMobileCountryID = '';
                model.sisObj.txtSHusMobileNumber = '';
                model.sisObj.ddlSHusLandCountryID = '';
                model.sisObj.txtSHusLandNumber = '';
                model.sisObj.txtSHusLandArea = '';
                model.sisObj.ddlSHusMobileCountryID2 = '';
                model.sisObj.txtSHusMobileNumber2 = '';
                model.sisObj.txtHusbandEmail = '';
                model.sisObj.txtHusbandFatherSurName = '';
                model.sisObj.txtHusbandFatherName = '';
                model.sisObj.ddlsisterspusefathercaste = '';
                model.sisObj.ddlSisSpouceFatherState = '';
                model.sisObj.ddlSisSpouceFatherDistrict = '';
                model.sisObj.txtSisSpouceFatherCity = '';
            }
        };

        model.enableSubmit = function() {
            isSubmit = true;


        };

        model.deleteDisplayTxt = '';
        model.DeletePopup = function(type, id) {
            model.deleteDisplayTxt = type;
            model.identityID = id;
            commonFactory.open('common/templates/deletepopup.html', model.scope, uibModal, 'sm');
        };

        model.deleteSubmit = function(type) {

            SelectBindService.DeleteSection({ sectioname: 'Family', CustID: custID, identityid: model.identityID }).then(function() {
                model.sibPageload(custID);
                commonFactory.closepopup();
            });



        };

        model.sibBroSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.sibBroData = {
                    GetDetails: {
                        CustID: custID,
                        BroName: obj.txtBName,
                        BroElderYounger: obj.rdlBElderYounger,
                        BroEducationcategory: null,
                        BroEducationgroup: null,
                        BroEducationspecialization: null,
                        BroEmployedin: null,
                        BroProfessiongroup: null,
                        BroProfession: null,
                        BroCompanyName: obj.txtBCompanyname,
                        BroJobLocation: obj.txtBJoblocation,
                        BroMobileCountryCodeID: obj.ddlBMObileCountryID,
                        BroMobileNumber: obj.txtBmobilenumber,
                        BroLandCountryCodeID: commonFactory.checkvals(obj.ddlBMObileCountryID2) ? obj.ddlBMObileCountryID2 : (commonFactory.checkvals(obj.ddlBLandLineCountryID) ? obj.ddlBLandLineCountryID : null),
                        BroLandAreaCode: commonFactory.checkvals(obj.txtBmobilenumber2) ? null : (obj.txtBAreCode !== '' && obj.txtBAreCode !== null ? obj.txtBAreCode : null),
                        BroLandNumber: commonFactory.checkvals(obj.txtBmobilenumber2) ? obj.txtBmobilenumber2 : (commonFactory.checkvals(obj.txtBLandNumber) ? obj.txtBLandNumber : null),
                        BroEmail: obj.txtBEmails,
                        BIsMarried: obj.rdlBIsMarried,
                        BroWifeName: obj.txtBWifeName,
                        BroWifeEducationcategory: null,
                        BroWifeEducationgroup: null,
                        BroWifeEducationspecialization: null,
                        BroWifeEmployedin: null,
                        BroWifeProfessiongroup: null,
                        BroWifeProfession: null,
                        BroWifeCompanyName: obj.txtBWifeCompanyName,
                        BroWifeJobLocation: obj.txtBwifeJoblocation,
                        BroWifeMobileCountryCodeID: obj.ddlBWMobileCode,
                        BroWifeMobileNumber: obj.txtBWifeMobileNumber,
                        BroWifeLandCountryCodeID: commonFactory.checkvals(obj.ddlBWMobileCode2) ? obj.ddlBWMobileCode2 : commonFactory.checkvals(obj.ddlBWifeLandLineCountryCode) ? obj.ddlBWifeLandLineCountryCode : null,
                        BroWifeLandAreacode: commonFactory.checkvals(obj.txtBWifeMobileNumber2) ? null : commonFactory.checkvals(obj.txtBWifeLandLineAreaCode) ? obj.txtBWifeLandLineAreaCode : null,
                        BroWifeLandNumber: commonFactory.checkvals(obj.txtBWifeMobileNumber2) ? obj.txtBWifeMobileNumber2 : commonFactory.checkvals(obj.txtBWifeLandLineNumber) ? obj.txtBWifeLandLineNumber : null,
                        BroWifeFatherSurName: obj.txtBWifeFatherSurName,
                        BroWifeFatherName: obj.txtBWWifeFatherName,
                        BroSibilingCustfamilyID: model.broObj.SibilingCustfamilyID,
                        BroEducationDetails: obj.txtbrotherreducation,
                        BrowifeEducationDetails: obj.txtbrotherwifeeducation,
                        BroProfessionDetails: obj.txtbrotherprofession,
                        BroWifeProfessionDetails: obj.txtbrotherwifeprofession,
                        BroSpouseFatherCountryID: '1',
                        BroSpouseFatherStateID: obj.ddlBroSpousefatherState,
                        BroSpouseFatherDitrictID: obj.ddlBroSpousefatherDistrict,
                        BroSpouseFatherNativePlace: obj.txtBroSpousefatherCity,
                        BrotherSpouseEmail: obj.txtwifeEmail,
                        SibilingSpouseFatherCasteID: obj.ddlborherspousefathercaste,
                        BroProfessionCategoryID: obj.ddlbroprofessionCatgory,
                        BroSpouseProfessionCategoryID: obj.ddlbroSpouseprofessionCatgory

                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }
                };

                model.submitPromise = editSibblingService.submitSibBroData(model.sibBroData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {
                        model.sibPageload(custID);
                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        model.sibSisSubmit = function(obj) {

            if (isSubmit) {
                isSubmit = false;
                model.sibSisData = {
                    GetDetails: {
                        CustID: custID,
                        SisName: obj.txtSisterName,
                        SisElderYounger: obj.rbtSElderyounger,
                        SisEducationcategory: null,
                        SisEducationgroup: null,
                        SisEducationspecialization: null,
                        SisEmployedin: null,
                        SisProfessiongroup: null,
                        SisProfession: null,
                        SisCompanyName: obj.txtSCompanyName,
                        SisJobLocation: obj.txtSjobloc,
                        SisMobileCountryCodeID: obj.ddlSMobileCountyCodeID,
                        SisMobileNumber: obj.txtSMobileNumber,
                        SisLandCountryCodeID: commonFactory.checkvals(obj.ddlSMobileCountyCodeID2) ? obj.ddlSMobileCountyCodeID2 : commonFactory.checkvals(obj.ddlSLandLineCountryCodeID) ? obj.ddlSLandLineCountryCodeID : null,
                        SisLandAreaCode: commonFactory.checkvals(obj.txtSMobileNumber2) ? null : commonFactory.checkvals(obj.txtSAreacoude) ? obj.txtSAreacoude : null,
                        SisLandNumber: commonFactory.checkvals(obj.txtSMobileNumber2) ? obj.txtSMobileNumber2 : commonFactory.checkvals(obj.txtSNumber) ? obj.txtSNumber : null,
                        SisEmail: obj.txtSEmails,
                        SIsMarried: obj.rdlSIsMarried,
                        SisHusbandName: obj.txtShusName,
                        SisHusbandEducationcategory: null,
                        SisHusbandEducationgroup: null,
                        SisHusbandEducationspecialization: null,
                        SisHusbandEmployedin: null,
                        SisHusbandProfessiongroup: null,
                        SisHusbandProfession: null,
                        SisHusCompanyName: obj.txtShusCompanyName,
                        SisHusJobLocation: obj.txtShusjobloc,
                        SisHusbandMobileCountryCodeID: obj.ddlSHusMobileCountryID,
                        SisHusbandMobileNumber: obj.txtSHusMobileNumber,
                        SisHusbandLandCountryCodeID: commonFactory.checkvals(obj.ddlSHusMobileCountryID2) ? obj.ddlSHusMobileCountryID2 : commonFactory.checkvals(obj.ddlSHusLandCountryID) ? obj.ddlSHusLandCountryID : null,
                        SisHusbandLandAreacode: commonFactory.checkvals(obj.txtSHusMobileNumber2) ? null : commonFactory.checkvals(obj.txtSHusLandArea) ? obj.txtSHusLandArea : null,
                        SisHusbandLandNumber: commonFactory.checkvals(obj.txtSHusMobileNumber2) ? obj.txtSHusMobileNumber2 : commonFactory.checkvals(obj.txtSHusLandNumber) ? obj.txtSHusLandNumber : null,
                        SisHusbandFatherSurName: obj.txtHusbandFatherSurName,
                        SisHusbandFatherName: obj.txtHusbandFatherName,
                        SisSibilingCustfamilyID: model.sisObj.SibilingCustfamilyID,
                        siseducationdetails: obj.txtsisEducation,
                        sisprofessiondetails: obj.txtsisProfession,
                        sisspouseeducationdetails: obj.txtHusbandEducation,
                        sisspouseprofessiondetails: obj.txtHusbandProfession,
                        SisSpouseFatherCountryID: '1',
                        SisSpouseFatherStateID: obj.ddlSisSpouceFatherState,
                        SisSpouseFatherDitrictID: obj.ddlSisSpouceFatherDistrict,
                        SisSpouseFatherNativePlace: obj.txtSisSpouceFatherCity,
                        SisSpouseEmail: obj.txtHusbandEmail,
                        SibilingSpouseFatherCasteID: obj.ddlsisterspusefathercaste,
                        SisProfessionCategoryID: obj.ddlsisprofessionCatgory,
                        SisSpouseProfessionCategoryID: obj.ddlsisSpouseprofessionCatgory
                    },
                    customerpersonaldetails: {
                        intCusID: custID,
                        EmpID: null,
                        Admin: null
                    }
                };
                model.submitPromise = editSibblingService.submitSibSisData(model.sibSisData).then(function(response) {
                    console.log(response);
                    commonFactory.closepopup();
                    if (response.data === 1) {

                        model.sibPageload(custID);

                        alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                    }
                });
            }

        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editSibblingModel', factory)

    factory.$inject = ['editSibblingService', 'authSvc', 'alert', 'commonFactory', '$uibModal', 'SelectBindService'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getSibblingeData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getsiblingsDetailsDisplay', { params: { CustID: obj } });
            },
            submitSibBroData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerSibBrotherUpdatedetails', JSON.stringify(obj1));
            },
            submitSibSisData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/CustomerSibSisterUpdatedetails', JSON.stringify(obj1));
            },
            submitSibCountsData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/UpdateSibblingCounts', JSON.stringify(obj1));
            },
            allowblockWebusers: function(custid) {

                return http.get(editviewapp.apipath + 'StaticPages/getRegisteredBranchStatus', { params: { StrCustID: custid } });
            }

        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editSibblingService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editSibblingModel,scope){var vm=this;vm.init=function(){vm.model=editSibblingModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editSibblingCtrl",controller),controller.$inject=["editSibblingModel","$scope"]}(angular),function(angular){"use strict";function factory(editSibblingService,authSvc,alertss,commonFactory,uibModal,SelectBindService){var model={};model.scope={},model.sibblingCountArr=[],model.BrotherArr=[],model.sisterArr=[],model.broObj=[],model.sisObj=[],model.sibCountsBindArr=commonFactory.numbersBind("",0,10),model.SibCountObj={},model.BroCount=null,model.SisCount=null,model.CountryVal="1",model.identityID=0;var isSubmit=!0,logincustid=authSvc.getCustId(),custID=model.CustID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.init=function(){return model.sibPageload(),model},model.sibPageload=function(){editSibblingService.getSibblingeData(custID).then(function(response){model.sibblingCountArr=JSON.parse(response.data[0]),model.BrotherArr=JSON.parse(response.data[1]),model.sisterArr=JSON.parse(response.data[2]),model.BroCount=model.sibblingCountArr[0].NoOfBrothers,model.SisCount=model.sibblingCountArr[0].NoOfSisters,model.broModifiedby=model.BrotherArr.length>0&&void 0!==model.BrotherArr[0].EmpLastModificationDate&&null!==model.BrotherArr[0].EmpLastModificationDate?model.BrotherArr[0].EmpLastModificationDate:"",model.sisModifiedby=model.sisterArr.length>0&&void 0!==model.sisterArr[0].EmpLastModificationDate&&null!==model.sisterArr[0].EmpLastModificationDate?model.sisterArr[0].EmpLastModificationDate:""})},model.sibblingPopulatePopulate=function(type,item){switch(isSubmit=!0,type){case"sibCounrt":void 0!==item&&(model.SibCountObj.ddlnoofsiblings=item.NoOfBrothers,model.SibCountObj.ddlnoofelderrother=item.NoOfElderBrothers,model.SibCountObj.ddlnoofyoungerbrother=item.NoOfYoungerBrothers,model.SibCountObj.ddlnoofsisters=item.NoOfSisters,model.SibCountObj.ddlnoofeldersisters=item.NoOfElderSisters,model.SibCountObj.ddlnoofyoungersisters=item.NoOfYoungerSisters),commonFactory.open("SibblingCountPopup.html",model.scope,uibModal);break;case"brother":void 0!==item&&model.BrotherArr.length<=parseInt(model.BroCount)?(model.broObj.SibilingCustfamilyID=null,model.broObj={},void 0!==item&&(model.broObj.SibilingCustfamilyID=item.SibilingCustfamilyID,model.broObj.rdlBElderYounger="Elder"==item.brotherYoungerORelder?42:"Younger"==item.brotherYoungerORelder?41:"-1",model.broObj.txtBName=item.SibilingName,model.broObj.txtbrotherreducation=item.SibilingEducationDetails,model.broObj.txtbrotherprofession=item.SibilingProfessionDetails,model.broObj.txtBCompanyname=item.SibilingCompany,model.broObj.txtBJoblocation=item.SibilingJobPLace,model.broObj.ddlBMObileCountryID=item.SibilingMobileCode,model.broObj.txtBmobilenumber=item.SibilingMobileNumber,""!==item.SibilingLandaraecode&&null!==item.SibilingLandaraecode?(model.broObj.ddlBLandLineCountryID=item.SibilngLandCountryCode,model.broObj.txtBAreCode=item.SibilingLandaraecode,model.broObj.txtBLandNumber=item.SibilingLandNumber):(model.broObj.ddlBMObileCountryID2=item.SibilngLandCountryCode,model.broObj.txtBmobilenumber2=item.SibilingLandNumber),model.broObj.txtBEmails=item.SibilingEmail,model.broObj.rdlBIsMarried=item.SibilingMarried,model.broObj.txtBWifeName=item.SibilingSpouseName,model.broObj.txtbrotherwifeeducation=item.SibilingSpouseEducationDetails,model.broObj.txtbrotherwifeprofession=item.SibilingSpouseProfessionDetails,model.broObj.chkboxbrotherwifeprofession="HouseWife"===item.SibilingSpouseProfessionDetails,model.broObj.txtBWifeCompanyName=item.spoucecompanyName,model.broObj.txtBwifeJoblocation=item.spoucejobloc,model.broObj.ddlBWMobileCode=item.SibilingSpouseMobileCode,model.broObj.txtBWifeMobileNumber=item.SibilingSpouceMobileNumber,""!==item.SibilingSpouseLandareCode&&null!==item.SibilingSpouseLandareCode?(model.broObj.ddlBWifeLandLineCountryCode=item.SibilingSpouseLandCode,model.broObj.txtBWifeLandLineAreaCode=item.SibilingSpouseLandareCode,model.broObj.txtBWifeLandLineNumber=item.SibilngSpouseLandnumber):(model.broObj.ddlBWMobileCode2=item.SibilingSpouseLandCode,model.broObj.txtBWifeMobileNumber2=item.SibilngSpouseLandnumber),model.broObj.txtwifeEmail=item.SpouseEmail,model.broObj.txtBWifeFatherSurName=item.SFsurname,model.broObj.txtBWWifeFatherName=item.SFname,model.broObj.ddlborherspousefathercaste=item.SibilingSpouseFatherCasteID,model.broObj.ddlBroSpousefatherState=item.BroSpouseFatherStateID,model.broObj.ddlBroSpousefatherDistrict=item.BroSpouseFatherDistrictID,model.broObj.txtBroSpousefatherCity=item.BroSpouseFatherCity,model.broObj.ddlbroprofessionCatgory=item.ProfessionCategoryID,model.broObj.ddlbroSpouseprofessionCatgory=item.SpouceProfessionCategoryID,commonFactory.open("brotherModalContent.html",model.scope,uibModal))):void 0===item&&model.BrotherArr.length<parseInt(model.BroCount)?(model.broObj.SibilingCustfamilyID=null,model.broObj={},commonFactory.open("brotherModalContent.html",model.scope,uibModal)):alertss.timeoutoldalerts(model.model,"alert-danger","Cannot add more brothers",4500);break;case"sister":if(void 0!==item&&model.sisterArr.length<=parseInt(model.SisCount))model.sisObj.SibilingCustfamilyID=null,model.sisObj={},void 0!==item&&(model.sisObj.SibilingCustfamilyID=item.SibilingCustfamilyID,model.sisObj.rbtSElderyounger="Elder"==item.SisterElderORyounger?"322":"Younger"==item.SisterElderORyounger?"321":"-1",model.sisObj.txtSisterName=item.SibilingName,model.sisObj.txtsisEducation=item.SibilingEducationDetails,model.sisObj.txtsisProfession=item.SibilingProfessionDetails,model.sisObj.chksisProfession="HouseWife"===item.SibilingProfessionDetails,model.sisObj.txtSCompanyName=item.SibilingCompany,model.sisObj.txtSjobloc=item.SibilingJobPLace,model.sisObj.ddlSMobileCountyCodeID=item.SibilingMobileCode,model.sisObj.txtSMobileNumber=item.SibilingMobileNumber,""!==item.SibilingLandaraecode&&null!==item.SibilingLandaraecode?(model.sisObj.ddlSLandLineCountryCodeID=item.SibilngLandCountryCode,model.sisObj.txtSAreacoude=item.SibilingLandaraecode,model.sisObj.txtSNumber=item.SibilingLandNumber):(model.sisObj.ddlSMobileCountyCodeID2=item.SibilngLandCountryCode,model.sisObj.txtSMobileNumber2=item.SibilingLandNumber),model.sisObj.txtSEmails=item.SibilingEmail,model.sisObj.rdlSIsMarried=item.SibilingMarried,model.sisObj.txtShusName=item.SibilingName,model.sisObj.txtHusbandEducation=item.SibilingSpouseEducationDetails,model.sisObj.txtHusbandProfession=item.SibilingSpouseProfessionDetails,model.sisObj.txtShusCompanyName=item.spoucecompanyName,model.sisObj.txtShusjobloc=item.spoucejobloc,model.sisObj.ddlSHusMobileCountryID=item.sisterspousemobilecode,model.sisObj.txtSHusMobileNumber=item.SibilingSpouceMobileNumber,""!==item.SibilingSpouseLandareCode&&null!==item.SibilingSpouseLandareCode?(model.sisObj.ddlSHusLandCountryID=item.SpousesisterLandCode,model.sisObj.txtSHusLandNumber=item.SibilngSpouseLandnumber,model.sisObj.txtSHusLandArea=item.SibilingSpouseLandareCode):(model.sisObj.ddlSHusMobileCountryID2=item.SpousesisterLandCode,model.sisObj.txtSHusMobileNumber2=item.SibilngSpouseLandnumber),model.sisObj.txtHusbandEmail=item.SpouseEmail,model.sisObj.txtHusbandFatherSurName=item.SpouceFatherLName,model.sisObj.txtHusbandFatherName=item.SpouceFatherFName,model.sisObj.ddlsisterspusefathercaste=item.SibilingSpouseFatherCasteId,model.sisObj.ddlSisSpouceFatherState=item.SisSpouseFatherStateID,model.sisObj.ddlSisSpouceFatherDistrict=item.SisSpouseFatherDitrictID,model.sisObj.txtSisSpouceFatherCity=item.SisSpousefatherCity,model.sisObj.ddlsisprofessionCatgory=item.ProfessionCategoryID,model.sisObj.ddlsisSpouseprofessionCatgory=item.SpouceProfessionCategoryID,commonFactory.open("sisterModalContent.html",model.scope,uibModal));else{if(!(void 0===item&&model.sisterArr.length<parseInt(model.SisCount))){alertss.timeoutoldalerts(model.model,"alert-danger","Cannot add more sisters",4500);break}model.sisObj.SibilingCustfamilyID=null,model.sisObj={},commonFactory.open("sisterModalContent.html",model.scope,uibModal)}}},model.cancel=function(){commonFactory.closepopup()},model.ShousewiseChk=function(item){item.chksisProfession===!0?item.txtsisProfession="HouseWife":item.txtsisProfession=""},model.BhousewiseChk=function(item){item.chkboxbrotherwifeprofession===!0?item.txtbrotherwifeprofession="HouseWife":item.txtbrotherwifeprofession=""},model.checkVal=function(val){return""!==val&&void 0!==val?val:0},model.sibblingCountsSubmit=function(obj){if(isSubmit){isSubmit=!1;var totalnofBrothers=parseInt(model.checkVal(obj.ddlnoofsiblings)),elderBrotherCount=parseInt(model.checkVal(obj.ddlnoofelderrother)),youngerBrotherCount=parseInt(model.checkVal(obj.ddlnoofyoungerbrother)),totalnoFSister=parseInt(model.checkVal(obj.ddlnoofsisters)),elderSisterCount=parseInt(model.checkVal(obj.ddlnoofeldersisters)),youngerSisterCount=parseInt(model.checkVal(obj.ddlnoofyoungersisters));if(0!==totalnofBrothers&&totalnofBrothers!==elderBrotherCount+youngerBrotherCount||0!==totalnoFSister&&totalnoFSister!==elderSisterCount+youngerSisterCount)alert("Please enter Correct Sibling count");else{var objinput={CustID:custID,NoOfBrothers:obj.ddlnoofsiblings,NoOfSisters:obj.ddlnoofsisters,NoOfYoungerBrothers:0===totalnofBrothers?"0":obj.ddlnoofyoungerbrother,NoOfElderBrothers:0===totalnofBrothers?"0":obj.ddlnoofelderrother,NoOfElderSisters:0===totalnoFSister?"0":obj.ddlnoofeldersisters,NoOfYoungerSisters:0===totalnoFSister?"0":obj.ddlnoofyoungersisters};model.BroCount=obj.ddlnoofsiblings,model.SisCount=obj.ddlnoofsisters,model.submitPromise=editSibblingService.submitSibCountsData(objinput).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.sibPageload(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})}}},model.BIsMarried=function(val){"0"==val&&(model.broObj.txtBWifeName="",model.broObj.txtbrotherwifeeducation="",model.broObj.txtbrotherwifeprofession="",model.broObj.chkboxbrotherwifeprofession="",model.broObj.txtBWifeCompanyName="",model.broObj.txtBwifeJoblocation="",model.broObj.ddlBWMobileCode="",model.broObj.txtBWifeMobileNumber="",model.broObj.ddlBWifeLandLineCountryCode="",model.broObj.txtBWifeLandLineAreaCode="",model.broObj.txtBWifeLandLineNumber="",model.broObj.ddlBWMobileCode2="",model.broObj.txtBWifeMobileNumber2="",model.broObj.txtwifeEmail="",model.broObj.txtBWifeFatherSurName="",model.broObj.txtBWWifeFatherName="",model.broObj.ddlborherspousefathercaste="",model.broObj.ddlBroSpousefatherState="",model.broObj.ddlBroSpousefatherDistrict="",model.broObj.txtBroSpousefatherCity="")},model.SIsMarried=function(val){"0"==val&&(model.sisObj.txtShusName="",model.sisObj.txtHusbandEducation="",model.sisObj.txtHusbandProfession="",model.sisObj.txtShusCompanyName="",model.sisObj.txtShusjobloc="",model.sisObj.ddlSHusMobileCountryID="",model.sisObj.txtSHusMobileNumber="",model.sisObj.ddlSHusLandCountryID="",model.sisObj.txtSHusLandNumber="",model.sisObj.txtSHusLandArea="",model.sisObj.ddlSHusMobileCountryID2="",model.sisObj.txtSHusMobileNumber2="",model.sisObj.txtHusbandEmail="",model.sisObj.txtHusbandFatherSurName="",model.sisObj.txtHusbandFatherName="",model.sisObj.ddlsisterspusefathercaste="",model.sisObj.ddlSisSpouceFatherState="",model.sisObj.ddlSisSpouceFatherDistrict="",model.sisObj.txtSisSpouceFatherCity="")},model.enableSubmit=function(){isSubmit=!0},model.deleteDisplayTxt="",model.DeletePopup=function(type,id){model.deleteDisplayTxt=type,model.identityID=id,commonFactory.open("common/templates/deletepopup.html",model.scope,uibModal,"sm")},model.deleteSubmit=function(type){SelectBindService.DeleteSection({sectioname:"Family",CustID:custID,identityid:model.identityID}).then(function(){model.sibPageload(custID),commonFactory.closepopup()})},model.sibBroSubmit=function(obj){isSubmit&&(isSubmit=!1,model.sibBroData={GetDetails:{CustID:custID,BroName:obj.txtBName,BroElderYounger:obj.rdlBElderYounger,BroEducationcategory:null,BroEducationgroup:null,BroEducationspecialization:null,BroEmployedin:null,BroProfessiongroup:null,BroProfession:null,BroCompanyName:obj.txtBCompanyname,BroJobLocation:obj.txtBJoblocation,BroMobileCountryCodeID:obj.ddlBMObileCountryID,BroMobileNumber:obj.txtBmobilenumber,BroLandCountryCodeID:commonFactory.checkvals(obj.ddlBMObileCountryID2)?obj.ddlBMObileCountryID2:commonFactory.checkvals(obj.ddlBLandLineCountryID)?obj.ddlBLandLineCountryID:null,BroLandAreaCode:commonFactory.checkvals(obj.txtBmobilenumber2)?null:""!==obj.txtBAreCode&&null!==obj.txtBAreCode?obj.txtBAreCode:null,BroLandNumber:commonFactory.checkvals(obj.txtBmobilenumber2)?obj.txtBmobilenumber2:commonFactory.checkvals(obj.txtBLandNumber)?obj.txtBLandNumber:null,BroEmail:obj.txtBEmails,BIsMarried:obj.rdlBIsMarried,BroWifeName:obj.txtBWifeName,BroWifeEducationcategory:null,BroWifeEducationgroup:null,BroWifeEducationspecialization:null,BroWifeEmployedin:null,BroWifeProfessiongroup:null,BroWifeProfession:null,BroWifeCompanyName:obj.txtBWifeCompanyName,BroWifeJobLocation:obj.txtBwifeJoblocation,BroWifeMobileCountryCodeID:obj.ddlBWMobileCode,BroWifeMobileNumber:obj.txtBWifeMobileNumber,BroWifeLandCountryCodeID:commonFactory.checkvals(obj.ddlBWMobileCode2)?obj.ddlBWMobileCode2:commonFactory.checkvals(obj.ddlBWifeLandLineCountryCode)?obj.ddlBWifeLandLineCountryCode:null,BroWifeLandAreacode:commonFactory.checkvals(obj.txtBWifeMobileNumber2)?null:commonFactory.checkvals(obj.txtBWifeLandLineAreaCode)?obj.txtBWifeLandLineAreaCode:null,BroWifeLandNumber:commonFactory.checkvals(obj.txtBWifeMobileNumber2)?obj.txtBWifeMobileNumber2:commonFactory.checkvals(obj.txtBWifeLandLineNumber)?obj.txtBWifeLandLineNumber:null,BroWifeFatherSurName:obj.txtBWifeFatherSurName,BroWifeFatherName:obj.txtBWWifeFatherName,BroSibilingCustfamilyID:model.broObj.SibilingCustfamilyID,BroEducationDetails:obj.txtbrotherreducation,BrowifeEducationDetails:obj.txtbrotherwifeeducation,BroProfessionDetails:obj.txtbrotherprofession,BroWifeProfessionDetails:obj.txtbrotherwifeprofession,BroSpouseFatherCountryID:"1",BroSpouseFatherStateID:obj.ddlBroSpousefatherState,BroSpouseFatherDitrictID:obj.ddlBroSpousefatherDistrict,BroSpouseFatherNativePlace:obj.txtBroSpousefatherCity,BrotherSpouseEmail:obj.txtwifeEmail,SibilingSpouseFatherCasteID:obj.ddlborherspousefathercaste,BroProfessionCategoryID:obj.ddlbroprofessionCatgory,BroSpouseProfessionCategoryID:obj.ddlbroSpouseprofessionCatgory},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editSibblingService.submitSibBroData(model.sibBroData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.sibPageload(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.sibSisSubmit=function(obj){isSubmit&&(isSubmit=!1,model.sibSisData={GetDetails:{CustID:custID,SisName:obj.txtSisterName,SisElderYounger:obj.rbtSElderyounger,SisEducationcategory:null,SisEducationgroup:null,SisEducationspecialization:null,SisEmployedin:null,SisProfessiongroup:null,SisProfession:null,SisCompanyName:obj.txtSCompanyName,SisJobLocation:obj.txtSjobloc,SisMobileCountryCodeID:obj.ddlSMobileCountyCodeID,SisMobileNumber:obj.txtSMobileNumber,SisLandCountryCodeID:commonFactory.checkvals(obj.ddlSMobileCountyCodeID2)?obj.ddlSMobileCountyCodeID2:commonFactory.checkvals(obj.ddlSLandLineCountryCodeID)?obj.ddlSLandLineCountryCodeID:null,SisLandAreaCode:commonFactory.checkvals(obj.txtSMobileNumber2)?null:commonFactory.checkvals(obj.txtSAreacoude)?obj.txtSAreacoude:null,SisLandNumber:commonFactory.checkvals(obj.txtSMobileNumber2)?obj.txtSMobileNumber2:commonFactory.checkvals(obj.txtSNumber)?obj.txtSNumber:null,SisEmail:obj.txtSEmails,SIsMarried:obj.rdlSIsMarried,SisHusbandName:obj.txtShusName,SisHusbandEducationcategory:null,SisHusbandEducationgroup:null,SisHusbandEducationspecialization:null,SisHusbandEmployedin:null,SisHusbandProfessiongroup:null,SisHusbandProfession:null,SisHusCompanyName:obj.txtShusCompanyName,SisHusJobLocation:obj.txtShusjobloc,SisHusbandMobileCountryCodeID:obj.ddlSHusMobileCountryID,SisHusbandMobileNumber:obj.txtSHusMobileNumber,SisHusbandLandCountryCodeID:commonFactory.checkvals(obj.ddlSHusMobileCountryID2)?obj.ddlSHusMobileCountryID2:commonFactory.checkvals(obj.ddlSHusLandCountryID)?obj.ddlSHusLandCountryID:null,SisHusbandLandAreacode:commonFactory.checkvals(obj.txtSHusMobileNumber2)?null:commonFactory.checkvals(obj.txtSHusLandArea)?obj.txtSHusLandArea:null,SisHusbandLandNumber:commonFactory.checkvals(obj.txtSHusMobileNumber2)?obj.txtSHusMobileNumber2:commonFactory.checkvals(obj.txtSHusLandNumber)?obj.txtSHusLandNumber:null,SisHusbandFatherSurName:obj.txtHusbandFatherSurName,SisHusbandFatherName:obj.txtHusbandFatherName,SisSibilingCustfamilyID:model.sisObj.SibilingCustfamilyID,siseducationdetails:obj.txtsisEducation,sisprofessiondetails:obj.txtsisProfession,sisspouseeducationdetails:obj.txtHusbandEducation,sisspouseprofessiondetails:obj.txtHusbandProfession,SisSpouseFatherCountryID:"1",SisSpouseFatherStateID:obj.ddlSisSpouceFatherState,SisSpouseFatherDitrictID:obj.ddlSisSpouceFatherDistrict,SisSpouseFatherNativePlace:obj.txtSisSpouceFatherCity,SisSpouseEmail:obj.txtHusbandEmail,SibilingSpouseFatherCasteID:obj.ddlsisterspusefathercaste,SisProfessionCategoryID:obj.ddlsisprofessionCatgory,SisSpouseProfessionCategoryID:obj.ddlsisSpouseprofessionCatgory},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.submitPromise=editSibblingService.submitSibSisData(model.sibSisData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.sibPageload(custID),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)}))},model.init()}angular.module("KaakateeyaEmpEdit").factory("editSibblingModel",factory),factory.$inject=["editSibblingService","authSvc","alert","commonFactory","$uibModal","SelectBindService"]}(angular),function(angular){"use strict";function factory(http){return{getSibblingeData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getsiblingsDetailsDisplay",{params:{CustID:obj}})},submitSibBroData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerSibBrotherUpdatedetails",JSON.stringify(obj1))},submitSibSisData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/CustomerSibSisterUpdatedetails",JSON.stringify(obj1))},submitSibCountsData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/UpdateSibblingCounts",JSON.stringify(obj1))},allowblockWebusers:function(custid){return http.get(editviewapp.apipath+"StaticPages/getRegisteredBranchStatus",{params:{StrCustID:custid}})}}}angular.module("KaakateeyaEmpEdit").factory("editSibblingService",factory),factory.$inject=["$http"]}(angular);
 (function(angular) {
     'use strict';

     function controller(editSpouseModel, scope) {
         /* jshint validthis:true */
         var vm = this;
         vm.init = function() {
             vm.model = editSpouseModel;
             vm.model.scope = scope;
         };

         vm.init();
     }
     angular
         .module('KaakateeyaEmpEdit')
         .controller('editSpouseCtrl', controller)

     controller.$inject = ['editSpouseModel', '$scope'];
 })(angular);
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
        model.childCount = 0;

        model.init = function() {
            model.pageload();
            return model;
        };

        model.pageload = function() {
            editSpouseService.getSpouseData(custID).then(function(response) {
                if (response.data.length > 0) {
                    model.spouseArray = response.data[0].length > 0 ? JSON.parse(response.data[0]) : [];
                    model.ChildArray = response.data[1].length > 0 ? JSON.parse(response.data[1]) : [];
                    model.childCount = response.data !== undefined && response.data[0].length > 0 && response.data[0].NoOfChildrens !== null ? (JSON.parse(response.data[0]))[0].NoOfChildrens : [];

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
                        model.childObj.txtdobchild = commonFactory.convertDateFormat(item.ChildDOB, 'DD-MM-YYYY');
                        model.childObj.rbtChildstayingWith = item.ChildStayingWithID;
                        model.childObj.ddlrelation = item.ChildStayingWithRelation;
                        commonFactory.open('spouseChildContent.html', model.scope, uibModal);

                    } else if (model.childCount !== undefined && model.childCount !== null &&
                        model.childCount !== 0 && model.ChildArray.length < model.childCount) {

                        commonFactory.open('spouseChildContent.html', model.scope, uibModal);
                    } else {
                        alertss.timeoutoldalerts(model.scope, 'alert-danger', 'cannot add more children', 4500);
                    }
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
            model.childCount = obj.ddlspousechidrens;

            editSpouseService.submitSpouseData(model.SpouseData).then(function(response) {
                console.log(response);
                commonFactory.closepopup();
                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }

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
                if (response.data === 1) {
                    model.pageload();
                    alertss.timeoutoldalerts(model.scope, 'alert-success', 'submitted Succesfully', 4500);
                } else {
                    alertss.timeoutoldalerts(model.scope, 'alert-danger', 'Updation failed', 4500);
                }
            });


        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editSpouseModel', factory)

    factory.$inject = ['editSpouseService', 'authSvc', 'alert', 'commonFactory', '$uibModal', '$filter'];

})(angular);
(function(angular) {
    'use strict';

    function factory(http) {
        return {
            getSpouseData: function(obj) {
                return http.get(editviewapp.apipath + 'CustomerPersonal/getCustomerPersonalSpouse_Details', { params: { CustID: obj } });
            },
            submitSpouseData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/UpdateSpoucedetails_Customersetails', JSON.stringify(obj1));
            },
            submitChildeData: function(obj1) {
                return http.post(editviewapp.apipath + 'CustomerPersonalUpdate/UpdateSpouseChildDetails', JSON.stringify(obj1));
            }
        };
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('editSpouseService', factory)

    factory.$inject = ['$http'];
})(angular);
!function(angular){"use strict";function controller(editSpouseModel,scope){var vm=this;vm.init=function(){vm.model=editSpouseModel,vm.model.scope=scope},vm.init()}angular.module("KaakateeyaEmpEdit").controller("editSpouseCtrl",controller),controller.$inject=["editSpouseModel","$scope"]}(angular),function(angular){"use strict";function factory(editSpouseService,authSvc,alertss,commonFactory,uibModal,filter){var model={};model.scope={};var logincustid=authSvc.getCustId(),custID=void 0!==logincustid&&null!==logincustid&&""!==logincustid?logincustid:null;return model.spouseArray=[],model.ChildArray=[],model.spouObj={},model.childObj={},model.noofChldrenAray=commonFactory.numbersBind("",0,10),model.childCount=0,model.init=function(){return model.pageload(),model},model.pageload=function(){editSpouseService.getSpouseData(custID).then(function(response){response.data.length>0&&(model.spouseArray=response.data[0].length>0?JSON.parse(response.data[0]):[],model.ChildArray=response.data[1].length>0?JSON.parse(response.data[1]):[],model.childCount=void 0!==response.data&&response.data[0].length>0&&null!==response.data[0].NoOfChildrens?JSON.parse(response.data[0])[0].NoOfChildrens:[],console.log(model.spouseArray),console.log(model.ChildArray))})},model.populatepopup=function(type,item){switch(type){case"Spouse":model.spouObj.Cust_Spouse_ID=null,model.spouObj={},void 0!==item&&(model.spouObj.Cust_Spouse_ID=item.Cust_Spouse_ID,model.spouObj.txtSpousename=item.NAME,model.spouObj.txtSpoueEducation=item.EducationDetails,model.spouObj.txtspouseProfession=item.ProfessionDetails,model.spouObj.txtHouseFlatnumber=item.HouseFlatNumberID,model.spouObj.txtApartmentname=item.AppartmentName,model.spouObj.txtStreetname=item.StreetName,model.spouObj.txtAreaname=item.AreaName,model.spouObj.txtLandmark=item.LandMark,model.spouObj.ddlspouseCountry=item.Country,model.spouObj.ddlspouseState=item.STATE,model.spouObj.ddlspouseDistrict=item.District,model.spouObj.ddlspouseCity=item.City,model.spouObj.txtspouseZip=item.Zip,model.spouObj.txtMarriedon=item.MarriageDate,model.spouObj.txtSeparateddate=item.SeperatedDate,model.spouObj.rbtspousediverse=item.LeagallyDivorceID,model.spouObj.txtLegalDivorsedate=item.DateofLegallDivorce,model.spouObj.txtspousefather=item.FatherFirstName,model.spouObj.txtspouselastname=item.FatherLastName,model.spouObj.txtpreviousmarriage=item.ReasonforDivorce,model.spouObj.rbtnspousefamily=item.MyFamilyPlanningID,model.spouObj.ddlspousechidrens=item.NoOfChildrens),commonFactory.open("SpouseContent.html",model.scope,uibModal);break;case"Child":model.childObj.Cust_Children_ID=null,model.childObj={},void 0!==item?(model.childObj.Cust_Children_ID=item.Cust_Children_ID,model.childObj.txtchildname=item.ChildName,model.childObj.rdlgenderchild=item.ChildGender,model.childObj.txtdobchild=commonFactory.convertDateFormat(item.ChildDOB,"DD-MM-YYYY"),model.childObj.rbtChildstayingWith=item.ChildStayingWithID,model.childObj.ddlrelation=item.ChildStayingWithRelation,commonFactory.open("spouseChildContent.html",model.scope,uibModal)):void 0!==model.childCount&&null!==model.childCount&&0!==model.childCount&&model.ChildArray.length<model.childCount?commonFactory.open("spouseChildContent.html",model.scope,uibModal):alertss.timeoutoldalerts(model.scope,"alert-danger","cannot add more children",4500)}},model.cancel=function(){commonFactory.closepopup()},model.spouseSubmit=function(obj){model.SpouseData={GetDetails:{CustID:custID,NAME:obj.txtSpousename,Education:obj.txtSpoueEducation,Profession:obj.txtspouseProfession,HouseFlatnumber:obj.txtHouseFlatnumber,Apartmentname:obj.txtApartmentname,Streetname:obj.txtStreetname,Areaname:obj.txtAreaname,Landmark:obj.txtLandmark,Country:obj.ddlspouseCountry,STATE:obj.ddlspouseState,District:obj.ddlspouseDistrict,City:obj.ddlspouseCity,Zip:obj.txtspouseZip,Marriedon:""!==obj.txtMarriedon&&"Invalid date"!==obj.txtMarriedon?filter("date")(obj.txtMarriedon,"yyyy-MM-dd"):null,Separateddate:""!==obj.txtSeparateddate&&"Invalid date"!==obj.txtSeparateddate?filter("date")(obj.txtSeparateddate,"yyyy-MM-dd"):null,Legallydivorced:obj.rbtspousediverse,Dateoflegaldivorce:""!==obj.txtLegalDivorsedate&&"Invalid date"!==obj.txtLegalDivorsedate?filter("date")(obj.txtLegalDivorsedate,"yyyy-MM-dd"):null,Uploaddivorcedocument:null,Fatherfirstname:obj.txtspousefather,Fatherlastname:obj.txtspouselastname,Notesaboutpreviousmarriage:obj.txtpreviousmarriage,Familyplanning:obj.rbtnspousefamily,Noofchildren:obj.ddlspousechidrens,Cust_Spouse_ID:model.spouObj.Cust_Spouse_ID},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},model.childCount=obj.ddlspousechidrens,editSpouseService.submitSpouseData(model.SpouseData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.pageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})},model.childSubmit=function(obj){model.childData={GetDetails:{CustID:custID,Nameofthechild:obj.txtchildname,Genderofthechild:obj.rdlgenderchild,DOB:""!==obj.txtdobchild&&"Invalid date"!==obj.txtdobchild?filter("date")(obj.txtdobchild,"yyyy-MM-dd"):null,Childstayingwith:obj.rbtChildstayingWith,Childstayingwithrelation:obj.ddlrelation,Cust_Children_ID:model.childObj.Cust_Children_ID},customerpersonaldetails:{intCusID:custID,EmpID:null,Admin:null}},editSpouseService.submitChildeData(model.childData).then(function(response){console.log(response),commonFactory.closepopup(),1===response.data?(model.pageload(),alertss.timeoutoldalerts(model.scope,"alert-success","submitted Succesfully",4500)):alertss.timeoutoldalerts(model.scope,"alert-danger","Updation failed",4500)})},model.init()}angular.module("KaakateeyaEmpEdit").factory("editSpouseModel",factory),factory.$inject=["editSpouseService","authSvc","alert","commonFactory","$uibModal","$filter"]}(angular),function(angular){"use strict";function factory(http){return{getSpouseData:function(obj){return http.get(editviewapp.apipath+"CustomerPersonal/getCustomerPersonalSpouse_Details",{params:{CustID:obj}})},submitSpouseData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/UpdateSpoucedetails_Customersetails",JSON.stringify(obj1))},submitChildeData:function(obj1){return http.post(editviewapp.apipath+"CustomerPersonalUpdate/UpdateSpouseChildDetails",JSON.stringify(obj1))}}}angular.module("KaakateeyaEmpEdit").factory("editSpouseService",factory),factory.$inject=["$http"]}(angular);
angular.module('KaakateeyaEmpEdit').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('index.html',
    "<!DOCTYPE html>\r" +
    "\n" +
    "<html lang=\"en\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "<head>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Meta, title, CSS, favicons, etc. -->\r" +
    "\n" +
    "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\r" +
    "\n" +
    "    <title>Kaakateeya Marriages</title>\r" +
    "\n" +
    "    <meta charset=\"utf-8\">\r" +
    "\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r" +
    "\n" +
    "    <base href=\"/\">\r" +
    "\n" +
    "    <meta name=\"description\" content=\"ACME Inc.\">\r" +
    "\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Bootstrap -->\r" +
    "\n" +
    "    <link href=\"node_modules/bootstrap/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\r" +
    "\n" +
    "    <!-- Font Awesome -->\r" +
    "\n" +
    "    <link href=\"node_modules/font-awesome/css/font-awesome.min.css\" rel=\"stylesheet\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <link href=\"build/css/custom.min.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "    <link href=\"node_modules/angular-material/angular-material.min.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "    <link href=\"node_modules/bootstrap-multiselect/dist/css/bootstrap-multiselect.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <link href=\"bower_components/angular-loading-bar/build/loading-bar.min.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "    <link href=\"css/scss/mainstyles.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "    <link href=\"stylesreg.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <link href=\"build/css/custom_styles.css\" rel=\"stylesheet\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <style>\r" +
    "\n" +
    "        .edit_pages_content_main {\r" +
    "\n" +
    "            width: 80%;\r" +
    "\n" +
    "        }\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        .nav-sm .container.body .right_col {\r" +
    "\n" +
    "            padding: 0px;\r" +
    "\n" +
    "        }\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        .nodatacls {\r" +
    "\n" +
    "            color: maroon;\r" +
    "\n" +
    "            font-size: 13px;\r" +
    "\n" +
    "            margin-top: 12px;\r" +
    "\n" +
    "        }\r" +
    "\n" +
    "    </style>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</head>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<body class=\"nav-sm\" ng-app=\"KaakateeyaEmpEdit\" ui-router-styles>\r" +
    "\n" +
    "    <div class=\"container body\">\r" +
    "\n" +
    "        <div class=\"main_container\">\r" +
    "\n" +
    "            <div class=\"edit_pages_sidebar clearfix\" ng-controller=\"baseCtrl\">\r" +
    "\n" +
    "                <div class=\"edit_page_profile_pic\">\r" +
    "\n" +
    "                    <img id=\"imgphoto\" ng-src=\"{{model.PersonalObj.ProfilePic}}\">\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" style=\"font-weight: bold;\" ng-click=\"model.photorequestAndshow();\"> {{model.PersonalObj.ProfilePic.indexOf('Fnoimage.jpg')!==-1 || model.PersonalObj.ProfilePic.indexOf('Mnoimage.jpg')!==-1?'Photo Request':'View Photo' }}         </a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"edit_pages_sidebar_profile_details\">\r" +
    "\n" +
    "                    <h6>\r" +
    "\n" +
    "                        <span>{{model.PersonalObj.Name+\" (\"+model.PersonalObj.ProfileID+\")\"}}</span></h6>\r" +
    "\n" +
    "                    <div class=\"edit_pages_sidebar_profile_details_in\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <p>\r" +
    "\n" +
    "                            <span>{{model.PersonalObj.MartialStatus+\" ,\"+model.PersonalObj.DateofBirth+((model.PersonalObj.Age!=\"\" && model.PersonalObj.Age!=null)?\" (\"+model.PersonalObj.Age+\")\":model.PersonalObj.Age)+((model.PersonalObj.Height!=\"\" && model.PersonalObj.Height!=null)?\" ,\"+model.PersonalObj.Height:model.PersonalObj.Height)+((model.PersonalObj.Complexion!=\"\")?\" ,\"+model.PersonalObj.Complexion:model.PersonalObj.Complexion)}}</span>\r" +
    "\n" +
    "                        </p>\r" +
    "\n" +
    "                        <p>\r" +
    "\n" +
    "                            <span>{{model.PersonalObj.Religion+\" ,\"+model.PersonalObj.Mothertongue+\", \"+model.PersonalObj.Caste+((model.PersonalObj.SubCaste!=\"\" && model.PersonalObj.SubCaste!=null)? \" (\"+SubCaste+\")\":SubCaste)}}</span>\r" +
    "\n" +
    "                        </p>\r" +
    "\n" +
    "                        <p>\r" +
    "\n" +
    "                            <span>\r" +
    "\n" +
    "                <span  style=\"font-weight:bold;\"> {{(model.PersonalObj.Borncountry!=null && model.PersonalObj.Borncountry!=\"\")?\" Born Citizen:\"+model.PersonalObj.Borncountry:Borncountry}}</span>\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"clear\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"edit_pages_sidebar_menu clearfix\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnkeducationandprof\" href=\"Education\" ng-style=\"{color:model.lnkeducationandprofReview==true?'Red':''}\">Education & Profession\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iCustomerPersonalDetails===0?'NoData':''}}</span>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a href=\"ManagePhoto\">Manage Photo\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iManagePhoto===0?'NoPhoto':''}}</span></a></a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a href=\"Parent\" ng-style=\"{color:model.lnkparentsReview==true?'Red':''}\">Parent Details\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iParentDetails===0?'NoData':''}}</span>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnkpartner\" href=\"Partnerpreference\" ng-style=\"{color:model.lnkpartnerReview==true?'Red':''}\">Partner Preferences\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iPartnerPreference===0?'NoData':''}}</span>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnksiblings\" href=\"Sibbling\" ng-style=\"{color:model.lnksiblingsReview==true?'Red':''}\">Sibling Details\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iSiblingDetails===0?'NoData':''}}</span>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnkastro\" href=\"Astro\" ng-style=\"{color:model.lnkastroReview==true?'Red':''}\">Astro Details\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iAstroDetails===0?'NoData':''}}</span>\r" +
    "\n" +
    "                                \r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnkproperty\" href=\"Property\" ng-style=\"{color:model.lnkpropertyReview==true?'Red':''}\">Property Details\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                 <span class=\"pull-right nodatacls\"> {{model.rev.iPropertyDetails===0?'NoData':''}}</span>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnkrelatives\" href=\"Relative\" ng-style=\"{color:model.lnkrelativesReview==true?'Red':''}\">Relative Details</a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a id=\"lnkreference\" href=\"Reference\" ng-style=\"{color:model.lnkreferenceReview==true?'Red':''}\">References\r" +
    "\n" +
    "                                <span class=\"pull-right nodatacls\"> {{model.rev.iReferenceDetails===0?'NoData':''}}</span>\r" +
    "\n" +
    "                                </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a href=\"Spouse\" ng-style=\"{color:model.lnkreferenceReview==true?'Red':''}\">Spouse Details\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a href=\"Contact\" ng-style=\"{color:model.lnkreferenceReview==true?'Red':''}\">Contact Details\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a href=\"OfcePurpose\" ng-style=\"{color:model.lnkreferenceReview==true?'Red':''}\">Office Purpose\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <a href=\"ProfileSetting\" ng-style=\"{color:model.lnkreferenceReview==true?'Red':''}\">Profile Settings\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ui-view=\"lazyLoadView\" class=\"right_col\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- jQuery -->\r" +
    "\n" +
    "    <script src=\"node_modules/jquery/dist/jquery.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/bootstrap/dist/js/bootstrap.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular/angular.min.js\"></script>\r" +
    "\n" +
    "    <script type=\"text/javascript\" src=\"node_modules/oclazyload/dist/ocLazyLoad.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-ui-router/release/angular-ui-router.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/underscore/underscore-min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/bootstrap-multiselect/dist/js/bootstrap-multiselect.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/ng-idle/angular-idle.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/angular-loading-bar/build/loading-bar.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/angular-animate/angular-animate.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-module-sanitize/angular-sanitize.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-animate/angular-animate.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/toastr/toastr.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-aria/angular-aria.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-messages/angular-messages.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-material/angular-material.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/editandview/dist/js/main.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-password/angular-password.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/angular-material-icons/angular-material-icons.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules/moment/min/moment.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/angular-auto-validate/dist/jcs-auto-validate.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"bower_components/angular-promise-buttons/dist/angular-promise-buttons.min.js\"></script>\r" +
    "\n" +
    "    <script src=\"node_modules\\registration\\dist\\js\\main.min.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"index.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"commonpage.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <!--<script src=\"directives\\dynamicSlideshow.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"directives\\photosSlideshowService.js\" type=\"text/javascript\"></script>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"https://rawgithub.com/eligrey/FileSaver.js/master/FileSaver.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"build/js/custom.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!--<script src=\"common/controllers/LoaderCtrl.js\" type=\"text/javascript\"></script>-->\r" +
    "\n" +
    "    <script src=\"common/services/errorInterceptor.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <!--<script src=\"common\\services\\route.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"directives\\testingslide.js\" type=\"text/javascript\"></script>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"common/directives/multiSelectDirective.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/constants/arrayBindConstatns.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/services/selectBindServices.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/services/authSvc.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/directives/commonFactory.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/directives/editFooter.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/directives/contactDirecrive.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/directives/countryDirective.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"common/model/countryArrayModel.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"base/controller/basectrl.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"base/model/baseMdl.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"base/service/baseservice.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"common/model/eduprofArrayModel.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/model/otherArrayModel.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "    <script src=\"common/directives/dynamicAlets.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script src=\"common/directives/pageReviewDirective.js\" type=\"text/javascript\"></script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "</body>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</html>"
  );


  $templateCache.put('app/editAstro/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Astro details'\" sectionid=\"'23'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"divlnkasro\" class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Astro Details </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div ng-if=\"page.model.AstroArr.length==0\" cssclass=\"edit_page_add_button\">\r" +
    "\n" +
    "                    <a ng-click=\"page.model.populateAstro();\" class=\"edit_page_add_button\" href=\"javascript:void(0);\">Add</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\" ng-repeat=\"item in page.model.AstroArr track by $index\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.TimeOfBirth===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"TimeofBirth\" style=\"font-weight:bold;\">Time of Birth</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblTimeofBirth\">{{item.TimeOfBirth}}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"PlaceofBirth\" style=\"font-weight:bold;\">Place of Birth</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblPlaceofBirth\">{{ item.CityOfBirth +\",\"+item.DistrictOfBirth+\",\"+item.StateOfBirth+\",\"+item.CountryOfBirth}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.TypeofStar===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Telugustar\" style=\"font-weight:bold;\">Star Language</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblTelugustar\">{{ item.TypeofStar+((item.StarName!=\"\" &&  item.StarName!=null)?\" - \"+\r" +
    "\n" +
    "                                            item.StarName:\"\")+((item.Paadam!=\"\" &&  item.Paadam!=null)?\" (\"+item.Paadam+\")\":\"\") }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.Rassi===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"raasimoonsign\" style=\"font-weight:bold;\">Raasi/moon sign</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblraasimoonsign\">{{ item.Rassi}}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.Lagnam===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Lagnam\" style=\"font-weight:bold;\">Lagnam</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblLagnam\">  {{ item.Lagnam }}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.Gothram===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"GothramGotra\" style=\"font-weight:bold;\">Gothram/Gotra</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblGothramGotra\">  {{ item.Gothram}}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.MeternalGothramID===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"MaternalGothram\" style=\"font-weight:bold;\">Maternal Gothram</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblMaternalGothram\">{{ item.MeternalGothramID }}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-hide=\"item.manglikkujadosham===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"manglikkujadosham\" style=\"font-weight:bold;\">manglik/kuja dosham</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblmanglikkujadosham\">{{ item.manglikkujadosham }}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.AstroArr.length>0\">\r" +
    "\n" +
    "                    <a ng-click=\"page.model.populateAstro(item);\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\">Edit</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <br>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_details_item_desc clearfix\" style=\"padding: 0 0 0 20px;\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"radio-group-my input-group\" ng-show=\"page.model.ImageUrl==='' || page.model.ImageUrl===null\">\r" +
    "\n" +
    "            <md-radio-group ng-required=\"true\" name=\"rdlUploadGenerate\" layout=\"row\" ng-model=\"page.model.atroObj.rdlUploadGenerate\" ng-change=\"page.model.uploadGenerateHoro(page.model.atroObj.rdlUploadGenerate);\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                <md-radio-button value=\"0\">Upload Horoscope</md-radio-button>\r" +
    "\n" +
    "                <md-radio-button value=\"1\"> Generate Horoscope </md-radio-button>\r" +
    "\n" +
    "            </md-radio-group>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-hide=\"page.model.ImageUrl==='' || page.model.ImageUrl===null\">\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                <img ng-model=\"page.model.imghoroName\" ng-src=\"{{page.model.ImageUrl}}\" Style=\"width: 250px; height: 250px;\" ng-show=\"!page.model.iframeShow\" />\r" +
    "\n" +
    "                <iframe border=\"0\" id=\"iframe\" frameborder=\"0\" height=\"300\" width=\"800\" ng-show=\"page.model.iframeShow\"></iframe>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item_desc clearfix\" style=\"padding: 0 0 0 20px;\">\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix  pull-left\">\r" +
    "\n" +
    "                <a ID=\"btndeletehoro\" class=\"edit_page_del_button\" href=\"javascript:void(0);\" ng-click=\"page.model.shoedeletePopup();\" data-placement=\"bottom\" data-toggle=\"tooltip\" data-original-title=\"Delete Astro Details\">\r" +
    "\n" +
    "               Delete <ng-md-icon icon=\"delete\" style=\"fill:#665454\" size=\"18\">Delete</ng-md-icon></a>\r" +
    "\n" +
    "                <a Style=\"padding-left: 100px;\" class=\"btn btn-link\" ng-click=\"page.model.vewHoro();\">View<span class=\"glyphicon glyphicon-eye-open\"></span></a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"astroContent.html\">\r" +
    "\n" +
    "    <form name=\"astroForm\" novalidate role=\"form\" ng-submit=\"page.model.astroSubmit(page.model.atroObj);\" accessible-form>\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Astro details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul id=\"ulastro\">\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lbltimebirth\" class=\"pop_label_left\">Time of Birth<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my select-box-my-trible select-box-my-trible3 input-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlFromHours\" ng-options=\"item.value as item.label for item in page.model.hrsbindArr\" required></select>\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlFromMinutes\" ng-options=\"item.value as item.label for item in page.model.minbindArr\" required></select>\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlFromSeconds\" ng-options=\"item.value as item.label for item in page.model.secbindArr\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <country-directive require=\"true\" countryshow=\"true\" cityshow=\"true\" othercity=\"false\" dcountry=\"page.model.atroObj.ddlCountryOfBirthID\" dstate=\"page.model.atroObj.ddlStateOfBirthID\" ddistrict=\"page.model.atroObj.ddlDistrictOfBirthID\" dcity=\"page.model.atroObj.ddlcity\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblstarlan\" class=\"pop_label_left\">Star language</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlstarlanguage\" typeofdata=\"'starLanguage'\" ng-change=\"page.model.changeBind('star',page.model.atroObj.ddlstarlanguage);\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblstar\" class=\"pop_label_left\">Star</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlstar\" ng-options=\"item.value as item.label for item in page.model.starArr\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblpaadam\" class=\"pop_label_left\">Paadam</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlpaadam\" typeofdata=\"'paadam'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblLagnam\" class=\"pop_label_left\">Lagnam</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlLagnam\" typeofdata=\"'lagnam'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblRaasiMoonsign\" class=\"pop_label_left\">Raasi/Moon sign</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddlRaasiMoonsign\" typeofdata=\"'ZodaicSign'\"></select>\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblGothramGotra\" class=\"pop_label_left\">Gothram/Gotra</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.atroObj.txtGothramGotra\" class=\"form-control\" tabindex=\"13\" maxlength=\"100\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblMaternalgothram\" class=\"pop_label_left\">Maternal gothram</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.atroObj.txtMaternalgothram\" class=\"form-control\" tabindex=\"14\" maxlength=\"100\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblManglikKujadosham\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Manglik/Kuja dosham</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group name=\"rdlkujaDosham\" layout=\"row\" ng-model=\"page.model.atroObj.rdlkujaDosham\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"0\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"1\"> No </md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"2\"> Dont't Know </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" style=\"display: none;\">\r" +
    "\n" +
    "                    <label for=\"lbllongitude\" class=\"pop_label_left\">Place of birth longitude</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input id=\"txtlogitude\" class=\"form-control\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddllongitude\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" style=\"display: none;\">\r" +
    "\n" +
    "                    <label for=\"lbllatitude\" class=\"pop_label_left\">Place of birth latitude</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input id=\"txtlatitude\" class=\"form-control col-lg-3\" />\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.atroObj.ddllatitude\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" style=\"display: none;\">\r" +
    "\n" +
    "                    <label for=\"lbllatitude\">Place of birth latitude</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-model=\"page.model.atroObj.Chkgenertehoro\" value=\"Generate HoroScope\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"AddHoroPopup.html\">\r" +
    "\n" +
    "    <form name=\"uploadForm\" novalidate role=\"form\" ng-submit=\"page.model.upload(up);\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Upload Horoscope </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "            <label class=\"control-label\">Use this file formats like gif, jpeg, png,jpg</label>\r" +
    "\n" +
    "            <br>\r" +
    "\n" +
    "            <ul id=\"ulprofession\">\r" +
    "\n" +
    "                <input type=\"file\" file-model=\"up.myFile\" />\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-footer\">\r" +
    "\n" +
    "            <input value=\"Cancel\" class=\"button_custom button_custom_reset\" ng-click=\"page.model.cancel();\" type=\"button\">\r" +
    "\n" +
    "            <input value=\"Upload\" class=\"button_custom\" type=\"submit\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"deletehoroPopup.html\">\r" +
    "\n" +
    "    <form name=\"uploadForm\" novalidate role=\"form\" ng-submit=\"page.model.deleteHoroImage();\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Delete Horoscope </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "            <div class=\"text-center\">Are you sure to delete horoscope?</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-footer\">\r" +
    "\n" +
    "            <input value=\"Close\" class=\"button_custom button_custom_reset\" ng-click=\"page.model.cancel();\" type=\"button\">\r" +
    "\n" +
    "            <input value=\"Delete\" class=\"button_custom\" type=\"submit\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"AstroCityPopup.html\">\r" +
    "\n" +
    "    <div class=\"modal-header alert alert-danger\" id=\"div2\">\r" +
    "\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"page.model.cancel();\">&times;</button>\r" +
    "\n" +
    "        <h4 class=\"modal-title\">\r" +
    "\n" +
    "            <span id=\"lblcityheader\">we are unable to genearte horoscope with your given city <b style=\"color: green\"> Administrative Buildings </b>,so please select Nearest city to your place of birth</span>\r" +
    "\n" +
    "        </h4>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-body\" id=\"modalbodyIDnew\">\r" +
    "\n" +
    "        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "            <select multiselectdropdown ng-model=\"page.model.ddlAstrocity\" ng-options=\"item.value as item.label for item in page.model.AstrocityArr\" ng-change=\"page.model.AstroCityChange(page.model.ddlAstrocity);\"></select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-footer\">\r" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"page.model.cancel();\">Close</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"AstroimagePopup.html\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"modal-header\">\r" +
    "\n" +
    "        <h3 class=\"modal-title text-center\" id=\"modal-title\">Horoscope\r" +
    "\n" +
    "            <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\"></ng-md-icon>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </h3>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "        <img ng-src=\"{{page.model.ImageUrl}}\" style=\"width:500px;height:500px;\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-footer\">\r" +
    "\n" +
    "        <div class=\"pull-right\">\r" +
    "\n" +
    "            <input value=\"Cancel\" class=\"button_custom button_custom_reset  pull-right\" ng-click=\"page.model.cancel();\" type=\"button\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"RefreshPopup.html\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"modal-body clearfix\" id=\"modal-body\">\r" +
    "\n" +
    "        <button ng-click=\"page.model.generatedhoroS3Upload();\" class=\"btn btn-success center-block\">Refresh Page<span class=\"fa fa-refresh\"></span></button>&nbsp;&nbsp;\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('app/editContact/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <div ID=\"updatevvv\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <h4>Candidate Contact details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                    <span style=\"color: #08CFD2;\">RelationName :Mobile :{{page.model.primaryRel.PrimaryMobileRelName}} & Email :{{page.model.primaryRel.PrimaryEmailRelName}}</span></h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ID=\"updatecabndidatecontactDetails\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" class=\"edit_page_add_button\" ng-click=\"page.model.showContactPopup('Candidate');\">Add\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ng-repeat=\"item in page.model.candidateContactArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"reviewdiv\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                    <div ID=\"updatecandMoblie\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span ID=\"candMoblie\" Font-Bold=\"true\">Moblie #</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span ID=\"lblcandMoblie\">{{item.CandidateMobilewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label ng-show=\"(item.primarymobile===1)|| (item.mobileisverfied) ?true:false \">\r" +
    "\n" +
    "    <span  ng-class=\"item.mobileisverfied==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\">\r" +
    "\n" +
    "    </span></label>\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" ng-show=\"(item.primarymobile)&&(((item.mobileisverfied))==true?false:true) ?true:false\" ng-click=\"page.model.sendMobileCode(item.Candidatemobilecountrycode,item.Candidatemobilecountrycode,item.CandidateMobileNumber,item.emaILcust_family_id);\"> &nbsp;&nbsp;&nbsp;&nbsp;verify mobile</a>                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" ng-click=\"page.model.setprimaryrelationPopup();\">RelationName</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanellnkcandmobilesedit\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showContactPopup('Candidate',item);\">Edit\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelcandidatelandnum\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"candidatelandnum\" Font-Bold=\"true\">Land line #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblcandidatelandnum\">{{item.Candidatelandlinewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primarylandline==1)|| (item.Landisverfied) ?true:false\">\r" +
    "\n" +
    "     <span  ng-class=\"(item.Landisverfied)==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"  style=\"color:#00FF00;\"></span>\r" +
    "\n" +
    " </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelcandidateemail\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"candidateemail\" Font-Bold=\"true\">Email</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblcandidateemail\">{{item.CandidateEmail}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primaryemail || item.isemailVerified) ?true:false\">\r" +
    "\n" +
    "    <span  ng-class=\"item.isemailVerified==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"></span>\r" +
    "\n" +
    "</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.primaryemail)&&(((item.isemailVerified))==true?false:true) ?true:false\" ng-click=\"page.model.verifymail();\">verify email</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Candidate Address Details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ID=\"listcontactadressDetails\" ng-repeat=\"item in page.model.candidateAddrArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div1\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelFlatno\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" id=\"flatdiv\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Flatno\" Font-Bold=\"true\">Flat no</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblFlatno\">{{item.Flatno}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanellnkaddresssedit\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showContactPopup('candidateAddr',item);\">Edit\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelApartmentno\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divapartment\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Apartmentno\" Font-Bold=\"true\">Apartment no</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblApartmentno\">{{item.Apartmentno}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelAreaname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divareaname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Areaname\" Font-Bold=\"true\">Area name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblAreaname\">{{item.Areaname}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelStreetnames\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" id=\"streetname\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Streetnamecand\" Font-Bold=\"true\">Street name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblStreetnamecand\">{{item.Streetname}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelLandmark\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" id=\"landmarkdiv\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Landmark\" Font-Bold=\"true\">Landmark</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblLandmark\">{{item.Landmark}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelCountry\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" id=\"CountryNamediv\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Country\" Font-Bold=\"true\">Country</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblfulladdress\">{{item.fulladdress}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Parent Contact Details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div ID=\"UpdatePanelparentcontacts\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ID=\"listparentsinfo\" ng-repeat=\"item in page.model.parentContactArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div2\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelparentcontactsDetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanellnkparentcontactsDetailst\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showContactPopup('parent',item);\">Edit\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelFathername\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Fathername\" Font-Bold=\"true\">{{item.Motheremailreletionship===\"39\"?\"Father Name\":\"Mother Name\"}}</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblFathername\">{{item.NAME}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelfathermobile\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"fathermobile\" Font-Bold=\"true\">Moblie #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblfathermobile\">{{item.Mobilewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primarymobile===1)|| (item.Mothermobileisverfied) ?true:false \">\r" +
    "\n" +
    "    <span  ng-class=\"item.Mothermobileisverfied==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\">\r" +
    "\n" +
    "    </span></label>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.primarymobile)&&(((item.Mothermobileisverfied))==true?false:true) ?true:false\" ng-click=\"page.model.sendMobileCode(item.mobilecountrycode,item.mobilecountrycode,item.mobilenumber,item.MotheremaILcust_family_id);\"> &nbsp;&nbsp;&nbsp;&nbsp;verify mobile</a>                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelfatherland\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"fatherlandnum\" Font-Bold=\"true\">Land line #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblfatherlandnum\">{{item.landlinewithcode}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label ng-show=\"(item.primarylandline==1)|| (item.MotherLandisverfied) ?true:false\">\r" +
    "\n" +
    "     <span  ng-class=\"(item.MotherLandisverfied)==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"  style=\"color:#00FF00;\"></span>\r" +
    "\n" +
    " </label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Email\" Font-Bold=\"true\">Email</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblmotherEmail\">{{item.Email}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.Motherprimaryemail || item.MotherisemailVerified) ?true:false\">\r" +
    "\n" +
    "    <span  ng-class=\"item.MotherisemailVerified==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"></span>\r" +
    "\n" +
    "</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.Motherprimaryemail)&&(((item.MotherisemailVerified))==true?false:true) ?true:false\" ng-click=\"page.model.verifymail();\">verify email</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4>Siblings Contact Details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ID=\"UpdatePanelBrotherContactDetails\">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ID=\"listSiblingsContac\" ng-repeat=\"item in page.model.SiiblingContactArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div3\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelsiblingcontactsDetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanellnksiblingDetailst\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showContactPopup('sibbling',item,'SelfFlag');\">Edit\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelbrothername\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"brothername\" Font-Bold=\"true\">{{(item.Siblingemailreletionship===\"41\" || item.Siblingemailreletionship===\"42\" )?\"Brother Name\":\"Sister Name\"}}</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblbrothername\">{{item.SiblingName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelbrothermobile\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"brothermobile\" Font-Bold=\"true\">Moblie #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblbrothermobile\">{{item.SiblingMobilewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primarymobile===1)|| (item.Siblingmobileisverfied) ?true:false \">\r" +
    "\n" +
    "    <span  ng-class=\"item.Siblingmobileisverfied==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\">\r" +
    "\n" +
    "    </span></label>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.primarymobile)&&(((item.Siblingmobileisverfied))==true?false:true) ?true:false\" ng-click=\"page.model.sendMobileCode(item.Siblingmobilecountrycode,item.Siblingmobilecountrycode,item.Siblingmobilenumber,item.SiblingemaILcust_family_id);\"> &nbsp;&nbsp;&nbsp;&nbsp;verify mobile</a>                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelbrotherland \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span Font-Bold=\"true \">Land line #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span>{{item.Siblinglandlinewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primarylandline==1)|| (item.SiblingLandisverfied) ?true:false\">\r" +
    "\n" +
    "     <span  ng-class=\"(item.SiblingLandisverfied)==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"  style=\"color:#00FF00;\"></span>\r" +
    "\n" +
    " </label>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelbrotherEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"brotherEmail\" Font-Bold=\"true\">Email</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblbrotherEmail\">{{item.SiblingEmail}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.Siblingprimaryemail || item.SiblingisemailVerified) ?true:false\">\r" +
    "\n" +
    "    <span  ng-class=\"item.SiblingisemailVerified==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"></span>\r" +
    "\n" +
    "</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.Siblingprimaryemail)&&(((item.SiblingisemailVerified))==true?false:true) ?true:false\" ng-click=\"page.model.verifymail();\">verify email</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdateEditSpouse \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "                            <div id=\"nowife \">\r" +
    "\n" +
    "                                <div ID=\"updatenowifr \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div ID=\"UpdatePSpouse \" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showContactPopup('sibbling',item,'SpouseFlag');\">Edit\r" +
    "\n" +
    "                                                            </a>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div ID=\"UpdatePanelbrotherwifename \" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <span ID=\"brotherwifename \" Font-Bold=\"true \">{{item.Siblingemailreletionship===41 || item.Siblingemailreletionship==42 ?\"Brother Wife \":\"Sister Husband\"}}</span></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span ID=\"lblbrotherwifename\">{{item.SiblingSpouseNAme}}</span></h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div ID=\"UpdatePanelbrotherwifemobile\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <span ID=\"brotherwifemobilenum\" Font-Bold=\"true\">Moblie #</span></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span ID=\"lblbrotherwifemobilenum\">{{item.SiblingSpouseMobilenumberwithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div ID=\"UpdatePanelbrotherwifeland\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <span ID=\"brotherwifelandnum\" Font-Bold=\"true\">Land line #</span></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span ID=\"lblbrotherwifelandnum\">{{item.SiblingSpouseLandnumberwithcode}}</span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div ID=\"upSpouseEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <span ID=\"SpouseEmail\" Font-Bold=\"true\">Email</span></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span ID=\"lblSpouseEmail\">{{item.SiblingSpouseEmail}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Relative Contact Details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ID=\"listRelativecontacts\" ng-repeat=\"item in page.model.relativeContactArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div4\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelRelativecontactsDetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanellnkFatherBrothercontactsDetailst\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showContactPopup('relative',item);\">Edit\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelFatherBrothername\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"FatherBrothername\" Font-Bold=\"true\">{{item.lblname}}</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblFatherBrothername\">{{item.NAME}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelFatherBrothermobile\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"FatherBrothermobile\" Font-Bold=\"true\">Moblie #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblFatherBrothermobile\">{{item.Mobilewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primarymobile===1)|| (item.mobileisverfied) ?true:false \">\r" +
    "\n" +
    "    <span  ng-class=\"item.mobileisverfied==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\">\r" +
    "\n" +
    "    </span></label>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.primarymobile)&&(((item.mobileisverfied))==true?false:true) ?true:false\" ng-click=\"page.model.sendMobileCode(item.mobilecountrycode,item.mobilecountrycode,item.mobilenumber,item.emaILcust_family_id);\"> &nbsp;&nbsp;&nbsp;&nbsp;verify mobile</a>                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelFatherBrotherland \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"FatherBrotherlandnum \" Font-Bold=\"true \">Land line #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblFatherBrotherlandnum \">{{item.landlinewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primarylandline==1)|| (item.Landisverfied) ?true:false\">\r" +
    "\n" +
    "     <span  ng-class=\"(item.Landisverfied)==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"  style=\"color:#00FF00;\"></span>\r" +
    "\n" +
    " </label>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelFatherBrotherEmail \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"FatherBrotherEmail \" Font-Bold=\"true \">Email</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblFatherBrotherEmail \">{{item.Email}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label ng-show=\"(item.primaryemail || item.isemailVerified) ?true:false\">\r" +
    "\n" +
    "    <span  ng-class=\"item.isemailVerified==true?'glyphicon glyphicon-check':'glyphicon glyphicon-ok'\"></span>\r" +
    "\n" +
    "</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-show=\"(item.primaryemail)&&(((item.isemailVerified))==true?false:true) ?true:false\" ng-click=\"page.model.verifymail();\">verify email</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item \">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix \">\r" +
    "\n" +
    "            <h4>Reference Contact details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix \">\r" +
    "\n" +
    "                <div ID=\"UpdatePanelreference \">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item \">\r" +
    "\n" +
    "            <div ID=\"listreference\" ng-repeat=\"item in page.model.referenceContactArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div5 \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelreferencername \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"referencename \" Font-Bold=\"true \">Name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblreferencename \">{{item.CandidateName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"updatereferenceMoblie \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span ID=\"referenceMoblie \" Font-Bold=\"true \">Moblie #</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span ID=\"lblreferenceMoblie \">{{item.CandidateMobilewithcode}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanellnkreferencemobilesedit \" class=\"edit_page_item_ui clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showContactPopup('reference',item);\">Edit\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelreferencelandnum \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"referencelandnum \" Font-Bold=\"true \">Land line #</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblreferencelandnum \">{{item.Candidatelandlinewithcode}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ID=\"UpdatePanelreferenceemail \" class=\"edit_page_details_item_desc clearfix \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"referenceemail \" Font-Bold=\"true \">Email</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblreferenceemail \">{{item.CandidateEmail}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"SibContactContent.html\">\r" +
    "\n" +
    "    <form name=\"sibForm\" novalidate role=\"form\" ng-submit=\"page.model.commonContactSubmit(page.model.sibobj.SiblingemaILcust_family_id,page.model.sibobj.txtsiblingname,\r" +
    "\n" +
    "    page.model.sibobj.ddlSiblingmob,page.model.sibobj.txtSiblingmob,page.model.sibobj.ddlsiblingmob2,page.model.sibobj.txtsiblingmob2,page.model.sibobj.ddlsiblinglandcode,\r" +
    "\n" +
    "    page.model.sibobj.txtsiblinglandarea,page.model.sibobj.txtsiblinglandnumber,page.model.sibobj.txtsiblinglemail,page.model.sibFlag)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Siblings Contact Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblsiblingname\" class=\"pop_label_left\">Name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.sibobj.txtsiblingname\" class=\"form-control\" readonly=\"true\" tabindex=\"1\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.sibobj.ddlSiblingmob\" strmobile=\"page.model.sibobj.txtSiblingmob\" dalternative=\"page.model.sibobj.ddlsiblingmob2\" stralternative=\"page.model.sibobj.txtsiblingmob2\" dland=\"page.model.sibobj.ddlsiblinglandcode\"\r" +
    "\n" +
    "                    strareacode=\"page.model.sibobj.txtsiblinglandarea\" strland=\"page.model.sibobj.txtsiblinglandnumber\" strmail=\"page.model.sibobj.txtsiblinglemail\"></contact-directive>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"parentContactContent.html\">\r" +
    "\n" +
    "    <form name=\"parentForm\" novalidate role=\"form\" ng-submit=\"page.model.commonContactSubmit(page.model.parentobj.MotheremaILcust_family_id,\r" +
    "\n" +
    "    page.model.parentobj.txtFathername,page.model.parentobj.ddlcandidatefathermobcode,page.model.parentobj.txtcandidatefathermob,page.model.parentobj.ddlcandidatefathermob2code,\r" +
    "\n" +
    "    page.model.parentobj.txtcandidatefathermob2,page.model.parentobj.ddlcandidatefathelandcode,page.model.parentobj.txtcandidatefathelandareacode\r" +
    "\n" +
    "    ,page.model.parentobj.txtcandidatefathelandnumber,page.model.parentobj.txtcandidatefatheremail,'Parent')\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Parent contact details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblFathername\" class=\"pop_label_left\">Name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.parentobj.txtFathername\" class=\"form-control\" readonly=\"true\" tabindex=\"1\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.parentobj.ddlcandidatefathermobcode\" strmobile=\"page.model.parentobj.txtcandidatefathermob\" dalternative=\"page.model.parentobj.ddlcandidatefathermob2code\" stralternative=\"page.model.parentobj.txtcandidatefathermob2\"\r" +
    "\n" +
    "                    dland=\"page.model.parentobj.ddlcandidatefathelandcode\" strareacode=\"page.model.parentobj.txtcandidatefathelandareacode\" strland=\"page.model.parentobj.txtcandidatefathelandnumber\" strmail=\"page.model.parentobj.txtcandidatefatheremail\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"relativeContactContent.html\">\r" +
    "\n" +
    "    <form name=\"relativeForm\" novalidate role=\"form\" ng-submit=\"page.model.commonContactSubmit(page.model.relativeobj.emaILcust_family_id,page.model.relativeobj.txtrelativename\r" +
    "\n" +
    "    ,page.model.relativeobj.ddlRelativemob,\r" +
    "\n" +
    "    page.model.relativeobj.txtRelativemob,page.model.relativeobj.ddlRelativemob2,page.model.relativeobj.txtRelativemob2,page.model.relativeobj.ddllandRelativecode,page.model.relativeobj.txtRelativeareacode\r" +
    "\n" +
    "    ,page.model.relativeobj.txtlandnumberRelative,page.model.relativeobj.txtRelativeemail,'relative')\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Relative Contact Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblrelativename\" class=\"pop_label_left\">Name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.relativeobj.txtrelativename\" class=\"form-control\" readonly=\"true\" tabindex=\"1\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.relativeobj.ddlRelativemob\" strmobile=\"page.model.relativeobj.txtRelativemob\" dalternative=\"page.model.relativeobj.ddlRelativemob2\" stralternative=\"page.model.relativeobj.txtRelativemob2\" dland=\"page.model.relativeobj.ddllandRelativecode\"\r" +
    "\n" +
    "                    strareacode=\"page.model.relativeobj.txtRelativeareacode\" strland=\"page.model.relativeobj.txtlandnumberRelative\" strmail=\"page.model.relativeobj.txtRelativeemail\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"candidateContactContent.html\">\r" +
    "\n" +
    "    <form name=\"candidateForm\" novalidate role=\"form\" ng-submit=\"page.model.commonContactSubmit(page.model.candidateobj.emaILcust_family_id,'',\r" +
    "\n" +
    "    page.model.candidateobj.ddlcandidateMobileCountryID,\r" +
    "\n" +
    "    page.model.candidateobj.txtcandidatemobilenumber,page.model.candidateobj.ddlcandidateMobileCountryID2,\r" +
    "\n" +
    "    page.model.candidateobj.txtFBMobileNumber2,page.model.candidateobj.ddlcandidateLandLineCountry,page.model.candidateobj.txtcandidateAreCode,\r" +
    "\n" +
    "    page.model.candidateobj.txttxtcandidateAreCodeLandNumber,\r" +
    "\n" +
    "    page.model.candidateobj.txtcandidateEmails,'Candidate')\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Candidate Contact details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <div id=\"divrelationer\">\r" +
    "\n" +
    "                        <label for=\"lblreationName\" class=\"pop_label_left\">Details of</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.candidateobj.ddlcandidateMobileCountryID\" strmobile=\"page.model.candidateobj.txtcandidatemobilenumber\" dalternative=\"page.model.candidateobj.ddlcandidateMobileCountryID2\" stralternative=\"page.model.candidateobj.txtFBMobileNumber2\"\r" +
    "\n" +
    "                    dland=\"page.model.candidateobj.ddlcandidateLandLineCountry\" strareacode=\"page.model.candidateobj.txtcandidateAreCode\" strland=\"page.model.candidateobj.txttxtcandidateAreCodeLandNumber\" strmail=\"page.model.candidateobj.txtcandidateEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"referenceContactContent.html\">\r" +
    "\n" +
    "    <form name=\"refForm\" novalidate role=\"form\" ng-submit=\"page.model.submitContactReference(page.model.referenceobj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Reference Contact details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblreferencename\" class=\"pop_label_left\">Name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.referenceobj.txtreferencename\" class=\"form-control\" readonly=\"true\" tabindex=\"1\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.referenceobj.ddlreferencemobile\" strmobile=\"page.model.referenceobj.txtreferencemobile\" dalternative=\"page.model.referenceobj.ddlreferencemobile2\" stralternative=\"page.model.referenceobj.txtreferencemobile2\"\r" +
    "\n" +
    "                    dland=\"page.model.referenceobj.ddlreferencelandnumber\" strareacode=\"page.model.referenceobj.txtreferenceAreCode\" strland=\"page.model.referenceobj.txtreferencelandnumber\" strmail=\"page.model.referenceobj.txtreferenceemail\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"candidateAddrContent.html\">\r" +
    "\n" +
    "    <form name=\"addrForm\" novalidate role=\"form\" ng-submit=\"page.model.CandidateAddressSubmit(page.model.canAddrobj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Candidate Address Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <ul>\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "                        <label for=\"lblCandidateHouseflat\" class=\"pop_label_left\">House/Flat number</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateHouse_flat\" class=\"form-control\" maxlength=\"100\" tabindex=\"1\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblCandidateApartmentName\" class=\"pop_label_left\">Apartment name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateApartmentName\" class=\"form-control\" maxlength=\"100\" tabindex=\"2\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblCandidateStreetName\" class=\"pop_label_left\">Street name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateStreetName\" class=\"form-control\" maxlength=\"100\" tabindex=\"3\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblCandidateAreaName\" class=\"pop_label_left\">Area Name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateAreaName\" class=\"form-control\" maxlength=\"100\" tabindex=\"4\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblCandidateeLandmark\" class=\"pop_label_left\">Landmark</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateLandmark\" class=\"form-control\" maxlength=\"100\" tabindex=\"5\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <country-directive countryshow=\"true\" cityshow=\"false\" othercity=\"false\" dcountry=\"page.model.canAddrobj.ddlCandidateCountryContact\" dstate=\"page.model.canAddrobj.ddlCandidateStateContact\" ddistrict=\"page.model.canAddrobj.ddlCandidateDistricContact\" require=true></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblCityCandidate\" class=\"pop_label_left\">City<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateCity\" class=\"form-control\" maxlength=\"100\" tabindex=\"9\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblCandidateZip_pin\" class=\"pop_label_left\">Zip/Pin</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"page.model.canAddrobj.txtCandidateZip_no\" class=\"form-control\" maxlength=\"8\" onkeydown=\"return checkwhitespace(event,this.id);\" tabindex=\"10\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"primaryRelationContent.html\">\r" +
    "\n" +
    "    <form name=\"refForm\" novalidate role=\"form\" ng-submit=\"page.model.primaryRelationSubmit(page.model.setrelObj.ddlPrimaryMobileRel,page.model.setrelObj.ddlPrimaryEmailRel,'1')\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Candidate Primary Contact relation\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <div class=\"row\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"col-lg-6\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"Div4\">\r" +
    "\n" +
    "                                <label for=\"lblMobile\" class=\"pop_label_left\">Mobile #  </label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                    <select multiselectdropdown ng-model=\"page.model.setrelObj.ddlPrimaryMobileRel\" typeofdata=\"'childStayingWith'\"></select>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"col-lg-6\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"Div1\">\r" +
    "\n" +
    "                                <label for=\"lblMobile\" class=\"pop_label_left\">Email #  </label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <select multiselectdropdown ng-model=\"page.model.setrelObj.ddlPrimaryEmailRel\" typeofdata=\"'childStayingWith'\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <br/>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"verifyMobileContent.html\">\r" +
    "\n" +
    "    <form name=\"refForm\" novalidate role=\"form\" ng-submit=\"page.model.verifyMobCode(page.model.verifymobObj.txtVerificationcode)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Mobile verification code sent successfully to {{page.model.popupMobilenumber}}\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\"></ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"row\">\r" +
    "\n" +
    "                        <span style=\"color: #000; font-size: 13px; margin-left: 20px; font-weight: bold;\">Click yes, If you want to verify by you \r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <br />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"Divrbt\" class=\"radio-group-my\" runat=\"server\">\r" +
    "\n" +
    "                        <label class=\"control-label\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <md-radio-group name=\"rbtnVerf\" layout=\"row\" ng-model=\"page.model.verifymobObj.rbtnVerf\" class=\"md-block\" ng-change=\"page.model.verifymobObj.rbtnVerf==='2'?page.model.cancel():''\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"2\"> No </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <br />\r" +
    "\n" +
    "                    <br />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div ng-if=\"page.model.verifymobObj.rbtnVerf==='1'\">\r" +
    "\n" +
    "                        <b>Mobile verify Code : </b><input type=\"text\" height=\"40\" ng-model=\"page.model.verifymobObj.txtVerificationcode\" maxlength=\"6\" class=\"form-control\" style=\"width:50%;\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style>\r" +
    "\n" +
    "    .fa-check-circle {\r" +
    "\n" +
    "        font-size: 21px;\r" +
    "\n" +
    "        color: green;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>"
  );


  $templateCache.put('app/editEducation/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Education details'\" sectionid=\"'6,7,8'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Customer Personal Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" id=\"spanEduModID\">ModifiedBy :{{page.model.custEmpLastModificationDate}}</span>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <a id=\"lnkpersonaldetailsadd\" class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('custData');\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"listpersonaldetails\" ng-repeat=\"item in page.model.CustomerDataArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"reviewdivpersonal\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                    <div id=\"UpdatePanel6\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"gender\">Gender</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblGender\">\r" +
    "\n" +
    "                            {{item.Gender}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanellblMaritalStatus\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"MaritalStatus\">Marital Status</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblMaritalStatus\">\r" +
    "\n" +
    "                            {{item.MartialStatus}}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelLnkpersonaledit\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('custData',item);\" visible='<%# Request.QueryString[\"Admin\"] == \"1\" %>' class=\"edit_page_edit_button\">Edit\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePaneldateofbirth\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divdateofbirth\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"dateofbirth\" font-bold=\"true\">Date Of Birth</span></h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lbldateofbirth\">{{item.DateofBirth}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelheight\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divcandidateheight\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblcandidateheight\" font-bold=\"true\">Height</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblheight\">{{item.Height}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelcolor\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" id=\"divcomplexion\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblcolor\" font-bold=\"true\">Complexion</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblcomplexion\">{{item.Complexion}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelreligion\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divreligion\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"religion\" font-bold=\"true\">Religion</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblReligion\">{{item.Religion}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanel1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"div1\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"span1\" font-bold=\"true\">Mother Tongue</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblmothertongue\">{{item.Mothertongue}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelpersonalcaste\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divpersonalcaste\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblcaste\" font-bold=\"true\">Caste</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblcandidatecaste\">{{item.Caste}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelSubcaste\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divSubcaste\" class=\"edit_page_details_item_desc clearfix\" visible='<%#(Eval(\"SubCaste\").ToString()!=\"\" && Eval(\"SubCaste\").ToString()!=null)?true:false %>'>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblsubcaste\" font-bold=\"true\">SubCaste</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblsubcastecandidate\">{{item.SubCaste}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelBorncitizenship\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divBorncitizenship\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblcitizenship\" font-bold=\"true\">BornCitizenship</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblborncitizenship\">{{item.Citizenship}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divEducation\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Education Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\">ModifiedBy :{{page.model.eduEmpLastModificationDate}}</span></h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('showEduModal');\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ng-repeat=\"item in page.model.educationSelectArray\">\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div id=\"lbleducationgroup\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lbleducationgroup\" ng-style=\"{color: item.EduHighestDegree==1?'Red':'Black'}\">{{item.EducationCategory!=null?(item.EducationCategory==\"Below Graduation\"?\"Under Graduation\":\"Education\"):\"Education\"}}</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <label id=\"edgoup\" ng-style=\"{color: item.EduHighestDegree==1?'Red':''}\">{{item.EducationGroup+\" \"+((item.EducationSpecialization!=null?\"(\" +item.EducationSpecialization+\")\":\"\"))+\" \"+((item.EduPassOfYear!=null?\",Completed\"+\"-\"+item.EduPassOfYear:\"\"))}} </label>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"editeducationbutton\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                        <a id=\"LinkButton1dfd\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('showEduModal',item)\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeleteEduPopup(item.EducationID);\">Delete</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"divuniversityhiding\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.EduUniversity===null\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Label1\">University</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblTuniversity\">{{item.EduUniversity}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"divCollege\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.EduCollege===null\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Label9\">College</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblTcollege\">{{item.EduCollege}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\" id=\"divcityviewhiding\" ng-hide=\"item.EduCityIn===null\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Label3\" font-bold=\"true\">City Study In</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblcountry\">{{item.EduCityIn+\",\"+item.EduDistrictIn+\",\"+item.EduStateIn+\",\"+item.EduCountryIn}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"divmerit\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.Educationdesc==null\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Label5\" font-bold=\"true\">Education Merits</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblmerits\">{{item.Educationdesc}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div id=\"divlnkAddProfession\" class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Professional Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style=\"color: #08CFD2\">ModifiedBy :{{page.model.profEmpLastModificationDate}}</span></h4>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div ng-if=\"page.model.ProfessionSelectArray.length==0\">\r" +
    "\n" +
    "                    <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('showProfModal')\">Add</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"lstProfession\" ng-repeat=\"item in page.model.ProfessionSelectArray\">\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'reviewCls':''\">\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblprofession\" style=\"font-weight:bold;\">Profession</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"txtProfession\">{{item.Professional+\" \"+(item.CompanyName !=null && item.CompanyName !=\"\"?\"in\"+\" \"+item.CompanyName:'')}}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.ProfessionSelectArray.length>0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a id=\"Linkedit\" class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('showProfModal',item)\">Edit</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"divcitywork\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.CityWorkingIn==null\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblcitywork\" style=\"font-weight:bold;\">City working in </span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblcityworkingg\">{{(item.CityWorkingIn!=null?\" \"+item.CityWorkingIn:\" \")+ \" \" +(item.StateWorkingIn!=null && item.StateWorkingIn!=\" \"?\",\"+item.StateWorkingIn:\"\")+\" \"+(item.CountryWorkingIn!=null && item.CountryWorkingIn!=\"\"? \", \"+item.CountryWorkingIn:\" \")}}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"Div1\">\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.Salary===null\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblsal\" style=\"font-weight:bold;\">Monthly salary</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblsalaryy\">{{item.Currency+\" \"+(item.Salary!=null && item.Salary!=\"\"?\" \"+item.Salary+\"/-\":\"\")}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"Div2\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.WorkingFromDate===null\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblworkfrom\" style=\"font-weight:bold;\">Working from date</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblworkingfrom\">{{item.WorkingFromDate}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"Div3\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.VisaStatus===null\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblvisa\">visa status</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"txtvisa\">{{item.VisaStatus}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"Div4\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.ResidingSince===null\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblsincedate\">Since date</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"txtsincedate\">{{item.ResidingSince}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"Div5\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.ArrivingDate===null\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblarrival\">Arrival Date</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"txtarrival\">{{item.ArrivingDate}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"Div6\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.DepartureDate===null\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lbldepartture\">Departure Date</span>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"txtdaparture\"> {{item.DepartureDate}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"Div7\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.OccupationDetails===null\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblOccupation\" style=\"font-weight:bold;\">Occupation Details</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span>{{item.OccupationDetails}} </span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"divlnkadd\" class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Mention your goals, interests and hobbies etc</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div id=\"upAboutAdd\" ng-if=\"page.model.lblaboutUrself==='' || page.model.lblaboutUrself===null\">\r" +
    "\n" +
    "                    <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('showAboutModal')\">Add</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"reviewdiv\" ng-class=\"AboutReviewStatusID===0?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                <div class=\"form-group\">\r" +
    "\n" +
    "                    <div id=\"uplblAbout\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h5 style=\"float: none; width: 92%; display: block;\">\r" +
    "\n" +
    "                            <span>{{page.model.lblaboutUrself}}</span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-if=\"page.model.lblaboutUrself!='' && page.model.lblaboutUrself!=null\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                        <a class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showpopup('showAboutModal',page.model.lblaboutUrself)\">Edit</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"edupopupdiv\">\r" +
    "\n" +
    "        <script type=\"text/ng-template\" id=\"EduModalContent.html\">\r" +
    "\n" +
    "            <form name=\"eduForm\" novalidate role=\"form\" ng-submit=\"eduForm.$valid  && page.model.eduSubmit(page.model.edoObj);\" accessible-form>\r" +
    "\n" +
    "                <div class=\"modal-header\">\r" +
    "\n" +
    "                    <h3 class=\"modal-title text-center\" id=\"modal-title\">Education Details\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                            <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                    </h3>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "                    <ul id=\"uleducation\" class='modal-body clearfix pop_content_my'>\r" +
    "\n" +
    "                        <li class=\"clearfix\">\r" +
    "\n" +
    "                            <label for=\"lblIsHighestDegree\" class=\"pop_label_left\" style=\"padding-top: 2%;\">Is Highest Degree<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"radio-group-my\">\r" +
    "\n" +
    "                                <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                                    <md-radio-group ng-required=\"true\" name=\"IsHighestDegree\" layout=\"row\" ng-model=\"page.model.edoObj.IsHighestDegree\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                        <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                        <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                                    </md-radio-group>\r" +
    "\n" +
    "                                    <div ng-messages=\"eduForm.IsHighestDegree.$invalid\">\r" +
    "\n" +
    "                                        <div ng-if=\"eduForm.IsHighestDegree.$invalid && (eduForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </md-input-container>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lbleducationGroup\" class=\"pop_label_left\">Education category<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown id=\"estt\" ng-model=\"page.model.edoObj.ddlEduCatgory\" typeofdata=\"'educationcategory'\" ng-change=\"page.model.changeBind('EducationCatgory',page.model.edoObj.ddlEduCatgory);\" required></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lbleducationGroup\" class=\"pop_label_left\">Education group<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.edoObj.ddlEdugroup\" ng-options=\"item.value as item.label for item in page.model.eduGroupArr\" ng-change=\"page.model.changeBind('EducationGroup',page.model.edoObj.ddlEdugroup);\" required></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lbleducationGroup\" class=\"pop_label_left\">Edu specialization<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.edoObj.ddlEduspecialization\" ng-options=\"item.value as item.label for item in page.model.eduSpecialisationArr\" required></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\" id=\"divuniversity\">\r" +
    "\n" +
    "                            <label for=\"lbluniversity\" class=\"pop_label_left\">University</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.edoObj.txtuniversity\" maxlength=\"100\" class=\"form-control\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblcollege\" class=\"pop_label_left\">College</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.edoObj.txtcollege\" maxlength=\"150\" class=\"form-control\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblPassOfYear\" class=\"pop_label_left\">Pass of year</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.edoObj.ddlpassOfyear\" ng-options=\"item1.value as item1.label for item1 in page.model.passOfyearArr\"></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <country-directive countryshow=\"true\" cityshow=\"true\" othercity=\"true\" dcountry=\"page.model.edoObj.ddlCountry\" dstate=\"page.model.edoObj.ddlState\" ddistrict=\"page.model.edoObj.ddlDistrict\" dcity=\"page.model.edoObj.ddlcity\" strothercity=\"page.model.edoObj.txtcity\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblEduMerits\" class=\"pop_label_left\">Educational merits</label>\r" +
    "\n" +
    "                            <div class=\"\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <textarea ng-model=\"page.model.edoObj.txtEdumerits\" maxlength=\"500\" rows=\"4\" cols=\"20\" style=\"max-width:515px;width:100%;\" tabindex=\"12\" onkeydown=\"return CharacterCountedu()\" onkeyup=\"return CharacterCountedu()\"></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"row\">\r" +
    "\n" +
    "                            <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <edit-footer></edit-footer>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "        </script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=profpopupdiv>\r" +
    "\n" +
    "        <script type=\"text/ng-template\" id=\"profModalContent.html\">\r" +
    "\n" +
    "            <form name=\"profForm\" novalidate role=\"form\" ng-submit=\"page.model.ProfSubmit(page.model.profObj);\" accessible-form>\r" +
    "\n" +
    "                <div class=\"modal-header\">\r" +
    "\n" +
    "                    <h3 class=\"modal-title text-center\" id=\"modal-title\">Profession details\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                            <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                    </h3>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblempin\" class=\"pop_label_left\">Employed In<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.profObj.ddlemployedin\" typeofdata=\"'ProfCatgory'\" required></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblprofessiongroup\" class=\"pop_label_left\">Professional group<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.profObj.ddlprofgroup\" typeofdata=\"'ProfGroup'\" ng-change=\"page.model.ProfchangeBind('ProfessionGroup',page.model.profObj.ddlprofgroup);\" required></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblprofession\" class=\"pop_label_left\">Profession<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.profObj.ddlprofession\" ng-options=\"item.value as item.label for item in page.model.ProfSpecialisationArr\" required></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblcmpyname\" class=\"pop_label_left\">Company name</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.profObj.txtcmpyname\" class=\"form-control\" tabindex=\"4\" maxlength=\"100\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblsal\" class=\"pop_label_left\">Monthly salary</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my select-box-my-double\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.profObj.ddlcurreny\" typeofdata=\"'currency'\"></select>\r" +
    "\n" +
    "                                <input ng-model=\"page.model.profObj.txtsalary\" style=\"float:right\" class=\"form-control\" onchange=\"currency();\" maxlength=\"7\" tabindex=\"6\" onkeydown=\"return (((event.keyCode == 8) || (event.keyCode == 46) || (event.keyCode >= 35 && event.keyCode <= 40) || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)));\"\r" +
    "\n" +
    "                                />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <country-directive countryshow=\"true\" cityshow=\"true\" othercity=\"true\" dcountry=\"page.model.profObj.ddlCountryProf\" dstate=\"page.model.profObj.ddlStateProf\" ddistrict=\"page.model.profObj.ddlDistrictProf\" dcity=\"page.model.profObj.ddlcityworkingprofession\"\r" +
    "\n" +
    "                            strothercity=\"page.model.profObj.txtcityprofession\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblworkingfrome\" class=\"pop_label_left\">Working from date</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <date-picker strdate=\"page.model.profObj.txtworkingfrom\"></date-picker>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <div id=\"divfalseVisa\" ng-if=\"page.model.profObj.ddlCountryProf!=1\">\r" +
    "\n" +
    "                            <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                                <label for=\"lblvisastatus\" class=\"pop_label_left\">visa status</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                    <div class=\"select-box-my\">\r" +
    "\n" +
    "                                        <select multiselectdropdown ng-model=\"page.model.profObj.ddlvisastatus\"></select>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                            <li class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label class=\"pop_label_left\" for=\"lblsincedate\">Since date</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                    <date-picker strdate=\"page.model.profObj.txtssincedate\"></date-picker>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                            <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                                <label for=\"lblarrivaldate\" class=\"pop_label_left\">Arrival Date</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                    <date-picker strdate=\"page.model.profObj.txtarrivaldate\"></date-picker>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                                <label for=\"lbldeaparturedate\" class=\"pop_label_left\">Departure Date</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                    <date-picker strdate=\"page.model.profObj.txtdeparture\"></date-picker>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lbloccupation\" class=\"pop_label_left\">Occupation Details</label>\r" +
    "\n" +
    "                            <div class=\"\">\r" +
    "\n" +
    "                                <textarea ng-model=\"page.model.profObj.txtoccupation\" style=\"width:515px;\" rows=\"4\" tabindex=\"16\" maxlength=\"500\" onkeydown=\"return CharacterCount()\"></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label id=\"lbloccupationcount\" style=\"color: #1e1c1c; font-size: 13px;\"></label>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"row\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <edit-footer></edit-footer>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "        </script>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"AboutPopup\">\r" +
    "\n" +
    "        <script type=\"text/ng-template\" id=\"AboutModalContent.html\">\r" +
    "\n" +
    "            <form name=\"aboutForm\" novalidate role=\"form\" ng-submit=\"page.model.AboutUrselfSubmit(page.model.aboutObj)\">\r" +
    "\n" +
    "                <div class=\"modal-header\">\r" +
    "\n" +
    "                    <h3 class=\"modal-title text-center\" id=\"modal-title\">About your self\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                            <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                    </h3>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label id=\"lblabout\" style=\"color: #9b2828; font-size: 13px;\">\r" +
    "\n" +
    "            				(Please don't write phone numbers/emails/any junk characters)*</label>\r" +
    "\n" +
    "                            <textarea ng-model=\"page.model.aboutObj.txtAboutUS\" style=\"width: 500px; height: 150px;\" class=\"col-lg-10\" maxlength=\"1000\" required ng-class=\"form-control\" required />\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <label id=\"Label1\" style=\"color: red; font-size: 13px;\" class=\"pull-right\">(max 1000 characters)</label>\r" +
    "\n" +
    "                            <label id=\"lblaboutcount\" style=\"color: #1e1c1c; font-size: 13px;\">{{aboutForm.txtAboutUS.length}}</label>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"row\">\r" +
    "\n" +
    "                            <edit-footer></edit-footer>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "        </script>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"deleteEduContent.html\">\r" +
    "\n" +
    "    <form name=\"deletetForm\" novalidate role=\"form\" ng-submit=\"page.model.deleteEduSubmit();\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Alert\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix\" id=\"modal-body\">\r" +
    "\n" +
    "            <b class=\"text-center\"> Do you want to delete Education details</b>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"modal-footer\">\r" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Delete</button>\r" +
    "\n" +
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"page.model.cancel();\">Cancel</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"CustomerDataContent.html\">\r" +
    "\n" +
    "    <form name=\"custForm\" novalidate role=\"form\" ng-submit=\"page.model.custdataSubmit(page.model.custObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Alert\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblElderYounger\" class=\"pop_label_left\">Gender<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "                        <md-input-container style=\"font-weight: 700; color: black;\">\r" +
    "\n" +
    "                            <md-radio-group ng-required=\"true\" name=\"rdlGender\" layout=\"row\" ng-model=\"page.model.custObj.rdlGender\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                <md-radio-button value=\"2\" class=\"md-primary\">Female</md-radio-button>\r" +
    "\n" +
    "                                <md-radio-button value=\"1\"> Male </md-radio-button>\r" +
    "\n" +
    "                            </md-radio-group>\r" +
    "\n" +
    "                            <div ng-messages=\"custForm.rdlGender.$invalid\">\r" +
    "\n" +
    "                                <div ng-if=\"custForm.rdlGender.$invalid && (custForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </md-input-container>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblname\" class=\"pop_label_left\">Sur Name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.custObj.txtSurName\" class=\"form-control\" required/>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblname\" class=\"pop_label_left\">Name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.custObj.txtName\" class=\"form-control\" required/>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblMaritalstatus\" class=\"pop_label_left\">Marital Status<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.dropmaritalstatus\" typeofdata=\"'MaritalStatus'\" required></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lbldob\" class=\"pop_label_left\">Date Of Birth<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <date-picker strdate=\"page.model.custObj.txtdobcandidate\" required></date-picker>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblheight\" class=\"pop_label_left\">Height<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.ddlHeightpersonal\" typeofdata=\"'height'\" required></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblheight\" class=\"pop_label_left\">Complexion<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.ddlcomplexion\" typeofdata=\"'Complexion'\" required></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Religion\" class=\"pop_label_left\">Religion<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <div class=\"select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <select multiselectdropdown ng-model=\"page.model.custObj.ddlreligioncandadate\" typeofdata=\"'Religion'\" required></select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" id=\"divMotherTongue\">\r" +
    "\n" +
    "                    <label for=\"lblPersonalMotherTongue\" class=\"pop_label_left\">Mother Tongue<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.ddlmothertongue\" typeofdata=\"'Mothertongue'\" required></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblCaste\" class=\"pop_label_left\">Caste<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.ddlcaste\" typeofdata=\"'caste'\" ng-change=\"page.model.changeBind('caste',page.model.custObj.ddlcaste);\" required></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblCaste\" class=\"pop_label_left\">SubCaste</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.ddlsubcaste\" ng-options=\"item.value as item.label for item in page.model.subcasteArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblborncitizenship\" class=\"pop_label_left\">Born Citizenship<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.custObj.ddlBornCitizenship\" typeofdata=\"'Country'\" required></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style>\r" +
    "\n" +
    "    .multiselect {\r" +
    "\n" +
    "        border: solid 1px #ADA2A2 !important;\r" +
    "\n" +
    "        color: #000;\r" +
    "\n" +
    "        background: #fff !important;\r" +
    "\n" +
    "        box-shadow: none !important;\r" +
    "\n" +
    "        height: 34px !important;\r" +
    "\n" +
    "        line-height: 33px;\r" +
    "\n" +
    "        margin: 0 !important;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "<!--<alert-directive></alert-directive>-->"
  );


  $templateCache.put('app/editManagePhoto/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"register_page_main\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"my_photos_main my_photos_main_edit\">\r" +
    "\n" +
    "            <h6>Upload your recent Photos for better response</h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"clear\">&nbsp;</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <br />\r" +
    "\n" +
    "            <div class=\"dragzone\">\r" +
    "\n" +
    "                <div class=\"pics_selected_list_main clearfix\">\r" +
    "\n" +
    "                    <div class=\"pics_selected_list_main_lt clearfix\">\r" +
    "\n" +
    "                        <p class=\"clearfix\"><span>Upload your three different photos</span></p>\r" +
    "\n" +
    "                        <div id=\"dtimagephoto\" class=\"clearfix\" ng-repeat=\"item in page.model.manageArr\" style=\"width:33%;float:left;\">\r" +
    "\n" +
    "                            <div class=\"photos\">\r" +
    "\n" +
    "                                <div class=\"pics_selected_list_item clearfix\">\r" +
    "\n" +
    "                                    <div ng-class=\"item.IsActive == 0 && item.PhotoName !== null?'cssMaskdiv clearfix':''\">\r" +
    "\n" +
    "                                        <img ng-model=\"imgPhotoName\" ng-src=\"{{item.ImageUrl}}\" />\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div class=\"pics_selected_list_item_ui clearfix\">\r" +
    "\n" +
    "                                        <div class=\"photos_icon\">\r" +
    "\n" +
    "                                            <a href=\"javascript:void(0);\" ng-click=\"page.model.AddImage($index+1,item.Cust_Photos_ID,item.DisplayOrder,item.IsActive);\" ng-show=\"{{item.addButtonvisible}}\">\r" +
    "\n" +
    "                                                <ng-md-icon icon=\"add_a_photo\" style=\"fill:#665454\" size=\"25\">Add</ng-md-icon>\r" +
    "\n" +
    "                                            </a>\r" +
    "\n" +
    "                                            <a href=\"javascript:void(0);\" ng-show=\"{{item.IsMain==1?false:(item.PhotoName!=null?true:false)}}\" ng-click=\"page.model.DeleteImage(item.keyname,item.Cust_Photos_ID);\">\r" +
    "\n" +
    "                                                <ng-md-icon icon=\"delete\" style=\"fill:#665454\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                                            </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                                            <a href=\"javascript:void(0);\" class=\"set_pic\" ng-click=\"page.model.setAsProfilePic(item.Cust_Photos_ID);\" style=\"color:#665454;font-weight:bold;\" ng-show='{{item.IsMain==\"1\"?false:(item.PhotoName!=null?true:false) }}'>\r" +
    "\n" +
    "                                            Set as Profilepic\r" +
    "\n" +
    "                                            </a>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"clear\"></div>\r" +
    "\n" +
    "                        <div class=\"edit_page_photo_manage_submit\">\r" +
    "\n" +
    "                            <div class=\"edit_page_photo_manage_protect pull-left clearfix\" ng-show=\"{{loginpaidstatus===1}}\">\r" +
    "\n" +
    "                                <label class=\"\">\r" +
    "\n" +
    "                                \r" +
    "\n" +
    "                                <div class=\"radio_my2 clearfix\">\r" +
    "\n" +
    "                                <label style=\"font-size: 14px !important; font-weight: 400;\"> Protect with Password :</label> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;\r" +
    "\n" +
    "                                <md-radio-group layout=\"row\" ng-model=\"rbtProtectPassword\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\" ng-change=\"page.model.setPhotoPassword(rbtProtectPassword);\">\r" +
    "\n" +
    "                                    <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                                </md-radio-group>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    </br>\r" +
    "\n" +
    "                    <div class=\"photo_upload_instrctns_list clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a ID=\"phtoguide\" href=\"javascript:void(0);\" ng-click=\"page.model.redirectPage('PhotoGuideLines');\">Photo guidelines\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                        <a ID=\"photofaq\" href=\"javascript:void(0);\" ng-click=\"page.model.redirectPage('Faqs');\">Photo faq’s\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                        <a ID=\"photoupload\" href=\"javascript:void(0);\" ng-click=\"page.model.redirectPage('uploadTips');\">Photo upload tips\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"my_photos_main_block2 clearfix\">\r" +
    "\n" +
    "            <div class=\"clearfix pics_incorrect_list\">\r" +
    "\n" +
    "                <h3>Such Photos cannot be Uploaded</h3>\r" +
    "\n" +
    "                <table id=\"DataList3\" class=\"clearfix\" style=\"border-collapse: collapse;\" cellspacing=\"0\">\r" +
    "\n" +
    "                    <tbody>\r" +
    "\n" +
    "                        <tr>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                <img id=\"DataList3_ctl00_images\" src=\"src\\images/Side-face.png\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    Side Face\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                <img id=\"DataList3_ctl01_images\" src=\"src\\images/Blir.png\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    Blur\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                <img id=\"DataList3_ctl02_images\" src=\"src\\images/Group-photos.png\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    Group Photo\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                <img id=\"DataList3_ctl03_images\" src=\"src\\images/Water-mark.png\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    Watermark\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                        </tr>\r" +
    "\n" +
    "                    </tbody>\r" +
    "\n" +
    "                </table>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"pics_selected_list_main_rt clearfix pics_correct_list\">\r" +
    "\n" +
    "                <h3>Photos that can be uploaded</h3>\r" +
    "\n" +
    "                <table id=\"DataList2\" class=\"clearfix\" style=\"border-collapse: collapse;\" cellspacing=\"0\">\r" +
    "\n" +
    "                    <tbody>\r" +
    "\n" +
    "                        <tr>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                <img id=\"DataList2_ctl00_images\" src=\"src\\images/Close-up.png\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    Close Up\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                <img id=\"DataList2_ctl01_images\" src=\"src\\images/Fulsize.png\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    Full Size\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                        </tr>\r" +
    "\n" +
    "                    </tbody>\r" +
    "\n" +
    "                </table>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"clear\">&nbsp;</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"my_photos_main_block3\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p>\r" +
    "\n" +
    "                <img src=\"src/images/whatsup.png\" alt=\"Mail\" style=\"width: 50px; height: 40px;\">Whatsup your photos to\r" +
    "\n" +
    "                <span>91-9848535373</span> - Kindly mention your Profile ID and name\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "            <p>\r" +
    "\n" +
    "                <img src=\"src/images/icon_email.png\" alt=\"Mail\">Can also Email your photos to <span>photos@telugumarriages.com</span> - Kindly mention your Profile ID and name\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"AddimagePopup.html\">\r" +
    "\n" +
    "    <form name=\"uploadForm\" novalidate role=\"form\" ng-submit=\"page.model.upload(up);\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Upload Photo </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul id=\"ulprofession\">\r" +
    "\n" +
    "                <input type=\"file\" file-model=\"up.myFile\" />\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-footer\">\r" +
    "\n" +
    "            <input value=\"Cancel\" class=\"button_custom button_custom_reset\" ng-click=\"page.model.cancel();\" type=\"button\">\r" +
    "\n" +
    "            <input value=\"Upload\" class=\"button_custom\" type=\"submit\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"deleteimagePopup.html\">\r" +
    "\n" +
    "    <form name=\"uploadForm\" novalidate role=\"form\" ng-submit=\"page.model.Delete(up);\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Delete Photo </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "            <div class=\"text-center\">Are you sure to delete photo?</div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-footer\">\r" +
    "\n" +
    "            <input value=\"Close\" class=\"button_custom button_custom_reset\" ng-click=\"page.model.cancel();\" type=\"button\">\r" +
    "\n" +
    "            <input value=\"Delete\" class=\"button_custom\" type=\"submit\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style>\r" +
    "\n" +
    "    .cssMaskdiv {\r" +
    "\n" +
    "        position: relative;\r" +
    "\n" +
    "        display: inline-block;\r" +
    "\n" +
    "        overflow: hidden;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    .cssMaskdiv:after {\r" +
    "\n" +
    "        background: rgba(0, 0, 0, 0.5) none repeat scroll 0 0;\r" +
    "\n" +
    "        color: #ffffff;\r" +
    "\n" +
    "        content: \"Under Review\";\r" +
    "\n" +
    "        display: block;\r" +
    "\n" +
    "        font-size: 14px;\r" +
    "\n" +
    "        /* height: 100%; */\r" +
    "\n" +
    "        left: 0;\r" +
    "\n" +
    "        padding: 50% 0;\r" +
    "\n" +
    "        position: absolute;\r" +
    "\n" +
    "        text-align: center;\r" +
    "\n" +
    "        top: 0;\r" +
    "\n" +
    "        width: 100%;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>"
  );


  $templateCache.put('app/editOfcePurpose/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>About Profile Details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <a id=\"lnkAboutProfile\" class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showPopup();\" ng-show=\"dataval===''?true:false\">Add\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                <h5>\r" +
    "\n" +
    "                    <span id=\"lblAboutProfile\">{{page.model.dataval}}</span>\r" +
    "\n" +
    "                </h5>\r" +
    "\n" +
    "                <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                    <a id=\"LinkButton1dfd\" data-placement=\"bottom\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showPopup(page.model.dataval);\" ng-hide=\"dataval===''?true:false\">Edit\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"AboutModalContent.html\">\r" +
    "\n" +
    "    <form name=\"aboutForm\" novalidate role=\"form\" ng-submit=\"page.model.AboutProfleSubmit(page.model.aboutObj.txtAboutprofile)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">About Your Profile\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label id=\"lblabout\" style=\"color: #9b2828; font-size: 13px;\">\r" +
    "\n" +
    "            				(You can write anything about this profile)*</label>\r" +
    "\n" +
    "                    <textarea ng-model=\"page.model.aboutObj.txtAboutprofile\" style=\"width: 500px; height: 150px;\" class=\"col-lg-10\" maxlength=\"1000\" required ng-class=\"form-control\" required />\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <label id=\"Label1\" style=\"color: red; font-size: 13px;\" class=\"pull-right\">(max 1000 characters)</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('app/editParent/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Parent details'\" sectionid=\"'11,12,13,15'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divlnkaddparents\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Parents Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" id=\"spanEduModID\">ModifiedBy :{{page.model.parentmodifiedby}}</span>\r" +
    "\n" +
    "                <span style=\"color: #08CFD2\" id=\"spanEduModID\" visible=\"false\">\r" +
    "\n" +
    "                    <label id=\"lblParentsDetailsmodby\" forecolor=\"#08CFD2\"></label>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.parentArr.length===0\">\r" +
    "\n" +
    "                <a data-toggle=\"tooltip\" data-original-title=\"Add Parents Details\" class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.populateModel('parent');\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"listparents\" ng-repeat=\"item in page.model.parentArr\">\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"lfathername\" font-bold=\"true\"></label>Father Name</h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"LBfathername\">{{item.FatherName}}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.parentArr.length>0\">\r" +
    "\n" +
    "                                <a id=\"LinkButton1dfd\" href=\"javascript:void(0):\" data-original-title=\"Edit Parents Details\" class=\"edit_page_edit_button\" ng-click=\"page.model.populateModel('parent',item);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblfathereducation\" font-bold=\"true\">Education</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblfathereducationdetails\">\r" +
    "\n" +
    "                                    {{item.FatherEducationDetails }}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label font-bold=\"true\">Profession Category</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span>\r" +
    "\n" +
    "                                    {{item.FatherProfessionCategory }}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblFatherprofession\" font-bold=\"true\">Designation</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblfatherprofessiondetails\">\r" +
    "\n" +
    "                                   {{item.FatherProfDetails }}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" id=\"fathercompnay\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblfatherprofessionloc\" font-bold=\"true\">Company & JobLocation</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblfatherprofandloc\">\r" +
    "\n" +
    "                                   {{((item.FathercompanyName!=null && (item.FathercompanyName!=\"\")?item.FathercompanyName:\"NotSpecified\"))\r" +
    "\n" +
    "                                        +\" \"+((item.FatherJoblocation!=null && (item.FatherJoblocation!=\"\")?\",\" +\" \"+item.FatherJoblocation:''))}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ownerdiv0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"lblfathernumber\" font-bold=\"true\">Father contact nos</label>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblfathermobile\">\r" +
    "\n" +
    "                                       {{((item.FatherMobilenumber!=null && (item.FatherMobilenumber!=\"\")?item.FatherMobilenumber:\"\"))\r" +
    "\n" +
    "                                        +\" \"+((item.FatherLandNumber!=null && (item.FatherLandNumber!=\"\")?\"&\"+\" \"+item.FatherLandNumber:\"\")) }}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"fatheremail\" font-bold=\"true\">Father Email</label>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFatherEmail\">\r" +
    "\n" +
    "                                       {{ item.FatherEmail }}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblfathersfather\">Father's Father Name</label></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblfathersfath\">\r" +
    "\n" +
    "                                  {{  ((item.FatherFathername!=null && (item.FatherFathername!=\"\")?item.FatherFathername:\"\"))\r" +
    "\n" +
    "                                        }}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ownerdiv1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"FFContactNos\">FF contact nos</label></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFFContactNos\">\r" +
    "\n" +
    "                                       {{((item.FFMobileNumberWithcode!=null && (item.FFMobileNumberWithcode!=\"\")?item.FFMobileNumberWithcode:\"\"))\r" +
    "\n" +
    "                                       + ((item.FFLandNumberwithCode!=null && item.FFLandNumberwithCode!=\"\")?\" & \"+item.FFLandNumberwithCode:\"\") }}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"FnativePlace\" font-bold=\"true\">Native Place</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblFnativePlace\">\r" +
    "\n" +
    "                                   {{\r" +
    "\n" +
    "                                        ((item.FatherNativeplace!=null && item.FatherNativeplace!=\"\")?item.FatherNativeplace:\"\" )+\r" +
    "\n" +
    "                                        ((item.FatherDistric!=null && item.FatherDistric!=\"\")?\" ,\"+item.FatherDistric:\"\")+\r" +
    "\n" +
    "                                        ((item.FatherState!=null && item.FatherState!=\"\")?\" ,\"+item.FatherState:\"\" )+\r" +
    "\n" +
    "                                        ((item.FatherCountry!=null && item.FatherCountry!=\"\")?\" ,\"+item.FatherCountry:\"\" )}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblmothername\" font-bold=\"true\" forecolor=\"Red\">\r" +
    "\n" +
    "                                Mother Name\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblmothernameandedu\">\r" +
    "\n" +
    "                                    {{item.MotherName}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lbleducationmother\">Education</label></h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblmotherducation\">\r" +
    "\n" +
    "                                   {{ ((item.MotherEducationDetails!=null && item.MotherEducationDetails!=\"\")?item.MotherEducationDetails:\"\" )}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label font-bold=\"true\">Profession Category</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span>\r" +
    "\n" +
    "                                    {{item.MotherProfessionCategory }}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblprofessionmotherr\" font-bold=\"true\">Designation</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblmotherprofdetails\">\r" +
    "\n" +
    "                                  {{((item.MotherProfedetails!=null && item.MotherProfedetails!=\"\")?\r" +
    "\n" +
    "                                                item.MotherProfedetails:\"\" )}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"mothercompany\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.MotherProfedetails=='HouseWife'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblmotherprofession\">Company & JobLocation</label></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblmotherprofandloc\">\r" +
    "\n" +
    "                                   {{((item.MothercompanyName!=null && (item.MothercompanyName!=\"\")?item.MothercompanyName:\"\"))+\" \"+\r" +
    "\n" +
    "                                            ((item.MotherJoblocation!=null && (item.MotherJoblocation!=\"\")?\", \"+\" \"+\r" +
    "\n" +
    "                                            item.MotherJoblocation:''))}}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ownerdiv2\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"lblmothercontacts\">Mother contact nos</label></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblmompmobile\">\r" +
    "\n" +
    "                                       {{((item.MotherMobilenumber!=null && item.MotherMobilenumber!=\"\")?item.MotherMobilenumber:\"\" )+\" \"+((item.MotherLandNumber!=null && (item.MotherLandNumber!=\"\")?\"&\"+\" \"+item.MotherLandNumber:\"\"))}}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"lblmotheremail\" font-bold=\"true\">Mother Email</label>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblmomemail\">\r" +
    "\n" +
    "                                        {{ item.MotherEmail }}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"lblmotherfatherupp\" font-bold=\"true\">Mother's Father Name</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMotherFatherName\">\r" +
    "\n" +
    "                                   {{item.MotherFatherName }}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"MotherFatherLastName\" font-bold=\"true\">Mother's Father SurName</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMotherFatherLastName\">\r" +
    "\n" +
    "                                  {{item.MotherFatherLastName}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ownerdiv3\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"mContactNos\" font-bold=\"true\">MF Contact nos</label>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblmContactNos\">\r" +
    "\n" +
    "                                       {{ item.MMMobileNumberWithcode+\r" +
    "\n" +
    "                                        ((item.MMLandNumberwithCode!=null && item.MMLandNumberwithCode!=\"\")?\" & \"+item.MMLandNumberwithCode:\"\") }}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <label id=\"MNativePlace\" font-bold=\"true\">Native Place</label>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMNativePlace\">\r" +
    "\n" +
    "                                   {{((item.MotherNativeplace!=null && item.MotherNativeplace!=\"\")?item.MotherNativeplace:\"\") +\r" +
    "\n" +
    "                                        ((item.MotherDistric!=null && item.MotherDistric!=\"\")?\" ,\"+item.MotherDistric:\"\" )+\r" +
    "\n" +
    "                                        ((item.MotherState!=null && item.MotherState!=\"\")?\" ,\"+item.MotherState:\"\" )+\r" +
    "\n" +
    "                                        ((item.MotherCountry!=null && item.MotherCountry!=\"\")?\" ,\"+item.MotherCountry:\"\" )}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div id=\"divParentIntercasteHide\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"ParentsInterCaste\">Are Parents InterCaste</label></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblParentsInterCaste\">{{item.Intercaste }}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"lFatherCaste\">Father Caste</label></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFatherCaste\">{{item.FatherCaste }}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"lMotherCaste\">Mother Caste</label>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblMotherCaste\">{{item.MotherCaste }}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divlnkAddcontactaddress\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Contact Address &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\">ModifiedBy :{{page.model.addrmodifiedby}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.addressArr.length===0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <a ng-click=\"page.model.populateModel('Address',item);\" href=\"javascript:void(0);\" data-original-title=\"Add Contact Address\" class=\"edit_page_add_button\">Add</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-repeat=\"item in page.model.addressArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div1\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblhousenum\" font-bold=\"true\">House/Flat No</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblhouseflat\">\r" +
    "\n" +
    "                                {{ item.FlatNumber}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"divapartment\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblapartmentname\" font-bold=\"true\">Apt Name</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblapartment\">\r" +
    "\n" +
    "                                {{ item.ApartmentName}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.addressArr.length>0\">\r" +
    "\n" +
    "                        <a ng-click=\"page.model.populateModel('Address',item);\" href=\"javascript:void(0);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"divareaname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblareaname\" font-bold=\"true\">Area Name</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblareanamee\">\r" +
    "\n" +
    "                                {{ item.AreaName}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblstreet\" font-bold=\"true\">Street Name</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblstreetname\">\r" +
    "\n" +
    "                                {{ item.StreetName}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblland\" font-bold=\"true\">Land Mark</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lbllandmark\">\r" +
    "\n" +
    "                                {{ item.LandMark}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblcityy\" font-bold=\"true\">City</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblcityname\">\r" +
    "\n" +
    "                                {{ item.CityName+\" \"+(item.DistrictName!=null?\",\"+ item.DistrictName:\"\")+(item.StateName!=null?\",\"+ item.StateName:\"\")+(item.CountryName!=null?\",\"+item.CountryName:\"\")+(item.Zip!=null?\"-\"+item.Zip:\"\") }}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divlnkAddphsysicall\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Physical Attribute & Health Details of Candidate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" id=\"spanEduModID\">ModifiedBy :{{page.model.physicalmodifiedby}}</span></h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.physicalArr.length===0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.populateModel('physicalAttributes',item);\" data-original-title=\"Add Physical Attribute & Health Details\" class=\"edit_page_add_button\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-repeat=\"item in page.model.physicalArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"Div2\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lbllDiet\" font-bold=\"true\">Diet</label></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblDiet\">\r" +
    "\n" +
    "                                {{ item.Diet}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lbllDrink\">Drink</label></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblDrink\">\r" +
    "\n" +
    "                                {{ item.Drink}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lbllSmoke\">Smoke</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblSmoke\">\r" +
    "\n" +
    "                                {{ item.Smoke}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lbllBodyType\">Body Type</label></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblBodyType\">\r" +
    "\n" +
    "                                {{ item.BodyType}}\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblbodyweight\" font-bold=\"true\">Body Weight</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblweight\">\r" +
    "\n" +
    "                                {{ item.BodyWeight}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblbloodgroup\" font-bold=\"true\">Blood Group</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblbloodgrop\">\r" +
    "\n" +
    "                                {{ item.BloodGroupName}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblhealthconditions\" font-bold=\"true\">Health Conditions</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblhealthcondition\">\r" +
    "\n" +
    "                                {{ item.Healthcondition}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.physicalArr.length>0\">\r" +
    "\n" +
    "                        <a data-original-title=\"Edit Physical Attribute & Health Details\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.populateModel('physicalAttributes',item);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <label id=\"lblhealthdescription\" font-bold=\"true\">Health Condition Description</label>\r" +
    "\n" +
    "                        </h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblhealthdescriptions\">\r" +
    "\n" +
    "                                {{ item.HealthConditionDescription}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        </h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divlnkaboutt\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>About My Family </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.lblaboutMyfamily==='' || page.model.lblaboutMyfamily===null\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <a data-original-title=\"Add About My Family\" class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.populateModel('AboutFamily');\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"lstAboutMyFamily\">\r" +
    "\n" +
    "                <div id=\"Div3\" ng-class=\"AboutFamilyReviewStatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblAboutMyFamily\">\r" +
    "\n" +
    "                                    {{page.model.lblaboutMyfamily}}\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                            <label id=\"Label5\" visible=\"false\"></label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.lblaboutMyfamily!='' && page.model.lblaboutMyfamily!=null\">\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" data-original-title=\"Edit About My Family\" ng-click=\"page.model.populateModel('AboutFamily',page.model.lblaboutMyfamily);\">Edit</a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"popupDiv\">\r" +
    "\n" +
    "    <script type=\"text/ng-template\" id=\"parentModalContent.html\">\r" +
    "\n" +
    "        <form name=\"parentForm\" novalidate role=\"form\" ng-submit=\"page.model.ParentSubmit(page.model.parent)\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h3 class=\"modal-title text-center\" id=\"modal-title\">Parent details\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                        <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "                <div class='modal-body clearfix pop_content_my'>\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <h6>Father Details</h6>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lbleducationGroup\" class=\"pop_label_left\" style=\"color: red;\">Father Name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"pop_controls_right form-group\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.parent.txtFathername\" class=\"form-control\" tabindex=\"1\" required/>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblFEducation\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.parent.txtFEducation\" class=\"form-control\" maxlength=\"150\" tabindex=\"2\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblFprofessioncat\" class=\"pop_label_left\">Profession Category</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.parent.ddlFprofessionCatgory\" typeofdata=\"'newProfessionCatgory'\"></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblFProfession\" class=\"pop_label_left\">Designation</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.parent.txtFProfession\" class=\"form-control\" maxlength=\"200\" tabindex=\"3\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblCompanyName\" class=\"pop_label_left\">Company Name </label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.parent.txtCompany\" class=\"form-control\" maxlength=\"100\" tabindex=\"4\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblJobLocation\" class=\"pop_label_left\">Job Location</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"page.model.parent.txtJobLocation\" class=\"form-control\" maxlength=\"100\" tabindex=\"5\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <contact-directive emailhide=\"true\" dmobile=\"parent.ddlMobile\" strmobile=\"parent.txtMobile\" dalternative=\"parent.ddlfathermobile2\" stralternative=\"parent.txtfathermobile2\" dland=\"parent.ddlLandLineCountry\" strareacode=\"parent.txtAreCode\" strland=\"parent.txtLandNumber\"\r" +
    "\n" +
    "                            strmail=\"parent.txtEmail\"></contact-directive>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblFatherFname\" class=\"pop_label_left\">Father's father name </label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=text ng-model=\"page.model.parent.txtFatherFname\" class=\"form-control\" placeholder=\"Enter Father's father name\" maxlength=\"100\" tabindex=\"17\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <contact-directive emailhide=\"false\" dmobile=\"parent.ddlFatherfatherMobileCountryCode\" strmobile=\"parent.txtMobileFatherfather\" dalternative=\"parent.ddlfatherfatherAlternative\" stralternative=\"parent.txtfatherfatherAlternative\" dland=\"parent.ddlFatherFatherLandLineCode\"\r" +
    "\n" +
    "                            strareacode=\"parent.txtGrandFatherArea\" strland=\"parent.txtGrandFatherLandLinenum\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <country-directive countryshow=\"false\" dcountry=\"dcountry\" cityshow=\"false\" othercity=\"false\" dstate=\"parent.ddlFState\" ddistrict=\"parent.ddlFDistric\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"FNativePlace\" class=\"pop_label_left\">Native Place</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.parent.txtFNativePlace\" class=\"form-control\" maxlength=\"100\" tabindex=\"29\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <h6>Mother Details</h6>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblMotherName\" class=\"pop_label_left\" style=\"color: red;\">Mother Name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right form-group\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.parent.txtMName\" class=\"form-control\" maxlength=\"100\" tabindex=\"30\" required/>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblMEducation\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.parent.txtMEducation\" class=\"form-control\" maxlength=\"150\" tabindex=\"31\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblFprofessioncat\" class=\"pop_label_left\">Profession Category</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.parent.ddlMprofessionCatgory\" typeofdata=\"'newProfessionCatgory'\"></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblMProfession\" class=\"pop_label_left\">Designation</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.parent.txtMProfession\" class=\"form-control\" maxlength=\"200\" tabindex=\"32\" />\r" +
    "\n" +
    "                                <label class=\"checkbox-inline checkbox_my\" style=\"padding: 5px 0 0 0;\">\r" +
    "\n" +
    "                <input type=checkbox ng-model=\"page.model.parent.chkbox\"  tabindex=\"33\"  ng-change=\"page.model.housewiseChk(page.model.parent);\"/><span>&nbsp;HouseWife</span>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <div id=\"divmotherprofesseion\" ng-hide=\"parent.chkbox==true\">\r" +
    "\n" +
    "                            <li id=\"divComLocation\" class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label for=\"lblMCompanyName\" class=\"pop_label_left\">Company Name </label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                    <input ng-model=\"page.model.parent.txtMCompanyName\" class=\"form-control\" maxlength=\"100\" tabindex=\"34\" />\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                                <label for=\"lblMJobLocation\" class=\"pop_label_left\">Job Location</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                    <input ng-model=\"page.model.parent.txtMJobLocation\" class=\"form-control\" maxlength=\"100\" tabindex=\"35\" />\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div style=\"height: 15px;\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <contact-directive emailhide=\"true\" dmobile=\"page.model.parent.ddlMMobileCounCodeID\" strmobile=\"page.model.parent.txtMMobileNum\" dalternative=\"page.model.parent.ddlMMobileCounCodeID2\" stralternative=\"page.model.parent.txtMMobileNum2\" dland=\"page.model.parent.ddlMLandLineCounCode\"\r" +
    "\n" +
    "                            strareacode=\"page.model.parent.txtmAreaCode\" strland=\"page.model.parent.txtMLandLineNum\" strmail=\"page.model.parent.txtMEmail\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblMotherFname\" class=\"pop_label_left\">Mother's Father Name </label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                <input type=text ng-model=\"page.model.parent.txtMFatherFname\" class=\"form-control\" placeholder=\"FIRST NAME\" tabindex=\"47\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblMotherFname\" class=\"pop_label_left\">Mother's Last Name </label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                <input type=text ng-model=\"page.model.parent.txtMFatherLname\" class=\"form-control\" placeholder=\"LAST NAME\" tabindex=\"48\" maxlength=\"50\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <contact-directive emailhide=\"false\" dmobile=\"page.model.parent.ddlMotherfatheMobileCountryCode\" strmobile=\"page.model.parent.txtMotherfatheMobilenumber\" dalternative=\"page.model.parent.ddlmotherfatheralternative\" stralternative=\"page.model.parent.txtmotherfatheralternative\"\r" +
    "\n" +
    "                            dland=\"page.model.parent.ddlMotherFatherLandLineCode\" strareacode=\"page.model.parent.txtMotherFatherLandLineareacode\" strland=\"page.model.parent.txtMotherFatherLandLinenum\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <country-directive countryshow=\"false\" dcountry=\"dcountry\" cityshow=\"false\" othercity=\"false\" dstate=\"page.model.parent.ddlMState\" ddistrict=\"page.model.parent.ddlMDistrict\"></country-directive>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"MNativePlace\" class=\"pop_label_left\">Native Place</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input type=text ng-model=\"page.model.parent.txtMNativePlace\" class=\"form-control\" maxlength=\"150\" tabindex=\"60\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"ParentIntercaste\" class=\"pop_label_left\">Are parents interCaste ? </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <md-radio-group name=\"rbtlParentIntercaste\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.parent.rbtlParentIntercaste\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                <md-radio-button value=\"0\">No </md-radio-button>\r" +
    "\n" +
    "                            </md-radio-group>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div ng-if=\"page.model.parent.rbtlParentIntercaste==='1' || page.model.parent.rbtlParentIntercaste===1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <li id=\"divddlFatherCaste\" class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <label for=\"lblFCaste\" class=\"pop_label_left\">Father Caste</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <select multiselectdropdown ng-model=\"page.model.parent.ddlFatherCaste\" typeofdata=\"'caste'\" required></select>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                            <li id=\"divddlMotherCaste\" class=\"clearfix form-group\">\r" +
    "\n" +
    "                                <label for=\"lblMCaste\" class=\"pop_label_left\">Mother Caste</label>\r" +
    "\n" +
    "                                <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                    <select multiselectdropdown ng-model=\"page.model.parent.ddlMotherCaste\" typeofdata=\"'caste'\"></select>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"row \">\r" +
    "\n" +
    "                            <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <edit-footer></edit-footer>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </script>\r" +
    "\n" +
    "    <script type=\"text/ng-template\" id=\"AddressModalContent.html\">\r" +
    "\n" +
    "        <form name=\"addressForm\" novalidate role=\"form\" ng-submit=\"page.model.contactAddressSubmit(page.model.AdrrObj)\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h3 class=\"modal-title text-center\" id=\"modal-title\">Contact Details\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                        <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "                <div class=\"modal-body clearfix pop_content_my\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblHouse_flat\" class=\"pop_label_left\">House/Flat number<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right form-group\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtHouse_flat\" class=\"form-control\" maxlength=\"50\" tabindex=\"1\" required/>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblApartmentName\" class=\"pop_label_left\">Apartment name</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtApartmentName\" class=\"form-control\" maxlength=\"150\" tabindex=\"2\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblStreetName\" class=\"pop_label_left\">Street name</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtStreetName\" class=\"form-control\" maxlength=\"150\" tabindex=\"3\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblAreaName\" class=\"pop_label_left\">Area Name</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtAreaName\" class=\"form-control\" maxlength=\"150\" tabindex=\"4\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lbleducationGroup\" class=\"pop_label_left\">Landmark</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtLandmark\" class=\"form-control\" maxlength=\"150\" tabindex=\"5\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <country-directive countryshow=\"true\" cityshow=\"false\" othercity=\"false\" dcountry=\"page.model.AdrrObj.ddlCountryContact\" dstate=\"page.model.AdrrObj.ddlStateContact\" ddistrict=\"page.model.AdrrObj.ddlDistricContact\" require=true></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblCityParentContactPopupgroup\" class=\"pop_label_left\">City<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtCity\" class=\"form-control\" tabindex=\"9\" maxlength=\"100\" required/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblZip_pin\" class=\"pop_label_left\">Zip/Pin 	</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <input ng-model=\"page.model.AdrrObj.txtZip_no\" class=\"form-control\" maxlength=\"8\" tabindex=\"10\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"row\">\r" +
    "\n" +
    "                            <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <edit-footer></edit-footer>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script type=\"text/ng-template\" id=\"PhysicalAttributeModalContent.html\">\r" +
    "\n" +
    "        <form name=\"PhysicalForm\" novalidate role=\"form\" ng-submit=\"page.model.physicalAtrrSubmit(page.model.physicalObj)\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h3 class=\"modal-title text-center\" id=\"modal-title\">Physical Attributes & Health Details of Candidate\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                        <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "                <div class=\"modal-body clearfix pop_content_my\">\r" +
    "\n" +
    "                    <ul id=\"HealthDivClear\">\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblpDiet\" class=\"pop_label_left\">Diet</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <md-radio-group name=\"rbtlDiet\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.physicalObj.rbtlDiet\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                    <md-radio-button value=\"27\" class=\"md-primary\">Veg</md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"28\">Non Veg </md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"29\">Both </md-radio-button>\r" +
    "\n" +
    "                                </md-radio-group>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblpDrink\" class=\"pop_label_left\">Drink</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <md-radio-group name=\"rbtlDrink\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.physicalObj.rbtlDrink\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                    <md-radio-button value=\"30\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"31\">No </md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"32\">Occasional </md-radio-button>\r" +
    "\n" +
    "                                </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblpSmoke\" class=\"pop_label_left\">Smoke</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <md-radio-group name=\"rbtlSmoke\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.physicalObj.rbtlSmoke\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                    <md-radio-button value=\"30\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"31\">No </md-radio-button>\r" +
    "\n" +
    "                                    <md-radio-button value=\"32\">Occasional </md-radio-button>\r" +
    "\n" +
    "                                </md-radio-group>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblpBodyType\" class=\"pop_label_left\">Body Type</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right  select-box-my\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.physicalObj.ddlBodyType\" typeofdata=\"'bodyType'\"></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblBodtWeight\" class=\"pop_label_left\">Body weight</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my select-box-my-double\">\r" +
    "\n" +
    "                                <span>kgs</span>\r" +
    "\n" +
    "                                <input ng-model=\"page.model.physicalObj.txtBWKgs\" class=\"form-control\" tabindex=\"5\" width=\"200px\" ng-keyup=\"page.model.converttolbs(page.model.physicalObj);\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label id=\"lbllbs\" class=\"pop_label_left\">lbs</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "                                    <input ng-model=\"page.model.physicalObj.txtlbs\" class=\"form-control\" text=\"\" onkeyup=\"converttokgs(this.id);\" onkeydown=\"return checkwhitespace(event,this.id);\" onblur=\"validateLbs(this)\" tabindex=\"6\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblBloodGroup\" class=\"pop_label_left\">Blood Group</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.physicalObj.ddlBloodGroup\" typeofdata=\"'bloodGroup'\"></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblHealthConditions\" class=\"pop_label_left\">Health Conditions</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <div class=\"select-box-my\">\r" +
    "\n" +
    "                                    <select multiselectdropdown ng-model=\"page.model.physicalObj.ddlHealthConditions\" typeofdata=\"'healthCondition'\"></select>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblHealthCondition\" class=\"pop_label_left\">Health Condition Description</label>\r" +
    "\n" +
    "                            <div class=\"\">\r" +
    "\n" +
    "                                <textarea ng-model=\"page.model.physicalObj.txtHealthCondition\" class=\"form-control\" tabindex=\"9\" rows=\"4\" style=\"width: 515px;\" maxlength=\"200\"></textarea>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"row\">\r" +
    "\n" +
    "                            <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <edit-footer></edit-footer>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </script>\r" +
    "\n" +
    "    <script type=\"text/ng-template\" id=\"AboutFamilyModalContent.html\">\r" +
    "\n" +
    "        <form name=\"AboutForm\" novalidate role=\"form\" ng-submit=\"page.model.AboutMyfamilySubmit(page.model.aboutFamilyObj)\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h3 class=\"modal-title text-center\" id=\"modal-title\">About My Family\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                        <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"form-group\">\r" +
    "\n" +
    "                    <label class=\"control-label\">(Do Not Mention Any Contact Information Phone Numbers, Email Id’s or your Profile May be Rejected.)</label>\r" +
    "\n" +
    "                    <textarea class=\"form-control\" ng-model=\"page.model.aboutFamilyObj.txtAboutUs\" required=\"required\" type=\"text\"> </textarea>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </script>\r" +
    "\n" +
    "    <alert-directive></alert-directive>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <style>\r" +
    "\n" +
    "        .md-dialog-container {\r" +
    "\n" +
    "            z-index: 99999999999;\r" +
    "\n" +
    "        }\r" +
    "\n" +
    "    </style>"
  );


  $templateCache.put('app/editPartnerpreference/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "    <!--<div class=\"employee_review_check clearfix\">\r" +
    "\n" +
    "        <md-checkbox ng-model=\"chkboxedu\" style=\"padding: 9px 13px 0px 0px;\" class=\"pull-right\" name=\"chkboxedu\" aria-label=\"Checkbox 1\"><span style=\"color: black;\">Review</span>\r" +
    "\n" +
    "        </md-checkbox>\r" +
    "\n" +
    "        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "    </div>-->\r" +
    "\n" +
    "    <page-review dispaly-name=\"'PartnerPreference details'\" sectionid=\"'16,17,18,20,21,22'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "    <div ng-repeat=\"item in page.model.partnerPrefArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_item\">\r" +
    "\n" +
    "            <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "                <h4>PartnerPreference Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.partnermodifiedby}}</span>\r" +
    "\n" +
    "                </h4>\r" +
    "\n" +
    "                <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.partnerPrefArr.length===0\">\r" +
    "\n" +
    "                    <a ng-click=\"page.model.partnerprefPopulate();\" class=\"edit_page_add_button\" href=\"javascript:void(0);\">Add</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "                <div id=\"uppartner\">\r" +
    "\n" +
    "                    <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanel21\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"partnergen\" style=\"color:Red;font-weight:bold;\">Gender</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblpartnergen\" style=\"color:Red;\">{{ item.Gender}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div ng-if=\"page.model.partnerPrefArr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                            <a ng-click=\"page.model.partnerprefPopulate(item);\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\">Edit</a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel10\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"agegap\" style=\"font-weight:bold;\">Age Gap</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblagegap\">{{ item.AgeGap}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel13\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"height\" style=\"font-weight:bold;\">Height</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblheight\">{{ item.Height}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel15\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"mothertongue\" style=\"font-weight:bold;\">mother tongue</span></h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblmothertongue\">{{ item.Mothertongue }}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel16\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"Religion\" style=\"font-weight:bold;\">Religion</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblReligion\">{{ item.Religion}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel17\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"caste\" style=\"font-weight:bold;\">caste</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblcaste\">{{ item.Caste}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel1\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"subcaste\" style=\"font-weight:bold;\">subcaste</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblsubcaste\">{{ item.Subcaste}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel2\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"maritalstatus\" style=\"font-weight:bold;\">marital status</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblmaritalstatus\">{{ item.MaritalStatus}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"updateeducationgroup\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"Education\" style=\"font-weight:bold;\">Education</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblEducation\">{{ item.EducationGroup!=null?item.EducationGroup:item.EducationCategory}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanel5\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"profession\" style=\"font-weight:bold;\">profession</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblprofession\">{{ item.ProfessionGroup}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanel6\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"MangalikKujadosham\" style=\"font-weight:bold;\">Manglik/Kujadosham</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblMangalikKujadosham\">{{ item.Kujadosham}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel7\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"preferredstarLanguage\" style=\"font-weight:bold;\">preferred star Language</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblpreferredstarLanguage\">{{ item.StarLanguage}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanel8\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"preferredstar\" style=\"font-weight:bold;\">Non preferred stars</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblpreferredstar\">{{ item.Stars}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel12\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"Diet\" style=\"font-weight:bold;\">Diet</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblDiet\">{{ item.Diet}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanel18\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"preferredCountry\" style=\"font-weight:bold;\">Domicile</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblpreferredCountry\">{{ item.Domicel}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanel18\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"preferredCountry\" style=\"font-weight:bold;\">preferred Country</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblpreferredCountry\">{{ item.CountryName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel19\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"preferredState\" style=\"font-weight:bold;\">preferred State</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblpreferredState\">{{ item.StateName}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel36\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"RegionName\" style=\"font-weight:bold;\">Region</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblRegionName\">{{ item.RegionName}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanel40\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"BranchName\" style=\"font-weight:bold;\">Branch</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblBranchName\">{{ item.BranchName}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_item\">\r" +
    "\n" +
    "            <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "                <h4>Partner Description ( Describe qualities you are looking for in your partner)</h4>\r" +
    "\n" +
    "                <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                    <div ng-if=\"item.PartnerDescripition==='' || item.PartnerDescripition===null\">\r" +
    "\n" +
    "                        <a id=\"lnkpartnerdesc\" class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.partnerdescPopulate();\"> Add</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanel9\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblpartnerdesc\">{{ page.model.partnerDescription}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-if=\"item.PartnerDescripition!=''  && item.PartnerDescripition!=null\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                        <a id=\"lnkpartnerdesc\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.partnerdescPopulate(item);\"> Edit</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"partnerPrefContent.html\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <form name=\"partnerFormForm\" novalidate role=\"form\" ng-submit=\"page.model.partnerPrefSubmit(page.model.partnerObj)\" accessible-form>\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Partnerprefernece details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <ul id=\"divclear\">\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblGender\" class=\"pop_label_left\">Gender</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-radio-group name=\"rbtlGender\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.partnerObj.rbtlGender\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                        <md-radio-button value=\"1\" class=\"md-primary\">Male</md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"2\">Female </md-radio-button>\r" +
    "\n" +
    "                    </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblagegapp\" class=\"pop_label_left\">Age Gap<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my select-box-my-double input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.partnerObj.ddlFromAge\" ng-options=\"item.value as item.label for item in page.model.ageGapArr\" required></select>\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.partnerObj.ddlToAge\" ng-options=\"item.value as item.label for item in page.model.ageGapArr\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblpatnerheight\" class=\"pop_label_left\">Height<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my select-box-my-double input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown required ng-model=\"page.model.partnerObj.ddlFromheight\" typeofdata=\"'height'\" required></select>\r" +
    "\n" +
    "                        <select multiselectdropdown required ng-model=\"page.model.partnerObj.ddltoHeight\" typeofdata=\"'height'\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblReligion\" class=\"pop_label_left\">Religion<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple=\"multiple\" ng-model=\"page.model.partnerObj.lstReligion\" typeofdata=\"'Religion'\" ng-change=\"page.model.changeBind('caste',page.model.partnerObj.lstReligion,page.model.partnerObj.lstMothertongue);\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblmothertongue\" class=\"pop_label_left\">Mother tongue<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstMothertongue\" typeofdata=\"'Mothertongue'\" ng-change=\"page.model.changeBind('caste',page.model.partnerObj.lstReligion,page.model.partnerObj.lstMothertongue);\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblpartnerCaste\" class=\"pop_label_left\">Caste<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstCaste\" ng-options=\"item.value as item.label for item in page.model.casteArr\" ng-change=\"page.model.changeBind('subCaste',page.model.partnerObj.lstCaste);\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblSubcaste\" class=\"pop_label_left\">Subcaste</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my \">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstSubcaste\" ng-options=\"item.value as item.label for item in page.model.subCasteArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblMaritalstatus\" class=\"pop_label_left\">Marital status<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstMaritalstatus\" typeofdata=\"'MaritalStatus'\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblEducationcategory\" class=\"pop_label_left\">Education category</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstEducationcategory\" typeofdata=\"'educationcategory'\" ng-change=\"page.model.changeBind('EducationCatgory',page.model.partnerObj.lstEducationcategory);\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblEducationgroup\" class=\"pop_label_left\">Education group</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstEducationgroup\" ng-options=\"item.value as item.label for item in page.model.eduGroupArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblEmployedin\" class=\"pop_label_left\">Employed in</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstEmployedin\" typeofdata=\"'ProfCatgory'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblProfessiongroup\" class=\"pop_label_left\">Profession group </label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstProfessiongroup\" typeofdata=\"'ProfGroup'\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblPreferredstar\" class=\"pop_label_left\">Domicile</label>\r" +
    "\n" +
    "                    <md-radio-group name=\"rbtDomacile\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.partnerObj.rbtDomacile\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                        <md-radio-button value=\"0\" class=\"md-primary\">India</md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"1\">Abroad </md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"2\">Both</md-radio-button>\r" +
    "\n" +
    "                    </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblPreferredcountry\" class=\"pop_label_left\">Preferred country 	</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstPreferredcountry\" typeofdata=\"'Country'\" ng-change=\"page.model.changeBind('Country',page.model.partnerObj.lstPreferredcountry);\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblPreferredstate\" class=\"pop_label_left\">Preferred state</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstPreferredstate\" ng-options=\"item.value as item.label for item in page.model.stateArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" id=\"divRegioncontrol\">\r" +
    "\n" +
    "                    <label for=\"lblRegion\" class=\"pop_label_left\">Region</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstRegion\" typeofdata=\"'region'\" ng-change=\"page.model.changeBind('region',page.model.partnerObj.lstRegion);\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblBranch\" class=\"pop_label_left\">Branch</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstBranch\" ng-options=\"item.value as item.label for item in page.model.branchArr\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblDiet\" class=\"pop_label_left\">Diet</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-radio-group name=\"rbtDiet\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.partnerObj.rbtDiet\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                        <md-radio-button value=\"27\" class=\"md-primary\">Veg</md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"28\"> Non Veg </md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"29\"> Both </md-radio-button>\r" +
    "\n" +
    "                    </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblManglik\" class=\"pop_label_left\">Manglik/Kuja dosham</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-radio-group name=\"rbtManglikKujadosham\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.partnerObj.rbtManglikKujadosham\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                        <md-radio-button value=\"0\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"1\">No </md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"2\"> Does Not Matter </md-radio-button>\r" +
    "\n" +
    "                    </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblPreferredstar\" class=\"pop_label_left\">Preferred star Language</label>\r" +
    "\n" +
    "                    <md-radio-group name=\"rbtPreferredstarLanguage\" style=\"font-weight: 700;color:black;\" ng-change=\"page.model.changeBind('star',page.model.partnerObj.rbtPreferredstarLanguage);\" layout=\"row\" ng-model=\"page.model.partnerObj.rbtPreferredstarLanguage\" class=\"md-block\"\r" +
    "\n" +
    "                        flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                        <md-radio-button value=\"1\" class=\"md-primary\">Telugu</md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"2\">Tamil </md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"3\">Kannada</md-radio-button>\r" +
    "\n" +
    "                    </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <label for=\"\" class=\"pop_label_left\">Star Preference</label>\r" +
    "\n" +
    "                    <md-radio-group name=\"rbtPreferredstars\" style=\"font-weight: 700;color:black;\" layout=\"row\" ng-model=\"page.model.partnerObj.rbtPreferredstars\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                        <md-radio-button value=\"0\" class=\"md-primary\">Preferredstars</md-radio-button>\r" +
    "\n" +
    "                        <md-radio-button value=\"1\">NonPreferredstars </md-radio-button>\r" +
    "\n" +
    "                    </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"\" class=\"pop_label_left\"></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown multiple ng-model=\"page.model.partnerObj.lstpreferedstars\" ng-options=\"item.value as item.label for item in page.model.starArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"partnerDescContent.html\">\r" +
    "\n" +
    "    <form name=\"aboutForm\" novalidate role=\"form\" ng-submit=\"page.model.partnerDescriptionSubmit(page.model.partnerDescObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Partner Description\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <textarea ng-model=\"page.model.partnerDescObj.txtpartnerdescription\" style=\"width: 500px; height: 150px;\" class=\"col-lg-10\" maxlength=\"1000\" required ng-class=\"form-control\" required />\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <br/>\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('app/editProfileSetting/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Profile Settings\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\" ng-repeat=\"item in page.model.profileSettingArr\">\r" +
    "\n" +
    "            <div id=\"fullupdatefatherbrother\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelFBProfession\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblprofilecurrentstatus\" font-bold=\"true\">Application Status</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblprofcurrentstatus\">{{item.ProfileStatus}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanellnkFatherSister\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showprofilepopup('profileSetting',item);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpApplicationStatusmodifybydiv\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ApplicationStatusmodifybydiv\" class=\"edit_page_details_item_desc clearfix\" visible={{item.EmployeeName !=\"\" && Eval( \"EmployeeName\")!=null?true:false }}>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"ApplicationStatusmodifyby\" font-bold=\"true\">Application Status ModifiedBy</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblApplicationStatusmodifyby\">{{item.EmployeeName}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"inactivediv\" ng-show=\"item.ProfileStatusID==='55' || item.ProfileStatusID===55\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"divtotalinactive\">\r" +
    "\n" +
    "                            <div id=\"UpdatePanel9\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"span1\" font-bold=\"true\">No of Days to be inactivated </span>\r" +
    "\n" +
    "                                    </h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblNoofDaysinactivated\">{{item.NoofDaysinactivated}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"UpdatePanel12\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"span6\" font-bold=\"true\">Reason for InActive</span>\r" +
    "\n" +
    "                                    </h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblReason4InActive\">{{item.Reason4InActive}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"UpdatePanel13\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"span8\" font-bold=\"true\">Requested By</span>\r" +
    "\n" +
    "                                    </h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblRequestedBy\">{{item.RequestedBy}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelFBProfessionDetails\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"profilegrade\" font-bold=\"true\">Profile Grade</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblprofilegrade\">{{item.ProfileGrade}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"Updatelblprofilegrademodifyby\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\" ng-show=\"item.ProfileGradeModifiedByEmp !=='' && item.ProfileGradeModifiedByEmp!=null\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblprofilegrademodifyby\" font-bold=\"true\">Profile Grade ModifiedBy</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"ProfileGradeModifiedByEmp\">{{item.ProfileGradeModifiedByEmp}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divconfidential\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Confidential status\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\" ng-repeat=\"item in page.model.ConfidentialArr\">\r" +
    "\n" +
    "            <div id=\"UpdatePanel2\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelFBCurrentLocation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"isConfidential\" font-bold=\"true\">isConfidential</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblisConfidential\">{{item.ConfindentialStatus}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanel1\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showprofilepopup('confidential',item);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanel6\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"span5\" font-bold=\"true\">Very High Confidential</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblvryconfidential\">{{item.HighConfidentialStatus}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\" id=\"divcprofiledisplaysettings\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Profile Display Settings\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\" ng-repeat=\"item in page.model.profileDisplayArr\">\r" +
    "\n" +
    "            <div id=\"UpdatePanel4\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanel3\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showprofilepopup('profileDisplay',item);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanel7\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"span3\" font-bold=\"true\">Display In</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblProfileDisplayName\">{{item.ProfileDisplayName}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanel8\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblprofileloginstatus\" font-bold=\"true\">Profile Current Login Status Is</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblprofileloginstatusis\">{{item.LoginStatusName}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"divBlockdisplay\" visible={{item.Blockflag==\"1\" ? true: false }}>\r" +
    "\n" +
    "                        <div id=\"uplblcreateblockeddate\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"lblcreatedate\">{{item.LoginStatusName == \"Blocked\" ? \"Blocked Date\": \"Allowed Date\" }}</span>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblcreateblockeddate\">{{item.BlockDate}}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"uplblblockedempname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"lblblockedempname\">{{item.LoginStatusName == \"Blocked\" ? \"Blocked By\": \"Allowed By\" }}</span>\r" +
    "\n" +
    "                                </h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"span2\">{{item.BlockEmapName}}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"upblockedreason\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"lblreason\">{{item.LoginStatusName == \"Blocked\" ? \"Reason For Blocked\": \"Reason For Allowed\" }}</span>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblBlockedReason\">{{item.ProfileBlockReason}}</span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Grade Selections\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div id=\"updatecontenGrade\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"divAddGrade\" visible=\"false\">\r" +
    "\n" +
    "                    <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                        <div id=\"updateAddlnkGrade\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.showprofilepopup('grading');\">Add</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\" ng-repeat=\"item in page.model.gradeSelectionArr\">\r" +
    "\n" +
    "            <div id=\"UpdatePanel14\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelGrade\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.showprofilepopup('grading',item);\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatepanelEdu\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblEducationGradeText\" font-bold=\"true\">Education</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblEducationGrade\">{{item.EducationGrade}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelProfession\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblprofessionGradeText\" font-bold=\"true\">Profession</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblprofessionGrade\">{{item.ProfileGrade}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"updateproperty\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblpropertyGradeText\">Property</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblpropertyGrade\">{{item.PropertyGrade}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"updatefamily\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblfamilyGradeText\">Family</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblfamilyGrade\">{{item.FamilyGrade}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"updatePhoto\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblPhotoGradeText\">Photo</span>\r" +
    "\n" +
    "                            </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblPhotoGrade\">{{item.PhotoGrade}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePaneCreatedBYEmp\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblCreatedBYEmp\">Created By</span> </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblCreatedBYEmpGrade\">{{item.CreatedBYEmp}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdateCreatedDateGrade\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblCreatedDateGrade\">CreatedDate</span> </h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblCreatedDatedisplay\">{{item.CreatedDate}}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"profileSettingContent.html\">\r" +
    "\n" +
    "    <form name=\"psForm\" novalidate role=\"form\" ng-submit=\"page.model.profileSettingSubmit(page.model.psObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Profile Settings\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\"></ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Application Status</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlapplicationstatus\" layout=\"row\" ng-model=\"page.model.psObj.rdlapplicationstatus\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"54\" class=\"md-primary\">Active</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"55\"> Inactive </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <div id=\"divinactive\" ng-if=\"page.model.psObj.rdlapplicationstatus==='55' || page.model.psObj.rdlapplicationstatus===55\">\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "                        <label for=\"Relationshiptype\" class=\"pop_label_left\">No of Days to be inactivated </label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input type=\"number\" ng-model=\"page.model.psObj.txtnoofdaysinactive\" class=\"form-control\" MaxLength=\"25\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "                        <label for=\"Relationshiptype\" class=\"pop_label_left\">Reason for InActive</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <textarea ng-model=\"page.model.psObj.txtreasonforinactive\" class=\"form-control\" TabIndex=\"9\" MaxLength=\"2000\"></textarea>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "                        <label for=\"Relationshiptype\" class=\"pop_label_left\">Requested By</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <select multiselectdropdown id=\"estt\" ng-model=\"page.model.psObj.ddlrequestedby\" typeofdata=\"'childStayingWith'\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Profile Grade</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlprofilegrade\" layout=\"row\" ng-model=\"page.model.psObj.rdlprofilegrade\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">A</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"2\"> B </md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"3\"> C </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"confidentialContent.html\">\r" +
    "\n" +
    "    <form name=\"refForm\" novalidate role=\"form\" ng-submit=\"page.model.confidentialSubmit(page.model.csObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Confidential Settings\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Firstname\" class=\"pop_label_left\">isConfidential</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <md-checkbox ng-model=\"page.model.csObj.chkisconfidential\" name=\"chkisconfidential\" aria-label=\"Checkbox 1\">\r" +
    "\n" +
    "                        </md-checkbox>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Firstname\" class=\"pop_label_left\">Very High Confidential</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <md-checkbox ng-model=\"page.model.csObj.chkvryhighconfidential\" name=\"chkvryhighconfidential\" aria-label=\"Checkbox 1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </md-checkbox>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"profileDisplayContent.html\">\r" +
    "\n" +
    "    <form name=\"psdForm\" novalidate role=\"form\" ng-submit=\"page.model.profileSettingDisplaySubmit(page.model.psdObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Profile Display Settings\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"displayin\" class=\"pop_label_left\">Display In</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdldisplayin\" layout=\"row\" ng-model=\"page.model.psdObj.rdldisplayin\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"279\" class=\"md-primary\">Only Online</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"280\"> Onlly Offline </md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"434\"> Both </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"displayin\" class=\"pop_label_left\">Password Block/Release</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlpwdblock\" layout=\"row\" ng-model=\"page.model.psdObj.rdlpwdblock\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"439\" class=\"md-primary\">Allow</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"440\"> Block </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"displayin\" class=\"\" style=\"color: #9b2828; font-size: 15px;\">Reason</label>\r" +
    "\n" +
    "                    <textarea ng-model=\"page.model.psdObj.txtblockedreason\" class=\"col-lg-10 form-control\" MaxLength=\"1000\" />\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"gradeSelectionContent.html\">\r" +
    "\n" +
    "    <form name=\"gradeForm\" novalidate role=\"form\" ng-submit=\"page.model.gradeSubmit(page.model.gradeObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Grade Selections\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.gradeObj.ddlEducationgrade\" typeofdata=\"'gradeSelection'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Profession</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.gradeObj.ddlProfessionGrade\" typeofdata=\"'gradeSelection'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Property</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.gradeObj.ddlpropertyGrade\" typeofdata=\"'gradeSelection'\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Family</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.gradeObj.ddlfamilyGrade\" typeofdata=\"'gradeSelection'\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Relationshiptype\" class=\"pop_label_left\">Photo</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.gradeObj.ddlphotoGrade\" typeofdata=\"'gradeSelection'\"></select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('app/editProperty/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Property details'\" sectionid=\"'34'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div id=\"upppp\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "                <h4>Property Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" visible=\"false\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.propertymodifiedby}}</span>\r" +
    "\n" +
    "                </h4>\r" +
    "\n" +
    "                <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.propertyArr.length===0\">\r" +
    "\n" +
    "                    <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.populateProperty()\">Add</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\" ng-repeat=\"item in page.model.propertyArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div id=\"uplFamilyStatus\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblfamilystatus\" style=\"font-weight: bold;\">Family Status</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblfmstatus\">{{(item.FamilyStatus!=null && item.FamilyStatus!=\"\")?item.FamilyStatus:\"Not Specified\" }}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-if=\"page.model.propertyArr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                        <a id=\"lnkedittt\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.populateProperty(item)\">Edit</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                    <h6>\r" +
    "\n" +
    "                        <span id=\"lblproperty\" style=\"font-weight: bold;\">Property Value</span></h6>\r" +
    "\n" +
    "                    <h5>\r" +
    "\n" +
    "                        <span id=\"lblpropertyval\">{{((item.PropertyValue!=null && item.PropertyValue!=\"\")?item.PropertyValue+\" Lakhs\":\"\")}}</span>\r" +
    "\n" +
    "                    </h5>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"isproperty\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h6>\r" +
    "\n" +
    "                        <label id=\"lblpropertysharedproperty\" style=\"font-weight: bold;\">Property Type</label></h6>\r" +
    "\n" +
    "                    <h5>\r" +
    "\n" +
    "                        <span id=\"lblisProperty\">{{((item.isProperty!=null && item.isProperty!=\"\")?item.isProperty:\"Not Specified\") }}</span></h5>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                    <h6>\r" +
    "\n" +
    "                        <span id=\"lblpropdet\" style=\"font-weight: bold;\">Property Details</span></h6>\r" +
    "\n" +
    "                    <h5>\r" +
    "\n" +
    "                        <span id=\"lblpropertydetails\">{{(item.PropertyDetails!=null && (item.PropertyDetails!=\"\"))?item.PropertyDetails:\"\"}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <hr>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script type=\"text/ng-template\" id=\"propertyContent.html\">\r" +
    "\n" +
    "        <form name=\"propertyForm\" novalidate role=\"form\" ng-submit=\"page.model.propertySubmit(page.model.proObj)\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h3 class=\"modal-title text-center\">Property Details\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"cancel();\">\r" +
    "\n" +
    "                        <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <ul id=\"ulproperty\">\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblfamilyStatus\" class=\"pop_label_left\">Family Status</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <select multiselectdropdown ng-model=\"page.model.proObj.ddlFamilyStatus\" typeofdata=\"'familyStatus'\"></select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix\">\r" +
    "\n" +
    "                        <label for=\"lblSharedProperty\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Is shared property</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                            <md-radio-group name=\"rdlSharedProperty\" layout=\"row\" ng-model=\"page.model.proObj.rdlSharedProperty\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                            </md-radio-group>\r" +
    "\n" +
    "                        </md-input-container>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\" style=\"display: none;\">\r" +
    "\n" +
    "                        <label for=\"lblQuantity\" class=\"pop_label_left\">Quantity</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.proObj.txtQuantity\" class=\"form-control col-lg-3\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblValueofproperty\" class=\"pop_label_left\">Value of property</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my select-box-my-double\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.proObj.txtValueofproperty\" class=\"form-control\" maxlength=\"5\" onkeydown=\"return (((event.keyCode == 8) || (event.keyCode == 46) || (event.keyCode >= 35 && event.keyCode <= 40) || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)));\"\r" +
    "\n" +
    "                            />\r" +
    "\n" +
    "                            <span font-bold=\"true\">Lakhs</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblQuantity\" class=\"pop_label_left\">Property description</label>\r" +
    "\n" +
    "                        <div class=\"\">\r" +
    "\n" +
    "                            <textarea ng-model=\"page.model.proObj.txtPropertydesc\" style=\"width:100%;\" maxlength=\"500\" rows=\"5\" width=\"515\"></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <div style=\"display: none;\">\r" +
    "\n" +
    "                            <label for=\"lblShowingviewprofile\" class=\"pop_label_left\">Showing view profile</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "                                <label class=\"\">\r" +
    "\n" +
    "                    <input ng-model=\"page.model.proObj.rbtShowViewProfile\" value=\"1\" type=\"radio\" checked><span>&nbsp;Yes</span>\r" +
    "\n" +
    "                </label> &nbsp;\r" +
    "\n" +
    "                                <label class=\"\"><input ng-model=\"page.model.proObj.rbtShowViewProfile\" value=\"0\" type=\"radio\"><span>&nbsp;No</span>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"row \">\r" +
    "\n" +
    "                        <edit-footer></edit-footer>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/editReference/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Reference details'\" sectionid=\"'29'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Reference Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" visible=\"false\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.referencemodifiedby}}</span></h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <a class=\"edit_page_add_button\" href=\"javascript:void(0)\" ng-click=\"page.model.referencePopulate();\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"fullupdate\">\r" +
    "\n" +
    "                <div ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\" ng-repeat=\"item in page.model.ReferenceArr\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div id=\"uplRelationShipType\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"RelationShipType\" style=\"font-weight:bold;\">RelationShip Type</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblRelationShipType\">{{item.Relatioshiptype }}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div ng-if=\"page.model.ReferenceArr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                            <a class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.referencePopulate(item);\">Edit</a>\r" +
    "\n" +
    "                            <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup(item.RefrenceCust_Reference_ID)\">Delete</a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"Name\" style=\"font-weight:bold;\">Name</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblName\">{{item.RefrenceName }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"uplEducationRef\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"uplProfessionDetails\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"ProfessionDetails\" style=\"font-weight:bold;\">Profession</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblProfessionDetails\">{{item.RefrenceProfessionDetails }}</span>\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"uplNativePlace\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"NativePlace\" style=\"font-weight:bold;\">Native Place</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblNativePlace\">{{item.RefrenceNativePlace }}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"uplCurrentLocation\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"CurrentLocation\" style=\"font-weight:bold;\">Current Location</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblCurrentLocation\">{{item.RefenceCurrentLocation }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"update0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ownerdiv0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"uplContacts\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"Contacts\" style=\"font-weight:bold;\">Contacts</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblContacts\">{{item.RefrenceMobileNumberWithcode+(item.RefrenceLandNumberwithCode!=null&&item.RefrenceLandNumberwithCode!=\"\"?\"&\"+item.RefrenceLandNumberwithCode:\"\") }}</span></h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"uplEmail\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"Email\" style=\"font-weight:bold;\">Email</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblEmail\">{{item.RefrenceEmail }}</span></h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"uplNarration\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Narration\" style=\"font-weight:bold;\">Narration</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblNarration\">{{item.RefrenceNarration }}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <hr>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <script type=\"text/ng-template\" id=\"referenceContent.html\">\r" +
    "\n" +
    "        <form name=\"refForm\" novalidate role=\"form\" ng-submit=\"page.model.refenceSubmit(page.model.refObj)\" accessible-form>\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <h3 class=\"modal-title text-center\">Reference Details\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                        <ng-md-icon icon=\"close\" style=\"fill:#665454\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "                <ul>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"Relationshiptype\" class=\"pop_label_left\">Relationship type<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                            <select multiselectdropdown ng-model=\"page.model.refObj.ddlRelationshiptype\" typeofdata=\"'RelationshipType'\" required></select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"Firstname\" class=\"pop_label_left\">First name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.refObj.txtFname\" class=\"form-control\" tabindex=\"2\" maxlength=\"100\" required/>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"Lastname\" class=\"pop_label_left\">Last name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.refObj.txtLname\" class=\"form-control\" tabindex=\"3\" maxlength=\"50\" required/>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"Professiondetails\" class=\"pop_label_left\">Profession</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.refObj.txtProfessiondetails\" class=\"form-control\" tabindex=\"4\" maxlength=\"200\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <country-directive countryshow=\"true\" cityshow=\"false\" othercity=\"false\" dcountry=\"page.model.refObj.ddlCountry\" dstate=\"page.model.refObj.ddlState\" ddistrict=\"page.model.refObj.ddlDistrict\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"NativePlace\" class=\"pop_label_left\">Native Place</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.refObj.txtNativePlace\" class=\"form-control\" tabindex=\"8\" maxlength=\"100\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblPresentlocation\" class=\"pop_label_left\">Present location </label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.refObj.txtPresentlocation\" class=\"form-control\" tabindex=\"9\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <contact-directive emailhide=\"true\" dmobile=\"page.model.refObj.ddlMobileCountryID\" strmobile=\"page.model.refObj.txtMobileNumber\" dalternative=\"page.model.refObj.ddlMobileCountryID2\" stralternative=\"page.model.refObj.txtMobileNumber2\" dland=\"page.model.refObj.ddlLandLineCountryID\"\r" +
    "\n" +
    "                        strareacode=\"page.model.refObj.txtAreCode\" strland=\"page.model.refObj.txtLandNumber\" strmail=\"page.model.refObj.txtEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblNarration\" class=\"pop_label_left\">Narration</label>\r" +
    "\n" +
    "                        <div class=\"\">\r" +
    "\n" +
    "                            <textarea ng-model=\"page.model.refObj.txtNarrations\" class=\"form-control\" textmode=\"MultiLine\" tabindex=\"21\" rows=\"4\" width=\"515\" maxlength=\"500\"></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label style=\"color: #1e1c1c; font-size: 13px;\"></label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"row \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <edit-footer></edit-footer>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </script>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style>\r" +
    "\n" +
    "    .md-dialog-container {\r" +
    "\n" +
    "        z-index: 99999999999;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    .reviewCls {\r" +
    "\n" +
    "        background-image: url(src/images/img_kaaka_Seal_b.png);\r" +
    "\n" +
    "        background-repeat: no-repeat;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>"
  );


  $templateCache.put('app/editRelative/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Relatives details'\" sectionid=\"'27,28,32,33'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Father's Brother Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" visible=\"false\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.FBemodifiedby}}</span>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.FBArr.length===0\">\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('FB');\" class=\"edit_page_add_button\" tabindex=\"0\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"fullupdatefatherbrother\" ng-repeat=\"item in page.model.FBArr\">\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div id=\"upFatherBrother\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FBName\" style=\"font-weight:bold;\">FB Name</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFBName\">{{item.FatherbrotherName+\"(\"+item.FatherBrotherElderyounger+\")\"}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div ng-if=\"page.model.FBArr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('FB',item);\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\">Edit</a>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup('father brother',item.FatherbrotherCustfamilyID);\">Delete</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFBProfession\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FBEducation\" style=\"font-weight:bold;\">Education</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFBEducation\">{{item.FatherBrotherEducationDetails}}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFBProfessionDetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FBProfessionDetails\" style=\"font-weight:bold;\">Profession</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblProfessionDetails\">{{item.FatherbrotherProfessionDetails }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFBCurrentLocation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FBCurrentLocation\" style=\"font-weight:bold;\">Current Location</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblCurrentLocation\">{{item.FatherbrotherCurrentLocation }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"update0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"ownerdiv0\">\r" +
    "\n" +
    "                                <div id=\"UpdatePanelFBcontacts\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <span id=\"FBcontacts\" style=\"font-weight:bold;\">FB contacts</span></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblFBcontacts\">{{(item.FatherbrotherMobileNumberWithCode!=null?item.FatherbrotherMobileNumberWithCode:'')+\" \"\r" +
    "\n" +
    "                                        +(item.FatherbrotherLandnumberwithcode!=null&&item.FatherbrotherLandnumberwithcode.ToString()!=\"\"?\"&\"+\r" +
    "\n" +
    "                                        item.FatherbrotherLandnumberwithcode:\" \") }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"UpdatePanelFBEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <span id=\"FBEmail\" style=\"font-weight:bold;\">FB Email</span></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblFBEmail\">{{item.FatherbrotherEmail }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Father's Sister Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" visible=\"false\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.FSmodifiedby}}</span>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.FSArr.length===0\">\r" +
    "\n" +
    "                <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('FS');\" tabindex=\"0\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"fullupdatefathersister\" ng-repeat=\"item in page.model.FSArr\">\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div id=\"upFathersister\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FsName\" style=\"font-weight:bold;\">FsName</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFsName\">{{item.FatherSisterName+\"(\"+item.FatherSisterElderyounger+\")\" }}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div ng-if=\"page.model.FSArr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                                <a ng-click=\"page.model.relativePopulatePopulate('FS',item);\" class=\"edit_page_edit_button\" href=\"javascript:void(0);\">Edit</a>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup('father sister',item.FatherSisterCustfamilyID);\">Delete</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFshName\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FshName\" style=\"font-weight:bold;\">Fsh Name</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFshName\">{{item.FatherSisterSpouseName }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFshEducation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"lblEducationfsh\" style=\"font-weight:bold;\">Fsh Education</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFshEducation\">{{item.FatherSisterSpouseEducationDetails }}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFshprofessiondetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"Fshprofessiondetails\" style=\"font-weight:bold;\">Fsh Profession</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFshprofessiondetails\">{{item.FathersisterSpouseProfessionDetails }}</span></h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFshCurrentLocation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FshCurrentLocation\" style=\"font-weight:bold;\">Fsh Current Location</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFshCurrentLocation\">{{item.FatherSisterCurrentLocation }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"UpdatePanelFshNativeplace\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"FshNativeplace\" style=\"font-weight:bold;\">Fsh Native Place</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblFshNativeplace\">{{(item.FathersisterSpouseNativePlace!=null?item.FathersisterSpouseNativePlace:'')+\" \"+(item.FatherSisterSpousDistrict!=null && \r" +
    "\n" +
    "                                                item.FatherSisterSpousDistrict.ToString()!=\"\"? \",\"+item.FatherSisterSpousDistrict:\"\")+\" \"+(item.FatherSisterSpousestate!=null && \r" +
    "\n" +
    "                                                item.FatherSisterSpousestate.ToString()!=\"\"? \",\"+item.FatherSisterSpousestate:\"\")+\" \"+(item.FatherSisterSpousecountry!=null && \r" +
    "\n" +
    "                                                item.FatherSisterSpousecountry.ToString()!=\"\"? \",\"+item.FatherSisterSpousecountry:\"\")  }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div id=\"update1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"ownerdiv1\">\r" +
    "\n" +
    "                                <div id=\"UpdatePanelFShcontactnos\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <span id=\"FShcontactnos\" style=\"font-weight:bold;\">FSh contact nos</span></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblFSHcontacts\">{{(item.FatherSisterspouseMobileNumberWithCode!=null?item.FatherSisterspouseMobileNumberWithCode:'')+\" \"+(item.FatherSisterspouseLandnumberwithcode!=null&&\r" +
    "\n" +
    "                                    item.FatherSisterspouseLandnumberwithcode.ToString()!=\"\"?\"&\"+item.FatherSisterspouseLandnumberwithcode:\"\") }}</span></h5>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"UpdatePanelFSHEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <span id=\"FSHEmail\" style=\"font-weight:bold;\">Fsh Email</span></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblFSHEmail\">{{item.FatherSisterspouseEmail }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Mother's Brother Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" visible=\"false\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.MBmodifiedby}}</span></h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.MBrr.length===0\">\r" +
    "\n" +
    "                <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('MB');\" tabindex=\"0\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"fullupdatemotherbrother\" ng-repeat=\"item in page.model.MBrr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div id=\"upmotherbrother\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"MBName\" style=\"font-weight:bold;\">MB Name</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblMBName\">{{item.MotherBrotherName+\"(\"+item.MotherBrotherElderyounger+\")\" }}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div ng-if=\"page.model.MBrr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('MB',item);\" class=\"edit_page_edit_button\">Edit</a>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup('mother brother',item.MotherBrotherCustfamilyID);\">Delete</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"lblMotherbrithereducation\" style=\"font-weight:bold;\">Education</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblMotherbrithereducationdetails\">{{item.MotherBrotherEducationDetails }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"MBProfessionDetails\" style=\"font-weight:bold;\">Profession</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblMBProfessionDetails\">{{item.MotherBrotherProfessionDetails }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"MBCurrentLocation\" style=\"font-weight:bold;\">Current Location</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblMBCurrentLocation\">{{item.MotherBrotherCurrentLocation }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"update2\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div id=\"ownerdiv2\">\r" +
    "\n" +
    "                                    <div id=\"UpdatePanelMBcontacts\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <span id=\"MBcontacts\" style=\"font-weight:bold;\">MB contacts</span></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblMBcontacts\">{{(item.MotherBrotherMobileNumberWithCode!=null?item.MotherBrotherMobileNumberWithCode:'')+\" \"+(item.MotherBrotherLandnumberwithcode!=null&& \r" +
    "\n" +
    "                                                    item.MotherBrotherLandnumberwithcode.ToString()!=\"\"?\"&\"+item.MotherBrotherLandnumberwithcode:\"\") }}</span></h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"UpdatePanelMBEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <span id=\"MBEmail\" style=\"font-weight:bold;\">MB Email</span></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblMBEmail\">{{item.MotherBrotherEmail }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Mother's Sister Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\" visible=\"false\" runat=\"server\" id=\"spanEduModID\">ModifiedBy :{{page.model.MSmodifiedby}}</span>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.MSArr.length===0\">\r" +
    "\n" +
    "                <a class=\"edit_page_add_button\" href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('MS');\" tabindex=\"0\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"fullupdatemothersister\" ng-repeat=\"item in page.model.MSArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"reviewdiv\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div id=\"upMothersister\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span id=\"MsName\" style=\"font-weight:bold;\">MsName</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblMsName\">{{item.MotherSisterName+\"(\"+item.MotherSisterElderyounger+\")\" }}</span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div ng-if=\"page.model.MSArr.length>0\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" ng-click=\"page.model.relativePopulatePopulate('MS',item);\" class=\"edit_page_edit_button\">Edit</a>\r" +
    "\n" +
    "                                <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup('mother sister',item.MotherSisterCustfamilyID);\">Delete</a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"MshName\" style=\"font-weight:bold;\">Msh Name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMshName\">{{item.MotherSisterSpouseName}}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"lblMshEducation\" style=\"font-weight:bold;\">Msh Education</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblMshEducationdetails\">{{item.MothersisterspouseEducationdetails }}</span></h5>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span style=\"font-weight:bold;\">Msh profession</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span>{{item.MotherSisterProfessionDetails }}</span></h5>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelMshCurrentLocation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"MshCurrentLocation\" style=\"font-weight:bold;\">Msh Current Location</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMshCurrentLocation\">{{item.MotherSisterCurrentLocation }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelMshNativeplace\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"MshNativeplace\" style=\"font-weight:bold;\">Msh Native Place</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMshNativeplace\">{{(item.MotherSisterSpouseNativePlace!=null?item.MotherSisterSpouseNativePlace:'')+\" \"+(item.Mothersisterspousedistrict!=null && \r" +
    "\n" +
    "                                                item.Mothersisterspousedistrict.ToString()!=\"\"? \",\"+item.Mothersisterspousedistrict:\"\")+\" \"+(item.Motherssisterspousestate!=null && \r" +
    "\n" +
    "                                                item.Motherssisterspousestate.ToString()!=\"\"? \",\"+item.Motherssisterspousestate:\"\")+\" \"+(item.MothersisterspouseCountry!=null && \r" +
    "\n" +
    "                                                item.MothersisterspouseCountry.ToString()!=\"\"? \",\"+item.MothersisterspouseCountry:\"\")  }}    </span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"update3\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div id=\"ownerdiv3\">\r" +
    "\n" +
    "                            <div id=\"UpdatePanelMshcontactnos\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"Mshcontactnos\" style=\"font-weight:bold;\">Msh contact nos</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblMshcontactnos\">{{(item.MotherSisterspouseMobileNumberWithCode!=null?item.MotherSisterspouseMobileNumberWithCode:'')+\" \"+(item.MotherSisterspouseLandnumberwithcode!=null \r" +
    "\n" +
    "                                            && item.MotherSisterspouseLandnumberwithcode.ToString()!=\"\" ?\r" +
    "\n" +
    "                                            \"&\"+item.MotherSisterspouseLandnumberwithcode:\"\") }}</span></h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"UpdatePanelMsHEmail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <span id=\"MsHEmail\" style=\"font-weight:bold;\">Msh Email</span></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblMsHEmail\">{{item.MotherSisterspouseEmail }}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"FBModalContent.html\">\r" +
    "\n" +
    "    <form name=\"FBForm\" novalidate role=\"form\" ng-submit=\"FBForm.$valid  && page.model.FBSubmit(page.model.fbObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Father's Brother Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul id=\"ulFatherBrother\">\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"ElderYounger\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Elder/Younger<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlFBElderORyounger\" layout=\"row\" ng-model=\"page.model.fbObj.rdlFBElderORyounger\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"324\" class=\"md-primary\">Elder</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"323\"> Younger </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                        <div ng-messages=\"FBForm.rdlFBElderORyounger.$invalid\">\r" +
    "\n" +
    "                            <div ng-if=\"FBForm.rdlFBElderORyounger.$invalid && (FBForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Fatherbrothername\" class=\"pop_label_left\">Father's brother name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fbObj.txtFatherbrothername\" class=\"form-control\" maxlength=\"100\" tabindex=\"2\" required/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Educationdetails\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fbObj.txtFBEducationdetails\" class=\"form-control\" tabindex=\"3\" maxlength=\"150\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Professiondetails\" class=\"pop_label_left\">Profession</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fbObj.txtFBProfessiondetails\" class=\"form-control\" tabindex=\"4\" maxlength=\"200\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.fbObj.ddlFBMobileCountryID\" strmobile=\"page.model.fbObj.txtFBMobileNumber\" dalternative=\"page.model.fbObj.ddlFBMobileCountryID2\" stralternative=\"page.model.fbObj.txtFBMobileNumber2\" dland=\"page.model.fbObj.ddlFBLandLineCountry\"\r" +
    "\n" +
    "                    strareacode=\"page.model.fbObj.txtFBAreCode\" strland=\"page.model.fbObj.txtFBLandNumber\" strmail=\"page.model.fbObj.txtFBEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblCurrentLocation\" class=\"pop_label_left\">Current Location</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fbObj.txtCurrentLocation\" class=\"form-control\" maxlength=\"150\" tabindex=\"16\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"FSModalContent.html\">\r" +
    "\n" +
    "    <form name=\"FSForm\" novalidate role=\"form\" ng-submit=\"FSForm.$valid  && page.model.FSSubmit(page.model.fsObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Father's Sister Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"FSElderYounger\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Elder/Younger<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlFSElderYounger\" layout=\"row\" ng-model=\"page.model.fsObj.rdlFSElderYounger\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"326\" class=\"md-primary\">Elder</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"325\"> Younger </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                        <div ng-messages=\"FSForm.rdlFSElderYounger.$invalid\">\r" +
    "\n" +
    "                            <div ng-if=\"FSForm.rdlFSElderYounger.$invalid && (FSForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Fathersistername\" class=\"pop_label_left\">Father's sister name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFathersistername\" class=\"form-control\" maxlength=\"100\" tabindex=\"2\" required/>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Husbandfirstname\" class=\"pop_label_left\">Husband first name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFSHusbandfirstname\" class=\"form-control\" maxlength=\"100\" tabindex=\"3\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Husbandlastname\" class=\"pop_label_left\">Husband last name </label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFSHusbandlastname\" class=\"form-control\" maxlength=\"50\" tabindex=\"4\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"FSHEDucation\" class=\"pop_label_left\">FSH Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFSHEDucation\" class=\"form-control\" tabindex=\"5\" maxlength=\"150\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Professiondetails\" class=\"pop_label_left\">FSH Profession</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFSProfessiondetails\" class=\"form-control\" tabindex=\"6\" maxlength=\"200\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <country-directive countryshow=\"false\" dcountry=\"'1'\" cityshow=\"false\" othercity=\"false\" dstate=\"page.model.fsObj.ddlFSHStateID\" ddistrict=\"page.model.fsObj.ddlFSHDistrictID\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"FSHNativePlace\" class=\"pop_label_left\">Native place </label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFSHNativePlace\" class=\"form-control\" tabindex=\"9\" maxlength=\"100\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.fsObj.ddlFSMObileCountryID\" strmobile=\"page.model.fsObj.txtFSMobileNumber\" dalternative=\"page.model.fsObj.ddlFSMObileCountryID2\" stralternative=\"page.model.fsObj.txtFSMobileNumber2\" dland=\"page.model.fsObj.ddlFSHLandCountryID\"\r" +
    "\n" +
    "                    strareacode=\"page.model.fsObj.txtFSHAreaNumber\" strland=\"page.model.fsObj.txtFSHNUmber\" strmail=\"page.model.fsObj.txtFSHEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblCurrentLocation\" class=\"pop_label_left\">Current Location</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.fsObj.txtFSHCurrentLocation\" class=\"form-control\" tabindex=\"21\" maxlength=\"100\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"MBModalContent.html\">\r" +
    "\n" +
    "    <form name=\"MBForm\" novalidate role=\"form\" ng-submit=\"MBForm.$valid  && page.model.MBSubmit(page.model.mbObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Mother's Brother Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul id=\"ulmotherbrother\">\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"MotherElderYounger\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Elder/Younger<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlMBElderYounger\" layout=\"row\" ng-model=\"page.model.mbObj.rdlMBElderYounger\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"328\" class=\"md-primary\">Elder</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"327\"> Younger </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                        <div ng-messages=\"MBForm.rdlMBElderYounger.$invalid\">\r" +
    "\n" +
    "                            <div ng-if=\"MBForm.rdlMBElderYounger.$invalid && (MBForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Motherbrothername\" class=\"pop_label_left\">Mother's brother name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.mbObj.txtMBName\" class=\"form-control\" maxlength=\"100\" tabindex=\"2\" required/>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MBEducation\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.mbObj.txtMBEducation\" class=\"form-control\" tabindex=\"3\" maxlength=\"150\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MBProfessiondetails\" class=\"pop_label_left\">Profession</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <input ng-model=\"page.model.mbObj.txtMBProfessiondetails\" class=\"form-control\" tabindex=\"4\" maxlength=\"200\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.mbObj.ddlMBCountriCode\" strmobile=\"page.model.mbObj.txtMBMobileNum\" dalternative=\"page.model.mbObj.ddlMBCountriCode2\" stralternative=\"page.model.mbObj.txtMBMobileNum2\" dland=\"page.model.mbObj.ddlMBLandLineCountryCode\"\r" +
    "\n" +
    "                    strareacode=\"page.model.mbObj.txtMBAreaCode\" strland=\"page.model.mbObj.txtMBLandLineNum\" strmail=\"page.model.mbObj.txtMBEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MBCurrentLocation\" class=\"pop_label_left\">Current Location</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.mbObj.txtMBCurrentLocation\" class=\"form-control\" tabindex=\"16\" maxlength=\"100\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row \">\r" +
    "\n" +
    "                    <!--<div class=\"col-lg-9\">\r" +
    "\n" +
    "                        <input value=\"Submit\" class=\"button_custom  pull-right\" type=\"submit\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col-lg-3\">\r" +
    "\n" +
    "                        <input value=\"Cancel\" class=\"button_custom button_custom_reset pull-right\" ng-click=\"page.model.cancel();\" type=\"button\">\r" +
    "\n" +
    "                    </div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"MSModalContent.html\">\r" +
    "\n" +
    "    <form name=\"MSForm\" novalidate=\"true\" ng-submit=\"MSForm.$valid  && page.model.MSSubmit(page.model.msObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Mother's Sister Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul id=\"ulmothersister\">\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"MsElderYounger\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Elder/Younger<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlMSElderYounger\" layout=\"row\" ng-model=\"page.model.msObj.rdlMSElderYounger\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"330\" class=\"md-primary\">Elder</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"329\"> Younger </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                        <div ng-messages=\"MSForm.rdlMSElderYounger.$invalid\">\r" +
    "\n" +
    "                            <div ng-if=\"MSForm.rdlMSElderYounger.$invalid && (MSForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"Fathersistername\" class=\"pop_label_left\">Mother's sister name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMSName\" class=\"form-control\" maxlength=\"100\" tabindex=\"2\" required/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MsHusbandfirstname\" class=\"pop_label_left\">Husband first name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMsHusbandfirstname\" class=\"form-control\" maxlength=\"100\" tabindex=\"3\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MsHusbandlastname\" class=\"pop_label_left\">Husband last name </label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMsHusbandlastname\" class=\"form-control\" maxlength=\"50\" tabindex=\"4\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <country-directive countryshow=\"false\" dcountry=\"'1'\" cityshow=\"false\" othercity=\"false\" dstate=\"page.model.msObj.ddlMSisState\" ddistrict=\"page.model.msObj.ddlMsDistrict\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MSHNativePlace\" class=\"pop_label_left\">Native place </label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMSNativePlace\" class=\"form-control\" tabindex=\"7\" maxlength=\"100\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MSHEducationdet\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMSHEducation\" class=\"form-control\" tabindex=\"8\" maxlength=\"150\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"MSProfessiondetails\" class=\"pop_label_left\">Profession</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMSProfessiondetails\" class=\"form-control\" tabindex=\"9\" maxlength=\"200\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.msObj.ddlMSCounCodeID\" strmobile=\"page.model.msObj.txtMSMObileNum\" dalternative=\"page.model.msObj.ddlMSCounCodeID2\" stralternative=\"page.model.msObj.txtMSMObileNum2\" dland=\"page.model.msObj.ddlMSLLCounCode\"\r" +
    "\n" +
    "                    strareacode=\"page.model.msObj.txtMSArea\" strland=\"page.model.msObj.txtLLNum\" strmail=\"page.model.msObj.txtMSEmail\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblMSCurrentLocation\" class=\"pop_label_left\">Current Location</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.msObj.txtMSCurrentLocation\" class=\"form-control\" maxlength=\"100\" tabindex=\"21\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row \">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style>\r" +
    "\n" +
    "    .md-dialog-container {\r" +
    "\n" +
    "        z-index: 99999999999;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>"
  );


  $templateCache.put('app/editSibbling/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "    <page-review dispaly-name=\"'Siblings details'\" sectionid=\"'14,25,26'\" custid=\"page.model.CustID\"></page-review>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Sibling Details\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.sibblingCountArr.length===0\">\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.sibblingPopulatePopulate('sibCounrt')\" class=\"edit_page_add_button\">Add</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"upnoofSibblings\" class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div id=\"lstnoofbros\">\r" +
    "\n" +
    "                <div ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\" ng-repeat=\"item in page.model.sibblingCountArr\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div class=\"form-group\">\r" +
    "\n" +
    "                                <div id=\"uplNoOfBrothers\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"NoOfBrothers\" font-bold=\"true\">No of Brothers</label>\r" +
    "\n" +
    "                                    </h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblNoOfBrothers\">\r" +
    "\n" +
    "                                            {{ item.NoOfBrothers }}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"brotherHide\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div ng-hide=\"item.NoOfElderBrothers===null || item.NoOfElderBrothers===0\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label id=\"noofelderbrother\" font-bold=\"true\">No of elder brothers</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblnoofelderbrother\">\r" +
    "\n" +
    "                                                {{ item.NoOfElderBrothers }}\r" +
    "\n" +
    "                                        </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div ng-hide=\"item.NoOfYoungerBrothers===null || item.NoOfYoungerBrothers===0\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label id=\"Noofyoungerbrother\" font-bold=\"true\">No of younger brother</label>\r" +
    "\n" +
    "                                        </h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblnofyoungbro\">\r" +
    "\n" +
    "                                                {{ item.NoOfYoungerBrothers }}\r" +
    "\n" +
    "                                        </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"edit_page_item_ui clearfix\" ng-if=\"page.model.sibblingCountArr.length>0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <a href=\"javascript:void(0);\" class=\"edit_page_edit_button\" ng-click=\"page.model.sibblingPopulatePopulate('sibCounrt',item)\">Edit</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div ng-hide=\"item.NoOfSisters===null\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label font-bold=\"true\">No of sisters</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblNoofsisters\">\r" +
    "\n" +
    "                                            {{ item.NoOfSisters }}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"sisterHideDiv\">\r" +
    "\n" +
    "                                    <div ng-hide=\"item.NoOfElderSisters===null || item.NoOfElderSisters===0\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label font-bold=\"true\">No of elder sisters</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblNoofeldersisters\">\r" +
    "\n" +
    "                                                {{ item.NoOfElderSisters }}\r" +
    "\n" +
    "                                        </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div ng-hide=\"item.NoOfYoungerSisters===null || item.NoOfYoungerSisters===0\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label font-bold=\"true\">No of younger sisters</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span>\r" +
    "\n" +
    "                                                {{ item.NoOfYoungerSisters }}\r" +
    "\n" +
    "                                        </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Brother&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\">ModifiedBy :{{page.model.broModifiedby}}</span>\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div id=\"uplnkbrotherdetails\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.sibblingPopulatePopulate('brother')\" class=\"edit_page_add_button\">Add\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"uplstSibbling\" class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"lstSibbling\" ng-repeat=\"item in page.model.BrotherArr\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div id=\"Div1\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <div id=\"uplElderbrotherName\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"ElderbrotherName\" font-bold=\"true\" style=\"color:red;\">\r" +
    "\n" +
    "                                        Brother Name</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblElderbrotherName\" style=\"color:red;\">\r" +
    "\n" +
    "                                            {{ item.SibilingName+\" (\"+item.brotherYoungerORelder+\")\" }}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"upllnkbrodetailseb\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <a class=\"edit_page_edit_button\" href=\"javascript:void(0);\" ng-click=\"page.model.sibblingPopulatePopulate('brother',item)\">Edit</a>\r" +
    "\n" +
    "                                    <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup('brother',item.SibilingCustfamilyID);\">Delete</a>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"brothereducation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"lblEducationbrother\" font-bold=\"true\">Education</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblBrotherEducationDetails\">\r" +
    "\n" +
    "                                            {{ item.SibilingEducationDetails!=null?item.SibilingEducationDetails:''}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label font-bold=\"true\">Profession Category</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span>\r" +
    "\n" +
    "                                            {{ item.ProfessionCategory}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"Label2\" font-bold=\"true\">Designation</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblBrotherprofessionDetails\">\r" +
    "\n" +
    "                                            {{ item.SibilingProfessionDetails}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"uplprofessioneb\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div id=\"professiondiv\">\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"profession\" font-bold=\"true\">Company&JobLocation</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblprofession\">\r" +
    "\n" +
    "                                            {{ (item.SibilingCompany!==null?item.SibilingCompany:'')+\" \"+(item.SibilingJobPLace.ToString()!=\"\" && item.SibilingJobPLace!=null?\",\"+item.SibilingJobPLace:\"\") }}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"update0\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div id=\"ownerdiv0\">\r" +
    "\n" +
    "                                    <div id=\"uplConactNoeb\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"ConactNo\" font-bold=\"true\">Conact Nos</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblConactNo\">\r" +
    "\n" +
    "                                                    {{ (item.SibilingMobileNumberWithCode!==null?item.SibilingMobileNumberWithCode:'')+\r" +
    "\n" +
    "                                                ((item.SibilngLandnumberwithcode.ToString()!=\"\" && item.SibilngLandnumberwithcode!=null)?\",\"+item.SibilngLandnumberwithcode:\"\")}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div id=\"brotheremail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"brotheremail\" font-bold=\"true\">Email</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblbrotheremail\">\r" +
    "\n" +
    "                                                    {{ item.SibilingEmail }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"uuuuuuuppp\" ng-if=\"item.SibilingMarried==1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div id=\"BROTHERDIV\">\r" +
    "\n" +
    "                                    <div id=\"uplWifeNameeb\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divWifeNamenew\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"SpouseName\" font-bold=\"true\" style=\"font-weight: bold; font-family: helvetica; font-size: 18px\">\r" +
    "\n" +
    "                                                Spouse Name</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblWifeName\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseName}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"lblbrotherwifeeducationdetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divlblbrotherwifeeducation\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"lblbrotherwifeeducation\" font-bold=\"true\">Education</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblbrotherwifeeducationdetails\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseEducationDetails}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label font-bold=\"true\">Profession Category</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span>\r" +
    "\n" +
    "                                            {{ item.SpouseProfessionCategory}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div id=\"lblbrotherwifeprofessiondetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divlblbrotherwifeprofession\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"lblbrotherwifeprofession\" font-bold=\"true\">Designation</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblbrotherwifeprofessiondetails\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseProfessionDetails}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"uplwifeprofessioneb\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.SibilingSpouseProfessionDetails=='HouseWife'\">\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label id=\"wifeprofession\" font-bold=\"true\">Company&JobLocation</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblwifeprofession\">\r" +
    "\n" +
    "                                                    {{ ((item.spoucecompanyName.ToString()!=\"\" && item.spoucecompanyName!=null)?item.spoucecompanyName:\"\")+((item.spoucejobloc.ToString()!=\"\"\r" +
    "\n" +
    "                                                    && item.spoucejobloc!=null)?\",\"+item.spoucejobloc:\"\") }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"update1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"ownerdiv1\">\r" +
    "\n" +
    "                                            <div id=\"wifenumbers\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                <div id=\"divspousecontactnumbers\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                    <h6>\r" +
    "\n" +
    "                                                        <label id=\"lblbrotherwife\" font-bold=\"true\">Contact Nos</label></h6>\r" +
    "\n" +
    "                                                    <h5>\r" +
    "\n" +
    "                                                        <span id=\"lblbrotherwifemobnumbers\">\r" +
    "\n" +
    "                                                           {{ (item.SibilingSpouceMobileNumberWithCode!==null?item.SibilingSpouceMobileNumberWithCode:'')\r" +
    "\n" +
    "                                                          +((item.SibilingSpouceLandNumberWithCode.ToString()!=\"\" && item.SibilingSpouceLandNumberWithCode!=null)?\",\"+item.SibilingSpouceLandNumberWithCode:\"\") }}\r" +
    "\n" +
    "                                                    </span>\r" +
    "\n" +
    "                                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            </div>\r" +
    "\n" +
    "                                            <div id=\"Brotherwife\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                                <h6>\r" +
    "\n" +
    "                                                    <label id=\"brotherwifeemail\" font-bold=\"true\">Email</label></h6>\r" +
    "\n" +
    "                                                <h5>\r" +
    "\n" +
    "                                                    <span id=\"lblbrotherwifeemail\">\r" +
    "\n" +
    "                                                            {{ item.SpouseEmail }}\r" +
    "\n" +
    "                                                    </span>\r" +
    "\n" +
    "                                                </h5>\r" +
    "\n" +
    "                                            </div>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"uplWifeFatherfirstnameeb\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label id=\"lWifeFatherfirstname\" font-bold=\"true\">Spouse Father's Name</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblWifeFatherfirstname\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseFatherName }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"brotherspusefathercaste\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label id=\"botherwifefathercaste\" font-bold=\"true\">Spouse Father Caste</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblbotherwifefathercaste\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseFatherCaste }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"upBroSpouseFatherNativePlace\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                        <h6>\r" +
    "\n" +
    "                                            <label id=\"BroSpouseFatherNativePlace\" font-bold=\"true\">Native Place</label></h6>\r" +
    "\n" +
    "                                        <h5>\r" +
    "\n" +
    "                                            <span id=\"lblBroSpouseFatherNativePlace\">\r" +
    "\n" +
    "                                                   {{((item.BroSpouseFatherCity!=null && item.BroSpouseFatherCity.ToString()!=\"\")?item.BroSpouseFatherCity:\"\") +\r" +
    "\n" +
    "                                        ((item.BroSpouseFatherDistrictname!=null && item.BroSpouseFatherDistrictname.ToString()!=\"\")?\" ,\"+item.BroSpouseFatherDistrictname:\"\" )+\r" +
    "\n" +
    "                                        ((item.BroSpouseFatherStatename!=null && item.BroSpouseFatherStatename.ToString()!=\"\")?\" ,\"+item.BroSpouseFatherStatename:\"\" )+\r" +
    "\n" +
    "                                        ((item.BroSpouseFatherCountryname!=null && item.BroSpouseFatherCountryname.ToString()!=\"\")?\" ,\"+item.BroSpouseFatherCountryname:\"\" )}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                        </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Sister Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: #08CFD2\">ModifiedBy :{{page.model.sisModifiedby}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div id=\"uplnksisterdet\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"page.model.sibblingPopulatePopulate('sister')\" data-original-title=\"Add Sister Details\" class=\"edit_page_add_button\">Add\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"uplistsister\" class=\"edit_page_details_item\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div id=\"listsister\" ng-repeat=\"item in page.model.sisterArr\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div id=\"Div2\" ng-class=\"item.reviewstatus===false?'edit_page_details_item_desc clearfix reviewCls':'edit_page_details_item_desc clearfix'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "                                <div id=\"uplsisnamees\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"sisname\" font-bold=\"true\" style=\"color:red;\">Sister Name\r" +
    "\n" +
    "                                    </label>\r" +
    "\n" +
    "                                    </h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblsisname\" style=\"color:red;\">\r" +
    "\n" +
    "                                            {{ item.SibilingName+\" (\"+item.SisterElderORyounger+\")\"}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"upllnksisteredites\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <a class=\"edit_page_edit_button\" data-original-title=\"Edit Sister Details\" href=\"javascript:void(0);\" ng-click=\"page.model.sibblingPopulatePopulate('sister',item)\">Edit\r" +
    "\n" +
    "                                         \r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "                                    <a href=\"javascript:void(0);\" class=\"edit_page_del_button\" ng-click=\"page.model.DeletePopup('sister',item.SibilingCustfamilyID);\">Delete</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"sistereducationdetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"lblsistereducation\" font-bold=\"true\">Education</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblsistereducationdetails\">\r" +
    "\n" +
    "                                            {{ item.SibilingEducationDetails}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label font-bold=\"true\">Profession Category</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span>\r" +
    "\n" +
    "                                            {{ item.ProfessionCategory}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div id=\"lblsisterprofessiondetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <h6>\r" +
    "\n" +
    "                                        <label id=\"lblsisterprofession\" font-bold=\"true\">Designation</label></h6>\r" +
    "\n" +
    "                                    <h5>\r" +
    "\n" +
    "                                        <span id=\"lblsisterprofessiondetails\">\r" +
    "\n" +
    "                                            {{ item.SibilingProfessionDetails}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                    </h5>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"uplsisprofes\" class=\"edit_page_details_item_desc clearfix\" ng-hide=\"item.SibilingProfessionDetails=='HouseWife'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <label id=\"sisprof\" font-bold=\"true\">Company & Job Location </label></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span id=\"lblsisprof\">\r" +
    "\n" +
    "                                            {{ (item.SibilingCompany!==null?item.SibilingCompany:'')+ ((item.SibilingJobPLace.ToString()!=\"\" && item.SibilingJobPLace!=null)?\",\"+item.SibilingJobPLace:\"\")}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"update2\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div id=\"ownerdiv2\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div id=\"uplsisnumbers\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"sisnumbers\" font-bold=\"true\">Contact Nos</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblsisnumbers\">\r" +
    "\n" +
    "                                                    {{ (item.SibilingMobileNumberWithCode!==null?item.SibilingMobileNumberWithCode:'')+\r" +
    "\n" +
    "                                                ((item.SibilngLandnumberwithcode.ToString()!=\"\" && item.SibilngLandnumberwithcode!=null)?\",\"+item.SibilngLandnumberwithcode:\"\")}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"sisterwifeemail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"sisteremail\" font-bold=\"true\">Email</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblsisteremail\">\r" +
    "\n" +
    "                                                    {{ item.SibilingEmail }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div id=\"pqw\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div id=\"Sisterspousedetails\" ng-if=\"item.SibilingMarried==1\">\r" +
    "\n" +
    "                                    <div id=\"uplhusnamees\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divhusname\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"husname\" font-bold=\"true\" style=\"font-weight: bold; font-family: helvetica; font-size: 18px\">\r" +
    "\n" +
    "                                                Husband Name</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblhusname\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseName}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div id=\"lblsisterspouseeducation\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                        <div id=\"divlblsisterspouseeducation\">\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"lblsisterspouseeducation\" font-bold=\"true\">Education</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lbllblsisterspouseeducationdetails\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseEducationDetails}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label font-bold=\"true\">Profession Category</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span>\r" +
    "\n" +
    "                                            {{ item.SpouseProfessionCategory}}\r" +
    "\n" +
    "                                    </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    <div id=\"lblsisterspouseprofession\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divlblsisterspouseprofession\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"lblsisterspouseprofession\" font-bold=\"true\">Designation</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblsisterspouseprofessiondetails\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseProfessionDetails}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"uplhusprofes\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divlblsisterspousecmpy\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"husprof\" font-bold=\"true\">Company&JobLocation</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblhusprof\">\r" +
    "\n" +
    "                                                    {{((item.spoucecompanyName.ToString()!=\"\" && item.spoucecompanyName!=null)?\" \"+item.spoucecompanyName:\"\")+((item.spoucejobloc.ToString()!=\"\" && item.spoucejobloc!=null)?\",\"+item.spoucejobloc:\"\") }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"update3\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"ownerdiv3\">\r" +
    "\n" +
    "                                            <div id=\"husbandnumbers\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                <div id=\"divmobilesisterhus\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                    <h6>\r" +
    "\n" +
    "                                                        <label id=\"lblsisterhusband\" font-bold=\"true\">Conact Nos</label></h6>\r" +
    "\n" +
    "                                                    <h5>\r" +
    "\n" +
    "                                                        <span id=\"lblhusbandnumbers\">\r" +
    "\n" +
    "                                                          {{ (item.SibilingSpouceMobileNumberWithCode!==null?item.SibilingSpouceMobileNumberWithCode:'')+((item.SibilingSpouceLandNumberWithCode.ToString()!=\"\" && item.SibilingSpouceLandNumberWithCode!=null)?\",\"\r" +
    "\n" +
    "                                                            +item.SibilingSpouceLandNumberWithCode:\"\")}}\r" +
    "\n" +
    "                                                    </span>\r" +
    "\n" +
    "                                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            </div>\r" +
    "\n" +
    "                                            <div id=\"lblsisterspouseemail\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                    <h6>\r" +
    "\n" +
    "                                                        <label id=\"sisterspouseemail\" font-bold=\"true\">Email</label></h6>\r" +
    "\n" +
    "                                                    <h5>\r" +
    "\n" +
    "                                                        <span id=\"lblsisterspouseemail\">{{ item.SpouseEmail }}\r" +
    "\n" +
    "                                                    </span>\r" +
    "\n" +
    "                                                    </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            </div>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"uplhusfathernamees\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divhusfathernames\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"husfathernames\" font-bold=\"true\">Husband Father Name</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblhusfathername\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseFatherName }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"sisterspousefathercaste\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div id=\"divsisterspousefathercaste\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"sisterhusbandfathercaste\" font-bold=\"true\">Husband Father Caste</label></h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblsisterSpousefathercaste\">\r" +
    "\n" +
    "                                                    {{ item.SibilingSpouseFatherCaste }}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div id=\"upSisNativePlace\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <div>\r" +
    "\n" +
    "                                            <h6>\r" +
    "\n" +
    "                                                <label id=\"SisSpouseFatherNativePlace\" font-bold=\"true\">Native Place</label>\r" +
    "\n" +
    "                                            </h6>\r" +
    "\n" +
    "                                            <h5>\r" +
    "\n" +
    "                                                <span id=\"lblSisSpouseFatherNativePlace\">\r" +
    "\n" +
    "                                                   {{((item.SisSpousefatherCity!=null && item.SisSpousefatherCity.ToString()!=\"\")?item.SisSpousefatherCity:\"\") +\r" +
    "\n" +
    "                                        ((item.SisSpouseFatherDistrictname!=null && item.SisSpouseFatherDistrictname.ToString()!=\"\")?\" ,\"+item.SisSpouseFatherDistrictname:\"\" )+\r" +
    "\n" +
    "                                        ((item.SisSpouseFatherStatename!=null && item.SisSpouseFatherStatename.ToString()!=\"\")?\" ,\"+item.SisSpouseFatherStatename:\"\" )+\r" +
    "\n" +
    "                                        ((item.SisSpouseFatherCountryname!=null && item.SisSpouseFatherCountryname.ToString()!=\"\")?\" ,\"+item.SisSpouseFatherCountryname:\"\" )}}\r" +
    "\n" +
    "                                            </span>\r" +
    "\n" +
    "                                            </h5>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"SibblingCountPopup.html\">\r" +
    "\n" +
    "    <form name=\"sibblingCoutForm\" novalidate role=\"form\" ng-submit=\"page.model.sibblingCountsSubmit(page.model.SibCountObj)\">\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Sibling Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblnoofsiblings\" class=\"pop_label_left\">No of Brothers<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.SibCountObj.ddlnoofsiblings\" ng-change=\"enableSubmit();\" ng-options=\"item.value as item.label for item in page.model.sibCountsBindArr\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" ng-show=\"page.model.SibCountObj.ddlnoofsiblings!==0\">\r" +
    "\n" +
    "                    <label for=\"lblnoofelderrother\" class=\"pop_label_left\">Elder Brother</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.SibCountObj.ddlnoofelderrother\" ng-change=\"enableSubmit();\" ng-options=\"item.value as item.label for item in page.model.sibCountsBindArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" ng-show=\"page.model.SibCountObj.ddlnoofsiblings!==0\">\r" +
    "\n" +
    "                    <label for=\"lblnoofyoungerbrother\" class=\"pop_label_left\">Younger Brother</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.SibCountObj.ddlnoofyoungerbrother\" ng-change=\"enableSubmit();\" ng-options=\"item.value as item.label for item in page.model.sibCountsBindArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblnoofsisters\" class=\"pop_label_left\">No of sisters<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.SibCountObj.ddlnoofsisters\" ng-change=\"enableSubmit();\" ng-options=\"item.value as item.label for item in page.model.sibCountsBindArr\" required></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" ng-show=\"page.model.SibCountObj.ddlnoofsisters!==0\">\r" +
    "\n" +
    "                    <label for=\"lblnoofeldersisters\" class=\"pop_label_left\">Elder sisters</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.SibCountObj.ddlnoofeldersisters\" ng-change=\"enableSubmit();\" ng-options=\"item.value as item.label for item in page.model.sibCountsBindArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\" ng-show=\"page.model.SibCountObj.ddlnoofsisters!==0\">\r" +
    "\n" +
    "                    <label for=\"lblnoofyoungersisters\" class=\"pop_label_left\">Younger  sisters</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.SibCountObj.ddlnoofyoungersisters\" ng-change=\"enableSubmit();\" ng-options=\"item.value as item.label for item in page.model.sibCountsBindArr\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"brotherModalContent.html\">\r" +
    "\n" +
    "    <form name=\"brotherForm\" novalidate role=\"form\" ng-submit=\"brotherForm.$valid  && page.model.sibBroSubmit(page.model.broObj)\" accessible-form>\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Brother details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblElderYounger\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Elder/Younger<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlBElderYounger\" layout=\"row\" ng-model=\"page.model.broObj.rdlBElderYounger\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"42\" class=\"md-primary\">Elder</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"41\"> Younger </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                        <div ng-messages=\"brotherForm.rdlBElderYounger.$invalid\">\r" +
    "\n" +
    "                            <div ng-if=\"brotherForm.rdlBElderYounger.$invalid && (brotherForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblBroName\" class=\"pop_label_left\">Name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.broObj.txtBName\" class=\"form-control\" tabindex=\"2\" maxlength=\"100\" required/>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblbrotherreducation\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.broObj.txtbrotherreducation\" class=\"form-control\" tabindex=\"3\" maxlength=\"150\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblbroprofessioncat\" class=\"pop_label_left\">Profession Category</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.broObj.ddlbroprofessionCatgory\" typeofdata=\"'newProfessionCatgory'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblbrotherprofession\" class=\"pop_label_left\">Designation</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.broObj.txtbrotherprofession\" class=\"form-control\" tabindex=\"4\" maxlength=\"200\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblwifescmpy\" class=\"pop_label_left\">Company Name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.broObj.txtBCompanyname\" class=\"form-control\" tabindex=\"5\" maxlength=\"100\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblbrojobloc\" class=\"pop_label_left\">Job Location</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.broObj.txtBJoblocation\" class=\"form-control\" tabindex=\"6\" maxlength=\"100\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li style=\"height: 15px;\"></li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.broObj.ddlBMObileCountryID\" strmobile=\"page.model.broObj.txtBmobilenumber\" dalternative=\"page.model.broObj.ddlBMObileCountryID2\" stralternative=\"page.model.broObj.txtBmobilenumber2\" dland=\"page.model.broObj.ddlBLandLineCountryID\"\r" +
    "\n" +
    "                    strareacode=\"page.model.broObj.txtBAreCode\" strland=\"page.model.broObj.txtBLandNumber\" strmail=\"page.model.broObj.txtBEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblIsMarried\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Married<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlBIsMarried\" ng-change=\"page.model.BIsMarried(page.model.broObj.rdlBIsMarried);\" layout=\"row\" ng-model=\"page.model.broObj.rdlBIsMarried\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                        <div ng-messages=\"brotherForm.rdlBIsMarried.$invalid\">\r" +
    "\n" +
    "                            <div ng-if=\"brotherForm.rdlBIsMarried.$invalid && (brotherForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </md-input-container>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <div ng-if=\"page.model.broObj.rdlBIsMarried==1\">\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblWifeName\" class=\"pop_label_left\">Spouse Name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.broObj.txtBWifeName\" class=\"form-control\" tabindex=\"19\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblWifeEducation\" class=\"pop_label_left\">Spouse Education</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.broObj.txtbrotherwifeeducation\" class=\"form-control\" tabindex=\"20\" maxlength=\"150\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label class=\"pop_label_left\">Profession Category</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                            <select multiselectdropdown ng-model=\"page.model.broObj.ddlbroSpouseprofessionCatgory\" typeofdata=\"'newProfessionCatgory'\"></select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblwifescmpy\" class=\"pop_label_left\">Spouse Designation</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.broObj.txtbrotherwifeprofession\" class=\"form-control\" tabindex=\"21\" maxlength=\"200\" />\r" +
    "\n" +
    "                            <label class=\"checkbox-inline\"><input ng-model=\"page.model.broObj.chkboxbrotherwifeprofession\" type=\"checkbox\" ng-change=\"page.model.BhousewiseChk(page.model.broObj);\"><span>&nbsp;HouseWife</span> </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"brothercmpyyy\" ng-hide=\"page.model.broObj.chkboxbrotherwifeprofession==true\">\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblwifescmpy\" class=\"pop_label_left\">Company Name</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.broObj.txtBWifeCompanyName\" class=\"form-control\" tabindex=\"23\" maxlength=\"100\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblwifefjobloc\" class=\"pop_label_left\">Job Location</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.broObj.txtBwifeJoblocation\" class=\"form-control\" tabindex=\"24\" maxlength=\"100\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li style=\"height: 15px;\"></li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <contact-directive emailhide=\"true\" dmobile=\"page.model.broObj.ddlBWMobileCode\" strmobile=\"page.model.broObj.txtBWifeMobileNumber\" dalternative=\"page.model.broObj.ddlBWMobileCode2\" stralternative=\"page.model.broObj.txtBWifeMobileNumber2\" dland=\"page.model.broObj.ddlBWifeLandLineCountryCode\"\r" +
    "\n" +
    "                        strareacode=\"page.model.broObj.txtBWifeLandLineAreaCode\" strland=\"page.model.broObj.txtBWifeLandLineNumber\" strmail=\"page.model.broObj.txtwifeEmail\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"divWifeSurname\">\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label for=\"lblwifefathername\" class=\"pop_label_left\">Spouse Father SurName</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <input ng-model=\"page.model.broObj.txtBWifeFatherSurName\" class=\"form-control\" tabindex=\"36\" maxlength=\"50\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblNatveWife\" class=\"pop_label_left\">Spouse Father Name</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.broObj.txtBWWifeFatherName\" class=\"form-control\" tabindex=\"37\" maxlength=\"100\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label for=\"lblspousefatherCaste\" class=\"pop_label_left\">Spouse Father Caste</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <select multiselectdropdown ng-model=\"page.model.broObj.ddlborherspousefathercaste\" typeofdata=\"'caste'\"></select>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <country-directive countryshow=\"false\" dcountry=\"CountryVal\" cityshow=\"false\" othercity=\"false\" dstate=\"page.model.broObj.ddlBroSpousefatherState\" ddistrict=\"page.model.broObj.ddlBroSpousefatherDistrict\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                            <label for=\"lblBroSpouseCity\" class=\"pop_label_left\">Native Place</label>\r" +
    "\n" +
    "                            <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                                <input ng-model=\"page.model.broObj.txtBroSpousefatherCity\" class=\"form-control\" tabindex=\"41\" maxlength=\"100\" />\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <li class=\"row \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"sisterModalContent.html\">\r" +
    "\n" +
    "    <form name=\"sibsisForm\" novalidate role=\"form\" ng-submit=\"sibsisForm.$valid  && page.model.sibSisSubmit(page.model.sisObj)\" accessible-form>\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Sister details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"20\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul id=\"ulsibilingsister\">\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblElderYounger\" style=\"padding-top: 2%;\" class=\"pop_label_left\">Elder/Younger<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"radio-group-my\">\r" +
    "\n" +
    "                        <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                            <md-radio-group ng-required=\"true\" name=\"rbtSElderyounger\" layout=\"row\" ng-model=\"page.model.sisObj.rbtSElderyounger\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                <md-radio-button value=\"322\" class=\"md-primary\">Elder</md-radio-button>\r" +
    "\n" +
    "                                <md-radio-button value=\"321\"> Younger </md-radio-button>\r" +
    "\n" +
    "                            </md-radio-group>\r" +
    "\n" +
    "                            <div ng-messages=\"sibsisForm.rbtSElderyounger.$invalid\">\r" +
    "\n" +
    "                                <div ng-if=\"sibsisForm.rbtSElderyounger.$invalid && (sibsisForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </md-input-container>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblSisName\" class=\"pop_label_left\">Name<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.sisObj.txtSisterName\" class=\"form-control\" tabindex=\"2\" maxlength=\"100\" required/>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblsisEducation\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.sisObj.txtsisEducation\" class=\"form-control\" tabindex=\"3\" maxlength=\"150\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblbroprofessioncat\" class=\"pop_label_left\">Profession Category</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.sisObj.ddlsisprofessionCatgory\" typeofdata=\"'newProfessionCatgory'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                    <label for=\"lblsisProfession\" class=\"pop_label_left\">Designation</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input ng-model=\"page.model.sisObj.txtsisProfession\" class=\"form-control\" tabindex=\"4\" maxlength=\"200\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <input ng-model=\"page.model.sisObj.chksisProfession\" type=\"checkbox\" ng-change=\"page.model.ShousewiseChk(page.model.sisObj);\"><span>&nbsp;HouseWife</span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <div id=\"divsiscmpyyy\" ng-hide=\"page.model.sisObj.chksisProfession==true\">\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblsisscmpy\" class=\"pop_label_left\">Company Name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtSCompanyName\" class=\"form-control\" tabindex=\"6\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblsissjobloc\" class=\"pop_label_left\">Job Location</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtSjobloc\" class=\"form-control\" tabindex=\"7\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div style=\"height: 15px;\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <contact-directive emailhide=\"true\" dmobile=\"page.model.sisObj.ddlSMobileCountyCodeID\" strmobile=\"page.model.sisObj.txtSMobileNumber\" dalternative=\"page.model.sisObj.ddlSMobileCountyCodeID2\" stralternative=\"page.model.sisObj.txtSMobileNumber2\" dland=\"page.model.sisObj.ddlSLandLineCountryCodeID\"\r" +
    "\n" +
    "                    strareacode=\"page.model.sisObj.txtSAreacoude\" strland=\"page.model.sisObj.txtSNumber\" strmail=\"page.model.sisObj.txtSEmails\"></contact-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblIsMarried\" class=\"pop_label_left\">Is Married<span style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"radio-group-my\">\r" +
    "\n" +
    "                        <md-input-container style=\"font-weight: 700;color:black;\">\r" +
    "\n" +
    "                            <md-radio-group ng-required=\"true\" name=\"rdlSIsMarried\" layout=\"row\" ng-change=\"page.model.SIsMarried(page.model.sisObj.rdlSIsMarried);\" ng-model=\"page.model.sisObj.rdlSIsMarried\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                                <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                                <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                            </md-radio-group>\r" +
    "\n" +
    "                            <div ng-messages=\"sibsisForm.rdlSIsMarried.$invalid\">\r" +
    "\n" +
    "                                <div ng-if=\"sibsisForm.rdlSIsMarried.$invalid && (sibsisForm.$submitted)\">This field is required.</div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </md-input-container>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"divSister\" ng-if=\"page.model.sisObj.rdlSIsMarried==1\">\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblhussisfamilyStatus\" class=\"pop_label_left\">Husband Name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtShusName\" class=\"form-control\" tabindex=\"20\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblHusbandEducation\" class=\"pop_label_left\">Husband Education</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtHusbandEducation\" class=\"form-control\" tabindex=\"21\" maxlength=\"150\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblbroprofessioncat\" class=\"pop_label_left\">Profession Category</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                            <select multiselectdropdown ng-model=\"page.model.sisObj.ddlsisSpouseprofessionCatgory\" typeofdata=\"'newProfessionCatgory'\"></select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblHusbandProfession\" class=\"pop_label_left\">Husband Designation</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtHusbandProfession\" class=\"form-control\" tabindex=\"22\" maxlength=\"200\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblhuscmpy\" class=\"pop_label_left\">Company Name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtShusCompanyName\" class=\"form-control\" tabindex=\"23\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblhussjobloc\" class=\"pop_label_left\">Job Location</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtShusjobloc\" class=\"form-control\" tabindex=\"24\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li style=\"height: 15px;\"></li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <contact-directive emailhide=\"true\" dmobile=\"page.model.sisObj.ddlSHusMobileCountryID\" strmobile=\"page.model.sisObj.txtSHusMobileNumber\" dalternative=\"page.model.sisObj.ddlSHusMobileCountryID2\" stralternative=\"page.model.sisObj.txtSHusMobileNumber2\" dland=\"page.model.sisObj.ddlSHusLandCountryID\"\r" +
    "\n" +
    "                        strareacode=\"page.model.sisObj.txtSHusLandArea\" strland=\"page.model.sisObj.txtSHusLandNumber\" strmail=\"page.model.sisObj.txtHusbandEmail\"></contact-directive>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblwifefathername\" class=\"pop_label_left\">Husband Father SurName</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtHusbandFatherSurName\" class=\"form-control\" tabindex=\"36\" maxlength=\"50\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblNatvehus\" class=\"pop_label_left\">Husband Father Name</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtHusbandFatherName\" class=\"form-control\" tabindex=\"37\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <label for=\"lblsisterspousefatherCaste\" class=\"pop_label_left\">Husband Father Caste</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <select multiselectdropdown ng-model=\"page.model.sisObj.ddlsisterspusefathercaste\" typeofdata=\"'caste'\"></select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <country-directive countryshow=\"false\" cityshow=\"false\" othercity=\"false\" dcountry=\"CountryVal\" dstate=\"page.model.sisObj.ddlSisSpouceFatherState\" ddistrict=\"page.model.sisObj.ddlSisSpouceFatherDistrict\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "                        <label for=\"lblSisSpouceFatherCity\" class=\"pop_label_left\">Native Place</label>\r" +
    "\n" +
    "                        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                            <input ng-model=\"page.model.sisObj.txtSisSpouceFatherCity\" class=\"form-control\" tabindex=\"41\" maxlength=\"100\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <li class=\"row \">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style>\r" +
    "\n" +
    "    .md-dialog-container {\r" +
    "\n" +
    "        z-index: 99999999999;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>"
  );


  $templateCache.put('app/editSpouse/index.html',
    "<div class=\"edit_pages_content_main clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Spouse Details</h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <a href=\"javascrip:void(0);\" class=\"edit_page_add_button\" ng-click=\"page.model.populatepopup('Spouse');\">Add\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div id=\"fullSpouseDetails\" ng-repeat=\"item in page.model.spouseArray\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div id=\"reviewdiv\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"updatespousename\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <h6>\r" +
    "\n" +
    "                            <span id=\"spouseName\" font-bold=\"true\">Name</span></h6>\r" +
    "\n" +
    "                        <h5>\r" +
    "\n" +
    "                            <span id=\"lblspouseName\">{{item.NAME}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanellnkspouseedit\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <a class=\"edit_page_edit_button\" href=\"javascrip:void(0);\" ng-click=\"page.model.populatepopup('Spouse',item);\">Edit\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelspouseProfession\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"spouseEducation\" font-bold=\"true\">Education</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblspouseEducation\">{{item.EducationDetails}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelspouseProfessionDetails\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"spouseProfessionDetails\" font-bold=\"true\">Profession</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblspouseProfessionDetails\">{{item.ProfessionDetails}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelMarriedon\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Marriedon\" font-bold=\"true\">Married on</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblMarriedon\">{{item.MarriageDate}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelSeparateddate\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Separateddate\" font-bold=\"true\">Separated date</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblSeparateddate\">\r" +
    "\n" +
    "                                {{item.SeperatedDate}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelLegallydivorced\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Legallydivorced\" font-bold=\"true\">Legally divorced</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblLegallydivorced\"></span> {{item.LeagallyDivorce}}\r" +
    "\n" +
    "                            </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelFamilyplanning\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"LabelFamilyplanning\" font-bold=\"true\">Family planning</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"Familyplanning\">{{item.MyFamilyPlanning}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelDateofegallydivorce\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Dateoflegallydivorce\" font-bold=\"true\">Date of legally divorce</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblDateoflegallydivorce\">{{item.DateofLegallDivorce}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanelReasonfordivorce\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Reasonfordivorce\" font-bold=\"true\">Reason for divorce</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblReasonfordivorce\">{{item.ReasonforDivorce}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelFathername\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Fathername\" font-bold=\"true\">Father name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblFathername\">{{item.FatherFirstName+\" \"+item.FatherLastName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"UpdatePanellblNoOfChildrens\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblnoofchildrenss\" font-bold=\"true\">No Of Children</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblNoOfChildrens\">{{item.NoOfChildrens}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelHouseFlatnumber\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"HouseFlatnumber\" font-bold=\"true\">House/Flat number</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblHouseFlatnumber\">{{item.HouseFlatNumberID}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelApartmentname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Apartmentname\" font-bold=\"true\">Apartmentname</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblApartmentname\">{{item.AppartmentName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelStreetname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Streetname\" font-bold=\"true\">Street name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblStreetname\">{{item.StreetName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelAreaname\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Areaname\" font-bold=\"true\">Area name</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblAreaname\">{{item.AreaName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelLandmark\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"lblLandark\" font-bold=\"true\">Land mark</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblLandmark\">{{item.LandMark}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelCountry\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"Country\" font-bold=\"true\">Country</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblCountry\">{{item.CountryName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelState\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"State\" font-bold=\"true\">State</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblState\">{{item.StateName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelDistrict\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"District\" font-bold=\"true\">District</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblDistrict\">{{item.DistrictName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div id=\"UpdatePanelCity\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span id=\"City\" font-bold=\"true\">City</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span id=\"lblCity\">{{item.CityName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"edit_page_item\">\r" +
    "\n" +
    "        <div class=\"edit_page_item_head clearfix\">\r" +
    "\n" +
    "            <h4>Children Details </h4>\r" +
    "\n" +
    "            <div class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "                <div ID=\"UpdatePanelChildrenDetails\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <a href=\"javascrip:void(0);\" ng-click=\"page.model.populatepopup('Child');\" class=\"edit_page_add_button\">Add\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"edit_page_details_item\">\r" +
    "\n" +
    "            <div ID=\"UpdatePanelfullChildrenDetails\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ID=\"listChildrenDetails\" ng-repeat=\"item in page.model.ChildArray\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div id=\"reviewdiv\" class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Nameofthechild\" Font-Bold=\"true\" ForeColor=\"Red\">Name of the child</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblNameofthechild\">{{item.ChildName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div ID=\"UpdatePanellnkchidrensedit\" class=\"edit_page_item_ui clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <a href=\"javascrip:void(0);\" ng-click=\"page.model.populatepopup('Child',item);\" class=\"edit_page_edit_button\">Edit\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "                            <a title=\"\" data-placement=\"bottom\" data-toggle=\"tooltip\" data-original-title=\"Delete chidrens Details\" class=\"edit_page_del_button\">delete\r" +
    "\n" +
    "                                           \r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span ID=\"Genderofthechild\" Font-Bold=\"true\">Gender of the child</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span ID=\"lblGenderofthechild\">{{item.GenderName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span ID=\"Dateofbirthofthechild\" Font-Bold=\"true\">DOB of the child</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span ID=\"lblDateofbirthofthechild\">{{item.ChildDOB}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <divclass=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <h6>\r" +
    "\n" +
    "                                    <span ID=\"Childstayingwith\" Font-Bold=\"true\">Child staying with</span></h6>\r" +
    "\n" +
    "                                <h5>\r" +
    "\n" +
    "                                    <span ID=\"lblChildstayingwith\">{{item.ChildStayingWith}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"edit_page_details_item_desc clearfix\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h6>\r" +
    "\n" +
    "                                <span ID=\"Childstayingwithrelation\" Font-Bold=\"true\">Child staying with relation</span></h6>\r" +
    "\n" +
    "                            <h5>\r" +
    "\n" +
    "                                <span ID=\"lblChildstayingwithrelation\">{{item.ChildernRelationName}}</span></h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"SpouseContent.html\">\r" +
    "\n" +
    "    <form name=\"profForm\" novalidate role=\"form\" ng-submit=\"page.model.spouseSubmit(page.model.spouObj);\" accessible-form>\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Spouse Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Fathersistername\" class=\"pop_label_left\">Name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtSpousename\" class=\"form-control\" maxlength=\"150\" tabindex=\"1\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"spouceEducation\" class=\"pop_label_left\">Education</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtSpoueEducation\" class=\"form-control\" maxlength=\"150\" tabindex=\"2\" />\r" +
    "\n" +
    "                        <label id=\"identityspouse\" visible=\"false\"></label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"spouseProfession\" class=\"pop_label_left\">Profession</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtspouseProfession\" class=\"form-control\" maxlength=\"200\" tabindex=\"3\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblspouseHouseFlatnumber\" class=\"pop_label_left\">House/Flat number</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtHouseFlatnumber\" class=\"form-control\" maxlength=\"100\" tabindex=\"4\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblApartmentname\" class=\"pop_label_left\">Apartment name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtApartmentname\" class=\"form-control\" maxlength=\"100\" tabindex=\"5\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"Streetname\" class=\"pop_label_left\">Street name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtStreetname\" class=\"form-control\" maxlength=\"100\" tabindex=\"6\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblAreaname\" class=\"pop_label_left\">Area name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtAreaname\" class=\"form-control\" maxlength=\"100\" tabindex=\"7\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblLandmark\" class=\"pop_label_left\">Landmark</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtLandmark\" class=\"form-control\" maxlength=\"100\" tabindex=\"8\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <country-directive countryshow=\"true\" cityshow=\"true\" dcountry=\"page.model.spouObj.ddlspouseCountry\" dstate=\"page.model.spouObj.ddlspouseState\" ddistrict=\"page.model.spouObj.ddlspouseDistrict\" dcity=\"page.model.spouObj.ddlspouseCity\"></country-directive>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblZip\" class=\"pop_label_left\">Zip</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtspouseZip\" class=\"form-control\" maxlength=\"8\" tabindex=\"13\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblMarriedon\" class=\"pop_label_left\">Married on</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <date-picker strdate=\"page.model.spouObj.txtMarriedon\"></date-picker>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblSeparateddate\" class=\"pop_label_left\">Separated date</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <date-picker strdate=\"page.model.spouObj.txtSeparateddate\"></date-picker>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"divorse\" class=\"pop_label_left\">Legally divorced</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"IsHighestDegree\" layout=\"row\" ng-model=\"page.model.spouObj.rbtspousediverse\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblLegalDivorsedate\" class=\"pop_label_left\">Legally Divorced date</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <date-picker strdate=\"page.model.spouObj.txtLegalDivorsedate\"></date-picker>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblfatherspouse\" class=\"pop_label_left\">Father first name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtspousefather\" class=\"form-control\" maxlength=\"100\" tabindex=\"18\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblfatherspouselastname\" class=\"pop_label_left\">Father last name</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtspouselastname\" class=\"form-control\" maxlength=\"50\" tabindex=\"19\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblpreviousmarriage\" class=\"pop_label_left\">Notes about previous marriage</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.spouObj.txtpreviousmarriage\" class=\"form-control\" maxlength=\"500\" tabindex=\"20\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"spousefamily\" class=\"pop_label_left\">Family planning</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rbtnspousefamily\" layout=\"row\" ng-model=\"page.model.spouObj.rbtnspousefamily\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">Yes</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"0\"> No </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblspousechidrens\" class=\"pop_label_left\">No of children</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown id=\"Select4\" ng-model=\"page.model.spouObj.ddlspousechidrens\" ng-options=\"item1.value as item1.label for item1 in page.model.noofChldrenAray\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"spouseChildContent.html\">\r" +
    "\n" +
    "    <form name=\"profForm\" novalidate role=\"form\" ng-submit=\"page.model.childSubmit(page.model.childObj);\" accessible-form>\r" +
    "\n" +
    "        <div class=\"modal-header\">\r" +
    "\n" +
    "            <h3 class=\"modal-title text-center\" id=\"modal-title\">Children Details\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\" ng-click=\"page.model.cancel();\">\r" +
    "\n" +
    "                    <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"modal-body clearfix pop_content_my\" id=\"modal-body\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"childname\" class=\"pop_label_left\">Name of the child </label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <input type=\"text\" ng-model=\"page.model.childObj.txtchildname\" class=\"form-control\" maxlength=\"150\" tabindex=\"1\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"genderchild\" class=\"pop_label_left\">Gender of the child</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rdlgenderchild\" layout=\"row\" ng-model=\"page.model.childObj.rdlgenderchild\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">Male</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"2\"> Female </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lbldobchild\" class=\"pop_label_left\">DOB of the child</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <date-picker strdate=\"page.model.childObj.txtdobchild\"></date-picker>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"genderchild\" class=\"pop_label_left\">Child staying with</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right pop_radios_list\">\r" +
    "\n" +
    "                        <md-radio-group ng-required=\"true\" name=\"rbtChildstayingWith\" layout=\"row\" ng-model=\"page.model.childObj.rbtChildstayingWith\" class=\"md-block\" flex-gt-sm ng-disabled=\"manageakerts\">\r" +
    "\n" +
    "                            <md-radio-button value=\"1\" class=\"md-primary\">Father Side</md-radio-button>\r" +
    "\n" +
    "                            <md-radio-button value=\"2\"> Mother Side </md-radio-button>\r" +
    "\n" +
    "                        </md-radio-group>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clearfix\">\r" +
    "\n" +
    "                    <label for=\"lblspouserelation\" class=\"pop_label_left\">Child staying with Relation</label>\r" +
    "\n" +
    "                    <div class=\"pop_controls_right select-box-my\">\r" +
    "\n" +
    "                        <select multiselectdropdown ng-model=\"page.model.childObj.ddlrelation\" typeofdata=\"'childStayingWith'\"></select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"row\">\r" +
    "\n" +
    "                    <edit-footer></edit-footer>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('common/templates/Photopopup.html',
    "<div class=\"modal-content\">\r" +
    "\n" +
    "    <div class=\"modal-header\">\r" +
    "\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"model.cancel()\">×</button>\r" +
    "\n" +
    "        <h4 class=\"modal-title\">Photo Album</h4>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-body\">\r" +
    "\n" +
    "        <div class=\"bs-example\">\r" +
    "\n" +
    "            <div id=\"slideshow\" class=\"carousel slide\" data-interval=\"3000\" data-ride=\"carousel\">\r" +
    "\n" +
    "                <ol class=\"carousel-indicators\">\r" +
    "\n" +
    "                    <li ng-repeat=\"slide in model.SlideArr\" data-target=\"#slideshow\" ng-class=\"$index+1==1?'active':''\" data-slide-to=\"$index+1-1\"></li>\r" +
    "\n" +
    "                </ol>\r" +
    "\n" +
    "                <div class=\"carousel-inner\">\r" +
    "\n" +
    "                    <div ng-class=\"($index+1)==1?'item active':'item'\" ng-repeat=\"slide in model.SlideArr\">\r" +
    "\n" +
    "                        <img id=\"imh\" ng-src=\"{{slide.FullPhotoPath}}\" style=\"margin-left: auto;\r" +
    "\n" +
    "    margin-right: auto;\"></img>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <a data-target=\"#slideshow\" id=\"a1\" class=\"carousel-control left\" href=\"javascript:void(0)\" data-slide=\"prev\">\r" +
    "\n" +
    "                    <span class=\"glyphicon glyphicon-chevron-left\"></span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "                <a data-target=\"#slideshow\" id=\"a2\" class=\"carousel-control right\" href=\"javascript:void(0)\" data-slide=\"next\">\r" +
    "\n" +
    "                    <span class=\"glyphicon glyphicon-chevron-right\"></span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-hide=\"true\">\r" +
    "\n" +
    "                <img src=\"http://d16o2fcjgzj2wp.cloudfront.net/Images/HoroscopeImages/86974_HaroscopeImage/86974_HaroscopeImage.jpg\" style=\"height: 500px; width: 500px;\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('common/templates/contacttemplate.html',
    "<div id=\"ownerdiv4\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <li id=\"divfathernumbersowner\" class=\"clearfix form-group\">\r" +
    "\n" +
    "        <label for=\"lblContactNumbersfather\" class=\"pop_label_left\">Contact Numbers</label>\r" +
    "\n" +
    "        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a data-toggle=\"tooltip\" style=\"padding-right:20%;\" data-original-title=\"Add Mobile Number\" tabindex=\"6\" ng-click=\"showhidemob($event,'mob');\" href=javascript:void(0);>\r" +
    "\n" +
    "                <ng-md-icon icon=\"smartphone\" style=\"fill:#337ab7\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a data-toggle=\"tooltip\" style=\"padding-right:20%;\" data-original-title=\"Add  Land Number\" tabindex=\"7\" ng-click=\"showhidemob($event,'land');\" href=javascript:void(0);>\r" +
    "\n" +
    "                <ng-md-icon icon=\"call\" style=\"fill:#337ab7\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a data-toggle=\"tooltip\" ng-show=\"emailhide\" data-original-title=\"Add  Email ID\" tabindex=\"8\" ng-click=\"showhidemob($event,'mail');\" href=javascript:void(0);>\r" +
    "\n" +
    "                <ng-md-icon icon=\"mail\" style=\"fill:#337ab7\" size=\"20\"></ng-md-icon>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <li class=\"clearfix form-group\" ng-show=\"pmob\">\r" +
    "\n" +
    "        <div>\r" +
    "\n" +
    "            <label for=\"lblMobile\" class=\"pop_label_left\">Mobile #  </label>\r" +
    "\n" +
    "            <div class=\"pop_controls_right select-box-my select-box-my-double\">\r" +
    "\n" +
    "                <select multiselectdropdown ng-model=\"dmobile\" typeofdata=\"'countryCode'\"></select>\r" +
    "\n" +
    "                <input type=text ng-model=\"strmobile\" style=\"float:right;\" class=\"form-control\" maxlength=\"10\" tabindex=\"10\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"clearfix form-group\" ng-show=\"amob\">\r" +
    "\n" +
    "        <div>\r" +
    "\n" +
    "            <label for=\"lblMobilefather\" class=\"pop_label_left\">Altenate Number</label>\r" +
    "\n" +
    "            <div class=\"pop_controls_right select-box-my select-box-my-double\">\r" +
    "\n" +
    "                <select multiselectdropdown ng-model=\"dalternative\" typeofdata=\"'countryCode'\"></select>\r" +
    "\n" +
    "                <input type=text class=\"form-control\" style=\"float:right;\" ng-model=\"stralternative\" maxlength=\"10\" tabindex=\"12\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"clearfix form-group\" ng-show=\"land\">\r" +
    "\n" +
    "        <div>\r" +
    "\n" +
    "            <label for=\"lblLandLine\" class=\"pop_label_left\">Land line #  </label>\r" +
    "\n" +
    "            <div class=\"pop_controls_right select-box-my select-box-my-trible\">\r" +
    "\n" +
    "                <select multiselectdropdown ng-model=\"dland\" typeofdata=\"'countryCode'\"></select>\r" +
    "\n" +
    "                <input type=text ng-model=\"strareacode\" maxlength=\"4\" tabindex=\"14\" />\r" +
    "\n" +
    "                <input type=text ng-model=\"strland\" maxlength=\"8\" tabindex=\"15\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"clearfix form-group\" ng-show=\"mail\">\r" +
    "\n" +
    "        <label for=\"lblEmail\" class=\"pop_label_left\">Email  </label>\r" +
    "\n" +
    "        <div class=\"pop_controls_right\">\r" +
    "\n" +
    "            <input type=text ng-model=\"strmail\" class=\"form-control\" placeholder=\"Enter Email\" text=\" \" tabindex=\"16\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('common/templates/countryTemplate.html',
    "<div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <li class=\"clearfix form-group\" ng-show=\"countryshow\">\r" +
    "\n" +
    "        <label for=\"lblCountry\" class=\"pop_label_left\">Country<span ng-if=\"require==true\" style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "        <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "            <select multiselectdropdown ng-model=\"dcountry\" ng-change=\"changeBind('Country',dcountry);\" typeofdata=\"'Country'\" ng-required=\"require\"></select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "        <label for=\"State\" class=\"pop_label_left\">State<span ng-if=\"require==true\" style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "        <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "            <select multiselectdropdown ng-model=\"dstate\" ng-options=\"item.value as item.label for item in stateArr\" ng-change=\"changeBind('State',dstate,dcountry);\" ng-required=\"require\"></select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"clearfix form-group\">\r" +
    "\n" +
    "        <div id=\"divEduDistric\">\r" +
    "\n" +
    "            <label for=\"lblDistrict\" class=\"pop_label_left\">District<span ng-if=\"require==true\" style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "            <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "                <select multiselectdropdown ng-model=\"ddistrict\" ng-options=\"item1.value as item1.label for item1 in districtArr\" ng-change=\"changeBind('District',ddistrict);\" ng-required=\"(dcountry===1 || dcountry==='1')?require:false\"></select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"clearfix form-group\" ng-show=\"cityshow\">\r" +
    "\n" +
    "        <label for=\"lblCityworking\" class=\"pop_label_left\">City<span ng-if=\"require==true\" style=\"color: red; margin-left: 3px;\">*</span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"pop_controls_right select-box-my input-group\">\r" +
    "\n" +
    "            <div ng-show=\"!cityinput\">\r" +
    "\n" +
    "                <select multiselectdropdown ng-model=\"dcity\" ng-options=\"item.value as item.label for item in cityeArr\" ng-required=\"cityshow==true?require:false\"></select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"othercity\">\r" +
    "\n" +
    "                <input ng-model=\"strothercity\" ng-show=\"cityinput\" class=\"form-control\" maxlength=\"100\" />\r" +
    "\n" +
    "                <a id=\"lnkCity\" href=\"javascript:void(0);\" ng-click=\"ShowCity();\">Not in List</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('common/templates/deletepopup.html',
    "<form name=\"deleteForm\" novalidate role=\"form\" ng-submit=\"page.model.deleteSubmit()\">\r" +
    "\n" +
    "    <div class=\"modal-header\">\r" +
    "\n" +
    "        <h3 class=\"modal-title text-center\" id=\"modal-title\">Alert\r" +
    "\n" +
    "            <a href=\"javascript:void(0);\" ng-click=\"cancel();\">\r" +
    "\n" +
    "                <ng-md-icon icon=\"close\" style=\"fill:#c73e5f\" class=\"pull-right\" size=\"25\">Delete</ng-md-icon>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </h3>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-body clearfix\" id=\"modal-body\">\r" +
    "\n" +
    "        <b class=\"text-center\"> Do you want to delete <span>{{deleteDisplayTxt}}</span> details</b>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"modal-footer\">\r" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-success\">Delete</button>\r" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"page.model.cancel();\">Cancel</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('common/templates/reviewConfirmationPopup.html',
    "<form name=\"reviewConfirmForm\" novalidate role=\"form\" ng-submit=\"reviewSubmit();\">\r" +
    "\n" +
    "    <div class=\"modal-header text-center\" style=\"color: #57b5e3;\r" +
    "\n" +
    "    border-bottom: 3px solid #57b5e3;font-size: 30px;\">\r" +
    "\n" +
    "        <i class=\"glyphicon glyphicon-alert\"></i>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-title text-center\" style=\"font-size: 17px;color: #737373;font-weight: bold;\">Confirmation</div>\r" +
    "\n" +
    "    <div class=\"modal-body clearfix\" id=\"modal-body\">\r" +
    "\n" +
    "        <b class=\"text-center\" style=\"color:gray;\"> Do you want to Review the {{reviewdisplay}}</b>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-footer\">\r" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-success\">Review</button>\r" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"cancel();\">Cancel</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('PageCode/viewFormat.html',
    "<html>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<head>\r" +
    "\n" +
    "    <title></title>\r" +
    "\n" +
    "</head>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<body>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</body>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</html>"
  );

}]);
