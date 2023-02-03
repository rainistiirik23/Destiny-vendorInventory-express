const path = require('path');
const express = require('express');
const app = express()
const fs = require('fs/promises')
const puppeteer = require('puppeteer');

/* const screenShot = async () => {
    const url = 'https://localhost:8000/gunPicView';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.screenshot({
        path: path.join(__dirname, '../../Pictures'),
        clip: {
            x: 3,
            y: 0,
            width: 1200,
            height: 800
        },

    });
    await browser.close();
} */

const gunPic = async (req, res) => {
    const dirRead = await fs.readdir(path.join(__dirname, '../Assets/Pictures/Banshee'), (err, result) => {
        if (err) {
            console.log(err)
        }
    })

    if (dirRead.length == 0) {

        const url = 'https://localhost:8000/gunPicView';
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true
        });
        const page = await browser.newPage();
        await page.goto(url);
        setTimeout(async () => {
            await page.screenshot({
                path: path.join(__dirname, '../Assets/Pictures/Banshee/screenshot.png'),
                /* clip: {
                    x: 3,
                    y: 0,
                    width: 1900,
                    height: 1080,
                }, */
                fullPage: true,

            });
            await browser.close();
            await res.sendFile(path.join(__dirname, '../Assets/Pictures/Banshee/screenshot.png'))

        }, 3000)
        return;
    }
    res.sendFile(path.join(__dirname, '../Assets/Pictures/Banshee/screenshot.png'))
};

module.exports = gunPic
