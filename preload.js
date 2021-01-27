// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  // this is kind of cool
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  for (const type of ['app']) {
    replaceText(`${type}-version`, process.env.npm_package_version)
  }

  /*
  // load json epic files
  const fs = require('fs');
  //var path = require('path');
  //require('./data/epics')

  var moveFrom = "./data/epics/";

  // Loop through all the files in the temp directory
  let objArr = []
  fs.readdir(moveFrom, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    // loop through json epic file system and store each epic text in an array of objects...
    console.log('commencing loop of files')
    files.forEach(function (file, index) {
      console.log('file parsing')
      console.log(file)
      //let rawdata = fs.readFileSync(moveFrom + file);
      //console.log(rawdata)
      //let student = JSON.parse(rawdata);
      var obj = JSON.parse(fs.readFileSync(moveFrom + file));
      //var obj = JSON.parse(fs.readFile(moveFrom + file));
      objArr.push(obj)
      console.log('right after push')
      console.log(objArr)
    })
    console.log(objArr)

  })
  */

  

})
