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
        var currCity = null;

        this.isInRange = false;
        this.markers = [];
        this.closestCity = null;
        this.distance = 0;
        this.cities = MapFactory.getCities();
        this.markerMyLocation = null;
        this.map = null;

        // handel Modal About
        this.showModal = false;
        this.toggleModal = function(){
            ctrl.showModal = !ctrl.showModal;
        };

        function init(){
            var CENTER = {lat: 31.394989, lng: 35.031700};  // center of Israel

            var mapOptions = {
                zoom: 9,
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
                        ctrl.closestCity = MapFactory.getCityById(i+1);
                        if (currCity) playAudio(currCity);
                        else ctrl.isInRange = true;


                    });
                });
            });
        }

        function playAudio(city) {
            if (ctrl.isInRange) return;
            var COLOR_DEFAULT = "#89849b";
            var audio = city.songUrl;
            var elm = document.querySelector('.pin' + city.id);

            if (currCity) {
                currCity.audio.pause();
                currCity.audio.currentTime = 0;
                document.querySelector('.pin' + currCity.id).style.backgroundColor = COLOR_DEFAULT;  //default pin color
                currCity = null;
                return;
            }
            audio.play();
            currCity = city;
            currCity.audio = audio;
            elm.style.backgroundColor = "#F15252";  // playing pin color
        }

        function findNearest() {
            window.navigator.geolocation.watchPosition(positionUpdate);
             //movingTest(); // Test positionUpdate
             MapFactory.degrees2Radians();
        }

        function positionUpdate(pos) {
            var MIN_KM = 20;
            var minCity = null;
            var minDistance = Number.MAX_VALUE;
            ctrl.closestCity = null;
            ctrl.distance = 0;

            var loc = {lat: pos.coords.latitude, lng: pos.coords.longitude};

            updateMyMarker(loc);

            ctrl.cities.forEach(function (city) {
                var DistInKm = MapFactory.distance(city.latLng.lng, city.latLng.lat, loc.lng, loc.lat);
                if (DistInKm < minDistance) {
                    minDistance = DistInKm;
                    minCity = city;
                }
            });

            $scope.$apply(function () {
                if (minDistance < MIN_KM) {
                    ctrl.closestCity = minCity;
                    ctrl.distance = minDistance;
                    ctrl.isInRange = true;
                } else {
                    ctrl.isInRange = false;
                }
            });
        }

        function updateMyMarker(loc){

            if (ctrl.markerMyLocation) {
                ctrl.markerMyLocation.setPosition(new google.maps.LatLng(loc.lat, loc.lng));
                ctrl.map.panTo(new google.maps.LatLng(loc.lat, loc.lng));
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


        this.playNearCityAudio = function () {
            ctrl.isInRange = false;
            playAudio(ctrl.closestCity);
        };
        init();
        $timeout(findNearest, 2000);
    });
})();
