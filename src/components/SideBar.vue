<template>
    <b-sidebar v-model="sidebarVisible" right no-header id="userProfile" width="360px" shadow="lg" bg-variant="dark" text-variant="light">
        <template v-slot:default="{ hide }">
            <div class="p-3">
                <div class="d-flex justify-content-between pb-3 border-bottom">
                    <div class="d-flex align-items-center">
                        <b-avatar size="2rem" variant="light"></b-avatar>
                        <h3 class="m-0 ml-3 pt-1 font-weight-bold">User Profile</h3>
                    </div>
                    <b-button-close id="sidebar-close-button" text-variant="light" @click="hide">
                        <b-icon icon="x"></b-icon>
                    </b-button-close>
                </div>
                <div class="mt-4 pt-1">
                    <b-row class="my-3 align-items-center">
                        <b-col cols="4" class="text-right p-0">
                            Username:
                        </b-col>
                        <b-col class="p-0 px-3">
                            <div v-if="!editing" class="font-weight-bold">
                                {{ username }}
                            </div>
                            <b-form-input size="sm" v-else v-model="newUsername" placeholder="Enter your username"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-3 align-items-center">
                        <b-col cols="4" class="align-content-end text-right p-0">
                            Search radius:
                        </b-col>
                        <b-col class="p-0 px-3">
                            <div v-if="!editing" class="font-weight-bold">
                                {{ radius }} m
                            </div>
                            <b-form-spinbutton v-else inline id="sb-inline" size="sm" v-model="radius" placeholder="" min="250" max="5000" step="250"></b-form-spinbutton>
                        </b-col>
                    </b-row>
                    <b-row class="my-3 align-items-center">
                        <b-col cols="4" class="align-content-end text-right p-0">
                            Favorites:
                        </b-col>
                        <b-col class="p-0 px-3">
                            <b-button class="btn-tiny" v-if="!editing" to="/favorites">show</b-button>
                            <b-button class="btn-tiny"
                                      v-else
                                      variant="danger"
                                      v-b-modal="removeID"
                                      :disabled="gs.favorites.length === 0">
                                remove
                            </b-button>
                        </b-col>
                    </b-row>
                </div>
            </div>
        </template>
        <template v-slot:footer="{ hide }">
            <div class="p-3" v-if="editing">
                <b-button block size="sm" variant="success" @click="storeChanges">Confirm changes</b-button>
                <b-button block size="sm" @click="leaveEditing">Cancel</b-button>
            </div>
            <div class="p-3" v-else>
                <b-button block size="sm" @click="enterEditing">Edit profile</b-button>
                <b-button block size="sm" @click="hide">Close</b-button>
            </div>
        </template>
    </b-sidebar>
</template>

<script>
    import { sidebarKey, usernameKey } from "@/backend/Constants";

    export default {
        name: "SideBar",
        data () {
            return {
                gs: this.$googleService,
                sidebar: null,
                editing: false,
                username: null,
                newUsername: null,
                radius: null,
                removeID: this.$removeFavoritesModalID
            }
        },

        computed: {
            sidebarVisible: {
                get: function () {
                    return String(this.sidebar) === "true";
                },
                set: function (value) {
                    this.sidebar = value;
                    document.setCookie(sidebarKey, value);
                }
            }
        },

        created() {
            // sidebar initial state
            this.sidebar = document.getCookie(sidebarKey);
            if (this.sidebar === undefined) {
                this.sidebar = false;
            }
            // stored username
            this.username = localStorage.getItem(usernameKey);
            if (this.username === null) {
                this.username = 'Unknown user';
            } else {
                this.newUsername = this.username;
            }
            // stored search radius
            this.radius = this.gs.radius;
        },

        methods: {
            enterEditing: function() {
                this.editing = true;
            },
            leaveEditing: function() {
                this.editing = false;
            },
            storeChanges() {
                // username has been changed
                if (this.newUsername && this.username !== this.newUsername) {
                    this.username = this.newUsername;
                    localStorage.setItem(usernameKey, this.username);
                }
                // search radius has been changed
                if (this.radius !== this.gs.radius) {
                    this.gs.setRadius(this.radius);
                }
                // leave editing mode
                this.editing = false;
            }
        }
    }
</script>

<style scoped>
    #sidebar-close-button {
        height: 24px;
    }
    .row {
        height: 31px;
    }
    .btn-tiny {
        height: 25px;
        font-size: 14px;
        padding: 0 14px;
    }
</style>