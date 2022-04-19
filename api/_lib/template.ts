import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, Theme } from './types';
import { html, css } from './util';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

function getCss(theme: Theme, fontSize: string) {
    let background = theme ?? 'black';
    let foreground = 'white';
    let radial = 'lightgray';

    return css`
    /*
    Copyright (c) 2021 Kil Hyung-jin, with Reserved Font Name Pretendard.
    https://github.com/orioncactus/pretendard

    This Font Software is licensed under the SIL Open Font License, Version 1.1.
    This license is copied below, and is also available with a FAQ at:
    http://scripts.sil.org/OFL
    */

    @font-face {
        font-family: 'Pretendard';
        font-weight: 900;
        font-display: swap;
        src: local('Pretendard Black'), url('${__dirname}/../_fonts/woff2/Pretendard-Black.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-Black.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 800;
        font-display: swap;
        src: local('Pretendard ExtraBold'), url('${__dirname}/../_fonts/woff2/Pretendard-ExtraBold.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-ExtraBold.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 700;
        font-display: swap;
        src: local('Pretendard Bold'), url('${__dirname}/../_fonts/woff2/Pretendard-Bold.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-Bold.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 600;
        font-display: swap;
        src: local('Pretendard SemiBold'), url('${__dirname}/../_fonts/woff2/Pretendard-SemiBold.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-SemiBold.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 500;
        font-display: swap;
        src: local('Pretendard Medium'), url('${__dirname}/../_fonts/woff2/Pretendard-Medium.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-Medium.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 400;
        font-display: swap;
        src: local('Pretendard Regular'), url('${__dirname}/../_fonts/woff2/Pretendard-Regular.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-Regular.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 300;
        font-display: swap;
        src: local('Pretendard Light'), url('${__dirname}/../_fonts/woff2/Pretendard-Light.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-Light.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 200;
        font-display: swap;
        src: local('Pretendard ExtraLight'), url('${__dirname}/../_fonts/woff2/Pretendard-ExtraLight.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-ExtraLight.woff') format('woff');
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 100;
        font-display: swap;
        src: local('Pretendard Thin'), url('${__dirname}/../_fonts/woff2/Pretendard-Thin.woff2') format('woff2'), url('${__dirname}/../_fonts/woff/Pretendard-Thin.woff') format('woff');
    }


    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Pretendard', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return html`<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return html`<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
