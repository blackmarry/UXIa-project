<template>
    <b-nav tabs>
        <b-nav-item :active="isRestaurantsPage" to="/restaurants">
            Restaurants
        </b-nav-item>
        <b-nav-item :active="isFavoritePage" to="/favorites">
            Favorites
        </b-nav-item>
        <b-nav-item :active="isSharedPage" to="/favorites" v-if="isSharedPage">
            Shared with you
        </b-nav-item>
    </b-nav>
</template>

<script>
    export default {
        name: "PageNavigation",
        computed: {
            isFavoritePage () {
                return this.$router.currentRoute.path === '/favorites';
            },
            isRestaurantsPage () {
                return this.$router.currentRoute.path === '/restaurants';
            },
            isSharedPage () {
                return this.$router.currentRoute.path === '/shared';
            }
        },

        created() {
        }
    }
</script>

<style scoped>

</style>