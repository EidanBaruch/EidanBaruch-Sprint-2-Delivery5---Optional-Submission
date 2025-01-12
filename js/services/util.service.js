'use strict'

function makeId(length = 6) {
	const possible = '0123456789'
	var id = ''
    
	for (var i = 0; i < length; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return id
}

function getRandomKeywords(wordCount = 1) {

    const keywords = ['Cute', 'Baby', 'Animal', 'Sarcastic']
    var randKeywords = []

	while (wordCount-- > 0) {
		randKeywords.push(keywords[getRandomInt(0, keywords.length)] + ' ')
	}

    return randKeywords
}

function makeLorem(wordCount = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
	var txt = ''

	while (wordCount-- > 0) {
		txt += words[getRandomInt(0, words.length)] + ' '
	}
	return txt
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function getRandUrl() {
    ++gCurrImgIdx

    const filename = `${gCurrImgIdx}.jpg`
    const url = 'img/' + filename

    return url
}

function onCloseModal(modal = 'modal') {
    document.querySelector(modal).close()
}