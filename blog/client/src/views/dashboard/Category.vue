<template>
    <n-button @click="showAddModal = true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in categoryList">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>
            <n-space>
                <n-button @click="toUpdate(item)">修改</n-button>
                <n-button @click="showDeleteModal = true ,category.id = item.id">删除</n-button>
            </n-space>
        </td>
      </tr>
    </tbody>
  </n-table>  
  <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <n-input v-model:value="category.name" placeholder="请输入名称" />
    <template #action>
      <div>
        <n-button @click="add">
            提交
        </n-button>
      </div>
    </template>
  </n-modal>
  <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
    <template #header>
      <div>修改分类</div>
    </template>
    <n-input v-model:value="updateCategory.name" placeholder="" />
    <template #action>
      <div>
        <n-button @click="update">
            提交
        </n-button>
      </div>
    </template>
  </n-modal>
  <n-modal
    v-model:show="showDeleteModal"
    preset="dialog"
    title="提示"
    content="确定删除该分类吗?"
    positive-text="确定"
    negative-text="取消"
    @positive-click="submitCallback"
  />
</template>
<script setup>
import { ref ,inject, onMounted, reactive } from "vue";
import { AdminStore } from '../../stores/AdminStore'
import { useRoute, useRouter } from "vue-router";
// import { useMessage } from "naive-ui";
const router = useRouter()
const route = useRoute() 
const message = inject("message")
const adminStore = AdminStore()
const axios = inject("axios")
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const categoryList = ref([])
const category = reactive({
    name:"",
    id: 0
})
const updateCategory = reactive({
    name:"",
    id: 0
})
onMounted(()=>{
    loadDatas()
})

const loadDatas = async()=>{
    let res = await axios.get("/category/list")
    categoryList.value = res.data.rows
    console.log(res)
}
const add = async()=>{
    let res = await axios.post("/category/_token/add",{ name: category.name})
    if(res.data.code == 200){
        message.success(res.data.msg)
        loadDatas()
    }else{
        message.error(res.data.msg)
    }
    showAddModal.value = false
}
const deleteCategory = async(category)=>{
    let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
    if(res.data.code == 200){
        message.success(res.data.msg)
        loadDatas()
    }else{
        message.error(res.data.msg)
    }
}
const submitCallback = ()=>{
  deleteCategory(category)
}
// const cancelCallback = ()=>{
//   message.success("Cancel")
// }
const toUpdate = (category)=>{
  showUpdateModal.value = true
  updateCategory.id = category.id
  updateCategory.name = category.name
}
const update = async()=>{
  let res = await axios.put("/category/_token/update",{ id: updateCategory.id, name: updateCategory.name })
  if(res.data.code == 200){
        message.success(res.data.msg)
        loadDatas()
    }else{
        message.error(res.data.msg)
    }
    showUpdateModal.value = false
}
</script>
<style lang="scss" scoped>
</style>