<template>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>  
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { ref ,inject, reactive, onMounted, onBeforeUnmount, shallowRef } from "vue";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
const mode = ref("default")
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref("")
const props = defineProps({
    modelValue:{
        type:String,
        default:""
    }
})
const emit = defineEmits(["update:model-value"])
let initFinished = false
// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true
      }, 10);
})

const toolbarConfig = { excludeKeys:[
   "uploadVideo" 
] }
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
    if(initFinished){
        console.log('change:', editor.getHtml());
        emit("update:model-value", valueHtml.value)
    }
    };
// 上传图片
const server_url = inject("server_url")
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
     base64LimitSize: 10 * 1024,
     server: server_url + '/upload/rich_editor_upload',
}
// 上传图片时加入完整的地址
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc:(src) => {
        if(src.indexOf("http") !==0 ){
            return `${server_url}${src}`
        }
        return src
    }
}
</script>
<style lang="scss" scoped>
</style>