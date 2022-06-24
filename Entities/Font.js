'use strict';

module.exports = class Font {
    constructor(name, fontFamily, ascent, descent, vertical) {
        this.name = name;
        this.fontFamily = fontFamily;
        this.ascent = ascent;
        this.descent = descent;
        this.vertical = vertical;
    }

    getName() {
        return this.name;
    }

    getFontFamily() {
        return this.fontFamily;
    }

    getAscent() {
        return this.ascent;
    }

    getDescent() {
        return this.descent;
    }

    isVertical() {
        return this.vertical;
    }

    getFontHeight() {
        return this.ascent + this.descent;
    }

    //get font size
    getFontSize() {
        return this.getFontHeight();
    }
}