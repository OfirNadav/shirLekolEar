(function () {
    'use strict';
    var module = angular.module('myApp.map');
    module.factory('MapFactory', function () {

        var cities = [
            {
                id: 1,
                name: 'בית שאן',
                latLng: {lat: 32.517996, lng: 35.496409},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/bet-shean.mp3')
                }]
            },
            {
                id: 2,
                name: 'ירושלים',
                latLng: {lat: 31.787770, lng: 35.210959},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/jerusalemCut.mp3')
                }]
            },
            {
                id: 3,
                name: 'חיפה',
                latLng: {lat: 32.826208, lng: 34.979194},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/Haifa.mp3')
                }]
            },
            {
                id: 4,
                name: 'באר שבע',
                latLng: {lat: 31.288780, lng: 34.790113},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/beer-sheva-cut.mp3')
                }]

            },
            {
                id: 5,
                name: 'תל אביב',
                latLng: {lat: 32.093689, lng: 34.782142},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/tlvCut.mp3')
                }]
            },
            {
                id: 6,
                name: 'כפר סבא',
                latLng: {lat: 32.188355, lng: 34.904188},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/kefar-saba.mp3')
                }]
            },
            {
                id: 7,
                name: 'אילת',
                latLng: {lat: 29.633019, lng: 34.924200},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/eilat.mp3')
                }]
            },
            {
                id: 8,
                name: 'רחובות',
                latLng: {lat: 31.907303, lng: 34.811231},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/rehovot-sheli_sharona.mp3')
                }]
            },
            {
                id: 9,
                name: 'רמת גן',
                latLng: {lat: 32.075543, lng: 34.821947},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/ramatGan-dublin.mp3')
                }]
            },
            {
                id: 10,
                name: 'גדרה',
                latLng: {lat: 31.816847, lng: 34.778689},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/gedera.mp3')
                }]
            },
            {
                id: 11,
                name: 'פתח תקווה',
                latLng: {lat: 32.090960, lng: 34.887522},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/petakh_tikva.mp3')
                }]
            },
            {
                id: 12,
                name: 'חולון',
                latLng: {lat: 32.020543, lng: 34.786928},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/holon-amir_lev.mp3')
                }]
            },
            {
                id: 13,
                name: 'בת ים',
                latLng: {lat: 32.018215, lng: 34.746760},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/batYam-punth.mp3')
                }]
            },
            {
                id: 14,
                name: 'ראשון לציון',
                latLng: {lat: 31.980073, lng: 34.789675},
                songs: [{
                    artist: '',
                    title:'',
                    songUrl: new Audio('lib/songs/rishon_letziyon.mp3')
                }]
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
            },
            degrees2Radians: function (){
                /** Converts numeric degrees to radians */
                if (typeof(Number.prototype.toRad) === "undefined") {
                    Number.prototype.toRad = function () {
                        return this * Math.PI / 180;
                    }
                }
            },
            distance: function (origin, dest) {
                var R = 6371; // Radius of the earth in km
                var dLat = (dest.lat - origin.lat).toRad();  // Javascript functions in radians
                var dLng = (dest.lng - origin.lng).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(origin.lat.toRad()) * Math.cos(dest.lat.toRad()) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c; // Distance in km
            }
        }
    });
})();