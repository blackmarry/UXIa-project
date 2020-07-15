<template>
    <b-col cols="12" sm="12" md="6" lg="4" class="mb-4 mt-2 h-auto">
        <b-card no-body class="h-100 text-left" :class="{'share-mode': shareMode, 'selected': shareMode && data.selected}" @click="toggleSelected">
            <b-card-header>
                <div class="d-flex justify-content-between">
                    <b>{{ data.name }}</b>
                    <b-icon id="icon-favorite" class="mt-1" :icon="data.favorite ? 'heart-fill' : 'heart'" :class="{ 'text-danger': data.favorite }" @click="toggleFavorite()"></b-icon>
                </div>
                <Rating v-bind:rating="data.rating" v-bind:total-ratings="data.totalRatings" v-bind:size="'small'"></Rating>
            </b-card-header>
            <b-card-body v-if="data.lunchMenu && data.lunchMenu.meals.length">
                <LunchMenu v-bind:lunch-data="data.lunchMenu"></LunchMenu>
            </b-card-body>
            <b-card-body v-else>
                <b-card-text class="text-danger font-small">
                    <i>No menu available.</i><br>
                </b-card-text>
                <b-card-text class="text-secondary font-small" v-if="data.website">
                    Please visit their <a :href="data.website" target="_blank">website</a> for more information.
                </b-card-text>
            </b-card-body>
            <b-card-footer>
                <b-card-text class="d-flex justify-content-between align-items-center">
                    <span class="font-small">Distance: {{distance}}</span>
                    <b-link @click="openRestaurantInfo">
                        <b-icon icon="info-circle-fill"></b-icon>
                    </b-link>
                </b-card-text>
            </b-card-footer>
        </b-card>
        <!-- Display restaurant details -->
        <RestaurantDetailModal v-bind:restaurant-data="data" v-bind:modal-i-d="detailModalID"></RestaurantDetailModal>
        <!-- Removing the restaurant from favorites -->
        <b-modal :id="removeModalID">
            <template v-slot:modal-title>
                <b-icon icon="exclamation-triangle-fill" variant="danger" class="mr-2"></b-icon>
                <b class="text-danger">Remove favorite restaurant</b>
            </template>
            <div class="d-block text-center">
                Are you sure you want to remove <b>{{data.name}}</b> from your favorite restaurants?
            </div>
            <template v-slot:modal-footer class="text-center">
                <b-button variant="danger" @click="removeFromFavorites">Remove</b-button>
                <b-button @click="$bvModal.hide(removeModalID)">Cancel</b-button>
            </template>
        </b-modal>
    </b-col>
</template>

<script>
    import { RestaurantData } from "@/backend/RestaurantData";
    import RestaurantDetailModal from "@/components/modals/RestaurantDetailModal";
    import Rating from "@/components/Rating";
    import LunchMenu from "@/components/LunchMenu";

    export default {
        name: "Restaurant",
        components: {
            LunchMenu,
            Rating,
            RestaurantDetailModal
        },
        props: {
            'restaurantData': {
                type: RestaurantData,
                required: true
            },
            'shareMode': {
                type: Boolean,
                required: false
            }
        },

        data() {
            return {
                data: this.restaurantData,
                gs: this.$googleService,
                removeModalID: 'remove-fav-' + this.restaurantData.place_id,
                detailModalID: 'restaurant-detail-' + this.restaurantData.place_id
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
            toggleFavorite() {
                if (this.data.favorite) {
                    this.$bvModal.show(this.removeModalID);
                } else {
                    this.gs.addToFavorites(this.data);
                }
            },

            removeFromFavorites() {
                this.gs.removeFromFavorites(this.data);
                this.$bvModal.hide(this.removeModalID);
            },

            openRestaurantInfo() {
                this.$bvModal.show(this.detailModalID);
            },

            toggleSelected() {
                if (this.shareMode) {
                    this.data.selected = !this.data.selected;
                }
            },
        }
    }
</script>

<style scoped>
    .card {
        border-radius: 8px;
        box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
        -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .card:hover, .selected {
        box-shadow: 8px 10px 16px rgba(0, 0, 0, .3);
    }
    .card:hover {
        opacity: 0.9;
    }
    .font-small {
        font-size: 14px;
    }
    .font-tiny {
        font-size: 10px;
    }
    #icon-favorite {
        cursor: pointer;
        transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .icon-rating {
        width: 0.75em;
    }
    .share-mode {
        opacity: 0.6;
        cursor: pointer;
    }
    .selected {
        opacity: 1;
    }
</style>