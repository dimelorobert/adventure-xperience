let savedFileName;
if (request.files && request.files.image) {
  let fileUploaded = {
    file: request.files.image,
    path: path.join(__dirname, `../${UPLOADS_DIR}` /*, `${emailUuid}`*/),
    width: 300,
    height: 300,
  };
  console.log("CONSOLE LOG FILE IMAGE PATH", fileUploaded.path);
  // we define location path and image size values
  let savedFileNameProcess = await helpers.processAndSavePhoto(fileUploaded);

  savedFileName = path.join(`./uploads/users/`, savedFileNameProcess);

  console.log(savedFileName);
}
