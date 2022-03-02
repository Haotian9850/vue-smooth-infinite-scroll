<template>
<div>
    <div ref="wrapper" :style="{minHeight: `${this.wrapperMinHeight}px`}">
        <div class="content" :style="{transform: `translateY(${this.contentOffsetY}px)`}">
            <SmoothInfiniteScrollItem 
                v-for="(v, i) in renderedItems" 
                :key="i" 
                :height="itemHeight"
            >
                <template>
                    <slot :item="v"></slot>
                </template>
            </SmoothInfiniteScrollItem>

            <!-- custom data loader -->
            <slot name="loader" v-if="$slots.loader && fetching">
            </slot>

            <!-- custom noMoreData -->
            <slot name="noMoreData" v-if="$slots.noMoreData && !fetching && !hasMore && atBottom">
            </slot>
            
            <!-- default data loader -->
            <div class="centered" v-if="!$slots.loader && fetching">
                <span>Loading...</span>
            </div>

            <!-- default noMoreData -->
            <div class="centered" v-if="!$slots.noMoreData && !fetching && !hasMore && atBottom">
                <span>No more data</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import SmoothInfiniteScrollItem from './SmoothInfiniteScrollItem.vue';
import debounce from 'lodash/debounce';

export default {
    name: "SmoothInfiniteScroll",

    components: {
        SmoothInfiniteScrollItem
    },

    props: {
        itemHeight: {
            type: Number,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        scrollableTargetId: {
            type: String,
            default: "window"   // whole page scrolling
        },
        preRenderCount: {
            type: Number,
            default: 5
        },
        hasMore: {
            type: Boolean,
            required: true 
        }
    },

    data() {
        return {
            wrapperMinHeight: null,
            renderedItems: [],
            numRendered: null,
            viewPortHeight: null,
            debouncedOnScroll: null,
            contentOffsetY: 0,
            fetching: false,
            itemsWithIndices: []
        }
    },

    computed: {
        atBottom: function() {
            return this.renderedItems?.[this.renderedItems.length - 1]?.index === this.itemsWithIndices.length - 1;
        }
    },

    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });
        this.debouncedOnScroll = debounce(this.onScroll, 10);
        if (this.isValidCustomScrollableTarget()) {
            this.getCustomScrollableTarget().addEventListener("scroll", this.debouncedOnScroll);
        } else {
            window.addEventListener("scroll", this.debouncedOnScroll);
        }
        this.setViewPortHeight();
        this.injectItemIndices();
        this.onScroll();    // initial call
    },

    beforeDestroy() { 
        window.removeEventListener("resize", this.onResize); 
        if (this.isValidCustomScrollableTarget()) {
            this.getCustomScrollableTarget().removeEventListener("scroll", this.debouncedOnScroll);
        } else {
            window.removeEventListener("scroll", this.debouncedOnScroll);
        }
    },

    methods: {
        onScroll() {
            this.setWrapperMinHeight();
            const scrollTop = -this.$refs.wrapper.getBoundingClientRect().top;
            let startNode = Math.floor(scrollTop / this.itemHeight);
            startNode = Math.max(0, startNode);
            let visibleNodeCount = Math.ceil(this.viewPortHeight / this.itemHeight);
            visibleNodeCount = Math.min(this.itemsWithIndices.length - startNode, visibleNodeCount + this.preRenderCount);
            this.renderedItems = new Array(visibleNodeCount).fill(null).map((_, index) => (
                this.itemsWithIndices[index + startNode]
            ));
            let offsetY = startNode * this.itemHeight;
            if (startNode !== 0 && this.isValidCustomScrollableTarget()) {
                // not on the top yet 
                offsetY += this.getCustomScrollableTarget().getBoundingClientRect().top;
            }
            this.contentOffsetY = offsetY;
            // check if has scrolled to bottom
            console.debug("onScroll", this.renderedItems[this.renderedItems.length - 1]?.index, this.itemsWithIndices.length, startNode);
            if (
                this.renderedItems[this.renderedItems.length - 1]?.index >= this.itemsWithIndices.length - 1 && 
                !this.fetching && 
                this.hasMore
            ) {
                //console.log(`Has scrolled to last item ${this.renderedItems[this.renderedItems.length - 1]?.index}, fetching data...`);
                this.fetching = true;
                this.$emit("next", { lastIndex: this.itemsWithIndices.length - 1 });
            }
        },

        setWrapperMinHeight() {
            this.wrapperMinHeight = this.itemsWithIndices.length * this.itemHeight;
        },

        onResize() {
            this.setViewPortHeight();
        },

        setViewPortHeight() {
            if (this.isValidCustomScrollableTarget()) {
                //console.log("scrollableTarget height: ", this.getCustomScrollableTarget().offsetHeight);
                this.viewPortHeight = this.getCustomScrollableTarget().offsetHeight;
            } else {
                //console.log(`Setting viewPortHeight to ${window.innerHeight}`);
                this.viewPortHeight = window.innerHeight;
            }
        },

        isValidCustomScrollableTarget() {
            if (!!this.scrollableTargetId && this.scrollableTargetId !== "window") {
                const target = this.getCustomScrollableTarget();
                return !!target && !!target.clientHeight;
            } else {
                return false;
            }
        },

        getCustomScrollableTarget() {
            return document.getElementById(this.scrollableTargetId);
        },

        injectItemIndices() {
            this.itemsWithIndices = this.items.map((item, index) => ({
                ...item,
                index: index 
            }));
        }
    },

    watch: {
        viewPortHeight(newHeight, oldHeight) {
            console.debug(`viewPortHeight changed to ${newHeight} from ${oldHeight}`);
            this.setViewPortHeight();
        },

        items(newItems, oldItems) {
            console.debug(`props.items changed, old length ${oldItems.length}, new length ${newItems.length}`);
            this.fetching = false;
            this.injectItemIndices();
            this.onScroll();
        },

        hasMore(newHasMore, oldHasMore) {
            console.debug(`props.hasMore changed, old value ${oldHasMore}, new value ${newHasMore}`);
            if (!newHasMore) {
                this.fetching = false;
                this.hasMore = false;   
            }
        }
    },
}
</script>

<style scoped>
.centered {
    text-align: center;
}
</style>
