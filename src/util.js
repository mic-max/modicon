'use strict'

function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

function wildcardToRegExp(str) {
    function regExpEscape(str) {
        return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    }
    return new RegExp(`^${str.split(/\*+/).map(regExpEscape).join('.*')}$`)
}

function addModToObj(obj, img, wildcards) {
    // TODO optional group_id, use to group related mods in UI, and for removing an icon pack from a group_id
    // manually created mods can omit this field
    obj[uuidv4()] = {img, wildcards}
}

function prependBase64(img) {
    return `data:image/png;base64,${img}`
}

function addRowToTable(table, tableBody, imgUrl, pageUrl, modGuid) {
    // Creating Elements
    let tr = document.createElement('tr')
    let td_icon = document.createElement('td')
    let td_file = document.createElement('td')
    let td_delete = document.createElement('td')
    let td_icon_img = document.createElement('img')
    let td_file_input = document.createElement('input')
    let td_delete_a = document.createElement('a')

    // Icon
    td_icon.classList.add('has-text-centered')
    td_icon_img.src = prependBase64(imgUrl)

    // File
    td_file_input.classList.add('input', 'is-small', 'is-static')
    td_file_input.value = pageUrl
    td_file_input.type = 'text'
    td_file_input.readOnly = true

    // Delete
    td_delete_a.classList.add('delete', 'is-danger')
    td_delete_a.addEventListener('click', () => {
        // Delete this modification from the modicons array in storage
        // TODO: actually just remove pageUrl from the wildcards array :) ???
        // Don't do above TODO if the inputs are made not readOnly
        browser.storage.sync.remove(modGuid, () => {
            tableBody.removeChild(tr)
            if (tableBody.children.length === 0)
                table.style.display = 'none'
            // TODO: if the wilcards.length === 1 delete entire rule
        })
        // update all bookmarks to reflect new change
        // update all tabs to reflect new change
    })

    // Combining Elements
    td_icon.appendChild(td_icon_img)
    td_file.appendChild(td_file_input)
    td_delete.appendChild(td_delete_a)
    tr.appendChild(td_icon)
    tr.appendChild(td_file)
    tr.appendChild(td_delete)
    tableBody.appendChild(tr)

    // Show table
    table.style.display = 'block'
}

function resetInputs(inputs) {
    for (let input of inputs)
        input.value = ''
}

function createMod(img, wildcards) {
    let mod = {}
    mod[uuidv4()] = {img, wildcards}
    return mod
}

function clearContext(context) {
    context.clearRect(0, 0, SIZE, SIZE)
}

function getResizedCanvasData(originalCanvas) {
    const EMPTY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAH0lEQVQ4T2NkoBAwUqifYdQAhtEwYBgNA1A+Gvi8AAAmmAARf9qcXAAAAABJRU5ErkJggg=='

    const smallCanvas = document.createElement('canvas')
    const smallContext = smallCanvas.getContext('2d')
    smallCanvas.height = ICON_SIZE
    smallCanvas.width = ICON_SIZE
    smallContext.drawImage(originalCanvas, 0, 0, ICON_SIZE, ICON_SIZE)

    const dataUrl = smallCanvas.toDataURL()
    if (dataUrl === EMPTY_PNG)
        return null
    return dataUrl
}
