(function(angular) {
    'use strict';

    function factory($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {}
    }

    angular
        .module('KaakateeyaEmpReg')
        .factory('regManagePhotoService', factory)

    factory.$inject = ['$http'];
})(angular);