const fs = require("fs/promises");
const {
  STUDENTSDATA_TEMP_FOLDER,
  STUDENT_INSCRIPTIONS_FOLDER,
} = require("../config/paths");
const createDataFolders = async () => {
  //The students data folder doesnt need to be created because is created by the mounted volume

  try {
    //Check if folder exists
    await fs.access(STUDENTSDATA_TEMP_FOLDER);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(STUDENTSDATA_TEMP_FOLDER);
    } catch (error) {
      throw error;
    }
  }

  try {
    //Check if folder exists
    await fs.access(STUDENT_INSCRIPTIONS_FOLDER);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(STUDENT_INSCRIPTIONS_FOLDER);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = createDataFolders;
