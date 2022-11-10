var multer = require('multer');
const fs = require('fs');

module.exports={
    // argumen 1 directory : penyimpanan
    // argumen 2 filePrefix : namaFile 
    uploader:(directory,filePrefix)=>{
        // argumen directory
        let defaultDir='./public';
        // config multer
        const storageUploader=multer.diskStorage({
            destination:(req,file,cb)=>{
                // lokasi penyimpanan
                const pathDir = directory ? defaultDir + directory : defaultDir;
                // Pemerikasaan pathDir
                if(fs.existsSync(pathDir)){
                    // Jika dir ada maka dijalankan cb u/ menyimpan data
                    console.log(`dir ${pathDir} exist`)
                    cb(null,pathDir)
                }else{
                    fs.mkdir(pathDir,{recursive:true},(err)=>{
                        //recursive true berfungsii untuk membuat directory di dalam directory
                        if(err){
                            console.log('error make dir:', err)
                        }
                        console.log(`success created ${pathDir}`)
                        return cb(err,pathDir)
                    })
                }
            },
            // argumen 2, fileprefix
            
            // bila dirubah
            filename:(req,file,cb)=>{
                let ext = file.originalname.split('.');
                // jika tidak ingin di ubah, tidak usah digunakan atau cukup gunakan
                //cb(null,file.originalname)

                // Jika di rubah
                let newName = filePrefix +Date.now()+'.'+ ext[ext.length -1]
                cb(null,newName);

            }
        })

        // config filtering extension
        const fileFilter = (req,file,cb)=>{
            const extFilter = /\.(jpg|png|webp|jpeg|svg)/;

            if(file.originalname.toLowerCase().match(extFilter)){
                cb(null,true)
            }else{
                cb(new Error('Your File ext are denied', false));
            }
        }
        return multer({storage:storageUploader, fileFilter})
    }
}