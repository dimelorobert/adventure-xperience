import sharp from "sharp";
import fsExtra from "fs-extra";
import path from "path";
import { v1 as uuidv1 } from "uuid";

async function processFiles(uploadedImage) {
    try {
      // Random File name to be saved
      const savedFileName = `${uuidv1()}.jpg`;

      // Ensure the uploads path exists
      await fsExtra.ensureDir(uploadedImage.path);

      // Process image
      const finalImage = sharp(uploadedImage.file.data);

      //Make sure image is not wider than 500px
      let imageInfo = await finalImage.metadata();

      if (
        imageInfo.width > uploadedImage.width &&
        imageInfo.height > uploadedImage.height
      ) {
        finalImage.resize(uploadedImage.width, uploadedImage.height);
      }

      // Save image
      await finalImage.toFile(path.join(uploadedImage.path, savedFileName));

      return savedFileName;
    }
    catch (error) {
      console.log('FROM PROCESS FILE :::',error);
    }
}

export default processFiles;
