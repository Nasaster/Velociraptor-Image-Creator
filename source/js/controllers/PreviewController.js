// app.controller('VelociraptorPreview', ['$scope', function($scope)
// {

// }]);

// app.controller('VelociraptorPreview', function($scope) {
//     $scope.name = 'World';
// });

app.directive('circleDraw', ['$timeout',
    function(timer) {
        return {
            restrict: 'A',
            link: function(scope, iElement) {
                var context = iElement[0].getContext('2d');
                var x = iElement[0].width / 2;
                var y = iElement[0].height / 2;
                var radius = 90;
                var startAngle = 0 * Math.PI;
                var endAngle;
                var counterClockwise = false;
                var strokeColor;

                function getColor(huh) {
                    if (huh <= 49) {
                        strokeColor = '#d31f1f';
                    } else if (huh <= 74) {
                        strokeColor = '#eac11e';
                    } else strokeColor = '#59b73c';
                    console.log(strokeColor);
                    return strokeColor;
                }

                //this test for rectangle works as expected 

                //context.fillStyle = "#FF0000";
                //context.fillRect(20, 20, 150, 150);

                var getDeg = function(inPerc) {
                    inPerc = 90;
                    var aPerc = (inPerc * 0.02);
                    console.log('aPerc = ' + aPerc);
                    endAngle = aPerc * Math.PI;
                    console.log("end angle = " + endAngle);
                    console.log("start angle = " + startAngle);
                    context.beginPath();
                    context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
                    context.lineWidth = 10;
                    context.strokeStyle = getColor(inPerc);
                    context.stroke();
                }
                timer(getDeg, 0);
            }
        }
    }
]);

app.controller('VelociraptorPreview', function($scope, squareDrawer) 
{
	$scope.classes = [
        //"bg-buildings",
        "red",
        "blue",
        "yellow",
        "green",
        "orange",
        "black",
        "purple"
    ];        

     $scope.square = 
    {
        height: '100',
        width: '100'
    };

    $scope.$watch('square', function(newValue, oldValue) 
    {
        if (newValue != oldValue) 
        {
            console.log('value changed: ' + JSON.stringify($scope.square));
            squareDrawer.draw(newValue.height, newValue.width);
        }
    }, true);

});

app.factory('squareDrawer', function()
{
    var registry = {};

    var squareDrawer = 
    {
        /**
         * draw the square on the canvas
         */
        draw: function(height, width) 
        {
            console.log("square to draw: " + height + "x" + width);

            var canvas = document.getElementById("canvas");
            if (canvas.getContext) 
            {
                console.log("drawing");
                var ctx = canvas.getContext("2d");
                //clear the canvas
                ctx.clearRect(0,0, canvas.width, canvas.height);

                ctx.fillRect(0, 0, width, height);
            }
        }
    };


    return squareDrawer;
});

app.directive("ngRandomClass", function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            ngClasses: "="
        },
        // template: "<canvas id='pgcanvas' width='400' height='400'>",
        link: function (scope, elem, attr) {            

            //Add random background class to selected element
            elem.addClass(scope.ngClasses[Math.floor(Math.random() * (scope.ngClasses.length))]);
        }
    }
});