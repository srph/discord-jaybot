const rf = require('rimraf')

rf('imgsrc/*', (err) => {
  if (err) {
    console.log(err)
  }
})