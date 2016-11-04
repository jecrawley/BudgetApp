angular.module('starter.services', [])

.factory('login', function() {

    function set (username) {

        sessionStorage.setItem("username", username);
    };

    function getUsername () {

        return sessionStorage.getItem("username");
    };

    return {
        set: set,
        getUsername: getUsername,
    }
});
