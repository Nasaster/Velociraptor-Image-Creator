// reference to Chai assertions
var assert = chai.assert;
var expect = chai.expect;

describe( 'VelociraptorForm', function () 
{
	// reference to our Angular application (see app.js)
	beforeEach( module( 'Velociraptor' ));
    var $scope, createController;

    beforeEach( inject( function ( $rootScope, $controller )
    {
        $scope = $rootScope.$new();

        createController = function() {
            return $controller('VelociraptorForm', {
            	'$rootScope': $rootScope,
                '$scope': $scope
            });
        };
    }));

    it( "should print the correct name", function () 
    {
    	var ctrl = createController();
        assert.strictEqual(ctrl.name, "VelociraptorForm",
        	"expected name to equal 'VelociraptorForm', got '" + ctrl.name + "' instead" );
    });

	it( "should have a valid model", function()
	{
		var ctrl = createController();

		var model = ctrl.model;
		expect( model.width ).to.be.a( "number" );
		expect( model.height ).to.be.a( "number" );
		expect( model.unit ).to.be.a( "string" );
		expect( model.transparent ).to.be.a( "boolean" );
		expect( model.solidColor ).to.be.a( "string" );
		expect( model.radius ).to.be.a( "number" );
		expect( model.checkered ).to.be.a( "boolean" );
		expect( model.rowAmount ).to.be.a( "number" );
		expect( model.columnAmount ).to.be.a( "number" );
		expect( model.blockColor ).to.be.a( "string" );
		expect( model.grid ).to.be.a( "boolean" );
		expect( model.gridColor ).to.be.a( "string" );
		

		// assertions regarding the data types of the model
	});

});

describe( 'VelociraptorPreview', function () 
{
	// reference to our Angular application (see app.js)
	beforeEach( module( 'Velociraptor' ));
    var $scope, directive, createController;

    beforeEach( inject( function ( $rootScope, $compile, $controller, $templateCache )
    {
        $scope = $rootScope.$new();

        createController = function() {
            return $controller('VelociraptorPreview', {
            	'$rootScope': $rootScope,
                '$scope': $scope
            });
        };

        // Compile and spawn the HTML template that is attached to ng-controller VelociraptorPreview
	    directive = $compile( $templateCache.get( "views/preview.html" ))( $scope );
        $scope.$apply(); // binds VelociraptorPreview to the template
    }));

    it( "should print the correct name", function () 
    {
    	// console.log(directive);return;
    // 	var ctrl = createController();
    //     assert.strictEqual(ctrl.name, "VelociraptorPreview",
    //     	"expected name to equal 'VelociraptorPreview', got '" + ctrl.name + "' instead" );
    });

});
