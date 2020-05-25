'use strict'
// require('../css/app.scss')

window.browser = require('webextension-polyfill')

import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'
import Popup from './Popup.vue'

import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.component('popup', Popup)

new Vue({
    render: h => h(App)
}).$mount('#app')

// -----------------

const SIZE = 128
const ICON_SIZE = 16

// Important DOM Elements
const pageUrlInput = document.getElementById('page_url')
const imgUrlInput = document.getElementById('img_url')
const imgFileInput = document.getElementById('img_file')
const modifyButton = document.getElementById('modify')
const imgHidden = document.getElementById('img_hidden')
const table = document.getElementById('table')
const tableBody = document.getElementById('table_body')
const canvas = document.getElementById('img_preview')

// Derived Variables
const context = canvas.getContext('2d')

// Initialization
canvas.width = canvas.height = SIZE

// Localization Setup
pageUrlInput.placeholder = browser.i18n.getMessage('pageUrlPlaceholder')
imgUrlInput.placeholder = browser.i18n.getMessage('imgUrlPlaceholder')
document.getElementById('or_para').innerText = browser.i18n.getMessage('or')
document.getElementById('browse_span').innerText = browser.i18n.getMessage('browseFilesButton')
document.getElementById('preview_para').innerText = browser.i18n.getMessage('previewImgLabel')
document.getElementById('modify_span').innerText = browser.i18n.getMessage('modifyButton')
document.getElementById('icon_col').innerText = browser.i18n.getMessage('iconColumn')
document.getElementById('page_col').innerText = browser.i18n.getMessage('pageColumn')

// TODO: Turn this loop into a function as it's being used elsewhere
browser.storage.sync.get(null, (items) => {
    for (const [guid, mod] of Object.entries(items)) {
        for (const wildcard of mod.wildcards) {
            addRowToTable(table, tableBody, mod.img, wildcard, guid)
        }
    }
})  

// Image URL Input
// TODO: add a debounce to this to reduce amount of potential requests
imgUrlInput.addEventListener('input', () => {
    // TODO: quit early if imgUrlInput.value is NOT a valid URL
    imgHidden.src = imgUrlInput.value
    imgHidden.addEventListener('load', () => {
        clearContext(context)
        context.drawImage(imgHidden, 0, 0, SIZE, SIZE)
    })
    imgHidden.addEventListener('error', () => {
        clearContext(context)
        // TODO: Show that image loading failed, red border
    })
})

// Image File Input
imgFileInput.addEventListener('change', () => {
    if (imgFileInput.files && imgFileInput.files[0]) {
        let FR = new FileReader()
        FR.onload = (e) => {
            let img = new Image()
            img.addEventListener('load', () => {
                clearContext(context)
                context.drawImage(img, 0, 0, SIZE, SIZE)
            })
            img.src = e.target.result
        }
        FR.readAsDataURL(imgFileInput.files[0])
    }
})

// Modify Button
modifyButton.addEventListener('click', () => {
    const img = getResizedCanvasData(canvas)
    const wildcards = pageUrlInput.value.split(',')

    // TODO: Prevent any duplicate wildcard values
    if (!img || wildcards.length === 1 && !wildcards[0])
        // TODO: show which inputs are invalid, red outline
        return

    const mod = createMod(img.replace('data:image/png;base64,', ''), wildcards)
    const guid = Object.keys(mod)[0]
    // Save this mod to storage
    browser.storage.sync.set(mod, () => {
        for (const wildcard of wildcards)
            addRowToTable(table, tableBody, mod[guid].img, wildcard, guid)
        resetInputs([pageUrlInput, imgUrlInput, imgFileInput])
        clearContext(context)
    })
    // update all bookmarks that match the added wildcard pattern to reflect new change
        // making a head request to the page?
    // update all tabs to reflect new change
})

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter')
        modifyButton.click()
})
