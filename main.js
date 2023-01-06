const mainUrl = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595' 
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
let allMatchesObj = require('./allMatches');

const iplFolderPath = path.join(__dirname , "IPL");
createFolder(iplFolderPath);

request(mainUrl , cb);
function cb(err , response , data) {
    if(err) console.log(err)
    else{
        extractHTMLData(data);
    }
    
}
function extractHTMLData(data) {
    //Gives us like a instrument to do something with the extracted html of our page
    const $ = cheerio.load(data);
    const allMatchesLink = $('.ds-border-t.ds-border-line.ds-text-center.ds-py-2 a');
    let link = $(allMatchesLink[0]).attr('href');
   // console.log(link);
    let fullLink = 'https://www.espncricinfo.com' + link;
    //console.log(fullLink);
    allMatchesObj.funcAllIPLData(fullLink);
}

//creating Folder
function createFolder(iplFolderPath) {
    if(fs.existsSync(iplFolderPath)==false){
        fs.mkdirSync(iplFolderPath);
    }
}

