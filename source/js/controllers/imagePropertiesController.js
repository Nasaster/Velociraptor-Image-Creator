app.controller('ImagePropertiesController', ['$scope', function($scope) {
    $scope.apps = [{
        "config": {
            "type": "String",
            "grid": "Boolean",
            "gridProperties": {
                "width": "Number",
                "height": "Number"
            }
        }
    }];
}]);