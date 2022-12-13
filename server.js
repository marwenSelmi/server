const express = require('express')
const cors = require("cors")
const fs = require("fs")

const router = require("express").Router()

const translate = require('translate-google')
const { v4: uuidv4 } = require('uuid');
const app = express()
app.use(cors())


app.use(express.json({limit: '50mb'}))

app.get("/api/hello",async(req,res)=>{
  res.json({msg:"hello world"})
})

app.post("/api/html_translator",async(req,res)=>{
    try{
        const {text_array,language,direction,file,connected} = req.body
     
     let result = []
    
        let data = JSON.parse( fs.readFileSync(`./${language}.json`))
        //connected
        if(connected){
          for(let i=0;i<text_array.length;i++){
            const replacer = new RegExp(" ", 'g')
            
            let originalText =   text_array[i].toString().replace(replacer,"").replace(/\[\d+\]/g, '')
            .replace(/[&\/\\#,+()$@~%.'":*?<>{}]/g,'').toUpperCase()
            let detected_text = ""
           
            if(data != []){
            
           
              
              detected_text = data.filter(el => el.originalText ==originalText )[0]
            }
                
  
                let translated_text = ""
                if(detected_text != undefined){
               
                  translated_text = detected_text.translated_origine
                  let f = {
                    id:uuidv4(),
                    
                    originalText
                    ,
                    language,
                    translated_origine:translated_text
                   }//orginal_text:text_array[i],
                  //  translated_text,
                  //  direction,
                  //  file
                
                   f[String(file.split(".")[0]+"auto")] = text_array[i]
                   f[String(direction)] = translated_text
  
                   f["file"] = file
                   
                   result.push(f)
                }else{
                   translated_text = await translate(text_array[i], {to: language})
                   let f = {
                    id:uuidv4(),
                    
                    originalText
                    ,
                    language,
                    translated_origine:translated_text
                   }
                   f[String(file.split(".")[0]+"auto")] = text_array[i]
                   f[String(direction)] = translated_text
                   f["file"] = file
                 
               
                   result.push(f)
                }
               
               
  
               
                 
                 
  
          
           
       
            }
            
            let final_array = [...data,...result]
       
         fs.writeFileSync(`./${language}.json`,JSON.stringify(final_array),'utf8')
       
     
          res.json({result})
        }
        //not connected
        else{
          for(let i=0;i<text_array.length;i++){
            const replacer = new RegExp(" ", 'g')
            
            let originalText =   text_array[i].toString().replace(replacer,"").replace(/\[\d+\]/g, '')
            .replace(/[&\/\\#,+()$@~%.'":*?<>{}]/g,'').toUpperCase()
            let detected_text = ""
           
            if(data != []){
        
           
              
              detected_text = data.filter(el => el.originalText ==originalText )[0]
            }
                
  
                let translated_text = ""
                if(detected_text != undefined){
                 
                  translated_text = detected_text.translated_origine
                  let f = {
                    id:uuidv4(),
                    
                    originalText
                    ,
                    language,
                    translated_origine:translated_text
                   }//orginal_text:text_array[i],
                  //  translated_text,
                  //  direction,
                  //  file
              
                   f[String(file.split(".")[0]+"auto")] = text_array[i]
                   f[String(direction)] = translated_text
  
                   f["file"] = file
                   
                   result.push(f)
                }else{
                   translated_text = ""
                   let f = {
                    id:uuidv4(),
                    
                    originalText
                    ,
                    language,
                    translated_origine:translated_text
                   }
                   f[String(file.split(".")[0]+"auto")] = text_array[i]
                   f[String(direction)] = translated_text
                   f["file"] = file
               
               
                   result.push(f)
                }
               
               
  
               
                 
                 
  
          
           
       
            }
            
            let final_array = [...data,...result]
           
         fs.writeFileSync(`./${language}.json`,JSON.stringify(final_array),'utf8')
         
     
          res.json({result})



        }
      
    }catch(err){
        console.log(err)
    }
})


app.post("/api/download_file",async(req,res)=>{
  try{
    const {original_html_file} = req.body
   
    fs.writeFileSync( "./index.html", original_html_file )


    res.download("./index.html")


  }catch(err){
    console.log(err.message)
  }
})

app.get("/api/file",async(req,res)=>{
  try {

    res.download("./index.html")
  } catch (err) {
    console.log(err)
  }
})

app.post("/api/download_json_file",async(req,res)=>{
  try{
    const {original_json_file} = req.body

    fs.writeFileSync( "./file.json", original_json_file )
    

    res.download("./file.json")


  }catch(err){
    console.log(err.message)
  }
})

app.get("/api/file_json",async(req,res)=>{
  try {
    res.download("./file.json")
  } catch (err) {
    console.log(err)
  }
})





let port = 5000
app.listen(port,()=>{
    console.log(`server is running on port ${port} `)
})