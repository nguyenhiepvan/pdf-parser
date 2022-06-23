"use strict";

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const fs = require("fs");
const CMAP_URL = "./node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const STANDARD_FONT_DATA_URL = "./node_modules/pdfjs-dist/standard_fonts/";
const pdfPath = process.argv[2] || "./test.pdf";
const data = new Uint8Array(fs.readFileSync(pdfPath));
const list_fonts = [];
const list_phrases = [];
const Font = require("./Entities/Font.js");
const Phrase = require("./Entities/Phrase.js");

const loadingTask = pdfjsLib.getDocument({
    data, cMapUrl: CMAP_URL, cMapPacked: CMAP_PACKED, standardFontDataUrl: STANDARD_FONT_DATA_URL,
});

(async function () {
    try {
        const pdfDocument = await loadingTask.promise;
        for (let i = 0; i < pdfDocument.numPages; i++) {
            (function (pageNumber) {
                parse(pageNumber, pdfDocument);
            })(i + 1);
        }
    } catch (reason) {
        console.log(reason);
    }
})();

function parse(pageNum, PDFDocumentInstance) {
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            pdfPage.getTextContent().then(function (textContent) {
                getPhrases(textContent);
                //TODO: merge phrases
                resolve();
            });
        });
    });
}

function getPhrases(textContent) {
    getPageFonts(textContent);
    let items = JSON.parse(JSON.stringify(textContent.items));
    for (let item in items) {
        let data = items[item];
        let [text, direction, width, height, transform, font_name, hasEOL] = Object.values(data);
        let font = list_fonts.find(f => f.name === font_name);
        list_phrases.push(new Phrase(text, direction, width, height, transform, font, hasEOL));
    }
}

function getPageFonts(textContent) {
    let styles = JSON.parse(JSON.stringify(textContent.styles));
    for (let fontName in styles) {
        let fontData = styles[fontName];
        let [fontFamily, ascent, descent, vertical] = Object.values(fontData);
        let font = new Font(fontName, fontFamily, ascent, descent, vertical);
        if (list_fonts.indexOf(font) === -1) {
            list_fonts.push(font);
        }
    }
}