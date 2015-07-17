app.controller('VelociraptorForm', [ '$rootScope', '$scope', function( $rootScope, $scope)
{
	// the model specifiying what the data looks like

	this.model = {
		width: 100,
		height: 100,
		unit: 'px',

		transparent: false,
		solidColor: '',
		randColor: getRandomColor(),
		radius: 20,

		rowAmount: 5,
		columnAmount: 5,

		noiseType: 'gradient',
		checkered: false,
		vertColumn: '',
		horizColmn: '',

		grid: false,
		gridColor: '',
		smallStep: 5,
		largeStep: 10
		
	};
	// Random Color function 
	function getRandomColor() 
	{
    	var letters = '0123456789ABCDEF'.split('');
    	var color = '#';
    		for (var i = 0; i < 6; i++ ) 
    		{
        		color += letters[Math.floor(Math.random() * 16)];
    		}
    		return color;
	};

	// function invoked when the form is submitted

	this.submit = function( form )
	{
		// broadcast to all subscribers that the form has been submitted
		$rootScope.$broadcast( 'update', this.model );
	};

		//console.log( "VelociraptorForm is active!!" );
}]);
