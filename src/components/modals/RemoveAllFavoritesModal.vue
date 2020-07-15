<template>
    <b-modal :id="modalID">
        <template v-slot:modal-title>
            <b-icon icon="exclamation-triangle-fill" variant="danger" class="mr-2"></b-icon>
            <b class="text-danger">Remove all favorite restaurants</b>
        </template>
        <div class="d-block text-center">
            Are you sure you want to remove all your favorite restaurants?
        </div>
        <template v-slot:modal-footer class="text-center">
            <b-button variant="danger" @click="removeFavorites()">Remove</b-button>
            <b-button @click="$bvModal.hide(modalID)">Cancel</b-button>
        </template>
    </b-modal>
</template>

<script>
    export default {
        name: "RemoveFavoritesModal",
        data () {
            return {
                gs: this.$googleService,
                modalID: this.$removeFavoritesModalID
            }
        },
        methods: {
            removeFavorites() {
                this.gs.removeAllFavorites();
                this.$bvModal.hide(this.modalID);
            }
        }
    }
</script>

<style scoped>

</style>