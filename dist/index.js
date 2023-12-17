"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const getFiles = (path) => {
    const files = [];
    const dir = fs.readdirSync(path);
    dir.forEach((file) => {
        const fullPath = `${path}/${file}`;
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            files.push(fullPath);
        }
        else if (stat.isDirectory()) {
            files.push(...getFiles(fullPath));
        }
    });
    return files;
};
fs.writeFileSync("output.txt", getFiles("./textures").join("\n"));
ask();
function ask() {
    const read = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    read.question("検索したいファイル名を入力してください: ", (input) => {
        if (input === "exit") {
            read.close();
            if (fs.existsSync("./matches")) {
                fs.rmSync("./matches", { recursive: true });
            }
            return;
        }
        read.close();
        const files = getFiles("./textures");
        const result = files.filter((file) => file.includes(input));
        if (fs.existsSync("./matches")) {
            fs.rmSync("./matches", { recursive: true });
        }
        fs.mkdirSync("./matches");
        if (result.length === 0) {
            console.log("一致するファイルはありませんでした");
            ask();
            return;
        }
        console.log(`一致したファイルは${result.length}件です`);
        result.forEach((file) => {
            console.log(file);
            fs.copyFileSync(file, `./matches/${file.split("/").pop()}`);
        });
        ask();
    });
}
