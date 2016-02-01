(function(){
angular.module('myApp.map', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider.when('/map', {
            controller: 'MapCtrl as vm',
            templateUrl: 'map/map.html'
        });
    })
    .controller('MapCtrl', function (MapFactory, $scope) {
        var ctrl = this;
        var currentlyPlaying = null;
        var currentlyCity = null;

        this.minDistanceBoolean = false;
        this.markers = [];
        this.closestCity = null;
        this.distance = 0;
        this.cities = MapFactory.getCities();

// handel Modal About
        this.showModal = false;
        this.toggleModal = function(){
            console.log('here');
            ctrl.showModal = !ctrl.showModal;
        };

        function init(){
            var mapOptions = {
                zoom: 9,
                center: new google.maps.LatLng(31.394989, 35.031700),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };
            var boxMap = new google.maps.Map(document.getElementById('map'), mapOptions);

            for (var i = 1; i <= ctrl.cities.length; i++) {
                var latLng = ctrl.cities[i - 1].latLng;

                var marker = new MarkerWithLabel({
                    position: latLng,
                    id: i,
                    title: ctrl.cities[i - 1].name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 0
                    },
                    map: boxMap,
                    draggable: false,
                    raiseOnDrag: false,
                    labelContent: '',
                    labelAnchor: new google.maps.Point(10, 10),
                    labelClass: 'pin pin'+i

                });
                ctrl.markers.push(marker);
            }

            ctrl.markers.forEach(function (marker, i) {
                google.maps.event.addListener(marker, "click", function () {
                    playAudio(MapFactory.getCityById(i+1));
                });
            });
        }

        function playAudio(city) {
            var audio = city.songUrl;
            console.log('audio: ', audio);
            var elm = document.querySelector('.pin' + city.id);

            if (audio.paused) {
                if (currentlyPlaying) {
                    currentlyPlaying.pause();
                    document.querySelector('.pin' + currentlyCity.id).style.backgroundColor = "#89849b";  //default pin color
                }
                console.log('elm play: ', elm);
                audio.play();
                currentlyPlaying = audio;
                currentlyCity = city;
                elm.style.backgroundColor = "#F15252";  // playing pin color
            }  else {
                currentlyPlaying = null;
                audio.pause();
                elm.style.backgroundColor = "#89849b";  //default pin color

            }
        }

         this.playNearCityAudio = function () {
            playAudio(ctrl.closestCity);
             ctrl.closestCity = !ctrl.closestCity;
        };


         function findNearest() {

            var minDistance = Number.MAX_VALUE;
////****************production version --- remove from comments when testing is done*****************
            window.navigator.geolocation.watchPosition(positionUpdate);


            function positionUpdate(pos) {
                ctrl.closestCity = null;
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;
                ctrl.cities.forEach(function (city) {

                    if (distance(city.latLng.lng, city.latLng.lat, lon, lat) < minDistance) {
                        minDistance = distance(city.latLng.lng, city.latLng.lat, lon, lat);
                        ctrl.closestCity = city;
                        ctrl.distance = minDistance;
                    }
                });
                if (minDistance < 20) {
                    ctrl.minDistanceBoolean = true;
                    $scope.$apply();
                }

            }

////*****************Test Environment*****************************
//            function movingTest() {
//                var index = 0;
//                var testData = [{lat: 31.274594, lon: 34.779791}, {lat: 31.855389, lon: 36.376344}];
//                var test = setInterval(function () {
//                    ctrl.closestCity = null;
//                    //var lat = 31.855389;
//                    //var lon = 36.376344;
//                    //var lat = 31.274401;
//                    //var lon = 34.779823;
//                    var lat = testData[index].lat;
//                    var lon = testData[index].lon;
//                    ctrl.cities.forEach(function (city) {
//
//                        if (distance(city.latLng.lng, city.latLng.lat, lon, lat) < minDistance) {
//                            minDistance = distance(city.latLng.lng, city.latLng.lat, lon, lat);
//                            ctrl.closestCity = city;
//                            ctrl.distance = minDistance;
//                        }
//                    });
//                    if (minDistance < 20) {
//                        ctrl.minDistanceBoolean = true;
//                        $scope.$apply();
//                    }
//                    index++;
//                }, 5000);
//                if (index >= testData.length)clearInterval(test);
//            }
//
//            movingTest();
////**************************End if test Env**********************


            function distance(lon1, lat1, lon2, lat2) {
                var R = 6371; // Radius of the earth in km
                var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
                var dLon = (lon2 - lon1).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            }

            /** Converts numeric degrees to radians */
            if (typeof(Number.prototype.toRad) === "undefined") {
                Number.prototype.toRad = function () {
                    return this * Math.PI / 180;
                }
            }

        }

        init();
        //findNearest();

    });
})();
