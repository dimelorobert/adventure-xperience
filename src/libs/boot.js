'use strict';

//////////////// SERVER //////////////////////
module.exports = (app) => {
  const PORT = app.get('port');

  app.listen(PORT, () => {
    console.log(`✔️ 🚀 >>>> Server working on PORT ${PORT}  <<<< 🚀 ✔️`);
  });
};
