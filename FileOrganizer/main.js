let fs=require('fs')
let path=require('path');
let types={
    media:["mp4","mkv"],
    archives:['zip','7z','rar','iso','tar','gz'],
    documents:['dock','doc','pdf','xlxs','xls','odt','odp','ods','txt','ipynb'],
    app:['exe','dmg','pkg','dab']
}
let inputArr=process.argv.slice(2)
console.log(inputArr);
let command=inputArr[0]
switch(command){
    case "tree":
         treeFn(inputArr[1])
        break;
    case "organize":
        organizeFn(inputArr[1])
        break;
    case "help":
         console.log(`
                        1. tree
                        2. 0rganize   
                    `);
        break;
    default:
        console.log("please type a valid commmand");
        break;
}
function treeFn(dirPath)
{
 
    console.log("Tree"+dirPath)
}

function organizeFn(dirPath)
{
    let destPath;
    if(dirPath==undefined)
    {
        let destPath=process.cwd();
        return;

    }
    else{

        let doesExist=fs.existsSync(dirPath)
        if(doesExist)
        {
            destPath=path.join(dirPath,"organized_Files");
            if(fs.existsSync(destPath)==false)
            {
                fs.mkdirSync(destPath)
            }
            organizeHelper(dirPath,destPath)
            


        }
        else{
            console.log("kindly check");
        }



    }

 
}
function organizeHelper(src,dest)
{
    let childNames=fs.readdirSync(src)

    
    for(let i=0;i<childNames.length;i++)
    {
        let childPath=path.join(src,childNames[i])
        let isFile=fs.lstatSync(childPath).isFile()
        if(isFile)
        {
            let category=getCategory(childNames[i])
           
            sendFiles(childPath,dest,category)
        }
    }

}
function getCategory(name)
{
    let ext=path.extname(name).slice(1)

    for(let type in types){
      
      let currentType=types[type]
      for(let i=0;i<currentType.length;i++)
      {if(ext==currentType[i]){
            return type;
        }
      }
        
    }
    return "others"
      
}
function sendFiles(src,dest,category)
{
    let categoryPath=path.join(dest,category)
       if(fs.existsSync(categoryPath)==false)
       {
           fs.mkdirSync(categoryPath)

       }
      
       let fileName=path.basename(src)
       let destPathFile=path.join(categoryPath,fileName)
       
      fs.copyFileSync(src,destPathFile)
      fs.unlinkSync(src)
       console.log(fileName+"Copoied to"+category);

       


}

