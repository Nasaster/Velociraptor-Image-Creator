app.controller('VelociraptorForm', ['$scope', function($scope)
{
	// the model specifiying what the data looks like

	this.model = {
		width: 10,
		height: 10,
		unit: 'px',

		transparent: false,
		solidColor: '#4455DD',
		randColor: [ '#FF0000', '#000000', '#FFFFFFF' ],
		radius: 20,

		noiseType: 'gradient',
		vertColumn: '#000000',
		horizColmn: '#FFFFFF',

		grid: false,
		gridColor: "#FAC22A",
		smallStep: 10,
		largeStep: 100
		
	};

	// function invoked when the form is submitted

	this.submit = function( form )
	{
		console.log( this.model );
	};

		//console.log( "VelociraptorForm is active!!" );
}]);



app.directive("canvasField", function ()
	{
    return {
        restrict: 'E',
        scope: {
            progress: '=', 		//set up progress to accept data-binding
            progressId: '@'		// the progressId uses the data-binding from the parent scope
        },
        template: "<canvas id='pgcanvas' width='400' height='400'>",
        link: function(scope, element, attrs) {
           console.log(element);
           scope.canvas = element.find('canvas')[0];
           scope.context = scope.canvas.getContext('2d');
 
           scope.$watch('progress', function(newValue) {
             barWidth = Math.ceil(newValue / 100 * scope.canvas.width);
             scope.context.fillStyle = "#DDD";
             scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
             scope.context.fillStyle = "#F00";
             scope.context.fillRect(0, 0, barWidth, scope.canvas.height);
           });
        }        
	};
});
