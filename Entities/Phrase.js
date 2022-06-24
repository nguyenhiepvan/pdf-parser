"use strict";

module.exports = class Phrase {
    constructor(text, direction, width, height, transform, font, hasEOL) {
        this.text = text;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.top = transform[5];
        this.left = transform[4];
        this.bottom = this.top + height;
        this.right = this.left + this.width;
        this.transform = transform;
        this.font = font;
        this.hasEOL = hasEOL;
    }

    // check if text is bold
    isBold() {
        return this.font.getFontFamily().includes("Bold");
    }

    //check if text is italic
    isItalic() {
        return this.font.getFontFamily().includes("Italic");
    }

    //check if text is underlined
    isUnderlined() {
        return this.font.getFontFamily().includes("Underline");
    }

    //check if text is striked
    isStriked() {
        return this.font.getFontFamily().includes("Strike");
    }

    getHtml() {
        let html = "";
        if (this.isBold()) {
            html += "<b>";
        }
        if (this.isItalic()) {
            html += "<i>";
        }
        if (this.isUnderlined()) {
            html += "<u>";
        }
        if (this.isStriked()) {
            html += "<s>";
        }
        html += this.text;
        if (this.isBold()) {
            html += "</b>";
        }
        if (this.isItalic()) {
            html += "</i>";
        }
        if (this.isUnderlined()) {
            html += "</u>";
        }
        if (this.isStriked()) {
            html += "</s>";
        }
        return html;
    }

    getTransformCss() {
        return "transform: matrix(" + this.transform.join(",") + ");";
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