'use strict'

const STORAGE_KEY = 'MemesDB'

const gCategories = ['Sarcastic', 'Animals', 'Babies', 'Cute']

var gMemes
var gMeme

var gCurrImgIdx = 0

_createMemes()


function getMemeCount(filterBy) {
    return _filterMemes(filterBy).length
}

function getCategories() {
    return gCategories
}

function removeMeme(memeId) {
    const memeIdx = gCategories.findIndex(meme => memeId === meme.id)
    gCategories.splice(memeIdx, 1)
    
    _saveMemesToStorage()
}

function addMeme(category) {
    var meme = _createMeme(category)
    gMemes.unshift(meme)

    _saveMemesToStorage()
    return meme
}

function getMemeById(memeId) {
    return gMemes.find(meme => memeId === meme.id)
}

function getMemeByURL(memeUrl) {
    return gMemes.find(meme => memeUrl === meme.url)
}

function updateMeme(memeId, newCategory) {
    const meme = gMemes.find(meme => meme.id === memeId)
    console.log(meme)

    meme.category = newCategory

    _saveMemesToStorage()
    return meme
}

function _createMeme(category) {
    return {
        id: makeId(),
        url: getRandUrl(),
        category,
        desc: makeLorem(),
        lines: [{ txt: '' }],
    }
}


function _createMemes() {
    gMemes = loadFromStorage(STORAGE_KEY)
    if (gMemes && gMemes.length) return
    
    // If no memes in storage - generate demo data

    gMemes = []
    const categories = ['Sarcastic', 'Animals', 'Babies', 'Cute']
    
    for (let i = 0; i <= 18; i++) {
        var category = categories[getRandomInt(0, categories.length)]
        gMemes.push(_createMeme(category))
    }
    _saveMemesToStorage()
}

function setImg(URL) {
    var meme = getMemeByURL(URL)

    if (meme) {
        gMeme = meme

        renderMeme()
        toggleEditor()
    } else {
        console.error("Meme not found for id:", id)
    }
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMemes)
}

function _filterMemes(filterBy) {
    const txt = filterBy.txt.toLowerCase()

    const filteredMemes = gMemes.filter(meme => 
        (meme.category.includes(txt) || meme.desc.toLowerCase().includes(txt)))

    return filteredMemes
}

function getFilteredMemes(options = {}, numImages) {
    var filteredMemes = _filterMemes(options.filterBy)

    if(options.page) {
        const startIdx = options.page.idx * options.page.size
        filteredMemes = filteredMemes.slice(startIdx, startIdx + options.page.size)
    }

    const imgFolder = 'img/'
    const newMemes = []

    for (let i = 1; i <= numImages; i++) {
        const filename = `${i}`
        const url = imgFolder + filename + '.jpg'
        const meme = {
            id: makeId(),
            url,
            category: getRandomKeywords(),
            desc: makeLorem(),
            lines: [{ txt: '' }],
        }
        
        newMemes.push(meme)
    }

    return filteredMemes.concat(newMemes)
}

function hideMemesContainer() {
    const memesContainer = document.querySelector('.memes-container')
    if (memesContainer) memesContainer.style.display = 'none'
}

function showMemesContainer() {
    const memesContainer = document.querySelector('.memes-container')
    if (memesContainer) memesContainer.style.display = 'grid'
}

function getLine() {
    return gMeme.lines[selectedLineIdx]
}