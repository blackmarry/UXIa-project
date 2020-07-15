import { favoritesKey, googleMaps, googlePlaces, radiusKey } from "@/backend/Constants";
import { RestaurantData } from "@/backend/RestaurantData";

/**
 * GoogleService class providing methods for usage of Google API.
 * */
export default class GoogleService {

    placeDetailFields = [
        'formatted_address',
        'international_phone_number',
        'url',
        'website'
    ];

    placeAllFields = this.placeDetailFields.concat([
        'name',
        'place_id',
        'geometry.location',
        'rating',
        'user_ratings_total'
    ]);

    constructor() {
        this.placeService = null;

        this.favorites = [];
        this.restaurants = [];
        this.loadingRestaurants = false;
        this.currentLocationLoading = false;

        // location components
        this.radius = this.loadRadiusFromStorage();
        this.latlng = null;
        this.address = null;
        this.currentLocation = null;
    }

    initPlaceService(elementID) {
        if (this.placeService === null) {
            this.placeService = new googlePlaces.PlacesService(document.getElementById(elementID));
        }
    }

    initAutocomplete(elementID) {
        // initialize input field
        let input = document.getElementById(elementID);
        // store the original event binding function
        const _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;
        // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected, and then trigger the original listener.
        function addEventListenerWrapper(type, listener) {
            if (type === 'keydown') {
                const originalListener = listener;
                listener = function (event) {
                    // 'enter' pressed and no suggestion selected -> simulate a down-arrow key event
                    if (event.which === 13 && document.getElementsByClassName('pac-item-selected').length === 0) {
                        const downArrowEvent = window.$.Event('keydown', {
                            keyCode: 40,
                            which: 40
                        });
                        originalListener.apply(input, [ downArrowEvent ]);
                    }
                    originalListener.apply(input, [event]);
                };
            }
            // add the modified listener
            _addEventListener.apply(input, [type, listener]);
        }
        if (input.addEventListener) {
            input.addEventListener = addEventListenerWrapper;
        } else if (input.attachEvent) {
            input.attachEvent = addEventListenerWrapper;
        }

        // initialize autocomplete
        let inst = this;
        let autocomplete = new googlePlaces.Autocomplete(input);
        autocomplete.setFields(['geometry', 'name']);
        autocomplete.addListener('place_changed', function() {
            let place = autocomplete.getPlace();
            if (place.geometry) {
                inst.setLocation(place.geometry.location);
            } else {
                // TODO: better error notification
                window.alert('No details available for input: "' + place.name + '".\nPlease select a place from the suggested places.');
            }
        });

        // initialize location
        if (this.latlng === null) {
            if (!this.loadLocationFromCookies()) {
                this.setToCurrentLocation();
            }
        }
    }

    loadRadiusFromStorage() {
        let radius = localStorage.getItem(radiusKey);
        // default: 750 m
        if (radius === null) {
            radius = 750;
        }
        return Number(radius);
    }

    setRadius(meters) {
        this.radius = Number(meters);
        localStorage.setItem(radiusKey, String(meters));
        this.getNearbyRestaurants();
    }

    loadRestaurantDataFromStorage(key) {
        let data = JSON.parse(localStorage.getItem(key));
        if (data === null) {
            return [];
        }
        return data.map(x => new RestaurantData(x));
    }

    addToFavorites(restaurant) {
        restaurant.favorite = true;
        if (this.favorites.filter(x => x.place_id === restaurant.place_id).length) {
            console.warn('Warning: "' + restaurant.name + '" is already in favorites');
        } else {
            this.favorites.push(restaurant);
            localStorage.setItem(favoritesKey, JSON.stringify(this.favorites));
        }
    }

    removeFromFavorites(restaurant) {
        restaurant.favorite = false;
        let newFavorites = this.favorites.filter(x => x.place_id !== restaurant.place_id);
        if (this.favorites.length === newFavorites.length) {
            console.warn('Warning: "' + restaurant.name + '" is not in favorites');
        } else {
            this.favorites = newFavorites;
            localStorage.setItem(favoritesKey, JSON.stringify(this.favorites));
        }
    }

    removeAllFavorites() {
        this.restaurants.forEach(x => x.favorite = false);
        this.favorites.forEach(x => x.favorite = false);
        this.favorites = [];
        localStorage.setItem(favoritesKey, JSON.stringify(this.favorites));
    }

    loadFavorites() {
        this.favorites = this.loadRestaurantDataFromStorage(favoritesKey);
        this.favorites.forEach(
            x => x.loadMenu()
        );
    }

    setLocation(latlng, address = null) {
        // new value
        if (!latlng.equals(this.latlng)) {
            if (address !== null) {
                this.address = address;
            }
            this.latlng = latlng;
            this.storeLocationCookie();
            // load nearby restaurants
            this.getNearbyRestaurants();
        }
    }

