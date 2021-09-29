import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import VuePapaParse from 'vue-papa-parse'


Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VuePapaParse)
new Vue({
  render: h => h(App),
}).$mount('#app')
