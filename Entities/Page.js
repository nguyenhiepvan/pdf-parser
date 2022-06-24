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

    //sort fonts by font size

    // map nearest font size to html tag
    getHtmlTag(font, inject_style = "") {
        let fontSize = font.getFontSize();

        if (fontSize < 14) {
            return "<p style=\"" + inject_style + "font-size: small;\">";
        }
        if (fontSize < 16) {
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