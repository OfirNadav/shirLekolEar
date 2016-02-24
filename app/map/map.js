(function(){
angular.module('myApp.map', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider.when('/map', {
            controller: 'MapCtrl as vm',
            templateUrl: 'map/map.html'
        });
    })
    .controller('MapCtrl', function (MapFactory, $scope, $timeout) {
        var ctrl = this;

        this.isDiffCityPressed = true;
        this.currCity = null;
        this.isInRange = false;
        this.markers = [];
        this.closestCity = null;
        this.distance = 0;
        this.cities = MapFactory.getCities();
        this.markerMyLocation = null;
        this.map = null;
        this.currLoc = null;
        this.prevClosestCity = null;

        // handel Modal About
        this.showModal = false;
        this.toggleModal = function(){
            ctrl.showModal = !ctrl.showModal;
        };
        //console.log('this.cities: ', this.cities);
        mapSetup();

        function mapSetup() {
            initMap();
            $timeout(findNearest, 2000);
        }

        function initMap(){
            var CENTER = {lat: 31.394989, lng: 35.031700};  // center of Israel

            var mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(CENTER.lat, CENTER.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };
            ctrl.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            // Create Markers for Cities
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
                    map: ctrl.map,
                    draggable: false,
                    raiseOnDrag: false,
                    labelContent: '',
                    labelAnchor: new google.maps.Point(10, 10),
                    labelClass: 'pin pin'+i

                });
                ctrl.markers.push(marker);
            }

            ctrl.markers.forEach(function (marker, i) {
                google.maps.event.addListener(marker, 'click', function () {
                    $scope.$apply(function () {
                        markerClicked(MapFactory.getCityById(i+1));
                    });
                });
            });
        }
        function markerClicked(cityClicked){
            if (ctrl.currCity) {
                ctrl.isDiffCityPressed =  (ctrl.currCity !== cityClicked);
                playAudio(cityClicked);
                if (!ctrl.isDiffCityPressed) {
                    ctrl.isInRange = true;
                }
            }
            else {
                ctrl.isInRange = true;
            }
            ctrl.closestCity = cityClicked;
            ctrl.distance = MapFactory.distance(cityClicked.latLng, ctrl.currLoc);
        }

        function playAudio(city) {
            if (ctrl.isInRange) return;
            var COLOR_DEFAULT = "#89849b";
            var audio = city.songs[0].songUrl;
            var elm = document.querySelector('.pin' + city.id);

            if (ctrl.currCity) {
                ctrl.currCity.audio.pause();
                ctrl.currCity.audio.currentTime = 0;
                document.querySelector('.pin' + ctrl.currCity.id).style.backgroundColor = COLOR_DEFAULT;  //default pin color
                ctrl.isDiffCityPressed =  (ctrl.currCity === city);
                ctrl.currCity = null;
                return;
            }
            audio.play();
            ctrl.currCity = city;
            ctrl.currCity.audio = audio;
            elm.style.backgroundColor = "#F15252";  // playing pin color
        }

        var geo_options = {
            enableHighAccuracy: true,
            maximumAge        : 300000,
            timeout           : 27000
        };

        function findNearest() {
            window.navigator.geolocation.watchPosition(positionUpdate, geo_error, geo_options);
             //movingTest(); // Test positionUpdate
             MapFactory.degrees2Radians();
        }
        function geo_error() {
            console.log("Sorry, no position available.");
        }

        function positionUpdate(pos) {
            var MIN_KM = 5;
            var minCity = null;
            var minDistance = Number.MAX_VALUE;
            ctrl.closestCity = null;
            ctrl.distance = 0;

            ctrl.currLoc = {lat: pos.coords.latitude, lng: pos.coords.longitude};

            updateMyMarker(ctrl.currLoc);

            ctrl.cities.forEach(function (city) {
                var DistInKm = MapFactory.distance(city.latLng, ctrl.currLoc);
                if (DistInKm < minDistance) {
                    minDistance = DistInKm;
                    minCity = city;
                }
            });

            $scope.$apply(function () {
                if (minDistance < MIN_KM){
                    ctrl.closestCity = minCity;
                    ctrl.distance = minDistance;
                    ctrl.isInRange =  (ctrl.prevClosestCity !== ctrl.closestCity);
                }
            });
        }

        this.handleClose = function(){
            ctrl.isInRange = false;
            ctrl.prevClosestCity = ctrl.closestCity;
        };

        function updateMyMarker(loc){

            if (ctrl.markerMyLocation) {
                ctrl.markerMyLocation.setPosition(new google.maps.LatLng(loc.lat, loc.lng));
                ctrl.map.panTo(new google.maps.LatLng(loc.lat, loc.lng));
                ctrl.map.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
            } else {
                ctrl.markerMyLocation = new MarkerWithLabel({
                    position: loc,
                    id: 'me',
                    title: 'Me',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 0
                    },
                    map: ctrl.map,
                    draggable: false,
                    raiseOnDrag: false,
                    labelContent: '',
                    labelAnchor: new google.maps.Point(10, 10),
                    labelClass: 'me'

                });
                ctrl.map.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
            }
        }

        // Test positionUpdate
        function movingTest() {
            var index = 0;

            // TLV: 32.066158, lng: 34.777819
            // EILAT: lat: 29.557669, lng: 34.951925
            // HAIFA: lat: 32.794044, lng: 34.989571

            var testData = [{latitude: 29.557669, longitude: 34.951925},
                {latitude: 32.794044, longitude: 34.989571},
                {latitude: 31.768319, longitude: 35.21371}
            ];

            var pos = {};

            var test = setInterval(function () {
                console.log('Interval ' + index);
                pos.coords = testData[index];
                positionUpdate(pos);
                index++;
                if (index > testData.length-1) clearInterval(test);
            }, 5000);

        }

        this.toggleFullScreen = function () {
            if (!document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        };

        this.playNearCityAudio = function () {
            ctrl.isInRange = false;
            playAudio(ctrl.closestCity);
        };
    });
})();
