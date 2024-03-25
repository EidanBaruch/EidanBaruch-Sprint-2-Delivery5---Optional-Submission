'use strict'

const gQueryOptions = {
    filterBy: { txt: ''},
    page: { idx: 0, size: 2 }
}

var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2} 

var gMemeToEdit = null
var isEditing = false

function onInit() {
    renderGallery()
}

function getMeme() {
    return gMeme
}

function renderGallery() {
    var memes = getFilteredMemes(gQueryOptions, 18)
    var strHtmls = memes.map(meme => `
        <article class="card">
            <img title="Photo of ${meme.category}" 
                src="${meme.url}" 
                alt="Meme category: ${meme.category}"
                onerror="this.src='${meme.url}'" 
                onclick="setImg('${meme.url}')">
        </article> 
    `)
    document.querySelector('.memes-container').innerHTML = strHtmls.join('')
}

function renderMeme() {
    const canvas = document.getElementById('memeCanvas')
    const ctx = canvas.getContext('2d')
    const image = new Image()

    image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        // Render each line of text
        gMeme.lines.forEach((line, idx) => {
            const text = getLineTextData(idx)
            ctx.fillStyle = line.color || 'black'
            ctx.font = `${line.bold ? 'bold' : 'normal'} ${line.size}px ${line.font}`
            ctx.textAlign = 'center'
            const textMetrics = ctx.measureText(text)
            const textWidth = textMetrics.width
            const textHeight = line.size // Adjusted text height to match font size
            const x = canvas.width / 2
            const y = line.height || 30 + idx * 30 // Adjusted y position to use line height
            ctx.fillText(text, x, y)

            if (idx === selectedLineIdx && selectedLineIdx !== undefined) {
                // Draw a rectangle around the text
                ctx.strokeStyle = 'yellow'
                ctx.lineWidth = 3
                ctx.strokeRect(
                    x - textWidth / 2 - 5,
                    y - textHeight, // Adjusted y position for top of the rectangle
                    textWidth + 10,
                    textHeight + 5
                )
            }
        })
    }

    image.src = gMeme.url
}





// CRUD

function onRemoveMeme(memeId) {
    removeMeme(memeId)
    renderGallery()
    flashMsg(`Meme Deleted`)
}

function onAddMeme() {
    const elModal = document.querySelector('.meme-edit-modal')
    elModal.querySelector('h2').innerText = 'Add Meme'
    elModal.showModal()
}

function onUpdateMeme(memeId) {
    gMemeToEdit = getMemeById(memeId)

    const elModal = document.querySelector('.meme-edit-modal')
    
    const elHeading = elModal.querySelector('h2').innerText = 'Edit Meme'
    const elImg = elModal.querySelector('img').src=`${gMemeToEdit.url}`
    const elCategories = elModal.querySelector('select').value = gMemeToEdit.category
    
    elModal.showModal()
}

function onSaveMeme() {
    const elForm = document.querySelector('.meme-edit-modal form')
    const elCategory = elForm.querySelector('select')
    const category = elCategory.value

    if(gMemeToEdit) {
        var meme = updateMeme(gMemeToEdit.id, category)
        gMemeToEdit = null
    } else {
        var meme = addMeme(category)
    }
    elForm.reset()

    renderGallery()
    flashMsg(`Meme Saved (id: ${meme.id})`)
}

// Meme Edit Dialog

function toggleEditor() {

    if (isEditing) {
        resetEditor()
        hideMemesContainer()
        showMemeEditor()
    } else {
        hideMemeEditor()
        showMemesContainer()
    }    

    isEditing = !isEditing
}

function showMemeEditor() {
    const editor = document.getElementById('memeEditor')
    editor.style.display = 'grid'
}

function hideMemeEditor() {
    const editor = document.getElementById('memeEditor')
    editor.style.display = 'none'
}

function onSelectCategory(elCategory) {
    const elMemeImg = document.querySelector('.meme-edit-modal img')
    elMemeImg.src = `${elCategory.url}`
}

function resetEditor() {
    // Default font styling
    gMeme.lines = [{
        txt: '', 
        size: 20,
        color: '#000000',
        font: 'arial',
        bold: false,
    }]
}
// Filter, Sort & Pagination

function onNextPage() {
    const memeCount = getMemeCount(gQueryOptions.filterBy)
    
    if(memeCount > (gQueryOptions.page.idx + 1) * gQueryOptions.page.size) {
        gQueryOptions.page.idx++
    } else {
        gQueryOptions.page.idx = 0
    }
    setQueryParams()
    renderGallery()
}

function onPrevPage() {
 // Todo
}

// Query Params

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('search', gQueryOptions.filterBy.txt)
}

// UI

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')

    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => el.classList.remove('open'), 3000)
}