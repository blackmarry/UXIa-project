<template>
  <div id="app">
    <TopBar/>
    <SideBar></SideBar>
    <b-container class="pt-3">
      <router-view/>
    </b-container>
    <RemoveAllFavoritesModal></RemoveAllFavoritesModal>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";
import RemoveAllFavoritesModal from "@/components/modals/RemoveAllFavoritesModal";


export default {
  name: 'App',
  components: {
    TopBar,
    SideBar,
    // MainPage,
    RemoveAllFavoritesModal
  },

  created () {
    // initialize Google PlaceService
    this.$googleService.initPlaceService('app');
    // get current location
    this.$googleService.getCurrentLocation();
    // laod favorites restaurants from local storage
    this.$googleService.loadFavorites();

    // cookies getter
    document.getCookie = function (name) {
      for (let cookie of decodeURIComponent(document.cookie).split(';')) {
        // remove leading spaces
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substr(1);
        }
        if (cookie.indexOf(name) === 0) {
          return cookie.substr(name.length + 1);
        }
      }
    };
    // cookies setter
    document.setCookie = function (name, value) {
      document.cookie = name + "=" + encodeURIComponent(value) + ";";
    };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
button {
  box-shadow: none !important;
}
</style>
