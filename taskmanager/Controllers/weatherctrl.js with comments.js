// Controller for the weather page
app.controller('weatherCtrl', function($scope, $rootScope, $location){
    
    // Fetch weather data from the server
    axios.get($rootScope.serverUrl + '/db/weatherdatas').then(res=>{
        $scope.datas = res.data;
        $scope.$apply();
       
        // If calendar view is active
        if ($location.path() == '/calendar'){

            // Initialize events array to store calendar events
            $scope.events = [];

            // Loop through each weather data item
            $scope.datas.forEach(item => {
                // Create events for min temperature, max temperature, and weather type
                $scope.events.push(
                    {
                        title: 'Min: ' + item.min + ' C°',
                        start: item.date,
                        allDay: false,
                        backgroundColor: '#42a29d',
                        borderColor: '#42a29d',
                    }
                );
                $scope.events.push(
                    {
                        title: 'Max: ' + item.max + ' C°',
                        start: item.date,
                        allDay: false,
                        backgroundColor: '#d04b45',
                        borderColor: '#d04b45',
                    }
                );
                $scope.events.push(
                    {
                        title: 'Type: ' + item.type,
                        start: item.date,
                        allDay: false,
                        backgroundColor: '#594293',
                        borderColor: '#594293',
                    }
                );
            });

            // Render calendar using FullCalendar library
            var calendarEl = document.getElementById("calendar");
            var calendar = new FullCalendar.Calendar(calendarEl, {
                headerToolbar: {
                    left: "prevYear,prev,next,nextYear today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                },
                initialDate: new Date(),
                navLinks: true,
                editable: false,
                dayMaxEvents: true,
                events: $scope.events,
                displayEventTime: false
            });
            calendar.render();
        }
            
        // If chart view is active
        if ($location.path() == '/chart'){
            // Initialize datapoints array to store chart data
            $scope.datapoints = [];
            // Loop through each weather data item
            $scope.datas.forEach(item => {
                // Create datapoints for chart including date, min temperature, max temperature, and weather type
                $scope.datapoints.push(
                    {
                        label: item.date, 
                        y: [item.min, item.max], 
                        name: item.type 
                    }
                );
            });

            // Render chart using CanvasJS library
            var chart = new CanvasJS.Chart("chart", {
                title:{
                    text: "Weather Forecast"
                },
                axisX: {},
                axisY: {
                    suffix: " °C",
                    maximum: 40,
                    gridThickness: 0
                },
                toolTip:{
                    shared: true, // Tooltip content is shared for all points
                    content: "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C" // Custom tooltip content
                },
                data: [{
                    type: "rangeSplineArea",
                    fillOpacity: 0.1, // Opacity for the filled area under the line
                    color: "#91AAB1",
                    indexLabelFormatter: formatter, // Formatter function for index labels
                    dataPoints: $scope.datapoints // Data points for the chart
                }],
                animationEnabled: true,
                exportEnabled: true, // Enable export feature for the chart
            });
            chart.render();
            // Add images to the chart
            addImages(chart);
        }
    });

    // Initialize data object for form submission
    $scope.data = {
        date: new Date(),
        min: 0,
        max: 0
    }

    // Function to handle form submission
    $scope.submit = function(){
        if ($scope.data.type == null){
            alert('Please fill out all the fields!');
        } else {
            if ($scope.data.min > $scope.data.max){
                alert('Minimum temperature cannot be higher than maximum temperature!');
            } else {
                // Check if data for selected date already exists
                axios.get($rootScope.serverUrl + '/db/weatherdatas/date/eq/'+moment($scope.data.date).format('YYYY-MM-DD')).then(res =>{
                    if(res.data.length > 0){
                        alert('Weather data already exists for this date!');
                    } else {
                        // If data does not exist, submit the form data
                        $scope.data.date = moment($scope.data.date).format('YYYY-MM-DD');
                        axios.post($rootScope.serverUrl + '/db/weatherdatas', $scope.data).then(res=>{
                            if(res.data.affectedRows == 1){
                                alert('Data recorded successfully!');
                            } else {
                                alert('Error occurred while saving data!');
                            }
                            // Reset form data after submission
                            $scope.data = {
                                date: new Date(),
                                min: 0,
                                max: 0,
                                type: null
                            }
                        });
                    }
                });
            }
        }
    }

    // Array to store images for chart
    var images = [];    

    // Function to add images to the chart based on weather type
    function addImages(chart) {
        // Loop through datapoints to add images
        for(var i = 0; i < chart.data[0].dataPoints.length; i++){
            var dpsName = chart.data[0].dataPoints[i].name;
            if(dpsName == "cloudy"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
            } else if(dpsName == "rainy"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
            } else if(dpsName == "sunny"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
            }
            // Position images on the chart
            images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
            positionImage(images[i], i);
        }
    }

    // Function to position the images on the chart
    function positionImage(image, index) {
        var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
        var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
    
        image.width("40px")
        .css({ "left": imageCenter - 20 + "px",
        "position": "absolute","top":imageTop + "px",
        "position": "absolute"});
    }

    // Resize event handler to adjust image position on chart resize
    $( window ).resize(function() {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
        var imageCenter = 0;
        for(var i=0;i<chart.data[0].dataPoints.length;i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            if(chart.data[0].dataPoints[i].name == "cloudy") {					
                $(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter});
            } else if(chart.data[0].dataPoints[i].name == "rainy") {
                $(".rainy").eq(rainyCounter++).css({ "left": imageCenter});  
            } else if(chart.data[0].dataPoints[i].name == "sunny") {
                $(".sunny").eq(sunnyCounter++).css({ "left": imageCenter});  
            }
        }
    });

    // Formatter function for tooltip text
    function formatter(e) { 
        if(e.index === 0 && e.dataPoint.x === 0) {
            return " Min " + e.dataPoint.y[e.index] + "°";
        } else if(e.index == 1 && e.dataPoint.x === 0) {
            return " Max " + e.dataPoint.y[e.index] + "°";
        } else{
            return e.dataPoint.y[e.index] + "°";
        }
    } 
}); 