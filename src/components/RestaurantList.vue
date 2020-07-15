<template>
    <div class="py-3">
        <b-row class="pb-4" v-if="restaurants.length > 0">
            <b-col>
                <div class="d-flex align-items-center" v-if="restaurants.length > 1">
                    <span class="mr-3 font-weight-bold">Sort by:</span>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <b-button
                            :variant=" sortByValue === options[0].value ? 'secondary' : 'light'"
                            size="sm"
                            @click="setSort(options[0].value)"
                            >
                            <b-icon :icon="options[0].icon"></b-icon>
                            {{options[0].text}}
                        </b-button>
                        <b-button
                                :variant=" sortByValue !== options[0].value  ? 'secondary' : 'light'"
                                size="sm"
                                @click="setSort(options[1].value)"
                        >
                            <b-icon :icon="options[1].icon"></b-icon>
                            {{options[1].text}}
                        </b-button>
                    </div>
<!--                    <b-form-group class="m-0">-->
<!--                        <b-form-radio-group-->
<!--                                v-model="sortBy"-->
<!--                                :icon="options.icon"-->
<!--                                :options="options"-->
<!--                                name="radio-inline"-->
<!--                        ></b-form-radio-group>-->
<!--                    </b-form-group>-->
                </div>
            </b-col>
            <b-col v-if="shareMode">
                <div class="d-flex justify-content-center">
                    <b-button class="mb-2 shadow" id="share-btn" variant="success" size="lg" @click="shareRestaurants" :disabled="noneSelected">
                        <span class="h3">Share</span>
                    </b-button>
                </div>
            </b-col>
            <b-col v-if="canShare">
                <div class="d-flex justify-content-end">
                    <b-button class="mb-2 shadow" variant="secondary" size="sm" @click="toggleShareMode">
                        <b v-if="!shareMode">Share restaurants</b>
                        <b v-else>Cancel selection</b>
                    </b-button>
                </div>
            </b-col>
        </b-row>
        <b-alert v-if="shareMode" variant="info" dismissible fade :show="true" class="shadow">
            <b-icon icon="info-circle-fill" class="mr-2"></b-icon>
            <i>Click on one or more restaurants to select them for sharing.</i>
        </b-alert>
        <b-row v-if="restaurants.length === 0" class="text-center mt-3">
            <b-col>
                <div v-if="loadingRestaurants" class="d-flex justify-content-center align-items-center">
                    <i class="h5 m-0 text-secondary">{{ loadingRestaurantsMsg }}</i>
                    <b-icon icon="three-dots" animation="cylon" font-scale="2" class="ml-2 pt-2 text-secondary"></b-icon>
                </div>
                <div v-else>
                    <i class="h5 m-0 text-secondary">{{ noRestaurantMsg }}</i>
                </div>
            </b-col>
        </b-row>
        <b-row v-else class="justify-content-center">
            <Restaurant v-for="restaurant in restaurants" v-bind:key="restaurant.place_id" v-bind:restaurant-data="restaurant" v-bind:share-mode="shareMode"></Restaurant>
        </b-row>
        <!-- Share link modal -->
        <b-modal :id="shareLinkModalID">
            <template v-slot:modal-title>
                <b-icon icon="link45deg" variant="success" class="h3 m-0 mr-1"></b-icon>
                <b class="text-success">Share restaurants</b>
            </template>
            <b-input type="text" :value="shareURL" autofocus readonly @focus="$event.target.select()"/>
            <template v-slot:modal-footer class="text-center">
                <b-button v-clipboard="shareURL">
                    <b-icon icon="box-arrow-in-right" class="m-0 mr-1"></b-icon>
                    Copy to clipboard
                </b-button>
                <b-button @click="$bvModal.hide(shareLinkModalID)">Close</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
    import Restaurant from "@/components/Restaurant";
    import {sortByKey, sortTypes, usernameKey} from "@/backend/Constants";
    import ShareLink from "@/backend/ShareLink";

    export default {
        name: "RestaurantList",
        components: {
            Restaurant
        },

        props: {
            'restaurantList': {
                type: Array,
                required: true
            },
            'noRestaurantMsg': {
                type: String,
                required: true
            },
            'loadingRestaurants': {
                type: Boolean,
                required: false
            },
            'loadingRestaurantsMsg': {
                type: String,
                required: false
            },
            'canShare': {
                type: Boolean,
                required: false,
                default: true
            }
        },

        data () {
            return {
                sortByValue: null,
                shareMode: false,
                shareLinkModalID: 'share-link-modal',
                shareURL: null,
                options: [
                    { text: 'Distance', value: sortTypes.distance, icon: 'geo-alt' },
                    { text: 'Ratings', value: sortTypes.ratings, icon: 'star-fill' }
                ]
            }
        },

        computed: {
            restaurants () {
                return this.sortRestaurants(this.restaurantList);
            },
            sortBy: {
                get: function () {
                    return this.sortByValue;
                },
                set: function (value) {
                    document.setCookie(sortByKey, value);
                    this.sortByValue = value;
                }
            },
            noneSelected () {
                return this.restaurants.filter(x => x.selected).length === 0;
            }
        },

        created() {
            // sorting
            this.sortByValue = document.getCookie(sortByKey);
            if (this.sortByValue === undefined) {
                this.sortByValue = sortTypes.distance;
            }
        },

        methods: {
            sortRestaurants: function (restaurants) {
                if (restaurants.length > 1) {
                    switch(this.sortBy) {
                        case sortTypes.distance:
                            restaurants.sort((a, b) => {return a.distance > b.distance ? 1 : -1});
                            break;
                        case sortTypes.ratings:
                            restaurants.sort((a, b) => {
                                if (a.rating === undefined) {
                                    return 1;
                                } else if (b.rating === undefined) {
                                    return -1;
                                } else {
                                    return a.rating < b.rating ? 1 : -1;
                                }
                            });
                            break;
                        default:
                    }
                }
                return restaurants;
            },

            toggleShareMode: function () {
                this.shareMode = !this.shareMode;
                if (this.shareMode) {
                    this.restaurants.forEach(
                        x => x.selected = false
                    );
                }
            },

            shareRestaurants: function () {
                let shareLink = new ShareLink();
                shareLink.setUsername(localStorage.getItem(usernameKey));
                shareLink.setRestaurants(this.restaurants.filter(x => x.selected).map(x => x.place_id));
                this.shareURL = shareLink.toString();
                this.$bvModal.show(this.shareLinkModalID);
            },

            setSort (value) {
                this.sortBy = value;
            }
        }
    }
</script>

<style scoped>
    #share-btn{
        width: 142px;
        height: 42px;
        padding: 0;
    }
</style>