const fs = require("fs/promises");

const createDataFolders = async () => {
  //The students data folder doesnt need to be created because is created by the mounted volume
  let tempFolderPath = "/studentsdata/temp_files";

  let studentsInscriptionsFolderPath = "/studentsdata/students_inscriptions";

  try {
    //Check if folder exists
    await fs.access(tempFolderPath);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(tempFolderPath);
    } catch (error) {
      throw error;
    }
  }

  try {
    //Check if folder exists
    await fs.access(studentsInscriptionsFolderPath);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(studentsInscriptionsFolderPath);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = createDataFolders;
