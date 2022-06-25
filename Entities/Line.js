"use strict";

module.exports = class Line {
    constructor(phrases) {
        this.phrases = phrases;
        this.sortPhrases();
    }

    //sort phrases
    sortPhrases() {
        // sort phrases by left
        this.phrases.sort((a, b) => {
            return a.left - b.left;
        });
        // sort phrases by direction (left to right or right to left)
        if (this.phrases[0].direction === "ltr") {
            this.phrases.sort((a, b) => {
                return a.left - b.left;
            });
        }
        if (this.phrases[0].direction === "rtl") {
            this.phrases.sort((a, b) => {
                return b.left - a.left;
            });
        }
    }

    //get most used font of line
    getFont() {
        let fonts = this.phrases.map(phrase => phrase.font);
        let font = fonts[0];
        for (let i = 1; i < fonts.length; i++) {
            if (fonts[i].getFontFamily() === font.getFontFamily()) {
                font = fonts[i];
            }
        }
        return font;
    }

    getText() {
        return this.phrases.map(phrase => phrase.getText()).join("\n");
    }

    getHtml(inject_style = "") {
        return this.phrases.map(phrase => "<span style='" + phrase.getTransformCss() + ";" + inject_style + "'>" + phrase.getHtml() + "</span>").join("\n");
    }
}
