'use strict'

var selectedLineIdx

function clearCanvas() {

    selectedLineIdx = undefined

    gMeme.lines = [{
        txt: '', 
        size: 20,
        color: '#000000',
        font: 'arial',
        bold: false,
    }]

    onLineSwitch()
    renderMeme()
}  

function setLineTxt(text) {

    if(!selectedLineIdx) selectedLineIdx = 0

    if (!gMeme.lines[selectedLineIdx]) {
        // If the line object doesn't exist at the specified index, create it
        gMeme.lines[selectedLineIdx] = { txt: text }

    } else {
        // If the line object already exists, update its text
        gMeme.lines[selectedLineIdx].txt = text
    }
        renderMeme()
}

function clearLine() {
    if (selectedLineIdx !== undefined && gMeme.lines[selectedLineIdx]) {
        gMeme.lines[selectedLineIdx].txt = ''       
        onLineSwitch()
        renderMeme()
    }
}

function switchLine() {

    if(selectedLineIdx === undefined) selectedLineIdx = 0

    selectedLineIdx++

    // Ensure selected line doesn't exceed the lines amount
    selectedLineIdx %= gMeme.lines.length

    onLineSwitch()
    renderMeme()
}

function addLine() {
    gMeme.lines.push({
        txt: '', 
        size: 20,
        color: '#000000',
        font: 'arial',
        bold: false,
    })

    // Automatically select the newly created line
    selectedLineIdx = gMeme.lines.length - 1

    onLineSwitch()

    // Render the meme with the new line
    renderMeme(gMeme.url)
}

function onLineSwitch() {
    const line = gMeme.lines[selectedLineIdx]

    // Update the text value of the add-text input
    const text = line ? line.txt : ''
    document.querySelector('.add-text').value = text

    // Update the color of the color picker to the text's color
    const color = line && line.color ? line.color : '#000000'
    document.getElementById('font-color').value = color

    if(!line) return
    // Update the font to the one of the selected line
    const font = line.font
    document.getElementById('font-select').value = font
}

function getLineTextData(lineIdx) {
    // Ensure that the lineIdx is valid
    if (lineIdx >= 0 && lineIdx < gMeme.lines.length) {
        return gMeme.lines[lineIdx].txt
    }
    return ''
}

function hideHighlighter() {
    selectedLineIdx = undefined
    onLineSwitch()
    renderMeme()
}

function downloadCanvas() {
    var prevIdx = selectedLineIdx

    hideHighlighter()
    
    setTimeout(() => {
        const canvas = document.getElementById('memeCanvas')
        const imgContent = canvas.toDataURL('image/jpeg')
        const link = document.createElement('a')
        link.href = imgContent
        link.download = 'canvas_image.jpg'
        link.click()
    }, 1)

    setTimeout(() => {

        selectedLineIdx = prevIdx
        onLineSwitch()
        renderMeme()
    }, 1)

    flashMsg('Meme downloaded!')
}


function fontSize(input) {

    var dir = input === '+' ? dir = 1 : dir = -1
    
    const MIN_FONT_SIZE = 12
    const MAX_FONT_SIZE = 48

    if (selectedLineIdx !== undefined && gMeme.lines[selectedLineIdx]) {
        const line = gMeme.lines[selectedLineIdx]
        line.size = (line.size || 24) + (dir * 4)
        line.size = Math.min(Math.max(line.size, MIN_FONT_SIZE), MAX_FONT_SIZE)
    }

    renderMeme()
    flashMsg('Font sized increased')
}

function selectFontColor() {
    const colorPicker = document.getElementById('font-color')
    const selectedColor = colorPicker.value

    if (selectedLineIdx !== undefined && gMeme.lines[selectedLineIdx]) {
        const line = gMeme.lines[selectedLineIdx]
        line.color = selectedColor
    }

    renderMeme()
}

function selectFont() {
    const fontEl = document.getElementById('font-select')
    const selectedFont = fontEl.value

    if (selectedLineIdx !== undefined && getLine()) {
        const line = getLine()
        line.font = selectedFont
    }

    renderMeme()
}

function toggleBold() {
    const line = getLine()

    line.bold = !line.bold

    renderMeme()
}

function onClickCanvas(ev) {

    const canvas = document.getElementById('memeCanvas')
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const mouseX = ev.clientX - rect.left
    const mouseY = ev.clientY - rect.top

    gMeme.lines.forEach((line, idx) => {
        const textWidth = ctx.measureText(line.txt).width
        const textHeight = 30

        // Calculate the position based on line.height if available
        const startX = (canvas.width - textWidth) / 2 - 5
        const startY = line.height !== undefined ? line.height - textHeight : 30 + idx * 30 - textHeight
        const endX = startX + textWidth + 10
        const endY = startY + textHeight + 5

        if (mouseX >= startX && mouseX <= endX && mouseY >= startY && mouseY <= endY) {
            selectedLineIdx = idx
            onLineSwitch()
            renderMeme()
        }
    })
}

function moveLine(direction) {
    if (selectedLineIdx !== undefined) {
        const canvas = document.getElementById('memeCanvas')
        const lineHeight = 30
        const minY = lineHeight / 2
        const maxY = canvas.height - lineHeight / 2

        const line = getLine()
        const deltaY = direction === 'up' ? -10 : 10
        const newY = line.height ? line.height + deltaY : 30 + selectedLineIdx * lineHeight + deltaY

        // Ensure the new y-position is within bounds
        if (newY >= minY && newY <= maxY) {
            line.height = newY
            renderMeme()
        }
    }
}

function setCustomImage(img) {
    const canvas = document.getElementById('memeCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}