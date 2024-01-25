import * as fs from "node:fs/promises";

const files = await fs.readdir(".");
const mdFiles = files.filter(f => f.includes(".md"));

for (const file of mdFiles) {
    const content =(await fs.readFile(file)).toString();
    const name = file.split(".md")[0];
    const loId = content.match( /SyllabusReference: (\d+(\.\d*)*)/)?.[1];


    console.log(loId);
    const newContent = content
        .toString()
        .replace(/## Learning Objectives([\s\S]*?)## Summary/, `\`\`\`tsx eval\n<LearningOBjectives learningObjectiveId={${loId}} />\n\`\`\`\n\n## Summary`)
        .replace("SyllabusReference: ", "learningObjectiveId: ")
        .replace("Title: ", "title: ")
    await fs.rm(file);
    await fs.writeFile(`${name}.md`, newContent); 

}