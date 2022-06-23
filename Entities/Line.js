"use strict";

module.exports = class Line {
    constructor(phrases) {
        this.phrases = phrases;
    }

    getText() {
        return this.phrases.map(phrase => phrase.getText()).join("");
    }
}
