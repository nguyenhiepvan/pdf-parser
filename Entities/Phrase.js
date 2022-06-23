"use strict";

module.exports = class Phrase {
    constructor(text, direction, width, height, transform, font, hasEOL) {
        this.text = text;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.transform = transform;
        this.font = font;
        this.hasEOL = hasEOL;
    }

    getText() {
        return this.text;
    }

    getDirection() {
        return this.direction;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getTransform() {
        return this.transform;
    }

    getFont() {
        return this.font;
    }

    hasEOL() {
        return this.hasEOL;
    }

    isVertical() {
        return this.font.isVertical();
    }


}