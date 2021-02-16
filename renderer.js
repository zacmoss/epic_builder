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
    {"page": "create_epic", "id": "create_epic_page"},
    {"page": "edit_epic", "id": "edit_epic_page"},
    {"page": "loading", "id": "loading_page"}
]

/* 
*
* Should this just be in like settings somewhere
* and be system-wide like you decide you want all
* titles on epic to be 24px?
*
* Then, you would maybe save changes to those custom
* settings before you leave the page?
*

custom styles structure = [
    {"key": {"type": "class or id"}}
]
*/
var custom_styles = {}

var state = {
    "pages": pages,
    "epics": [],
    "selected_epic": undefined,
    "loading": false,
    "custom_styles": custom_styles
}

function updateState(key, value) {
    state[key] = value
    console.log('state updated')
    console.log(state)
}



// INITIAL LOAD LOGIC

document.addEventListener("DOMContentLoaded", function(event) { 
    /*
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
    */
   getEpics()
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






// UPDATE EPIC LOGIC
var edit_button = document.getElementById('edit_epic_button')
edit_button.addEventListener('click', () => {
    console.log('clicked!')

    // show edit epic page, load in with selected epic data
    populateEditPage(state.selected_epic)
    cyclePage("edit_epic_page")
    //populateEditPage(state.selected_epic)

})
var cancel_edit_button = document.getElementById('cancel_edit_button')
cancel_edit_button.addEventListener('click', () => {
    console.log('clicked!')

    var cancel_confirmed = confirm("Are you sure you want to cancel these changes to the " + state.selected_epic.name + " epic?")
    if (cancel_confirmed) {
        populateEpicPage(state.selected_epic)
        cyclePage("epic_page")
    }
})
var save_button = document.getElementById('save_changes_button')
save_button.addEventListener('click', () => {
    console.log('save changes clicked')
    var title = document.getElementById('edit_epic_page_title_input').value
    var description = document.getElementById('edit_epic_page_description_input').value
    let epic = {
        'id': state.selected_epic.id,
        'old_name': state.selected_epic.name,
        'name': title,
        'description': description
    }

    var update_confirmed = confirm("Are you sure you want to make these changes to the " + state.selected_epic.name + " epic?")
    
    if (update_confirmed) {
        ipcRenderer.send('update-epic', epic)

        cyclePage("loading_page")

        ipcRenderer.on('asynchronous-reply-updated-epic', (event, arg) => {
            console.log(arg)
            if (arg) {
                console.log('Successfully updated epic.')
                getEpics()
            } else {
                console.log('There was an error on update of the epic.')
                // TODO: maybe show error page
            }
        })
    }
})







// DELETE EPIC LOGIC
var delete_button = document.getElementById('delete_epic_button')
delete_button.addEventListener('click', () => {
    console.log('clicked!')
    console.log(state)
    var delete_confirmed = confirm("Are you sure you want to delete " + state.selected_epic.name + " epic?")
    if (delete_confirmed) {
        ipcRenderer.send('delete-epic', state.selected_epic)

        // TODO: need to put some kind of loading disable activity thing here
        cyclePage("loading_page")
        // disable here somehow

        ipcRenderer.on('asynchronous-reply-deleted-epic', (event, arg) => {
            console.log(arg)
            if (arg) {
                console.log('Successfully deleted epic.')
                getEpics()
            } else {
                console.log('There was an error on delete of the epic.')
                // TODO: maybe show error page
            }
        })
    }
})





// CREATE EPIC LOGIC
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
    document.getElementById('create_epic_page_title_input').value = ''
    document.getElementById('create_epic_page_description_input').value = ''
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
                    updateState("selected_epic", view_epic)
                }
            })

            if (!view_epic) {
                console.log('No epic exists with that id!')
            }

            populateEpicPage(view_epic)
            cyclePage("epic_page")
        })
    })
    

    // get next epic id number
    var next_id = (Math.max(...epic_ids)) + 1;
    updateState('next_id', next_id)

    // populate main view with first epic or selected epic on case of update
    var current_epic = state.selected_epic ? state.selected_epic : epics[0];
    updateState("selected_epic", current_epic)

    console.log('populating epic_page')
    populateEpicPage(current_epic)

    console.log('cycling to epic_page')
    cyclePage('epic_page')
}

// meant to be a function that just runs initially
function populateEpicPage(epic) {
    console.log('populating epic_page with ' + epic.name + ' ' + epic.description + '.')
    document.getElementById("epic_page_epic_name").textContent = epic.name
    document.getElementById("epic_page_epic_description").textContent = epic.description
}

function populateEditPage(epic) {
    console.log('clicked edit')
    console.log(epic)
    document.getElementById("edit_epic_page_title_input").value = epic.name
    document.getElementById("edit_epic_page_description_input").value = epic.description
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

function getEpics() {
    ipcRenderer.send('get-epics', null)

    console.log('sent get-epics')

    // hide elements not showing on first page -- inline sytle didn't work...
    cyclePage('epic_page') // this is just here to display none all the extra pages

    // TODO - make the above dynamic - should have state keep track of display styles depending on state page

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log('epics returned')
        console.log(arg)
        updateState("epics", arg)
        if (state.selected_epic) {
            state.epics.forEach(function (epic, index) {
                if (epic.id == state.selected_epic.id) {
                    updateState("selected_epic", epic)
                }
            })
        }
        
        generateEpicHtml(arg, state)
    })
}
