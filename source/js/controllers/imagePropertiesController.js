app.controller('ImagePropertiesController', ['$scope', function($scope) {
  $scope.scores = [
  {
  	"type": "String",		// transparent toggle (e.g. PNG for transparent, JPG for non-transparent)
  	"grid": "Boolean",
  	"gridProperties": {
  		"width": "Number",
  		"height": "Number"
  	}
  }]
}]);
