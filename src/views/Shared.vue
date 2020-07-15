<template>
    <div>
        <PageNavigation></PageNavigation>
        <div class="text-center text-secondary mt-5 mb-3 h3">
            <div v-if="shareLink.isValid()">
                <b class="text-dark">{{ shareLink.getUsername() }}</b> has shared with you
                <span v-if="restaurants.length === 1">this restaurant</span>
                <span v-else>these restaurants</span>
            </div>
            <div v-else>
                Invalid share link!
            </div>
        </div>
        <RestaurantList v-if="shareLink.isValid()"
                        v-bind:can-share="false"
                        v-bind:restaurant-list="restaurants"
                        v-bind:loading-restaurants="loadingRestaurants"
                        v-bind:loading-restaurants-msg="'Loading shared restaurants'"
                        v-bind:no-restaurant-msg="'Failed to load shared restaurants!'">
        </RestaurantList>
    </div>
</template>

<script>
    import ShareLink from "@/backend/ShareLink";
    import RestaurantList from "@/components/RestaurantList";
    import PageNavigation from "@/components/PageNavigation";

    export default {
        name: "Shared",
        components: {
            PageNavigation,
            RestaurantList
        },

        data () {
            return {
                shareLink: new ShareLink(this.$route.query),
                loadingRestaurants: false,
                restaurants: []
            }
        },

        created() {
            this.loadingRestaurants = true;

            let inst = this;
            // get current location
            this.$googleService.getCurrentLocation(function () {
                // load shared restaurants
                if (inst.shareLink.isValid()) {
                    inst.$googleService.getRestaurantsByID(inst.shareLink.getRestaurants(), results => {
                        inst.restaurants = results;
                        inst.loadingRestaurants = false;
                    });
                }
            }, true);
        }
    }
</script>

<style scoped>

</style>