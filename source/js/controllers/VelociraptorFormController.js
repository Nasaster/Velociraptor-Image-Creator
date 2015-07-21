app.controller('VelociraptorForm', [ '$rootScope', '$scope', function( $rootScope, $scope)
{
	// the model specifiying what the data looks like

	this.model = {
		width: 100,
		height: 100,
		unit: 'px',

		transparent: false,
		solidColor: '',
		radius: 0,

		rowAmount: 5,
		columnAmount: 5,
		blockColor: '',

		noiseType: 'gradient',
		checkered: false,
		vertColumn: '',
		horizColmn: '',

		grid: false,
		gridColor: '',
		smallStep: 5,
		largeStep: 10		
	};

	// function invoked when the form is submitted

	this.submit = function( form )
	{
		// broadcast to all subscribers that the form has been submitted
		$rootScope.$broadcast( 'update', this.model );
	};

		//console.log( "VelociraptorForm is active!!" );
}]);
