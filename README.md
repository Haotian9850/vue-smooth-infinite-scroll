<h1 align="center">vue-smooth-infinite-scroll</h1>
<p>
  <a href="https://www.npmjs.com/package/vue-smooth-infinite-scroll" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vue-smooth-infinite-scroll.svg">
  </a>
  <a href="https://github.com/Haotian9850/vue-smooth-infinite-scroll#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/Haotian9850/vue-smooth-infinite-scroll/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/Haotian9850/vue-smooth-infinite-scroll/blob/main/license" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Haotian9850/vue-smooth-infinite-scroll" />
  </a>
</p>

[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> A high-performance Vue.js plugin with virtual DOM list to support fast, smooth infinite scroll | 一款基于虚拟列表的高性能Vue.js无限加载组件

![Demo GIF](https://github.com/Haotian9850/vue-smooth-infinite-scroll/blob/main/gif/vue-smooth-infinite-scroll_demo_compressed.gif)

### [Demo](https://github.com/Haotian9850/vue-smooth-infinite-scroll/blob/main/gif/vue-smooth-infinite-scroll_demo_compressed.gif)

## Install
```sh
npm install --save vue-smooth-infinite-scroll

OR 

yearn add vue-smooth-infinite-scroll
```

## Import into your project 
```js
// in a vue2 project
import SmoothInfiniteScroll from "vue-smooth-infinite-scroll";

// common JS
var SmoothInfiniteScroll = require("vue-smooth-infinite-scroll");
```

## Usage
```js
<template>
    <smooth-infinite-scroll
        :itemHeight="220"
        :items="items"
        @next="onNext"
        :hasMore="hasMore"
        :preRenderCount="3"
    >
        <template v-slot="{ item }">
            <div>
                {{ item }}
            </div>
        </template>

        <template #loader>
            <span>Your custom loader component</span>
        </template>

        <template #noMoreData>
            <span>Your custom "no more data" component</span>
        </template>
    </smooth-infinite-scroll>
</template>

<script>
import SmoothInfiniteScroll from "vue-smooth-infinite-scroll";

export default {
    components: {
        SmoothInfiniteScroll
    },

    data() {
        return {
            items: [],
            currPage: 1,
            hasMore: true
        }
    },

    methods: {
        async fetchNewData(page) {
            /* your code to fetch new data by page number */
            const newData = await this.$http.get("SOME_URL");
            if (!newData.length) {
                // set hasMore to false for "noMoreData" slot to render
                this.hasMore = false;
            } else {
                // pass new data into the infinite scroll component
                this.items = this.items.concat(newData);
            }
        },

        onNext() {
            // fetch the next page of data upon hitting the bottom
            this.currPage = this.currPage + 1;
            this.fetchNewData(this.currPage);
        }
    }
}
</script>
```
## Props, Slots and Events
### Props
| name                           | type                 | description                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **itemHeight**                 | Number `Required`      | Height for each item in the infinite scroll in pixels |
| **hasMore**                    | Boolean `Required`     | If `true`, the infinite scroll will emit `next` event when hitting the bottom of the scroll. Otherwise, it will display the custom or default "no more data" component at the bottom of the scroll |
| **items**                      | Array `Required`       | The list data items which you need to scroll  |
| **preRenderCount**             | Number `Optional`      | Number of items to be preemptively rendered before they enter the viewport. A higher number will give a smoother scroll but renders more DOM elements. Default is `5`|
| **scrollableTargetId**         | String `Optional`      | ID of the parent element to which the scrolling action is relative. Only required when scrolling inside of a element with a fixed height |

### Slots
| name                           | description                 | default                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **loader**      | Shown when new data is being fetched | `<span>Loading...</span>` |
| **noMoreData**  | Shown where user has reached the bottom of the scroll (i.e. when no new data is available)     | `<span>No more data</span>` |

### Events
| name                           | description                 | handling                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **next**      | Emitted from the `SmoothInfiniteScroll` component whenever user has reached the bottom of the scroll  | Your own `onNext` function which will request new data, concatenate it with `this.items` and set `hasMore` accordingly as in the above example |

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Haotian9850/vue-smooth-infinite-scroll/issues). 

## Show your support
Give a ⭐️ if this project helped you!

## License

Copyright © 2022 [hao](https://github.com/Haotian9850).<br />
This project is [MIT](https://github.com/Haotian9850/vue-smooth-infinite-scroll/blob/main/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_