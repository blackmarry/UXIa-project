<template>
    <div>
        <PageNavigation></PageNavigation>
        <RestaurantList v-bind:restaurant-list="restaurants"
                        v-bind:loading-restaurants="false"
                        v-bind:no-restaurant-msg="'No favorite restaurants.'">
        </RestaurantList>
        <b-row class="text-center">
            <b-col>
                <b-button size="sm"
                          variant="danger"
                          class="shadow"
                          v-b-modal="this.$removeFavoritesModalID"
                          v-if="restaurants.length">
                    <b-icon icon="trash" class="mr-1"></b-icon>
                    <span>Remove all favorites</span>
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import PageNavigation from "@/components/PageNavigation";
    import RestaurantList from "@/components/RestaurantList";

    export default {
        name: "Favorites",
        components: {
            PageNavigation,
            RestaurantList
        },
        computed: {
            restaurants() {
                return this.$googleService.favorites;
            }
        }
    }
</script>

<style scoped>

</style>