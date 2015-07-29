// is subscribed to data modified by the FormController

app.controller('VelociraptorPreview', function($scope, $document, renderer) 
{
	$scope.name = "VelociraptorPreview";

	var canvas        = $document[ 0 ].querySelector( "#canvas" ),
	    ctx           = canvas.getContext( "2d" ),
	    isTransparent = false;

	var gridMarkerWidth     = 0,
		gridMarkerHeight    = 0,
	    gridMarkerSubWidth  = 0,
	    gridMarkerSubHeight = 0;
     
	// invoked whenever the FormController broadcasts a form submit
	// over the $rootScope

	$scope.$on( 'update', function( event, eventData )
    {
	 	var data = sanitizeForm( eventData ); // sanitize form dimensions from inches to pixels

	 	console.log( data ); // dump data in console, is model from FormController

	 	// first scale the canvas to the requested dimensions

	 	canvas.width  = data.width;
    	canvas.height = data.height;
	 	isTransparent = data.transparent;
	 	var radius    = ( data.width / 2 ) * ( data.radius / 100 ); // maximum radius is half the width of the image !!

    	//clear the canvas
        ctx.clearRect( 0, 0, canvas.width, canvas.height );	

	 	// which fill type render do we require ?

	 	switch ( data.fillType )
	 	{
	 		case "solid":
	 			renderer.drawSquare( ctx, 0, 0, data.width, data.height, data.solidColor, radius );
	 			break;

 			case "random":
				renderer.drawSquare( ctx, 0, 0, data.width, data.height, "#" + Math.floor( Math.random() * 0xFFFFFF ).toString( 16 ), radius );
 				break;

			case "noise":
				renderer.createNoise( ctx, data.width, data.height, 1 );
				break;

	 	}

	 	if ( data.checkered ) {

	 		renderer.createCheckeredPattern( ctx, data.width, data.height, data.rowAmount, data.columnAmount, data.blockColor );
	 	}

	 	if ( data.grid ) {

	 	 	renderer.createGridGenerator( ctx, data.width, data.height, gridMarkerWidth, gridMarkerHeight,
	 	 								  gridMarkerSubWidth, gridMarkerSubHeight, data.gridColor, 1 );
	 	}

	});

	// cache the DPI for this particular device / screen
	// this is the amount of pixels that fits in an inch
	var ppi = $document[ 0 ].querySelector( ".inch" ).offsetWidth;
	
	console.log( "pixels per inch: " + ppi );

	// helper function to convert dimensions in inches to pixels

	function inchesToPixels( inches ) {
		return inches * ppi;
	}

	// helper function to sanitize form values into pixels

	function sanitizeForm( form )
	{
		// we clone the form data as to not update the form view
		var data = JSON.parse( JSON.stringify( form ));

		// if unit is specified to be in inches, convert all
		// associated dimensions into pixels

		if ( data.unit === "in" )
		{
			data.width     = inchesToPixels( data.width );
			data.height    = inchesToPixels( data.height );
			data.radius    = inchesToPixels( data.radius );
		}

		// grid markers are relative to the full image width
		// grid markers specify the amount of steps present in this image

		gridMarkerWidth     = data.width / data.gridStepAmount;
		gridMarkerHeight	= data.height / data.gridStepAmount;
		gridMarkerSubWidth  = gridMarkerWidth / data.gridSubdivisions;
		gridMarkerSubHeight = gridMarkerHeight / data.gridSubdivisions;

		return data;
	}

	function grabImage()
	{
		if ( canvas && ctx ) 
        {
        	// grab canvas image contents as either PNG (transparent) or JPEG
            return canvas.toDataURL( isTransparent ? "image/png" : "image/jpeg" );
        }	
	}

	// function exportCanvas( canvas, ctx)
    document.getElementById( "download" ).onclick = function( e )
	{
        // create anchor element that will download file through browser
        var anchor = document.createElement( "a" );
        anchor.href = grabImage();
        // create random filename
        anchor.download = "VelociraptorImage_" + Date.now() + ( isTransparent ? ".png" : ".jpg" );
        anchor.click();
	}

	// full view
	document.getElementById( "fullview" ).onclick = function( e )
	{
		window.open( grabImage(), "_blank" );
	};
});

