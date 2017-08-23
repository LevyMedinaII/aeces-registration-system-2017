var register =  angular.module('Regsystem', []);

register.controller('regController', ['$scope', '$http', '$location', '$window', '$timeout',function($scope, $http, $location, $window, $timeout){
  //initialize applicant object
  $scope.applicant = {}
    $http.get('http://10.100.67.131:5000/scheduler/schedules', {headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'}})
     .then(function(schedules){
       //console.log(typeof(schedules));
       // console.log("Success");
       $scope.schedules = schedules.data;
       return schedules;
     })
     .catch(function(err){
       // console.log(err);
       // console.log("Failure")
       return err;
     })

     var getData = function(applicant){
       console.log(applicant)
     }
     $scope.interviewDates = {
     "selectedOption": [{"dateVal" : "null", "dateText" : "Please choose an interview date"}],
     "availableOptions":
     [
       {"dateVal" : "08-29-2017", "dateText" : "August 29 (Tuesday)"},
       {"dateVal" : "08-30-2017", "dateText" : "August 30 (Wednesday)"},
       {"dateVal" : "08-31-2017", "dateText" : "August 31 (Thursday)"},
       {"dateVal" : "09-01-2017", "dateText" : "September 01 (Friday)"}
     ]
    }

    $scope.pickSched = {
      selected: false
    }
    $scope.applicant.is_paid= true
    $scope.applicant.is_emailed= false
    $scope.chooseDate = function(){
      if (!document.getElementById('new_member').dirty){
      $scope.applicant.is_new_member = false
      }
      //$scope.applicant.id_pic_link = "null",
      $scope.scheduler = !$scope.scheduler
      alert("Each timeslot can accomodate up to 6 people. Each taken slot is represented by a colored box")
      $window.scrollTo(0,0)
    }
    var prevIndex = 200
    $scope.applyToDate = function(index){
      if (prevIndex == index || prevIndex == 200) {
      $scope.interview_time = []
        if(!$scope.pickSched.selected){
          $scope.interview_time.push(angular.element(document.getElementsByName('interview_timeslot')[index]).val());
          $scope.pickSched.selected = true;
          angular.element(document.getElementsByClassName('timeslot2')[index]).addClass('clicked')
          $scope.interview_date = $scope.interviewDates.selectedOption.dateVal
          $scope.applicant.interview_sched = $scope.interview_date+ " "+ $scope.interview_time
          prevIndex = index
        }
        else {
          angular.element(document.getElementsByClassName('timeslot2')[index]).removeClass('clicked')
          $scope.pickSched.selected = false;
          $scope.interview_time.pop();
          prevIndex = 200
        }
      }
    else {
      alert("You can only choose one schedule")
    }
  }
  $scope.applyMember = function(){
    $http.post('http://10.100.67.131:5000/users/', $scope.applicant, {headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'}})
    .then (function(response){
      console.log(response.data)
      console.log(response.status)
        $http.put('http://10.100.67.131:5000/scheduler/', applicant_scheduled, {headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'}})
        .then (function(response){
          if(response.status == 200){
            if(response.data == 'The selected timeslot is full'){
              alert(response.data);
            }
            else if (response.data == 'User already has a schedule. Please delete his schedule first'){
              alert(response.data);
            }
            else{
              alert('Your application has been succesfully submitted. Thank you '+ $scope.applicant.first_name+' for applying to AECES!')
              $timeout(function() { $scope.displayErrorMsg = false;}, 2000);
              $window.location.reload();
              $window.scrollTo(0,0);
              $http.get('http://10.100.67.131:5000/exporter/csv/')
              .then(function(response){
                return response.data
              }, function(err){
                return err.data
                });
              }
            }
          return response
        },function(err){
            alert(err)
            return err
          });
      return response
    }, function (err){
      alert(err)
      return err
    })
    var applicant_scheduled  = {
      "applicant_id_number" : $scope.applicant.id_number,
      "date" : $scope.interviewDates.selectedOption.dateVal,
      "timeslot": $scope.interview_time
    }
  }
}]);
