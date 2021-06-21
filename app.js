const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// connecting to mongoose server
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true, useUnifiedTopology:true});

//create schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//create model/collection article
const Article = mongoose.model("Article", articleSchema);


//------------all of the following requests apply to the /articles route-----------

app.route("/articles")
  .post(function(req,res){
    const newArticle =new Article({ //constructing new document from Postman
      title: req.body.title, //captures the title in the body that was submited in Postman
      content:  req.body.content //captures the "content" value that was submitted in Postman
    });
    newArticle.save(function(err){ //saving newArticle document into wikiDB, under articles collection
      if(!err){
        console.log("New article added successfully")
      }else{
        console.log(err)
      }
    });
  })
  .get(function(req,res){ //sends a get request to look at the articles collection
    Article.find({}, function(err, foundArticles){
      if(!err){ //if no errors were found send back the results of the find to client
        res.send(foundArticles);//dislpayes found articles to user
      }else{
        console.log(err);
      }
    });
  })
  .delete(function(req, res){//sends a request to delete all documents in the articles collection
    Article.deleteMany({}, function(err){
      if(!err){
        res.send("successfully deleted all articles");
      }else{
        res.send(err);
      }
    });
  });

//-----------------specific route requests-------------------------------------

app.route("/articles/:articleTitle")
  .get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        console.log("article was found");
        res.send(foundArticle);
      }else{
        console.log("article wasn't found");
        res.send("article wasn't found");
      }
    });
  })
  .put(function (req,res){ //replaces a whole document
    Article.replaceOne(
      {title: req.params.articleTitle}, //searches for a particular document based on articleTitle in url
      {title: req.body.title, //uses bodyparser to capture new title and overwrite the old one
       content: req.body.content}, //overwrites old content with new one
      function(err){
        if(!err){
          res.send("article was updated");
        }else{
          res.send("article wasn't updated")
        }
    });
  })
  .patch(function(req,res){ //updates a document
    Article.updateOne(
      {title: req.params.articleTitle},
      req.body, //we don't know what fields need to be updated, so we capture whatever field is typed by user to update
      function(err){
        if(!err){
          console.log("article successfully updated");
        }else{
          console.log("article was not updated")
        }
      }
    );
  })
  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("article was successfully deleted");
        }else{
          res.send("article was not deleted");
        }
    });
  });


app.listen(3000, function(){
  console.log("Server has started on port 3000")
});


























// -----------------------------------------------longer/older way of writing when all of requests go to the same route (/articles)-----------------------------------------
//
// app.post("/articles", function(req,res){
//   const newArticle =new Article({ //constructing new document from Postman
//     title: req.body.title, //captures the title in the body that was submited in Postman
//     content:  req.body.content //captures the "content" value that was submitted in Postman
//   });
//
// //saving newArticle document into wikiDB, under articles collection
//   newArticle.save(function(err){
//     if(!err){
//       console.log("New article added successfully")
//     }else{
//       console.log(err)
//     }
//
//   });
// });
//
// //when going to localhost:3000/articles, all contents of the Article model will be displayed
// app.get("/articles", function(req,res){
//   Article.find({}, function(err, foundArticles){
//
//     if(!err){ //if no errors were found send back the results of the find to client
//       res.send(foundArticles);
//     }else{
//       console.log(err);
//     }
//
//   });
// });
//
// app.delete("/articles", function(req, res){
//   Article.deleteMany({}, function(err){
//     if(!err){
//       res.send("successfully deleted all articles");
//     }else{
//       res.send(err);
//     }
//   });
// });
