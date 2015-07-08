app.controller('VelociraptorForm', ['$scope', function($scope)
{
	// the model specifiying what the data looks like

	this.model = {
		width: 10,
		height: 10,
		unit: 'px',
		transparent: false,
		hex: [ '#FF0000', '#000000', '#FFFFFFF' ]
	};

	// function invoked when the form is submitted

	this.submit = function( form )
	{
		console.log( this.model );
	};
}]);
