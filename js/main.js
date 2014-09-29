
// FINDER.COM ENTITY
var app = angular.module('app',[]);

app.controller('myController',['$scope', '$http', function($scope,$http){

  $scope.map=null;
  $scope.marker=null;
  $scope.currentPosition=null;

  $scope.url = 'https://api.foursquare.com/v2/venues/explore'

 $scope.getLocation = function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          $scope.showPosition(position)

      });
    } 
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  $scope.showPosition = function(position) {
      $scope.loadMap(position.coords);
     $scope.currentPosition = position.coords;
    }

  $scope.loadMap = function(coordinates) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();  
    // FINDER.COM map properties
    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(coordinates.latitude,coordinates.longitude),
      mapTypeId:google.maps.MapTypeId.HYBRID,
      panControl:true,
      zoomControl:true,
      mapTypeControl:true,
      scaleControl:true,
      streetViewControl:true,
      overviewMapControl:true,
      rotateControl:true,
    };
    // FINDER.COM creating and displaying map on the page
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // FINDER.COM putting marker to indicant the current position and its properties
    $scope.marker = new google.maps.Marker({ 
      position: mapOptions.center, 
      animation: google.maps.Animation.BOUNCE
    });
    $scope.marker.setMap($scope.map);
    // Zoom to 15 when clicking on marker
    google.maps.event.addListener($scope.marker,'click',function() {
      $scope.map.setZoom(15);
      $scope.map.setCenter($scope.marker.getPosition());
    });
    google.maps.event.addListener($scope.map,'center_changed',function() {
      window.setTimeout(function() {
        $scope.map.panTo($scope.marker.getPosition());
      },40000);
    })

  }
  

  $scope.initializeSearch = function(){

    var address = (document.getElementById('enterBox'));
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
            return;
      }
     $scope.enterBox = place.formatted_address;
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    });
  }
  $scope.initializeSearch()

  $scope.fetchSearch = function(){
    
    geocoder = new google.maps.Geocoder();
    
    var address = $scope.enterBox;
   
    geocoder.geocode( { 'address': address}, function(results) {
        console.log(results)
        // if (status == google.maps.GeocoderStatus.OK) {
        var newLat = results[0].geometry.location.lat();
        var newLng = results[0].geometry.location.lng();    
        var mapOptions = {
          zoom: 5,
          center: new google.maps.LatLng(newLat,newLng),
        }
        $scope.marker = new google.maps.Marker({ position: mapOptions.center, animation: google.maps.Animation.BOUNCE});
        $scope.marker.setMap($scope.map);
        $scope.map.setCenter($scope.marker.getPosition())
        var la = (results[0].geometry.location.lat());
        var lg = (results[0].geometry.location.lng());
        var LaLg = (la+", "+lg);
        // console.log(lat);
        // console.log(lng);
        // var queryme = $(this).parents().attr('id');
         var url = 'https://api.foursquare.com/v2/venues/explore'
         var config = {

            params:{

          client_secret: "QWVA0TKCGU404SQEZGSUMBYWC5FB523KQPRTQWG2K3AXF00H",
          client_id: "CTQUBJ0VCHZS5O405Z0G5SCRCWVECGGJ3QKLTRVSRUG2RI0E",
          ll:"",
          radius:"50000",
          v: "20140707",
          query:"",
          callback:'JSON_CALLBACK'

              }
          }
          config.params.ll=LaLg;
          config.params.query=$scope.searchfor;
          $http.jsonp($scope.url, config).success(function(reply){
                console.log(reply.response.groups[0].items)
                $scope.datas=reply.response.groups[0].items;
          })
         
      // } 
      // else {
      //   alert("Geocode was not successful for the following reason: " + status);
      // }
    });
  //   google.maps.event.addDomListener(window, 'load', $scope.enterBox);
  }

  $scope.fetchRecent = function(obj){
    
    var lat = ($scope.currentPosition.latitude);
    var lng = ($scope.currentPosition.longitude);
    var LatLng = (lat+", "+lng);
    var config = {

            params:{

          client_secret: "QWVA0TKCGU404SQEZGSUMBYWC5FB523KQPRTQWG2K3AXF00H",
          client_id: "CTQUBJ0VCHZS5O405Z0G5SCRCWVECGGJ3QKLTRVSRUG2RI0E",
          ll:LatLng,
          radius:"5000",
          v: "20140707",
          query:"",
          callback:'JSON_CALLBACK'

              }
          }
    config.params.query=obj;
    $http.jsonp($scope.url, config).success(function(reply){
                console.log(reply.response.groups[0].items)
                $scope.datas=reply.response.groups[0].items;
          }) 
  }


}])
