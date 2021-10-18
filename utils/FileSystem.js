/* global process */

const fs = require("fs");

const AbsPath = require("path");

const FileSystem = {
  path(path) {
    return AbsPath.resolve(process.cwd() + "/" + path);
  },
  //
  // GET ALL FILES IN A DIRECTORY, EXCLUDING index.js
  //
  getDirectoryFiles(dir) {
    const absDir = FileSystem.path(dir);
    try {
      const dirPath = fs.realpathSync(absDir);
      const files = fs.readdirSync(dirPath).filter((file) => {
        const isValidFile = file && file.indexOf(".") !== 0 && file !== absDir && file !== "index.js";
        return isValidFile;
      });

      return files;
    } catch (err) {
      if (err instanceof Error && err.code === "ENOENT") {
        console.error(`Directory ${absDir} not found.`);
        return [];
      }
      throw err;
    }
  },
  //
  // READ FROM A FILE
  //
  readFile(filePath) {
    const absPath = FileSystem.path(filePath);
    const buf = fs.readFileSync(absPath);
    const content = buf.toString();
    return content;
  },
  //
  // CREATE OR UPDATE A FILE
  //
  writeFile(filePath, content) {
    const absPath = FileSystem.path(filePath);
    fs.writeFileSync(absPath, content);
  },
};

module.exports.FileSystem = FileSystem;
