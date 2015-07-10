// app.controller('VelociraptorPreview', ['$scope', function($scope)
// {

// }]);

app.controller('VelociraptorPreview', function($scope) {
    $scope.name = 'World';
});

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
                    inPerc = 99;
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