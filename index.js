const fs = require("fs");
const fse = require("fs-extra");
const readline = require("readline-sync");

/**
 * @param {string} path
 * @returns {string[]}
 */
const getFiles = (path) => {
    const files = fs.readdirSync(path);
    let result;
    files.forEach((file) => {
        if (fs.statSync(`${path}/${file}`).isDirectory())
            getFiles(`${path}/${file}`).forEach((f) => files.push(`${path}/${file}/${f}`));
        result = files;
    });
    result = result.filter((f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg"));
    result.forEach((f, i) => result[i] = removeDuplicate(f));
    return result;
}

const files = getFiles("textures");

const ask = () => {
    const name = readline.question("Enter the name of the texture: ").toLowerCase().replace(/( )/g, "").split(",");
    if (!name.length) process.exit();
    const wantFiles = files.filter((f) => name.every((v) => f.toLowerCase().includes(v)));
    if (wantFiles.length) {
        fs.readdirSync("matches").forEach((f) => fs.rmSync("matches/" + f));
        wantFiles.forEach((f, i) => {
            try {
                fse.copySync(f, `matches/${f.split("/")[f.split("/").length - 1]}`);
                fs.renameSync(`matches/${f.split("/")[f.split("/").length - 1]}`, `matches/${f.replace(/(\/)/g, "-")}`);
                console.log(`${i+1}:`, f);
            } catch { console.log(`${i+1}:`, f, "(Error)");}
            
            
            
        });
    } else console.log("No files found.");
    ask();
}; ask();

function removeDuplicate (text) {
    const lines = text.split("/");
    const result = [];
    lines.forEach((line) => {
        if (!result.includes(line)) result.push(line);
    });
    return result.join("/");
}
