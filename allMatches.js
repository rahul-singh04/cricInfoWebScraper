const request = require('request');
const cheerio = require('cheerio');
const IndividualMatchProcessor = require('./matchDetails')
function getWholeIPLdata(url) {
    request(url , cb);
    function cb(err, response , data){
        if(err)console.log(err);
        else{
            //  console.log(data);
            extractLink(data);
        }
    }
}
function extractLink(data) {
    const $ = cheerio.load(data);
    const allMatches = $('.ds-flex .ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>.ds-no-tap-higlight');
   for(let i =0 ; i < allMatches.length ; i++){
    let link  = $(allMatches[i]).attr('href');
    let eachMatchFullLink = 'https://www.espncricinfo.com' + link;
    console.log(eachMatchFullLink);
    IndividualMatchProcessor.IndividualMatchURL(eachMatchFullLink);
   }
   // console.log(allMatches.length);
}

module.exports ={
    funcAllIPLData :getWholeIPLdata
}