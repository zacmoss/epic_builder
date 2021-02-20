## Technical

The html in index.html acts as shells for content. In the future, I'd like to separate those out in modules under views, but we had issues with grabbing classes for html pages which hadn't been loaded yet.

The client logic exists in renderer.js. The logic starts with the getEpics function which sends a request to the backend (main.js) for the existing epics in the data directory. The cyclePage function sets all "pages" (which are just divs on index.html) to display: none which are not the epics_page. So, essentially all those initial "pages" are there but set to display: none, except for the epics_page div. We then load in the first epic returned from the request to the backend into the epics_page div.

The CRUD logic triggered by the buttons are just on click events set up in renderer.js. Each of them send a request to the backend (main.js) to do certain things. After each one, we currently just display the "loading_page" and send another request with the getEpics function which also re-loads the "epics_page".



## To Do
- Fix issue with large description for epic and attempt at scrollable height
- Fix bug, on delete of epic, local state loads the old deleted epic if it was the first one
- Logic that allows ranking of epics or starring on epic page, starred epic would be first to show
- Settings page add checkbox for order by ranked epics
- Settings page with custom styling option





# electron-quick-start

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
