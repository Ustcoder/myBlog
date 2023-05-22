<template>
    <div class="login-panel">
        <n-card title="管理后台登录">
            <n-form :rules="rules" :model="admin">
                <n-form-item label="账号" path="account">
                    <n-input v-model:value="admin.account" placeholder="请输入账号" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                    <n-input 
                    v-model:value="admin.password" 
                    placeholder="请输入密码" 
                    type="password"
                    />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox v-model:checked="admin.remember" label="记住我" />
                <n-button @click="login">登录</n-button>
            </template>
        </n-card>
    </div>
  </template>
<script setup>
import { reactive ,inject } from "vue";
import { AdminStore } from '../stores/AdminStore'
import { useRoute, useRouter } from "vue-router";
// import { useMessage } from "naive-ui";
    const router = useRouter()
    const route = useRoute() 
    const admin = reactive({
        account: localStorage.getItem("account") || "",
        password: localStorage.getItem("password") || "",
        remember: localStorage.getItem("remember") == 1 || false
      })
    const rules = {
        admin: {
          account: [
            {required: true, message: "请输入账号", trigger: "blur"},
            {min: 3, max: 12,message: "账号长度在 3 到 12 个字符",trigger:"blur"},
        ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, max: 18,message: "账号长度在 6 到 18 个字符",trigger:"blur"},
          ]
        }
      }
    const message = inject("message")
    const adminStore = AdminStore()
    const axios = inject("axios")
    const login = async ()=>{
        let result = await axios.post("/admin/login",{
            account: admin.account,
            password: admin.password
        });
        if(result.data.code == 200){
            adminStore.token = result.data.data.token
            adminStore.account = result.data.data.account
            adminStore.id = result.data.data.id
            if(admin.remember){
                localStorage.setItem("account",admin.account)
                localStorage.setItem("password",admin.password)
                localStorage.setItem("remember",admin.remember?1:0)
            }
            message.success("登录成功")
            setTimeout(()=>{router.push('./dashBoard')},1000)  
        }
        else{
            message.error("登录失败")
        }
        console.log(result)
    }
</script>
<style lang="scss" scoped>
.login-panel{
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
}
</style>