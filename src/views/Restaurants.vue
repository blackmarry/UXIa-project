<template>
    <div>
        <PageNavigation></PageNavigation>
        <div class="mt-2 d-flex flex-row justify-content-center">
    </div>
        <RestaurantList v-bind:restaurant-list="restaurants"
                        v-bind:loading-restaurants="loadingRestaurants"
                        v-bind:loading-restaurants-msg="'Searching for nearby restaurants'"
                        v-bind:no-restaurant-msg="'No restaurants nearby. Try another location or increase the search radius in your user profile.'">
        </RestaurantList>
    </div>
</template>

<script>
    import PageNavigation from "@/components/PageNavigation";
    import RestaurantList from "@/components/RestaurantList";

    export default {
        name: "Restaurants",
        components: {
            PageNavigation,
            RestaurantList
        },
        data () {
            return {
            }
        },
        computed: {
            restaurants() {
                return this.$googleService.restaurants;
            },
            loadingRestaurants() {
                return this.$googleService.loadingRestaurants;
            }
        }
    }
</script>

<style scoped>

</style>