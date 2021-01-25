import getConnection from "../../../database";
import helpers from "../../../helpers";

import path from "path";

const { UPLOADS_DIR } = process.env;

// we open connection to db
let connectionDB;
async function uploadImage(request, response, next) {
  try {
    // we open connection to db
    connectionDB = await getConnection();

    const { id } = request.params;
    const { image } = request.files;

    // we create a path to host the user files
    const userImagePath = path.join(
      __dirname,
      `../../../${UPLOADS_DIR}`,
      `./users/${id}/images/`
    );

    // we check if exists an image to delete for save another
    const [
      imageExist,
    ] = await connectionDB.query(`SELECT image FROM users WHERE id=?`, [id]);

    if (imageExist !== null) {
      await helpers.deleteFolder(userImagePath);
    }

   
    let savedFileName;

    let uploadImageBody = {
      file: image,
      path: userImagePath,
      width: 300,
      height: 300,
    };
    
    savedFileName = path.join(
      `./uploads/users/`,
      `${id}`,
      `./images/`,
      await helpers.processAndSavePhoto(uploadImageBody)
    );

    const imageChanged = {
      id: id,
      image: savedFileName,
    };

    await connectionDB.query(`UPDATE users SET ?`, imageChanged);

    response
      .status(200)
      .json({ message: "La imagen fue subida correctamente" });
  } catch (error) {
    next(error);
  } finally {
    await connectionDB.release();
  }
}

export default uploadImage;
