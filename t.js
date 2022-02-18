const api = require("novelcovid")
let data = api.countries({country:'austria'}).then((body) => {
    console.log(body.countryInfo.flag) 
});
