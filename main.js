// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

console.log(app.getVersion())

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [],
      worldSafeExecuteJavaScript: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // send initial epics data to renderer?
  //ipcMain.send('asynchronous-message', 'ping')
  

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })







  // GET EPICS LOGIC
  ipcMain.on('get-epics', (event, arg) => {
    const fs = require('fs');
    var filepath = "./data/epics/";

    // Loop through all the files in the temp directory
    let objArr = []
    fs.readdir(filepath, function (err, files) {
      if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }

      // loop through json epic file system and store each epic text in an array of objects...
      console.log('commencing loop of files')
      files.forEach(function (file, index) {
        var obj = JSON.parse(fs.readFileSync(filepath + file));
        objArr.push(obj)
      })
      console.log('before send')
      console.log(objArr)
      event.sender.send('asynchronous-reply', objArr)
    })
    /*
    var epics = getAllEpics()
    console.log('all epics')
    console.log(epics)
    event.sender.send('asynchronous-reply', epics)
    */
  })






 // ADD EPIC LOGIC
 ipcMain.on('add-epic', (event, arg) => {
  const fs = require('fs');

  let filepath = './data/epics/'
  let epic_name = getEpicNaming(arg)

  // TODO: assign an epic id on random number generation
  // TODO: but check all current ids and if rando isn't currently in use, use it, else generate rando again

  try {
    fs.writeFileSync(path.resolve(filepath, epic_name), JSON.stringify(arg))

    // repetitive code, but not sure how to async await this yet
    //var filepath = "./data/epics/";

    // Loop through all the files in the temp directory
    let objArr = []
    fs.readdir(filepath, function (err, files) {
      if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }

      // loop through json epic file system and store each epic text in an array of objects...
      console.log('commencing loop of files')
      files.forEach(function (file, index) {
        var obj = JSON.parse(fs.readFileSync(filepath + file));
        objArr.push(obj)
      })

      event.sender.send('asynchronous-reply', objArr)
    })
  } catch (err) {
    console.log('error updating epic')
    console.log(err)
  }
 })






 // UPDATE EPIC LOGIC
 ipcMain.on('update-epic', (event, arg) => {
   console.log('request to update epic')
   console.log(arg)
  let filepath = './data/epics/'
  let old_epic_name = getOldEpicNaming(arg)
  delete arg['old_name']
  try {
    fs.unlinkSync(filepath + old_epic_name);
    console.log('successfully deleted ' + filepath + old_epic_name);
    let new_epic_name = getEpicNaming(arg)
    fs.writeFileSync(path.resolve(filepath, new_epic_name), JSON.stringify(arg))
    console.log('successfully updated epic')
    event.sender.send('asynchronous-reply-updated-epic', 1)
  } catch (err) {
    console.log('error updating epic')
    console.log(err)
    event.sender.send('asynchronous-reply-updated-epic', 0)
  }
 })



 // UPDATE EPIC STATUS ONLY
 ipcMain.on('update-epic-status', (event, arg) => {
  let filepath = './data/epics/'
  let old_epic_name = getOldEpicNaming(arg)
  delete arg['old_name']
  try {
    fs.unlinkSync(filepath + old_epic_name);
    console.log('successfully deleted ' + filepath + old_epic_name);
    let new_epic_name = getEpicNaming(arg)
    fs.writeFileSync(path.resolve(filepath, new_epic_name), JSON.stringify(arg))
    console.log('successfully updated epic')
  } catch (err) {
    console.log('error updating epic')
    console.log(err)
  }
 })





 // DELETE EPIC LOGIC
 ipcMain.on('delete-epic', (event, arg) => {
  let filepath = './data/epics/'
  let epic_name = getEpicNaming(arg)
  try {
    fs.unlinkSync(filepath + epic_name);
    console.log('successfully deleted ' + filepath + epic_name);

    // SHOULD I ADD GET EPIC LOGIC HERE RATHER THAN ANOTHER SERVER REQUEST FROM FRONT END?

    event.sender.send('asynchronous-reply-deleted-epic', 1)
  } catch (err) {
    console.log('error deleting epic')
    console.log(err)
    event.sender.send('asynchronous-reply-deleted-epic', 0)
  }
 })
})






// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function getEpicNaming(epic_obj) {
  console.log('epic_obj')
  console.log(epic_obj)
  let name = epic_obj.name + '.json'
  let epic_name = name.replaceAll(" ", "_")
  return epic_name
}

function getOldEpicNaming(epic_obj) {
  let name = epic_obj.old_name ? epic_obj.old_name + '.json' : epic_obj.name + '.json'
  let epic_name = name.replaceAll(" ", "_")
  return epic_name
}

// doesn't work b/c not async, need to sort that out to be able to abstract this
/*
function getAllEpics() {
  const fs = require('fs');
  var filepath = "./data/epics/";

  // Loop through all the files in the temp directory
  let objArr = []
  fs.readdir(filepath, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    // loop through json epic file system and store each epic text in an array of objects...
    console.log('commencing loop of files')
    files.forEach(function (file, index) {
      var obj = JSON.parse(fs.readFileSync(filepath + file));
      objArr.push(obj)
    })
    console.log(objArr)
    return objArr
  })
}
*/
