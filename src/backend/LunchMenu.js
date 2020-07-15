/**
 * Class representing a meal.
 * */
export class Meal {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}


/**
 * Class representing a lunch menu of a restaurant.
 * */
export class LunchMenu {
    constructor(soup = null, meals = null) {
        this.soup = soup;
        this.meals = meals;
        if (this.meals === null) {
            this.meals = [];
        }
    }

    setSoup(soup) {
        this.soup = soup;
    }

    addMeal(meal) {
        this.meals.push(meal);
    }
}