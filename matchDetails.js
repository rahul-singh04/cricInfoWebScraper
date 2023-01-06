//const mainUrl = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const main = require('./main')
const xlsx = require('xlsx');
function getIndividualMatchURL(mainUrl){
    request(mainUrl, cb);
}

function cb(err, response, data) {
    if (err) console.log(err)
    else {
        extractHTMLData(data);
    }

}
let count = 0;

function extractHTMLData(data) {
    const $ = cheerio.load(data);
        let venueAndDate = $('.ds-flex.ds-items-center .ds-grow ')
        let venueAndDateStr = $(venueAndDate[0]).text()
        console.log();
        let venueAndDateArr = venueAndDateStr.split(',')
        let finalVenueAndDateArr = venueAndDateArr.slice(1,3)
        let venue = finalVenueAndDateArr[0];
        let date = finalVenueAndDateArr[1];
        const result = $('.ds-text-compact-xxs.ds-p-2.ds-px-4 .ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title').text()
        //console.log(result);
        //console.log(venue + " " + date);
       const scoreTable =  $(".ds-mt-3 .ds-rounded-lg.ds-mt-2");
        //console.log(scoreTable.length);
       let completeHTML = '';
       for(let i =0 ; i<scoreTable.length ; i++){
        // const individualHTML = $(scoreTable[i]).html();   //used to extract a part of total html and then  focus on it,does not help in any other functionality of code
        // completeHTML += individualHTML;
        let teamName = $(scoreTable[i]).find('span[class="ds-text-title-xs ds-font-bold ds-capitalize"]').text().trim();
        
        teamName = teamName.split(" ").join("");
        let opponentTeamName =""
        if(i==0){
            opponentTeamName = $(scoreTable[1]).find('span[class="ds-text-title-xs ds-font-bold ds-capitalize"]').text();
        }else{
            opponentTeamName = $(scoreTable[0]).find('span[class="ds-text-title-xs ds-font-bold ds-capitalize"]').text();
        }
        //console.log(`${venue}  ${date}  ${teamName} ----> ${opponentTeamName}  ${result}`);

        let currentInning = $(scoreTable[i]);
        let batsmanRows = currentInning.find('table[class="ds-w-full ds-table ds-table-md ds-table-auto  ci-scorecard-table"] tbody tr[class=""]');
        let n = batsmanRows.length;
        let batsmanRowsNew = batsmanRows.slice(0,n-2)
        
        
        for (let i = 0; i < batsmanRowsNew.length; i++) {
            let batsmanCol = $(batsmanRowsNew[i]).find('td');

            let playerName = $(batsmanCol[0]).text().trim();
            playerName = playerName.split(" ").join("");
            let runs = $(batsmanCol[2]).text().trim();
            let balls = $(batsmanCol[3]).text().trim();
            let fours = $(batsmanCol[5]).text().trim();
            let sixes = $(batsmanCol[6]).text().trim();
            let strikeRate = $(batsmanCol[7]).text().trim();
            
            console.log(`${playerName}  ${runs}  ${balls}  ${fours}  ${sixes} ${strikeRate} `);
            processPlayer(teamName , opponentTeamName , date , venue , result , playerName , runs , balls , fours , sixes ,strikeRate);
            
        }
        count++;
            console.log(count);
        // console.log($(batsmanRows).text());
       }

}

function processPlayer( teamName , opponentTeamName , date , venue , result , playerName , runs , balls , fours , sixes ,strikeRate) {
    const teamNamePath = path.join(__dirname, 'IPL' , teamName )
    console.log(teamNamePath);
    createFolder(teamNamePath);
    //main.makeFolder(teamNamePath);
    const filePath = path.join(teamNamePath,playerName + ".xlsx")
    let fileContent = excelReader(filePath,playerName);
    let objToAdd = {
        teamName,
        opponentTeamName,
        playerName,
        runs , 
        balls , 
        fours , 
        sixes ,
        strikeRate,
        date,
        venue,
        result
    }
    fileContent.push(objToAdd);
    excelWriter(filePath , fileContent , playerName);
}


function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath)==false){
        return [];
    }
    let wb = xlsx.readFile(filePath) ;
    let excelData = wb.Sheets[sheetName]; 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}


function excelWriter(filePath, data, sheetName) {

     let newWb = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet (data) ;
    xlsx.utils.book_append_sheet(newWb, newWS, sheetName) ;
    
    xlsx.writeFile(newWb, filePath);
    
     
}



function createFolder(path) {
    if(fs.existsSync(path)==false){
        fs.mkdirSync(path);
    }
}

module.exports={
    IndividualMatchURL : getIndividualMatchURL
}