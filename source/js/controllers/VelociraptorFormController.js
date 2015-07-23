app.controller('VelociraptorForm', [ '$rootScope', '$scope', function( $rootScope, $scope)
{
	this.name = "VelociraptorForm";

	// the model specifiying what the data looks like

	this.model = {
		width: 100,
		height: 100,
		unit: 'px',

		transparent: false,
		solidColor: '#7bbf60',
		radius: 0,

		rowAmount: 5,
		columnAmount: 5,
		blockColor: '#000000',

		//noiseType: 'gradient',
		checkered: false,
		//vertColumn: '',
		//horizColmn: '',

		stw:'1',

		grid: false,
		gridColor: '#000000',
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
