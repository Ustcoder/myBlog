<template>
    <div class="container">
        <n-button @click="goBack">返回</n-button>
        <n-h1>{{ blogInfo.title }}</n-h1>
        <div>
            <div v-html="blogInfo.content"></div>
        </div>
    </div>   
</template>
<script setup>
import { ref ,inject, onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { useMessage } from "naive-ui";
const router = useRouter()
const route = useRoute() 
const message = inject("message")
const axios = inject("axios")
const blogInfo = ref({})
const goBack = (()=>{
    router.push("/home")
})
onMounted(()=>{
    loadBlog()
})
const loadBlog = async()=>{
    let res = await axios.get("/blog/detail?id=" + route.query.id)
    blogInfo.value = res.data.rows[0]
}
</script>
<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
:deep(img){
    max-width: 100%;
}
</style>