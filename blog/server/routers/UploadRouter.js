const express = require("express")
const router = express.Router()
const fs = require("fs")
const {db,genId} = require("../db/DbUtils")
 
router.post("/rich_editor_upload", async (req,res)=>{
    if(req.files){
        let files = req.files
        let ret_files = []
        for(let file of files){
            // console.log(file);
            // {
            //     fieldname: 'files',
            //     originalname: 'dnf壁纸.jpg',
            //     encoding: '7bit',
            //     mimetype: 'image/jpeg',
            //     destination: './public/upload/temp',
            //     filename: 'daba3810f5d49eb54746107283ffc534',
            //     path: 'public\\upload\\temp\\daba3810f5d49eb54746107283ffc534',
            //     size: 1600244
            //   }
            // 获取文件名字后缀
            let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
            // 随机文件名
            let file_name = genId.NextId() + "." + file_ext
            // 修改名字加移动文件
            fs.renameSync(
                process.cwd() + "/public/upload/temp/" + file.filename, 
                process.cwd() + "/public/upload/" + file_name
            )
            ret_files.push("/upload/" + file_name)
        }
        res.send({
            "errno": 0, // 注意：值是数字，不能是字符串
            "data": {
                "url": ret_files[0], // 图片 src ，必须
                // "alt": "yyy", // 图片描述文字，非必须
                // "href": "zzz" // 图片的链接，非必须
            }
        })
    }else{
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
    }
})
module.exports = router