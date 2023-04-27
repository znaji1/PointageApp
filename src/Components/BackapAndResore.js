import React, { useState } from "react";
import { dialog } from "electron";
import path from "path";
import extract from "extract-zip";

const BackupAndRestore = () => {
  const { dialog, remote } = require("electron").remote;
  const [selectedFolder, setSelectedFolder] = useState(null);
  const selectFolder = async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    setSelectedFolder(result.filePaths[0]);
  };

  const extractFiles = async (files) => {
    const tempDir = `${__dirname}/temp`;
    if (!remote.require("fs").existsSync(tempDir)) {
      remote.require("fs").mkdirSync(tempDir);
    }
    const extractedFiles = [];
    for (const file of files) {
      const tempFile = `${tempDir}/${file.name}`;
      remote.require("fs").copyFileSync(file.path, tempFile);
      await extract(tempFile, { dir: tempDir });
      extractedFiles.push(tempFile);
    }
    return extractedFiles;
  };

  const saveFiles = (files, destPath) => {
    if (!remote.require("fs").existsSync(destPath)) {
      remote.require("fs").mkdirSync(destPath);
    }
    for (const file of files) {
      const fileName = path.basename(file, path.extname(file));
      const fileContent = remote.require("fs").readFileSync(file);
      const destFile = `${destPath}/${fileName}.txt`;
      remote.require("fs").writeFileSync(destFile, fileContent);
    }
  };

  const startProcess = async () => {
    if (!selectedFolder) return;
    const files = remote
      .require("fs")
      .readdirSync(selectedFolder)
      .filter((file) => /\.(rar|zip)$/i.test(file))
      .map((file) => ({ name: file, path: `${selectedFolder}/${file}` }));
    const extractedFiles = await extractFiles(files);
    saveFiles(extractedFiles, `${__dirname}/backup`);
    console.log("Backup successful");
  };
  return (
    <>
      <button onClick={selectFolder}>Select Folder</button>
      <button onClick={startProcess}>Start Backup</button>
    </>
  );
};
export default BackupAndRestore;
