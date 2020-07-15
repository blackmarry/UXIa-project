<template>
    <div class="align-items-center text-center">
        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
            <b-button id="current-location-btn" class="mb-2 mr-3 shadow" variant="light" size="sm" v-on:click="setToCurrentLocation" :disabled="gs.currentLocationLoading">
                <b-spinner small variant="light" label="Loading" v-if="gs.currentLocationLoading"></b-spinner>
                <span v-else>
                <b-icon icon="geo-alt" id="current-location-icon"></b-icon>
                Current location
            </span>
            </b-button>
            <b-input-group size="sm" id="location-input-group" class="shadow mr-3">
                <b-input-group-prepend is-text>
                    <b-icon icon="search"></b-icon>
                </b-input-group-prepend>
                <b-form-input :id="inputID" size="sm" placeholder="Enter a location" v-model="gs.address"></b-form-input>
            </b-input-group>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LocationSearch",
        data () {
            return {
                inputID: 'location-input',
                gs: this.$googleService
            }
        },
        methods: {
            setToCurrentLocation: function () {
                this.gs.setToCurrentLocation();
            }
        },
        mounted() {
            // initialize autocomplete
            this.gs.initAutocomplete(this.inputID);
        }
    }
</script>

<style scoped>
    #location-input-group {
        width: 360px;
        height: 31px;
    }
    #current-location-btn {
        width: 142px;
    }
    #current-location-icon {
        width: 12px;
    }
</style>