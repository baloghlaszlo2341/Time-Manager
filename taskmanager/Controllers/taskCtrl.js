// Definiáljuk az taskvezérlőt szükséges függőségekkel
app.controller('taskCtrl', function($scope, $rootScope, $location){

    // Szerezzük be az task adatait a szerverről
    axios.get($rootScope.serverUrl + '/db/tasks').then(res=>{
        // Tároljuk a szerezett adatokat a scope-ban és frissítsük
        $scope.datas = res.data;
        $scope.$apply();

        // Ha a naptár nézet aktív
        if ($location.path() == '/calendar'){
            // Hozz létre események tömböt a naptárhoz
            $scope.events = [];

            // Építsd fel az események tömböt a szerezett adatokból
            $scope.datas.forEach(item => {
                $scope.color = randomColor();
                $scope.events.push(
                    {
                        title: 'Feladat megnevezése: ' + item.name,
                        start: item.date,
                        end: item.duedate,
                        backgroundColor: $scope.color,
                        borderColor: $scope.color,
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

     
    });

    axios.get($rootScope.serverUrl + '/db/users').then(res=>{
        $scope.users = res.data;
        $scope.$apply();
    });

    axios.get($rootScope.serverUrl + '/db/statistics').then(res=>{
        $scope.statistics = res.data;
        $scope.$apply();   
        
           // Ha a diagram nézet aktív
           if ($location.path() == '/chart'){
            // Hozz létre adatpontok tömböt a diagramhoz
            $scope.datapoints = [];

            // Építsd fel az adatpontok tömbjét a szerezett adatokból
            $scope.statistics.forEach(item => {
                $scope.datapoints.push(
                    {
                        label: item.user, 
                        y: item.db,  //a határidő kezdete és vége van
                        color: randomColor(),
                    }
                );
            });

            // Inicializáld a CanvasJS diagramot a diagram nézethez
            var chart = new CanvasJS.Chart("chart", {            
                title:{
                    text: "Teendők száma"              
                },
                axisX: {},
                axisY: {
                    suffix: " db",
                    gridThickness: 0
                },
                toolTip:{
                    shared: true,
                    content: "Felhasználó neve: {label} </br> Feladatok száma: {y}" 
                },
                data: [{
                    type: "column",
                    fillOpacity: 0.1,
                  
                    dataPoints: $scope.datapoints
                }],
                animationEnabled: true,
                exportEnabled: true,
            });
            chart.render();

         
          
        }
    })

    // Adat objektum a new időjárás adatok beküldéséhez
    $scope.data = {
        date: new Date(),
        name: '',
        duedate: null,
        type: null,
        description: "" //feladatleírás
    }

    // Beküldés függvény az új időjárás adatok hozzáadásához
    $scope.submit = function(){
        if ($scope.data.type == null){
            alert('Nincs minden adat megadva!');
        } else {
            if ($scope.data.date > $scope.data.duedate){
                alert('A munka nem kezdődhet akkor amikor már befejeződött!');
            } else {
                $scope.data.date = moment($scope.data.date).format('YYYY-MM-DD');
                $scope.data.duedate = moment($scope.data.duedate).format('YYYY-MM-DD');
                console.log($scope.data);
                axios.post($rootScope.serverUrl + '/db/tasks', $scope.data).then(res=>{
                    if(res.data.affectedRows == 1){
                        alert('Adatok sikeresen rögzítve!');
                    } else {
                        alert('Hiba történt az adatok rögzítése közben!');
                    }

                    $scope.data = {
                        date: new Date(),
                        name: '',
                        duedate: null,
                        type: null,
                        description: "" //feladatleírás
                    }
                });
            }
        }
    }

    function randomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    // Kezeld az ablak átméretezését az képek pozícióinak megfelelően történő frissítéséhez
    $( window ).resize(function() {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
        var imageCenter = 0;
        for(var i=0;i<chart.data[0].dataPoints.length;i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            if(chart.data[0].dataPoints[i].name == "Főnök//Felhős") {					
                $(".Főnök//felhős").eq(cloudyCounter++).css({ "left": imageCenter});
            } else if(chart.data[0].dataPoints[i].name == "alkalmazott//Esős") {
                $("alkalmazott//Esős").eq(rainyCounter++).css({ "left": imageCenter});  
            } else if(chart.data[0].dataPoints[i].name == "Menedzser//Napos") {
                $("Menedzser//Napos").eq(sunnyCounter++).css({ "left": imageCenter});  
            }                
        }
    });

 

});