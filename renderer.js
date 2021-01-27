// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// this appears to be the javascript file for the index...
//import { ipcRenderer } from './node_modules/electron'
//var ipcRenderer = require('electron').ipcRenderer
const ipcRenderer = require('electron').ipcRenderer;

// STATE
var pages = [
    {"page": "home", "id": "epic_page"},
    {"page": "create_epic", "id": "create_epic_page"}
]

var state = {
    "pages": pages,
    "epics": []
}

function updateState(key, value) {
    state[key] = value
    console.log('state updated')
    console.log(state)
}



// INITIAL LOAD LOGIC

document.addEventListener("DOMContentLoaded", function(event) { 
    ipcRenderer.send('get-epics', null)

    // hide elements not showing on first page -- inline sytle didn't work...
    //document.getElementById("create_epic_page").style.display = 'none'
    cyclePage('epic_page') // this is just here to display none all the extra pages

    // TODO - make the above dynamic - should have state keep track of display styles depending on state page

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg)
        //state.epics = arg
        updateState("epics", arg)
        generateEpicHtml(arg, state)
    })
});





// CREATING EVENT LISTENERS

// return to home page
var home_button = document.getElementById('home_button')
home_button.addEventListener('click', () => {
    console.log('clicked home button!')
    cyclePage("epic_page")
})

// Show create_epic page form
var add_button = document.getElementById('add_epic_button')
add_button.addEventListener('click', () => {
    console.log('clicked!')
    // TODO: check epic name versus existing epic names and if duplicate send back error?
    cyclePage("create_epic_page")
})

// show epic page event listener has to be created after sidebar populated

var update_button = document.getElementById('update_epic_button')
update_button.addEventListener('click', () => {
    console.log('clicked!')
    let epic = {
        'name': 'Test Epic',
        'description': 'This is a test description'
    }
    ipcRenderer.send('update-epic', epic)
})

var delete_button = document.getElementById('delete_epic_button')
delete_button.addEventListener('click', () => {
    console.log('clicked!')
    let epic = {
        'name': 'Test Epic',
        'description': 'This is a test description'
    }
    ipcRenderer.send('delete-epic', epic)
})

// Create Epic Logic
var create_epic_button = document.getElementById('create_epic_button')
create_epic_button.addEventListener('click', () => {
    var title = document.getElementById('create_epic_page_title_input').value
    var description = document.getElementById('create_epic_page_description_input').value
    console.log('clicked create epic!')
    let epic = {
        'id': state.next_id,
        'name': title,
        'description': description
    }
    console.log(epic)
    ipcRenderer.send('add-epic', epic)
})










// HELPER FUNCTIONS

// receive initial epics data from preload?
function generateEpicHtml(epics, state) {

    // clear html
    document.getElementById("side_nav").innerHTML = "";

    // TODO: reorganize epics by date updated here

    var epic_ids = []

    // populate epics side nav
    epics.forEach(function (epic, index) {
        var side_div = document.createElement("div");
        var title_text_node = document.createElement("P");
        title_text_node.innerText = epic.name;
        title_text_node.className = "epic_link_sidebar"
        title_text_node.id = epic.id

        // get all epic ids
        console.log("next number id is " + epic.id)
        epic_ids.push(epic.id)

        side_div.appendChild(title_text_node);
        document.getElementById("side_nav").appendChild(side_div);
    })

    // TODO - break the below into a helper function?
    // Show epic page on click of sidebar link
    document.querySelectorAll('.epic_link_sidebar').forEach(view_epic_button => {
        view_epic_button.addEventListener('click', () => {
            console.log('clicked!')
            // TODO: check epic name versus existing epic names and if duplicate send back error?
            var view_epic
            var id = view_epic_button.id
            state.epics.forEach(function (epic, index) {
                if (epic.id == id) {
                    view_epic = epic
                }
            })

            if (!view_epic) {
                console.log('No epic exists with that id!')
            }

            populateHomePage(view_epic)
            cyclePage("epic_page")
        })
    })
    

    // get next epic id number
    var next_id = (Math.max(...epic_ids)) + 1;
    updateState('next_id', next_id)

    // populate main view with first epic
    var current_epic = epics[0];

    console.log('populating epic_page')
    populateHomePage(current_epic)

    console.log('cycling to epic_page')
    cyclePage('epic_page')
}

// meant to be a function that just runs initially
function populateHomePage(epic) {
    console.log('populating epic_page with ' + epic.name + ' ' + epic.description + '.')
    document.getElementById("epic_page_epic_name").textContent = epic.name
    document.getElementById("epic_page_epic_description").textContent = epic.description
}

function cyclePage(newPageId) {
    state.pages.forEach(function (page, index) {
        if (page.id == newPageId) {
            document.getElementById(page.id).style.display = "block"
            updateState("page", page.page)
        } else {
            document.getElementById(page.id).style.display = "none"
        }
    })
}