app.factory('renderer', function()
{
    var renderer =
    {
    	createNoise : function( ctx, width, height, opacity )
    	{
		    var x, y, color;
		    var opacity = opacity || .2;
		    var red, green, blue;
		  
		    for ( x = 0; x < width; x++ )
		    {
		       for ( y = 0; y < height; y++ )
		       {
		          red   = Math.floor( Math.random() * 255 );
		  	      green = Math.floor( Math.random() * 255 );
		          blue  = Math.floor( Math.random() * 255 );
		  
		          ctx.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + opacity + ")";
		          ctx.fillRect(x, y, 1, 1);
		       }
		    }
    	},

    	createCheckeredPattern : function( ctx, canvasWidth, canvasHeight, amountOfRows, amountOfColumns, blockColor )
    	{
    		var blockWidth  = canvasWidth  / amountOfColumns;
    		var blockHeight = canvasHeight / amountOfRows;

    		// render blocks in individual rows

    		var rowFilled = true;	// whether the previous row started with a filled block
    		var fill = true;

    		for ( var row = 0; row < amountOfRows; ++row )
    		{
    			// render all columns within a row
    			for ( var column = 0; column < amountOfColumns; ++column )
    			{
    				if ( fill ) {
	    				renderer.drawSquare( ctx, column * blockWidth, row * blockHeight, blockWidth, blockHeight, blockColor, 0 );
    				}
    				fill = !fill;
    			}
    			rowFilled = !rowFilled;
    			fill      = rowFilled;	// ensure first block of the next row matches the fill expectation of the row
    		}
    	},

        createGridGenerator : function( ctx, canvasWidth, canvasHeight, gridMarkerWidth, gridMarkerHeight,
        					 			gridMarkerSubWidth, gridMarkerSubHeight, gridColor, gridPixelSize )
	    {

   			// calculate center coordinates

   			var x = canvasWidth  / 2  - gridPixelSize / 2;
   			var y = canvasHeight / 2  - gridPixelSize / 2;

   			// draw horizontal line
            
        	ctx.moveTo( 0, y );
        	ctx.lineTo( canvasWidth, y );

        	// draw vertical line

        	ctx.moveTo( x, 0 );
        	ctx.lineTo( x, canvasHeight );

        	// draw all horizontal grid steps

        	var markerHeight    = canvasHeight / 20; // height of an individual marker
        	var markerSubHeight = markerHeight / 2;
        	y = canvasHeight / 2 - markerHeight / 2;
        	var subX;
        	var subY = canvasHeight / 2 - markerSubHeight / 2;

        	for ( x = 0; x < canvasWidth; x += gridMarkerWidth )
        	{
    			ctx.moveTo( x, y );
        		ctx.lineTo( x, y + markerHeight );

        		for ( subX = x; subX < ( x + gridMarkerWidth ); subX += gridMarkerSubWidth )
        		{
        			ctx.moveTo( subX, subY );
        			ctx.lineTo( subX, subY + markerSubHeight );
        		}	
        	}

        	// draw all vertical grid steps

        	var markerWidth = markerHeight; // width of an individual marker
        	var markerSubWidth = markerWidth / 2;
        	x = canvasWidth / 2 - markerWidth / 2;
        	subX = canvasWidth / 2 - markerSubWidth / 2;

        	for ( y = 0; y < canvasHeight; y += gridMarkerHeight )
        	{
    			ctx.moveTo( x, y );
        		ctx.lineTo( x + markerWidth, y );

        		for ( subY = y; subY < ( y + gridMarkerHeight ); subY += gridMarkerSubHeight )
        		{
        			ctx.moveTo( subX, subY );
        			ctx.lineTo( subX + markerSubWidth, subY );
        		}	
        	}
        	
			ctx.strokeStyle = gridColor;
			ctx.stroke();
        	
			ctx.strokeStyle = gridColor;
			ctx.stroke();

	    },

        /**
         * draw the square on the canvas
         */
        drawSquare : function( ctx, x, y, width, height, color, radius ) 
        {
            console.log("square to draw: " + width + "x" + height + " at " + x + " x " + y );
            
            ctx.fillStyle = color;
            //ctx.fillRect( x, y, width, height);
        
			if (typeof radius === "undefined") {
			  radius = 0;
			}
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
		    ctx.fill();
        }
    };
    return renderer;
});

