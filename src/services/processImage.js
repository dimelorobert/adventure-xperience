import sharp from "sharp";
import fsExtra from "fs-extra";
import path from "path";
import uuid from 'uuid'


async function processImages(image) {
  //Random generated name to save it
  let savedFileName = `${uuid.v1()}.jpg`;

  //Ensure path
  await fsExtra.ensureDir(image.path);

  //Process image
  let finalImage = sharp(image.file.data);

  //Make sure image is not wider than 500px
  let imageInfo = await finalImage.metadata();

  if (imageInfo.width > image.width && imageInfo.height > image.height) {
    finalImage.resize(image.width, image.height);
  }
  //Save image
  await finalImage.toFile(path.join(image.path, savedFileName));
  return savedFileName;
}

export default processImages;
