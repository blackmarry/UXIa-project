<template>
    <b-modal :id="modalID">
        <template v-slot:modal-title>
            <div class="d-flex flex-row">
                <span class="h3 font-weight-bold">{{ data.name }}</span>
            </div>
        </template>
            <div>
                <b-row v-if="data.rating" class="mb-2">
                    <b-col cols="4" class="font-weight-bold text-right">
                        Rating:
                    </b-col>
                    <b-col class="d-flex flex-row">
                        <span class="mr-2">{{ data.rating }}</span>
                        <Rating v-bind:rating="data.rating" v-bind:total-ratings="data.totalRatings" v-bind:size="'small'"></Rating>
                    </b-col>
                </b-row>
                <b-row v-if="data.website" class="mb-2">
                    <b-col cols="4" class="font-weight-bold text-right">
                        Website:
                    </b-col>
                    <b-col>
                        <b-link :href="data.website" target="_blank" class="font-small">
                            {{ data.website }}
                        </b-link>
                    </b-col>
                </b-row>
                <b-row v-if="data.phoneNumber" class="mb-2">
                    <b-col cols="4" class="font-weight-bold text-right">
                        Phone number:
                    </b-col>
                    <b-col>
                        {{ data.phoneNumber }}
                    </b-col>
                </b-row>
                <b-row v-if="data.address || data.mapURL" class="mb-2">
                    <b-col cols="4" class="font-weight-bold text-right">
                        Address:
                    </b-col>
                    <b-col v-if="data.mapURL">
                        <b-link :href="data.mapURL" v-if="data.mapURL" target="_blank" class="font-small">
                            <span v-if="data.address">
                                {{ data.address }}
                            </span>
                            <span v-else>
                                show on map
                            </span>
                        </b-link>
                    </b-col>
                    <b-col v-else>
                        {{ data.address }}
                    </b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col cols="4" class="font-weight-bold text-right">
                        Distance:
                    </b-col>
                    <b-col>
                        {{distance}}
                    </b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col cols="4" class="font-weight-bold text-right">
                        Favorite:
                    </b-col>
                    <b-col v-if="data.favorite">
                        <i>Yes</i>
                        <b-button class="fav-toggle-btn" @click="toggleFavorite" variant="danger">Remove from favorites</b-button>
                    </b-col>
                    <b-col v-else>
                        <i>No</i>
                        <b-button class="fav-toggle-btn" @click="toggleFavorite" variant="success">Add to favorites</b-button>
                    </b-col>
                </b-row>
            </div>
        <template v-slot:modal-footer class="text-center">
            <b-button @click="$bvModal.hide(modalID)">Close</b-button>
        </template>
    </b-modal>
</template>

<script>
    import {RestaurantData} from "@/backend/RestaurantData";
    import Rating from "@/components/Rating";

    export default {
        name: "RestaurantDetailModal",
        components: {Rating},
        props: {
            'restaurantData': {
                type: RestaurantData,
                required: true
            },
            'modalID': {
                type: String,
                required: true
            }
        },
        data () {
            return {
                data: this.restaurantData,
                gs: this.$googleService,
                removeModalID: 'remove-fav-' + this.restaurantData.place_id,
            }
        },

        computed: {
            distance() {
                if (this.data.distance > 1000) {
                    return String(Math.round(this.data.distance / 100) / 10) + ' km';
                } else {
                    return String(this.data.distance) + ' m';
                }
            }
        },

        methods: {
            getRatingIcon: function (index) {
                if (this.data.rating !== undefined) {
                    if (index <= this.data.rating) {
                        return 'star-fill';
                    } else if ((index - 0.5) <= this.data.rating) {
                        return 'star-half';
                    }
                }
                return 'star';
            },
            toggleFavorite() {
                if (this.data.favorite) {
                    this.$bvModal.show(this.removeModalID);
                } else {
                    this.gs.addToFavorites(this.data);
                }
            },
        }
    }
</script>

<style scoped>
    .font-small {
        font-size: 14px;
    }
    #icon-favorite {
        cursor: pointer;
        transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .fav-toggle-btn {
        margin-left: 10px;
        height: 20px;
        padding: 0 5px;
        font-size: 12px;
    }
</style>