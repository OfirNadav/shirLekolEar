(function () {
    'use strict';
    var module = angular.module('myApp.map');
    module.factory('MapFactory', function () {

        var cities = [

            {
                id: 1,
                name: 'בית שאן',
                latLng: {lat: 32.497103, lng: 35.497336},
                songUrl: new Audio('lib/songs/bet-shean.mp3'),
                audioOn: false

            },
            {
                id: 2,
                name: 'ירושלים',
                latLng: {lat: 31.768319, lng: 35.21371},
                songUrl: new Audio('lib/songs/jerusalemCut.mp3')

            },
            {
                id: 3,
                name: 'חיפה',
                latLng: {lat: 32.794044, lng: 34.989571},
                songUrl: new Audio('lib/songs/Haifa.mp3')

            },
            {
                id: 4,
                name: 'באר שבע',
                latLng: {lat: 31.252973, lng: 34.791462},
                songUrl: new Audio('lib/songs/beer-sheva-cut.mp3')

            }
            ,
            {
                id: 5,
                name: 'תל אביב',
                latLng: {lat: 32.066158, lng: 34.777819},
                songUrl: new Audio('lib/songs/tlvCut.mp3')

            }             ,
            {
                id: 6,
                name: 'כפר סבא',
                latLng: {lat: 32.178195, lng: 34.90761},
                songUrl: new Audio('lib/songs/kefar-saba.mp3'),
                audioOn: false

            }
             ,
            {
                id: 7,
                name: 'אילת',
                latLng: {lat: 29.557669, lng: 34.951925},
                songUrl: new Audio('lib/songs/eilat.mp3'),
                audioOn: false

            }
        ];

        return {
            getCities: function () {
                return cities;

            },
            getCityById: function (cityId) {
                var cityMatch = cities.filter(function (city) {
                    return city.id == cityId;
                });
                return cityMatch[0];
            }

        }

    });

})();