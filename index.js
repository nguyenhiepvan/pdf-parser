"use strict";

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const fs = require("fs");
const CMAP_URL = "./node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const STANDARD_FONT_DATA_URL = "./node_modules/pdfjs-dist/standard_fonts/";
const pdfPath = process.argv[2] || "./input/test1.pdf";
const data = new Uint8Array(fs.readFileSync(pdfPath));
const Font = require("./Entities/Font.js");
const Phrase = require("./Entities/Phrase.js");
const Page = require("./Entities/Page.js");

const loadingTask = pdfjsLib.getDocument({
    data, cMapUrl: CMAP_URL, cMapPacked: CMAP_PACKED, standardFontDataUrl: STANDARD_FONT_DATA_URL,
});

(async function () {
    try {
        const pdfDocument = await loadingTask.promise;
        const totalPages = pdfDocument.numPages;

        for (let i = 0; i <totalPages; i++) {
            await (async function (pageNumber) {
                await parse(pageNumber, pdfDocument);
            })(i + 1);
        }
    } catch (reason) {
        console.log(reason);
    }
})();

function parse(pageNum, PDFDocumentInstance) {
    console.log("parsing page #" + pageNum);
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            pdfPage.getTextContent().then(function (textContent) {
                let viewport = pdfPage.getViewport({scale: 1});
                let list_fonts = getPageFonts(textContent);
                let list_phrases = getPhrases(textContent, list_fonts);
                let page = new Page(pageNum, viewport.width, viewport.height, list_phrases, list_fonts);
                let append = "<p>=============( " + pageNum + " )=============</p>\n";
                fs.appendFile('output/output1.html', append + page.getHtml(), err => {
                    if (err) {
                        console.error(err)
                        process.exit(0);
                    }
                })
                resolve();
            });
        });
    });
}

function getPhrases(textContent, list_fonts) {
    let list_phrases = [];
    let items = JSON.parse(JSON.stringify(textContent.items));
    for (let item in items) {
        let data = items[item];
        let [text, direction, width, height, transform, font_name, hasEOL] = Object.values(data);
        let font = list_fonts.find(f => f.name === font_name);
        list_phrases.push(new Phrase(text, direction, width, height, transform, font, hasEOL));
    }
    return list_phrases;
}

function getPageFonts(textContent) {
    let list_fonts = [];
    let styles = JSON.parse(JSON.stringify(textContent.styles));
    for (let fontName in styles) {
        let fontData = styles[fontName];
        let [fontFamily, ascent, descent, vertical] = Object.values(fontData);
        let font = new Font(fontName, fontFamily, ascent, descent, vertical);
        if (list_fonts.indexOf(font) === -1) {
            list_fonts.push(font);
        }
    }
    return list_fonts;
}