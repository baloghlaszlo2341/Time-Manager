// Define the login controller with necessary dependencies
app.controller('loginCtrl', function($scope, $rootScope, $routeParams, $location, ngNotify){
    
    $scope.user = {};

    // Function to handle user login
    $scope.login = function(){
        // Check if email and password are provided
        if ($scope.user.email == null || $scope.user.passwd == null){
            alert('Nem adtad meg a bejelentkezési adtokat!');
        }else{
            // Encrypt password and send login data to the server for verification
            let data = {
                email: $scope.user.email,
                passwd: CryptoJS.SHA1($scope.user.passwd).toString()
            }
            axios.post($rootScope.serverUrl + '/db/logincheck', data).then(res=>{
                // If login is successful, store the ACCESS_TOKEN and set axios headers
                if (res.data.token != ''){
                    // Store token in sessionStorage
                    sessionStorage.setItem('access_token', JSON.stringify(res.data.token));
                    token = JSON.parse(sessionStorage.getItem('access_token'));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Update logged in status and redirect to data entry view
                    $rootScope.loggedIn = true;
                    $location.path('/newdata');
                    $scope.$apply();
                }else{
                    // Show error message for incorrect login data
                    alert('Hibás belépési adatok!');
                }

            });
        }

    }

    // Function to handle user logout
    $scope.logout = function(){
        // Remove token from sessionStorage and axios headers and redirect to login view
        sessionStorage.removeItem('access_token');
        axios.defaults.headers.common['Authorization'] = ``;
        $rootScope.loggedIn = false;
        $location.path('/login');
    }

    // Function to register a new user
    $scope.register = function(){
        // Check if all required user data is provided
        if ($scope.user.name == null || $scope.user.email == null || $scope.user.pass1 == null || $scope.user.pass2 == null){
            ngNotify.set('Nem adtál meg minden adatot!', 'error');
        }else{
            // Validate password match
            if ($scope.user.pass1 != $scope.user.pass2){
                ngNotify.set('A megadott jelszavak nem egyeznek!', 'error');
            }
            else{
                // Create new user object with encrypted password and send data to the server
                let data = {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    passwd: CryptoJS.SHA1($scope.user.pass1).toString(),
                    rights: "felhasználó",
                    secret: 's2dfsd3fg6sfgfd' //TODO: random generate
                }
                axios.post($rootScope.serverUrl + `/db/users`, data).then(res =>{
                    // Handle registration success or failure
                    if (res.data.affectedRows){
                        ngNotify.set('A regisztráció sikeres!', 'success');
                        // Clear form after successful registration
                        $scope.user = {
                            name: '',
                            email: '',
                            pass1: '',
                            pass2: ''
                        };
                    }
                    else{
                        ngNotify.set('Ez az e-mail cím már regisztrálva van!', 'error');
                    }
                });
            }
        }
    
    }

    // Function to send password reset email link
    $scope.sendMail = function(){
        // Validate user email and send reset link if email exists
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
                        // Create and send password reset email
                        // Then notify user
                    }
                });
            }
        }
    }

    // Function to restore password based on reset link
    $scope.restorepass = function(){
        // Restore password based on link parameters and validate strength
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
                    // Handle password restoration
                }
            }
        }
    }

    // Function to check admin rights (TODO: complete authorization handling)
    $scope.isAdmin = function(){
        // Check if the user has admin rights
        axios.get($rootScope.serverUrl + '/db/permissioncheck').then(res => {
            console.log(res.data)
            return res.data;
        });
    }
    
});