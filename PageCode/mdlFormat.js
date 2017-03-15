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
        .factory('parametervalueModel', factory)

    factory.$inject = ['$http'];

})(angular);