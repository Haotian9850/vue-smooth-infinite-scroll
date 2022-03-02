import SmoothInfiniteScroll from "./components/SmoothInfiniteScroll.vue";

function install(Vue) {
    if (install.installed) {
        return;
    }
    install.installed = true;
    Vue.component("vue-smooth-infinite-scroll", SmoothInfiniteScroll);
}

const plugin = {
    install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
    GlobalVue = global.vue;
}

if (GlobalVue) {
    GlobalVue.use(plugin);
}

SmoothInfiniteScroll.install = install;

export default SmoothInfiniteScroll;