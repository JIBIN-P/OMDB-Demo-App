const express = require(`express`);
let app = express();
const request = require(`request`);

app.use(express.static(`public`));

app.set(`view engine`, `ejs`);

app.get(`/`, (req, res) => {
   res.render(`home`);
});

app.get(`/results`, (req, res) => {
   let query = req.query.search;
   let url = `http://www.omdbapi.com/?apikey=thewdb&s=` + query + `&page=`;
   request(url, (error, response, body) => {
      console.log(`error:`, error);
      console.log(`Status:`, response && response.statusCode);
      let message = "";
      let data = JSON.parse(body);
      let count = parseInt(data["totalResults"]);

      /* This if - else loop requires refactoring and it is also a bug for now,
         What I want to do is display more than 10 search results(API constraints)so I came up 
         with this loop, for now the only success is that the url is changing according to page no.
         I think this can be solved using array of objects which has the size of count and store 
         new data in a new index with the help of objects(pg1, pg2,...page count) and then in the 
         results.ejs file we will loop through that array to display the data.*/
      if(data["Response"] == "True"){
         for(let page = 2;page < 4;page++){
            let newUrl = url;
            newUrl += page;
            request(newUrl, (error, response, body) => {
               console.log(body);
            }); 
         }
      }
      else{
         count = 0;
         message = `There is no movie with the name ` + query;
      }

      res.render(`results`, {data: data, query: query, count: count, message: message});
   });
});

app.listen(process.env.PORT || `3000`, (req, res) => console.log(`Server is up.`));