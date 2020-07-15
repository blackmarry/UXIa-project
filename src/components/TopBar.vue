<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-container>
            <b-navbar-brand href="#" class="mr-3">What's for lunch?</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <div class="text-light my-2">
                    {{ currentDate }}
                </div>

                <b-navbar-nav class="ml-auto">
                    <LocationSearch></LocationSearch>
                    <b-avatar id="user-avatar" button size="2rem" variant="light" v-b-toggle.userProfile></b-avatar>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script>
    import {weekday} from "@/backend/Constants";
    import LocationSearch from "./LocationSearch";

    export default {
        name: "TopBar",
        components: {LocationSearch},
        data() {
            return {
                currentDate: null
            }
        },
        created() {
            const today = new Date();
            this.currentDate = weekday[today.getDay() - 1] + ', ' + today.getDate() + '.' + today.getMonth() + '. ' + today.getFullYear();
        }
    }
</script>

<style scoped>

</style>