import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import {router} from './common/router'
import {createPinia} from 'pinia'
import axios from 'axios'
import { AdminStore } from './stores/AdminStore'
/**
 * axios
 * pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor
 */
// category/list
axios.defaults.baseURL = "http://localhost:8080"
const { message, notification, dialog} = createDiscreteApi(["message", "notification", "dialog"])
const app = createApp(App)
//  provide 全局注入，其他地方就可以直接引入
app.provide("message",message)
app.provide("notification",notification)
app.provide("dialog",dialog)
app.provide("axios", axios)
app.provide("server_url", axios.defaults.baseURL)
app.use(naive)
app.use(createPinia())
const adminStore = AdminStore()
// 拦截器，所有请求都会先执行这个
axios.interceptors.request.use((config)=>{
    config.headers.token = adminStore.token
    return config
})
app.use(router)
app.mount('#app')
