<template>
    <div class="d-flex flex-row align-items-center">
        <b-icon class="icon-rating" :class="size + (rating !== undefined ? ' text-warning' : '')" v-for="index in 5" :key="index" :icon="getRatingIcon(index)"></b-icon>
        <span v-if="totalRatings" class="text-secondary ml-2" :class="size">{{ totalRatings }} reviews</span>
        <i v-else class="text-secondary ml-2 font-tiny">No reviews</i>
    </div>
</template>

<script>
    export default {
        name: "Rating",
        props: {
            'rating': {
                required: true
            },
            'totalRatings': {
                required: true
            },
            size: {
                type: String,
                required: false
            }
        },
        methods: {
            getRatingIcon: function (index) {
                if (this.rating !== undefined) {
                    if (index <= this.rating) {
                        return 'star-fill';
                    } else if ((index - 0.5) <= this.rating) {
                        return 'star-half';
                    }
                }
                return 'star';
            }
        }
    }
</script>

<style scoped>
   svg .small {
       width: 0.8em;
   }
   span .small {
        font-size: 6px;
   }
</style>