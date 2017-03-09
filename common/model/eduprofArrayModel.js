(function(angular) {
    'use strict';


    function factory($http, service) {
        var model = {};

        model.init = function() {
            model.ProfCatgoryf();
            model.ProfessionGroupf();
            return model;
        };

        model.ProfCatgoryf = function() {
            service.ProfessionCatgory().then(function(response) {
                var option = [];
                option.push({ "label": "--select--", "title": "--select--", "value": "" });
                _.each(response.data, function(item) {
                    option.push({ "label": item.Name, "title": item.Name, "value": item.ID });
                });
                model.ProfCatgory = option;
            });
        };

        model.ProfessionGroupf = function() {
            service.ProfessionGroup().then(function(response) {
                var option = [];
                option.push({ "label": "--select--", "title": "--select--", "value": "" });
                _.each(response.data, function(item) {
                    option.push({ "label": item.Name, "title": item.Name, "value": item.ID });
                });
                model.ProfGroup = option;
            });
        };

        return model.init();
    }

    angular
        .module('KaakateeyaEmpEdit')
        .factory('eduprofArrayModel', factory)

    factory.$inject = ['$http', 'SelectBindService'];

})(angular);