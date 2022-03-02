<template>
    <div :style="{ height: `${height}px` }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "SmoothInfiniteScrollItem",

    props: {
        height: {
            // in pixels
            type: Number,
            default: null 
        }
    },

    methods: {

    }
}
</script>

<style scoped>

</style>