    loadLocationFromCookies() {
        const cookie = document.getCookie('location');
        if (cookie !== undefined) {
            const parts = cookie.split('&');
            if (parts.length === 3) {
                this.setLocation(new googleMaps.LatLng(parts[0], parts[1]), parts[2]);
                return true;
            }
        }
        return false;
    }

    storeLocationCookie() {
        const value = this.latlng === null ? '' : [this.latlng.lat(), this.latlng.lng(), this.address].join('&');
        document.setCookie('location', value);
    }

    setDefaultLocation() {
        // Faculty of Information Technology, Brno University of Technology
        this.setLocation(new googleMaps.LatLng(49.226588, 16.596220), 'Božetěchova 1, 612 00 Brno-Královo Pole, Czechia');
    }

    setToCurrentLocation() {
        let inst = this;
        this.getCurrentLocation(function () {
            const request = {
                'location': inst.currentLocation
            };
            const geocoder = new googleMaps.Geocoder;
            geocoder.geocode(request,
                (results, status) => {
                    if (status === googlePlaces.PlacesServiceStatus.OK && results[0]) {
                        inst.setLocation(results[0].geometry.location, results[0].formatted_address);
                    } else {
                        inst.setDefaultLocation();
                    }
                    inst.currentLocationLoading = false;
                });
        });
    }

    getCurrentLocation(resultCallback = null, cancelLoading = false) {
        // already got the current location
        if (this.currentLocation !== null) {
            if (resultCallback !== null) {
                resultCallback();
            }
            return;
        }

        let inst = this;
        this.currentLocationLoading = true;
        navigator.geolocation.getCurrentPosition(
            position => {
                this.currentLocation = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
                inst.currentLocationLoading = false;
                if (resultCallback !== null) {
                    resultCallback();
                    if (cancelLoading) {
                        inst.currentLocationLoading = false;
                    }
                } else {
                    inst.currentLocationLoading = false;
                }
            },
            error => {
                console.error("Error: failed to get the current location! Error code: " + error.code);
                this.currentLocation = new googleMaps.LatLng(49.226588, 16.596220);
                if (resultCallback !== null) {
                    resultCallback();
                    if (cancelLoading) {
                        inst.currentLocationLoading = false;
                    }
                } else {
                    inst.currentLocationLoading = false;
                }
            }
        );
    }

    getRestaurantsByID(restaurants, resultCallback) {
        if (this.placeService === null) {
            console.error('Place Service is not initialized. Call "initPlaceService(elementID)" first.');
            resultCallback([]);
            return;
        }
        if (Array.isArray(restaurants)) {
            let results = [];
            restaurants.forEach(
                id => {
                    if (id !== '') {
                        let instance = this;
                        this.placeService.getDetails({
                            placeId: id,
                            fields: this.placeAllFields
                        }, function (place, status) {
                            if (status === googlePlaces.PlacesServiceStatus.OK) {
                                let data = new RestaurantData(place, instance.currentLocation);
                                // check if the restaurant is in favorites
                                if (instance.favorites.find(x => x.place_id === data.place_id) !== undefined) {
                                    data.favorite = true;
                                }
                                results.push(data);
                            }
                            resultCallback(results);
                        });
                    }
                }
            );
        } else {
            console.warn('Warning: getRestaurantsByID() accepts only the array of IDs.');
        }
    }

    getNearbyRestaurants() {
        if (this.placeService === null) {
            console.error('Place Service is not initialized. Call "initPlaceService(elementID)" first.');
            return;
        }
        this.loadingRestaurants = true;
        // clear restaurant list
        this.restaurants = [];
        let request = {
            location: this.latlng,
            radius: this.radius,
            type: ['restaurant']
        };
        let instance = this;
        this.placeService.nearbySearch(request,
            (results, status) => {
                if (status === googlePlaces.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {
                        let restaurant = new RestaurantData(results[i], instance.currentLocation);
                        // check if the restaurant is in favorites
                        if (instance.favorites.find(x => x.place_id === restaurant.place_id) !== undefined) {
                            restaurant.favorite = true;
                        }
                        restaurant.loadMenu();
                        this.loadRestaurantDetails(restaurant);  // TODO: load after the user clicks info button
                        instance.restaurants.push(restaurant);
                    }
                } else {
                    console.warn('No nearby restaurants has been found.');
                }
                instance.loadingRestaurants = false;
            });
    }

    loadRestaurantDetails(restaurant) {
        const request = {
            placeId: restaurant.place_id,
            fields: this.placeDetailFields
        };
        restaurant.loadingDetails = true;
        this.placeService.getDetails(request, function(place, status) {
            if (status === googlePlaces.PlacesServiceStatus.OK) {
                restaurant.address     = place.formatted_address;
                restaurant.phoneNumber = place.international_phone_number;
                restaurant.website     = place.website;
                restaurant.mapURL      = place.url;
            }
            restaurant.loadingDetails = false;
        });
    }
}