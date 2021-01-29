import getConnection from "../../../database";
import { processFiles } from "../../../services";
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

    // we check if exists an image to delete it and save another
    const [
      imageExist,
    ] = await connectionDB.query(`SELECT image FROM users WHERE id=?`, [id]);

    if (imageExist !== null) {
      await helpers.deleteFile(
        path.join(__dirname, `../../../public/${imageExist[0].image}`)
      );
    }

    let savedFileName;
    let uploadImageBody = {
      file: image,
      path: userImagePath,
      width: 300,
      height: 300,
    };
    let processedFile = await processFiles(uploadImageBody);
    savedFileName = path.join(
      `./uploads/users/`,
      `${id}`,
      `./images/`,
      `./${processedFile}`
    );

    await connectionDB.query(`UPDATE users SET image=? WHERE id=?`,[savedFileName, id]);

    response
      .status(200)
      .json({ message: "La imagen fue subida correctamente" });
  } catch (error) {
    response.status(401).send({
      message: "Ha ocurrido un error al subir la imagen",
      ...error,
    });
  } finally {
    await connectionDB.release();
  }
}

export default uploadImage;
