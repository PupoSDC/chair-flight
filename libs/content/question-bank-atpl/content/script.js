const fs = require("fs");
const path = require("path");

function createAnnexes(folderPath) {
  const annexesFolder = path.join(folderPath, "annexes");
  const gitkeepFile = path.join(annexesFolder, ".gitkeep");
  const annexesJsonFile = path.join(folderPath, "annexes.json");

  // Create annexes folder and .gitkeep file
  fs.mkdirSync(annexesFolder, { recursive: true });
  fs.writeFileSync(gitkeepFile, "");

  // Create annexes.json file with an empty array
  fs.writeFileSync(annexesJsonFile, "[]");
}

function processFolders(folderPath) {
  const items = fs.readdirSync(folderPath);

  items.forEach((item) => {
    const itemPath = path.join(folderPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    if (isDirectory) {
      processFolders(itemPath);
      createAnnexes(itemPath);
    }
  });

  // Create annexes folder and .gitkeep file for the current folder
  createAnnexes(folderPath);
}

// Replace 'your/top/folder' with the root folder path
const rootFolder = ".";
processFolders(rootFolder);
