"use strict";

const Line = require("./Line.js");
module.exports = class Page {

    constructor(pageNum, pageWidth, pageHeight, phrases, fonts) {
        this.pageNum = pageNum;
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.fonts = fonts;
        this.lines = this.groupPhrases(phrases);
        this.getMedianFontSize();
        this.getAvgFontSize();
    }

    //median of all font sizes
    getMedianFontSize() {
        if (typeof this.medianFontSize === "undefined") {
            let fontSizes = this.lines.map(line => line.getFont().getFontSize());
            fontSizes.sort((a, b) => a - b);
            this.medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)];
        }
        return this.medianFontSize;
    }

    //set median font size
    setMedianFontSize(medianFontSize) {
        this.medianFontSize = medianFontSize;
    }

    //set avg font size
    setAvgFontSize(avgFontSize) {
        this.avgFontSize = avgFontSize;
    }

    //avg of all font sizes
    getAvgFontSize() {
        if (typeof this.avgFontSize === "undefined") {
            let fontSizes = this.fonts.map(font => font.getFontSize());
            this.avgFontSize = fontSizes.reduce((a, b) => a + b) / fontSizes.length;
        }
        return this.avgFontSize;
    }

    // map nearest font size to html tag
    getHtmlTag(font, inject_style = "") {
        let fontSize = font.getFontSize();

        let medianFontSize = this.medianFontSize;
        let avgFontSize = this.avgFontSize;

        let [small, medium] = [Math.min(medianFontSize, avgFontSize), Math.max(medianFontSize, avgFontSize)];


        if (fontSize < small) {
            return "<p style=\"" + inject_style + "font-size: small;font-family: " + font.getFontFamily() + "\">";
        }
        if (fontSize < medium) {
            return "<p style=\"" + inject_style + "font-size: medium;font-family: " + font.getFontFamily() + "\">";
        }
        return "<p style=\"" + inject_style + "font-size: large;font-family: " + font.getFontFamily() + "\">";
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
        return this.lines.map(line => line.getText()).join("");
    }

    getHtml(inject_style = "") {
        return this.lines.map(line => this.getHtmlTag(line.getFont()) + line.getHtml(inject_style) + "</p>").join("");
    }
}