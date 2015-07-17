// is subscribed to data modified by the FormController

app.controller('VelociraptorPreview', function($scope, renderer) 
{
	var canvas = document.getElementById( "canvas" ),
	    ctx    = canvas.getContext( "2d" );
     
	// invoked whenever the FormController broadcasts a form submit
	// over the $rootScope

	$scope.$on( 'update', function( event, eventData )
    {
	 	var data = sanitizeForm( eventData ); // sanitize form dimensions from inches to pixels

	 	console.log( data ); // dump data in console, is model from FormController

	 	// first scale the canvas to the requested dimensions

	 	canvas.width  = data.width;
    	canvas.height = data.height;

    	//clear the canvas
        ctx.clearRect( 0, 0, canvas.width, canvas.height );	

	 	// which fill type render do we require ?

	 	switch ( data.fillType )
	 	{
	 		case "solid":
	 			renderer.drawSquare( ctx, 0, 0, data.width, data.height, data.solidColor );
	 			break;

 			case "random":
				renderer.drawSquare( ctx, 0, 0, data.width, data.height, "#" + Math.floor( Math.random() * 0xFFFFFF ).toString( 16 ));
 				break;

			case "noise":
				renderer.createNoise( ctx, data.width, data.height, 1 );
				break;

	 	}

	 	if ( data.checkered ) {

	 		renderer.createCheckeredPattern( ctx, data.width, data.height, data.rowAmount, data.columnAmount, data.solidColor );
	 	}

	 	if ( data.grid ) {

	 	 	renderer.createGridGenerator( ctx, data.width, data.height, data.smallStep, data.largeStep, data.gridColor );
	 	}

	 	//
	 	//renderer.drawCircle( data.radius, data.solidColor, data.randColor );
	 	//renderer.triangle  ( data.height, data.width, 	   data.solidColor, data.randColor );
	});

	// cache the DPI for this particular device / screen
	// this is the amount of pixels that fits in an inch
	var ppi = document.querySelector( ".inch" ).offsetWidth;
	
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
			data.smallStep = inchesToPixels( data.smallStep );
			data.largeStep = inchesToPixels( data.largeStep );
		}
		return data;
	}

	// function exportCanvas( canvas, ctx)
 //    {
 //        if( canvas &amp;&amp; ctx ) 
 //        {
 //            var img = canvas.toDataURL("image/png;base64;");
 //            anchor = document.getElementById("download");
 //            anchor.href = img;
 //            anchor.innerHTML = "Download";
	//     }
	//     else 
	//     {
 //             alert("Can not export");
 //        }
	// }
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

    	createCheckeredPattern( ctx, canvasWidth, canvasHeight, amountOfRows, amountOfColumns, blockColor )
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
	    				renderer.drawSquare( ctx, column * blockWidth, row * blockHeight, blockWidth, blockHeight, blockColor );
    				}
    				fill = !fill;
    			}
    			rowFilled = !rowFilled;
    			fill      = rowFilled;	// ensure first block of the next row matches the fill expectation of the row
    		}
    	},

        createGridGenerator( ctx, canvasWidth, canvasHeight, smallStep, largeStep, gridColor, gridPixelSize )
	    {

		 /*
		  * i is used for both x and y to draw
	 	  * a line every 5 pixels starting at
	 	  * .5 to offset the canvas edges
	 	  */

			for(var i = .5; i < canvasWidth || i < canvasHeight; i += 20) {
            // draw horizontal lines
            ctx.moveTo( i, 0 );
            ctx.lineTo( i, canvasHeight);
            // draw vertical lines
            ctx.moveTo( 0, i );
            ctx.lineTo( canvasWidth, i);
        	}
        
        

			ctx.strokeStyle = gridColor;
			ctx.stroke();

	    },

        /**
         * draw the square on the canvas
         */
        drawSquare : function( ctx, x, y, width, height, color ) 
        {
            console.log("square to draw: " + width + "x" + height + " at " + x + " x " + y );
            
            ctx.fillStyle = color;
            ctx.fillRect( x, y, width, height);
        },

        triangle: function( ctx, width, height, color, randomColor)
        {
			ctx.moveTo(120, 120);
			ctx.lineTo(120, 200);
			ctx.lineTo(200, 200);
			ctx.closePath();
			 
			// the fill color
			ctx.fillStyle = color || randomColor;;
			ctx.fill();
        },

        drawCircle : function( ctx, radius, color, randomColor )
        {
            var x = canvas.width / 2;
            var y = canvas.height / 2;
            var startAngle = 0 * Math.PI;
            var endAngle;
            var counterClockwise = false;
            

            var getDeg = function(inPerc) {
                var aPerc = (inPerc * 0.02);
                console.log('aPerc = ' + aPerc);
                endAngle = aPerc * Math.PI;
                console.log("end angle = " + endAngle);
                console.log("start angle = " + startAngle);
                ctx.beginPath();
                ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
                ctx.lineWidth = 10;
                ctx.strokeStyle = color || randomColor;
                ctx.stroke();
                ctx.fill();
            }
            getDeg( 100 );
        }
    };
    return renderer;
});

