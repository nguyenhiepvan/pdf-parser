"use strict";

const Line = require("./Line.js");
module.exports = class Page {

    constructor(pageNum, pageWidth, pageHeight, phrases, fonts) {
        this.pageNum = pageNum;
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.fonts = fonts;
        this.lines = this.groupPhrases(phrases);
    }

    //median of all font sizes
    getMedianFontSize() {
        let fontSizes = this.lines.map(line => line.getFont().getFontSize());
        fontSizes.sort((a, b) => a - b);
        return fontSizes[Math.floor(fontSizes.length / 2)];
    }

    //avg of all font sizes
    getAvgFontSize() {
        let fontSizes = this.lines.map(line => line.getFont().getFontSize());
        return fontSizes.reduce((a, b) => a + b) / fontSizes.length;
    }

    // map nearest font size to html tag
    getHtmlTag(font, inject_style = "") {
        let fontSize = font.getFontSize();

        let medianFontSize = this.getMedianFontSize();
        let avgFontSize = this.getAvgFontSize();

        let [small,medium] = [Math.min(medianFontSize,avgFontSize), Math.max(medianFontSize,avgFontSize)];


        if (fontSize < small) {
            return "<p style=\"" + inject_style + "font-size: small;\">";
        }
        if (fontSize < medium) {
            return "<p style=\"" + inject_style + "font-size: medium;\">";
        }
        return "<p style=\"" + inject_style + "font-size: large;\">";
    }

    //group phrases by top
    groupPhrases(phrases) {
        let lines = [];
        let line = [];
        for (let phrase of phrases) {
            if (line.length === 0) {
                line.push(phrase);
            } else {
                if (phrase.top === line[line.length - 1].top) {
                    line.push(phrase);
                } else {
                    lines.push(new Line(line));
                    line = [];
                    line.push(phrase);
                }
            }
        }
        return lines;
    }

    //get text
    getText() {
        return this.lines.map(line => line.getText()).join("\n");
    }

    getHtml() {
        return this.lines.map(line => this.getHtmlTag(line.getFont()) + line.getHtml() + "</p>").join("\n");
    }
}