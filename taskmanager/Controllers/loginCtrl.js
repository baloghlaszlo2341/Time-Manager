app.controller('loginCtrl', function($scope, $rootScope, $routeParams, $location, ngNotify){
    
    $scope.user = {};

    // belépés
    $scope.login = function(){
        // ha nem adott meg minden adtot
        if ($scope.user.email == null || $scope.user.passwd == null){
            alert('Nem adtad meg a bejelentkezési adtokat!');
        }else{
            // létrehozzuk a user objektumot, lekódolt jelszóval
            let data = {
                email: $scope.user.email,
                passwd: CryptoJS.SHA1($scope.user.passwd).toString()
            }
            // elküldjük a szervenek a belépési adatokat ellenőrzésre
            axios.post($rootScope.serverUrl + '/db/logincheck', data).then(res=>{
                // ha helyesek a belépési adatok, akkor kapunk a szervertől egy ACCESS_TOKEN-t
                if (res.data.token != ''){
                    // a tokent letároljuk a sessionStorage-ban
                    sessionStorage.setItem('access_token', JSON.stringify(res.data.token));
                    
                    // hozzáadjuk az axios-hoz, hogy innentől minden lekérdezéssel küldje el a szerver számára a kapott token-t
                    token = JSON.parse(sessionStorage.getItem('access_token'));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // belépünk és átirányítjuk az adatfelvétel nézetre
                    $rootScope.loggedIn = true;
                    $location.path('/newdata');
                    $scope.$apply();
                }else{
                    // ha nem jó adatokat ad meg
                    alert('Hibás belépési adatok!');
                }

            });
        }

    }

    // kijelentkezés
    $scope.logout = function(){
        // töröljük a sessionStorage-ből és az axios-ból a tokent-t, majd átirányítjuk a login nézetre
        sessionStorage.removeItem('access_token');
        axios.defaults.headers.common['Authorization'] = ``;
        $rootScope.loggedIn = false;
        $location.path('/login');
    }

    // felhasználó regisztráció
    $scope.register = function(){
       // ha nem adott meg minden szükséges adatot 
        if ($scope.user.name == null || $scope.user.email == null || $scope.user.pass1 == null || $scope.user.pass2 == null){
           // alert('Nem adtál meg minden adatot!');
           ngNotify.set('Nem adtál meg minden adatot!', 'error');
        }else{
            // ha a megadott jelszavak nem egyeznek
            if ($scope.user.pass1 != $scope.user.pass2){
                //alert('A megadott jelszavak nem egyeznek!');
                ngNotify.set('A megadott jelszavak nem egyeznek!', 'error');
            }
            else{
                // létrehozzuk az új user objektumot, titkosított jelszóval
                let data = {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    passwd: CryptoJS.SHA1($scope.user.pass1).toString(),
                    rights: "felhasználó",
                    secret: 's2dfsd3fg6sfgfd' //TODO: random generate
                }
                //TODO: jelszó erősség vizsgálat (regExp)
                // elküldjük a szervernek
                axios.post($rootScope.serverUrl + `/db/users`, data).then(res =>{
                    // ha nincs még ilyen, akkor beszúrta a users táblába
                    if (res.data.affectedRows){
                        //alert('A regisztráció sikeres!');
                        ngNotify.set('A regisztráció sikeres!', 'success');
                        //TODO: kiürítés
                        $scope.user = {
                            name: '',
                            email: '',
                            pass1: '',
                            pass2: ''
                        };

                    }
                    else{
                        // van már ilyen email cím a users táblában
                        //alert('Ez az e-mail cím már regisztrálva van!');
                        ngNotify.set('Ez az e-mail cím már regisztrálva van!', 'error');
                    }
                });
            }
        }
    
    }

    // elfelejtett jelszó visszaállító email link küldés
    $scope.sendMail = function(){
        if ($scope.usermail == null){
            alert('Add meg a regisztrált e-mail címed!');
        }else{
            if (!$scope.usermail.match($rootScope.emailRegExp)){
                alert('Nem megfelelő e-mail cím formátum!');
            }else{
                data = {
                    email: $scope.usermail
                }
                axios.post($rootScope.serverUrl + '/db/emailcheck', data).then(res=>{
                    if (res.data == []){
                        alert('Nem regisztrált e-mail cím!');
                    }else{
                        link = $rootScope.appUrl + '#!/restorepass/'+$scope.usermail+'/'+res.data;
                        let message = `<body>
                        <h1>Elfelejtett jelszó visszaállítása</h1>
                        <p>Valaki az Ön e-mail címére jelszó visszaállítási kérelmet küldött. Amennyiben nem Ön volt, ezt az e-mailt tekintse tárgytalannak.</p>
                        <p>Ha Ön szeretné visszaállítani az elfelejtett jelszavát, azt az alábbi egyszer használható linken keresztül teheti meg:</p>
                        <p>
                            <h6><a href="${link}" target="_blank">${link}</a></h6>
                        </p>
                        <h3>${$rootScope.appTitle}</h3>
                        </body>`;
        
                        let data = {
                            to: $scope.usermail,
                            subject: 'Elfelejtett jelszó - TimemanagerApp',
                            message: message
                        }
        
                        axios.post($rootScope.serverUrl + '/email/send', data).then(res=>{
                            alert(res.data);
                            $scope.usermail = null;
                        });
                    }
                })



               
            }
        }
    }

    $scope.restorepass = function(){
// http://127.0.0.1:5500/index.html#!/restorepass/walkowiczszasa@turr.hu/s2dfsd3fg6sfgfd
        
        if ($scope.userpass1 == null || $scope.userpass2 == null){
            alert('Nem adtad meg a jelszavakat!');
        }
        else{
            if ($scope.userpass1 != $scope.userpass2){
                alert('A megadott jelszavak nem egyeznek!');
            }
            else{
                if (!$scope.userpass1.match($rootScope.passwdRegExp)){
                    alert('Nem megfelelő erősségű jelszó!');
                }else{
                    let data = {
                        email: $routeParams.email,
                        passwd: CryptoJS.SHA1($scope.userpass1).toString(),
                        secret: $routeParams.secret
                    }
                    axios.post($rootScope.serverUrl + '/db/restorepass', data).then(res =>{
                           
                            
                    });
                  
            }
        }
    }
    }
     //TODO: befejezni a jogosultságkezelést
    $scope.isAdmin = function(){
        axios.get($rootScope.serverUrl + '/db/permissioncheck').then(res => {
            console.log(res.data)
            return res.data;
        });
    }
    
});
    
