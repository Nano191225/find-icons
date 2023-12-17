import * as fs from "fs";
import * as readline from "readline";

const getFiles = (path: string): string[] => {
  const files: string[] = [];
  const dir = fs.readdirSync(path);
  dir.forEach((file) => {
    const fullPath = `${path}/${file}`;
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      files.push(fullPath);
    } else if (stat.isDirectory()) {
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

  read.question("検索したいファイル名を入力してください: ", (input: string) => {
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
