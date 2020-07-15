<template>
    <b-container class="m-0 p-0">
        <b-row>
            <b-col class="text-secondary font-medium font-weight-bold pb-1">Lunch menu</b-col>
        </b-row>
        <b-row v-if="data.soup" class="font-small">
            <b-col class="font-small d-flex flex-row">
                <div class="pr-0 mr-2 text-secondary">Soup:</div>
                <div>{{ data.soup }}</div>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col class="font-small font-italic text-info">
                without soup
            </b-col>
        </b-row>
        <b-row v-for="(meal, index) in data.meals" v-bind:key="meal.name" class="pt-2">
            <b-col class="font-small d-flex flex-row">
                <div class="mr-1">
                    {{ index + 1 }}.
                </div>
                {{ meal.name }}
            </b-col>
            <b-col cols="3" class="font-small pl-0 text-right">
                {{ meal.price }} Kč
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import { LunchMenu } from "@/backend/LunchMenu";

    export default {
        name: "LunchMenu",
        props: {
            'lunchData': {
                type: LunchMenu,
                required: true
            }
        },
        data() {
            return {
                data: this.lunchData
            }
        }
    }
</script>

<style scoped>
    .font-small {
        font-size: 14px;
    }
    .font-medium {
        font-size: 16px;
    }
</style>