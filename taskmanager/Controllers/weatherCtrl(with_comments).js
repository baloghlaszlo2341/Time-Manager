// Definiáljuk az időjárásvezérlőt szükséges függőségekkel
app.controller('weatherCtrl', function($scope, $rootScope, $location){

    // Szerezzük be az időjárás adatait a szerverről
    axios.get($rootScope.serverUrl + '/db/weatherdatas').then(res=>{
        // Tároljuk a szerezett adatokat a scope-ban és frissítsük
        $scope.datas = res.data;
        $scope.$apply();

        // Ha a naptár nézet aktív
        if ($location.path() == '/calendar'){
            // Hozz létre események tömböt a naptárhoz
            $scope.events = [];

            // Építsd fel az események tömböt a szerezett adatokból
            $scope.datas.forEach(item => {
                $scope.events.push(
                    {
                        title: 'munka kezdete//Min: ' + item.min + ' C°',
                        start: item.date,
                        allDay: false,
                        backgroundColor: '#42a29d',
                        borderColor: '#42a29d',
                    }
                );
                $scope.events.push(
                    {
                        title: 'munka vége//Max: ' + item.max + ' C°',
                        start: item.date,
                        allDay: false,
                        backgroundColor: '#d04b45',
                        borderColor: '#d04b45',
                    }
                );
                $scope.events.push(
                    {
                        title: 'munkatárs beosztása//Type: ' + item.type,
                        start: item.date,
                        allDay: false,
                        backgroundColor: '#594293',
                        borderColor: '#594293',
                    }
                );
            });

            // Inicializáld a FullCalendar-t a naptár nézethez
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

        // Ha a diagram nézet aktív
        if ($location.path() == '/chart'){
            // Hozz létre adatpontok tömböt a diagramhoz
            $scope.datapoints = [];

            // Építsd fel az adatpontok tömbjét a szerezett adatokból
            $scope.datas.forEach(item => {
                $scope.datapoints.push(
                    {
                        label: item.date, 
                        y: [item.min, item.max], 
                        name: item.type 
                    }
                );
            });

            // Inicializáld a CanvasJS diagramot a diagram nézethez
            var chart = new CanvasJS.Chart("chart", {            
                title:{
                    text: "Időjárási Előrejelzés"              
                },
                axisX: {},
                axisY: {
                    suffix: " °C",
                    maximum: 40,
                    gridThickness: 0
                },
                toolTip:{
                    shared: true,
                    content: "{name} </br> <strong>Hőmérséklet: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
                },
                data: [{
                    type: "rangeSplineArea",
                    fillOpacity: 0.1,
                    color: "#91AAB1",
                    indexLabelFormatter: formatter,
                    dataPoints: $scope.datapoints
                }],
                animationEnabled: true,
                exportEnabled: true,
            });
            chart.render();

            // Adj hozzá képeket a diagramhoz különböző időjárási körülmények
            addImages(chart);
        }
    });

    // Adat objektum a new időjárás adatok beküldéséhez
    $scope.data = {
        date: new Date(),
        min: 0,
        max: 0
    }

    // Beküldés függvény az új időjárás adatok hozzáadásához
    $scope.submit = function(){
        if ($scope.data.type == null){
            alert('Nem minden adat megadva!');
        } else {
            if ($scope.data.min > $scope.data.max){
                alert('A munka nem kezdődhet akkor amikor már befejeződött //A minimális hőmérséklet nem lehet magasabb a maximális hőmérsékletnél!');
            } else {
                axios.get($rootScope.serverUrl + '/db/weatherdatas/date/eq/'+moment($scope.data.date).format('YYYY-MM-DD')).then(res =>{
                    if(res.data.length > 0){
                        alert('Az adat már létezik ehhez a dátumhoz!');
                    } else {
                        $scope.data.date = moment($scope.data.date).format('YYYY-MM-DD');
                        axios.post($rootScope.serverUrl + '/db/weatherdatas', $scope.data).then(res=>{
                            if(res.data.affectedRows == 1){
                                alert('Adatok sikeresen rögzítve!');
                            } else {
                                alert('Hiba történt az adatok rögzítése közben!');
                            }

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

    // Tömb az időjárási körülmények képek tárolásához
    var images = [];    

    // Függvény a képek hozzáadására a diagramhoz időjárási körülmények szerint
    function addImages(chart) {
        for(var i = 0; i < chart.data[0].dataPoints.length; i++){
            var dpsName = chart.data[0].dataPoints[i].name;
            if(dpsName == "felhős"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
            } else if(dpsName == "esős"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
            } else if(dpsName == "napos"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
            }

            images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
            positionImage(images[i], i);
        }
    }

    // Függvény a képek pozícionálására a diagramon
    function positionImage(image, index) {
        var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
        var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

        image.width("40px")
        .css({ "left": imageCenter - 20 + "px",
        "position": "absolute","top":imageTop + "px",
        "position": "absolute"});
    }

    // Kezeld az ablak átméretezését az képek pozícióinak megfelelően történő frissítéséhez
    $( window ).resize(function() {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
        var imageCenter = 0;
        for(var i=0;i<chart.data[0].dataPoints.length;i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            if(chart.data[0].dataPoints[i].name == "Főnök//felhős") {					
                $(".felhős").eq(cloudyCounter++).css({ "left": imageCenter});
            } else if(chart.data[0].dataPoints[i].name == "alkalmazott //esős") {
                $(".esős").eq(rainyCounter++).css({ "left": imageCenter});  
            } else if(chart.data[0].dataPoints[i].name == "Menedzser //napos") {
                $(".napos").eq(sunnyCounter++).css({ "left": imageCenter});  
            }                
        }
    });

    // Formázó függvény a tooltip tartalomhoz
    function formatter(e) { 
        if(e.index === 0 && e.dataPoint.x === 0) {
            return " Min " + e.dataPoint.y[e.index] + "°";
        } else if(e.index == 1 && e.dataPoint.x === 0) {
            return " Max " + e.dataPoint.y[e.index] + "°";
        } else {
            return e.dataPoint.y[e.index] + "°";
        }
    } 

});