const fs = require('fs');
const path = require('path');

function moveAndDeleteFolders(rootFolder) {
    if (!fs.existsSync(rootFolder)) {
        console.error(`Error: The specified root folder "${rootFolder}" does not exist.`);
        return;
    }

    fs.readdirSync(rootFolder).forEach(folderName => {
        const folderPath = path.join(rootFolder, folderName);

        // Check if it's a directory
        if (fs.statSync(folderPath).isDirectory()) {
            const parentFolderName = path.basename(path.dirname(folderPath));

            // Check if the folder name matches its parent
            if (folderName === parentFolderName) {
                // Move contents to the parent folder
                const parentFolderPath = path.dirname(folderPath);
                fs.readdirSync(folderPath).forEach(item => {
                    const sourcePath = path.join(folderPath, item);
                    const destinationPath = path.join(parentFolderPath, item);
                    fs.renameSync(sourcePath, destinationPath);
                });

                // Delete the folder
                fs.rmdirSync(folderPath);
            }

            // Recursively process subdirectories
            moveAndDeleteFolders(folderPath);
        }
    });
}


// Replace 'path/to/your/root/folder' with the actual path to your root folder
const rootFolderPath = '.';
moveAndDeleteFolders(rootFolderPath);