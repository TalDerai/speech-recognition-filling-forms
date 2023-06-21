//var cmd=require('node-cmd'); cmd.run('npx next start -p 3010');
const { exec } = require("child_process")
//import {exec} from "child_process"

exec("npm run dev", (error, stdout, stderr) => { //node ./index.js
    if (error) {
        console.log(`error: ${error.message}`)
        return
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
    }
    console.log(`stdout: ${stdout}`)
})