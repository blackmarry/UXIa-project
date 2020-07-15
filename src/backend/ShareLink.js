/**
 * Search link used to search restaurants with other people.
 * */
export default class ShareLink {
    // share link param keys
    usernameKey = 'username';
    restaurantsKey = 'restaurants';
    defaultUsername = 'unknown user';

    constructor(params = null) {
        this.url = new URL('/shared', 'http://localhost');
        this.url.port = '8080';
        this.params = params;
        if (this.params === null) {
            this.params = {};
            this.params[this.usernameKey] = this.defaultUsername;
            this.params[this.restaurantsKey] = [];
        }
    }

    isValid() {
        return Object.prototype.hasOwnProperty.call(this.params, this.restaurantsKey) && this.getRestaurants().length;
    }

    setUsername(username) {
        if (username) {
            this.params[this.usernameKey] = username;
        }
    }

    getUsername() {
        if(this.params[this.usernameKey]) {
            return this.params[this.usernameKey];
        } else {
            return this.defaultUsername;
        }
    }

    setRestaurants(restaurants) {
        this.params[this.restaurantsKey] = restaurants;
    }

    getRestaurants() {
        if(this.params[this.restaurantsKey] !== undefined) {
            if (Array.isArray(this.params[this.restaurantsKey])) {
                return this.params[this.restaurantsKey];
            } else {
                return this.params[this.restaurantsKey] === '' ? [] : this.params[this.restaurantsKey].split(',');
            }
        } else {
            return [];
        }
    }

    addRestaurant(restaurantID) {
        if (Array.isArray(this.params[this.restaurantsKey])) {
            this.params[this.restaurantsKey].push(restaurantID);
        } else {
            console.warn('Warning: invalid ShareLink parameter');
        }
    }

    toString() {
        this.url.search = new URLSearchParams(this.params).toString();
        return this.url.toString();
    }
}