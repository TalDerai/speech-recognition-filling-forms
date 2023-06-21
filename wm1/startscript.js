//var cmd=require('node-cmd'); cmd.run('npx next start -p 3010');
const { exec } = require("child_process");

exec("npx next start -p 3009", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});