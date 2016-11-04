angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, login) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // // Form data for the login modal
  //
  //
  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  //
  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };
  //
  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };
  //
  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //     console.log('Doing login', $scope.loginData);
  //     $scope.closeLogin();
  // };


})

.controller ('LoginCtrl', function ($scope, $http, $state, login) {

    $scope.loginData = {id: 0};

    $scope.authenticateUser = function () {

        $http ({
            method: 'POST',
            url: 'http://localhost:8080/authenticate',
            data: $scope.loginData
        })
        .then (function (response) {
            if (response.data.message === 'Success!') {
                login.set($scope.loginData.username);
                $scope.loginData.username = '';
                $scope.loginData.password = '';
                $state.go('app.budgets');
            } else {
                $scope.error = 'Username or Password is incorrect.'
            }
            console.log(response.data);
        })

    };

    $scope.createUser = function() {

        var budget = {
            id: 0,
            username: $scope.loginData.username,
            housing: 100,
            housingBudgetSpent: 0,
            electricity: 100,
            electricityBudgetSpent: 0,
            water: 100,
            waterBudgetSpent: 0,
            phone: 100,
            phoneBudgetSpent: 0,
            heating: 100,
            heatingBudgetSpent: 0,
            groceries: 100,
            groceriesBudgetSpent: 0,
            restaurants: 100,
            restaurantsBudgetSpent: 0,
            clothing: 100,
            clothingBudgetSpent: 0,
            beauty: 100,
            beautyBudgetSpent: 0,
            automobile: 100,
            automobileBudgetSpent: 0,
            entertainment: 100,
            entertainmentBudgetSpent: 0
        }

        $http ({
            method: 'POST',
            url: 'http://localhost:8080/createuser',
            data: $scope.loginData
        })
        .then (function (response) {
            if (response.data.message === 'Success!') {
                login.set($scope.loginData.username);
                $http ({
                    method: 'POST',
                    url: 'http://localhost:8080/createbudget',
                    data: budget
                })
                .then (function (response) {
                    console.log(response.data);
                })
                $scope.loginData.username = '';
                $scope.loginData.password = '';
                $state.go('app.budgets');
            } else {
                $scope.error = 'Username is already taken.'
            }
            console.log(response.data);
        })

    };
})

.controller('BudgetsCtrl', function($scope, $http, login) {

    $scope.loggedIn = login.getUsername();

  $scope.budgets = [
    { title: 'Housing', id: 'housing' },
    { title: 'Electricity', id: 'electricity' },
    { title: 'Water', id: 'water' },
    { title: 'Phone', id: 'phone'},
    { title: 'Heating', id: 'heating' },
    { title: 'Groceries', id: 'groceries' },
    { title: 'Restaurants', id: 'restaurants' },
    { title: 'Clothing', id: 'clothing' },
    { title: 'Beauty', id: 'beauty' },
    { title: 'Atomobile', id: 'automobile' },
    { title: 'Entertainment', id: 'entertainment' }
  ];

  console.log(login.getUsername());

  $http({
    method: 'GET',
    url:'http://localhost:8080/budgets/' + login.getUsername()
  })
  .then( function (response){
      login.set
      $scope.value = response.data;
  })
})

.controller('BudgetCtrl', function($scope, $stateParams, $http, $state, login) {
  $scope.id = $stateParams.budgetId;

  $scope.updateBudget = function (id) {

    var type = id.toLowerCase();
    var newBudget = document.getElementById('newBudget');

    var payment = {
      id: login.getUsername(),
      amount: newBudget.value
    }

    $http({
      method: 'PUT',
      url:'http://localhost:8080/update' + type + 'budget',
      data: payment
    })
    .then( function (response){
      newBudget.value = "";
        console.log(response.data);
        $state.go('app.budgets');
    })
  }
})

.controller('PaymentsCtrl', function($scope, $stateParams, $http, $ionicPopup, login) {

  $scope.bills = [
    "Phone",
    "Housing",
    "Electricity",
    "Heating",
    "Water",
    "Automobile"
  ];

  $scope.purchases = [
    "Groceries",
    "Restaurants",
    "Clothing",
    "Beauty",
    "Entertainment"
  ];

  $scope.id = $stateParams.budgetId;

  var overspentBudgetPopup = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Overspent Budget',
      templateUrl: 'templates/popup.html'
    });
  }

  $scope.submitPayment = function (purchaseForm, purchaseType) {

    var amount;
    var purchase = document.getElementById(purchaseForm);
    var type = document.getElementById(purchaseType).value.toLowerCase();

    if (purchase.value !== undefined) {
      amount = purchase.value;
    } else {
      amount = 0;
    }

    var payment = {
      "username": login.getUsername(),
      "amount": amount
    }

    $http ({
      method: 'PUT',
      url: 'http://localhost:8080/make' +  type + 'payment',
      data: payment
    })
    .then ( function (response) {
      if (response.data[0] < response.data[1]) {
        overspentBudgetPopup();
      }
      purchase.value = "";
    })
  };
});
