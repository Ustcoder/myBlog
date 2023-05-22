<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div>
                <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory" :options="categoryOptions" trigger="click">
                    <div>分类<span>{{ categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="dashboard">后台</div>
        </div>
        <n-divider/>
        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{width: '500px'}" placeholder="请输入关键字" />
            <n-button type="primary" ghost @click="loadBlogs(0)">搜索</n-button>
        </n-space>
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px;">
                <n-card @click="toDetail(blog)" :title="blog.title" style="cursor: pointer;">
                    {{ blog.content }}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
        <n-divider/>
        <div class="footer">
            <div>Power By XXXX</div>
            <div>XICP备XXXXX号-1</div>
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
const selectedCategory = ref(0)
const categoryOptions = ref([])
onMounted(()=>{
    loadCategories();
    loadBlogs(); 
})
const blogListInfo = ref([])
const pageInfo = reactive({
    page: 1,
    pageCount: 0,
    pageSize: 3,
    count: 0,
    keyword: "",
    category_id:0
})
const searchByCategory = (category_id)=>{
    pageInfo.category_id = category_id
    loadBlogs()
}
const loadBlogs = async(page = 0)=>{
    if(page != 0){
        console.log(page)
        pageInfo.page = page 
    }
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.category_id}`)
   console.log(res)
    let temp_rows = res.data.data.rows
    for(let row of temp_rows){
        row.content += "..."
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
    }
    pageInfo.count = res.data.data.count
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
    blogListInfo.value = temp_rows
}
const categoryName = computed(()=>{
   let selectedOption =  categoryOptions.value.find((option) => {return option.value == selectedCategory.value})
   return selectedOption ? selectedOption.label : ""
})
const loadCategories = async()=>{
    let res = await axios.get('/category/list')
    categoryOptions.value = res.data.rows.map((item)=>{
        return {
            label: item.name,
            value: item.id
        }
    })
}
const toDetail = (blog)=>{
    router.push({path:'/detail',query:{id: blog.id}})
}
const homePage = ()=>{
    router.push("/")
}
const dashboard = ()=>{
    router.push("/login")
}
</script>
<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: rgb(35, 35, 35);
    div{
        cursor: pointer;
        margin-right: 15px;
        &:hover{
            color: rgb(253, 97, 0);
        }
        span {
            font-size: 12px;
            margin-left: 6px;
        }
    }
}
.search {
    margin-bottom: 15px;
}
.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
</style>