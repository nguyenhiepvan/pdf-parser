"use strict";

module.exports = class Line {
    constructor(phrases) {
        this.phrases = phrases;
        this.sortPhrases();
        this.isMergeable();
        this.getCoordinates()
    }

    //get coordinates of line
    getCoordinates() {
        this.left = this.phrases[0].left;
        this.right = this.phrases[this.phrases.length - 1].right;
        this.top = this.phrases[0].top;
        this.bottom = this.phrases[this.phrases.length - 1].bottom;
        return {
            left: this.left, right: this.right, top: this.top, bottom: this.bottom
        };
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

    getText(force = false) {
        if (typeof this.text === "undefined" || force) {
            this.text = this.phrases.map(phrase => phrase.text).join("");
        }
        return this.text;
    }

    getHtml(inject_style = "", force = false) {
        if (typeof this.html === "undefined" || force) {
            this.html = this.phrases.map(phrase => "<span style='" + phrase.getTransformCss() + ";" + inject_style + "'>" + phrase.getHtml() + "</span>").join("");
        }
        return this.html;
    }

    //merge line to this line
    merge(line) {
        this.phrases = this.phrases.concat(line.phrases);
        this.sortPhrases();
        this.isMergeable();
        this.getCoordinates();
        this.getText(true);
        this.getHtml(true);
        return this;
    }

    //check if line is merge-able
    isMergeable() {
        // if line's text is empty or trimmed, it is mergeable
        if (this.getText().trim() === "") {
            return true;
        }
        // if line's text is too short, it is mergeable
        return this.getText().length < 3;

    }

}
