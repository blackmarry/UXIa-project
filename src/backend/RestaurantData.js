import { googleMaps } from '@/backend/Constants'
import { LunchMenu, Meal } from "@/backend/LunchMenu";

/**
 * Restaurant class containing information about itself.
 * */
export class RestaurantData {
    constructor(object, location) {
        // constructing from JSON
        if (arguments.length === 1) {
            Object.assign(this, object);
        // constructing from google result
        } else {
            this.name = object.name;
            this.place_id = object.place_id;
            this.location = object.geometry.location;
            this.rating = object.rating;
            this.totalRatings = object.user_ratings_total;
            this.distance = location !== null ? this.getDistanceFrom(location) : 0;

            // properties not contained in google result
            this.loadingDetails = false;
            this.detailsLoaded  = false;
            this.address        = object.formatted_address;
            this.phoneNumber    = object.international_phone_number;
            this.website        = object.website;
            this.mapURL         = object.url;

            // lunch menu
            this.lunchMenu = null;

            // meta-data
            this.favorite = false;
            this.selected = false;
        }
    }

    loadMenu() {
        this.lunchMenu = new LunchMenu();
        // TODO ...
        if (Math.random() > 0.9) {
            this.lunchMenu.setSoup('Kulajda');
            this.lunchMenu.addMeal(new Meal('Smažený sýr eidam, vařené brambory s máslem, domáci ...', 105));
            this.lunchMenu.addMeal(new Meal('Vepřové výpečky, dušené zelí, domáci houskové knedlíky', 105));
            this.lunchMenu.addMeal(new Meal('Noky s kuřecím masem, listovým špenátem a jemnou ...', 115));
            this.lunchMenu.addMeal(new Meal('Caesar salát - kuřecí maso, ančovičkový dresink, ledový ...', 120));
        } else if (Math.random() > 0.7) {
            this.lunchMenu.setSoup('dle nabídky');
            this.lunchMenu.addMeal(new Meal('Sýrové duo, vařený brambor, tatarka', 89));
            this.lunchMenu.addMeal(new Meal('Kuřecí steak, houbový přeliv, grilovaná zelenina, hranolky', 89));
            this.lunchMenu.addMeal(new Meal('Marinovaná krkovička, hranolky', 99));
        } else if (Math.random() > 0.6) {
            this.lunchMenu.setSoup('Hrachová s uzeným masem');
            this.lunchMenu.addMeal(new Meal('Grilovaná panenka na žampionech, bramborové zlaťáky', 119));
            this.lunchMenu.addMeal(new Meal('Moravský vrabec, dušené zelí, bramborové knedlíky', 109));
            this.lunchMenu.addMeal(new Meal('Holandský řízek, bramborová kaše, steril. okurek', 109));
            this.lunchMenu.addMeal(new Meal('Kuřecí kung-pao, dušená rýže', 99));
            this.lunchMenu.addMeal(new Meal('Smažený sýr, hranolky, tat. omáčka', 89));
        } else if (Math.random() > 0.4) {
            this.lunchMenu.setSoup('Frankfurtská A1');
            this.lunchMenu.addMeal(new Meal('Chilli con Carne, bramboráčky A1, 3', 95));
            this.lunchMenu.addMeal(new Meal('Pečené koleno, hořčice, křen, pečivo A1, 3, 7, 10', 95));
            this.lunchMenu.addMeal(new Meal('Smažené sýrové trio, vařené brambory, tatarka A1, 3, 10', 105));
        } else if (Math.random() > 0.2) {
            this.lunchMenu.setSoup('Masový vývar s kořenovou zeleninou a nudlemi');
            this.lunchMenu.addMeal(new Meal('Čočka na kyselo s opečenou klobásou, chleba, okurek', 99));
            this.lunchMenu.addMeal(new Meal('Smažená kuřecí kapsa se šunkou a sýrem, bramborová kaše', 109));
        }
    }

    getDistanceFrom(location) {
        if (!location) {
            return null;
        }
        return Math.floor(googleMaps.geometry.spherical.computeDistanceBetween(this.location, location));
    }

    updateDistance(location) {
        this.distance = this.getDistanceFrom(location);
    }
}