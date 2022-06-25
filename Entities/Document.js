"use strict";

module.exports = class Document {
    constructor(pages) {
        this.pages = pages;
        this.getMedianFontSize();
        this.getAvgFontSize();
        this.setAvgFontSize(this.getAvgFontSize());
        this.setMedianFontSize(this.getMedianFontSize());
    }

    //get the page at the given index
    getPage(index) {
        //return the page whose pageNum is equal to the given index
        return this.pages.find(page => page.pageNum === index);
    }

    //get the number of pages in the document
    getNumPages() {
        return this.pages.length;
    }

    //set the median font size of the document for all pages
    setMedianFontSize(medianFontSize) {
        for (let page of this.pages) {
            page.setMedianFontSize(medianFontSize);
        }
    }

    //set the average font size of the document for all pages
    setAvgFontSize(avgFontSize) {
        for (let page of this.pages) {
            page.setAvgFontSize(avgFontSize);
        }
    }

    //get the median font size of the document
    getMedianFontSize() {
        // median of all pages
        let fontSizes = this.pages.map(page => page.getMedianFontSize());
        return fontSizes.sort((a, b) => a - b)[Math.floor(fontSizes.length / 2)];
    }

    //get the average font size of the document
    getAvgFontSize() {
        // avg of all pages
        let fontSizes = this.pages.map(page => page.getAvgFontSize());
        return fontSizes.reduce((a, b) => a + b) / fontSizes.length;
    }

    //get text of the document
    getText(inject_content = "") {
        let text = "";
        for (let page of this.pages) {
            if (inject_content !== "") {
                text += inject_content + "\n";
            }
            text += page.getText();
        }
        return text;
    }

    //get html of the document
    getHtml(inject_html = "") {
        let html = "";
        for (let page of this.pages) {
            if (inject_html !== "") {
                html += inject_html + "\n";
            }
            html += page.getHtml();
        }
        return html;
    }
}