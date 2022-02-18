const api = require("novelcovid")
let data = api.countries({country:'austria'}).then((body) => {
    console.log(body.countryInfo.flag) 
    console.log(body.cases)
        console.log(body.todayCases)
            console.log(body.active)
                console.log(body.critical)
                    console.log(body.deaths)
                        console.log(body.recovered)
});
