const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
app.use(express.static("public"));
const articleSchema={
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArcticles){
    if(!err){
      res.send(foundArcticles);
    }
    else{
      res.send(err);
    }
  });
})
  .post(function(req,res){
    const article=new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err){
      if(!err){
        console.log("Successfully added an article");
      }else{
        console.log(err);
      }
    });
})
    .delete(function(req,res){
      Article.deleteMany(function(err){
        if(!err){
          res.send("Successfully deleted all articles");
        }
        else{
          console.log(err);
        }
      });
    });
/////////////////////////////////////////////////////For Specific route//////////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
  .get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArcticle){
      if(foundArcticle){
        res.send(foundArcticle);
      }else{
        console.log(err);
      }
    })
  })
  .put(function (req,res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title,content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated record");
        }else{
          res.send(err);
        }
      }
    );
  })
  .patch(function(req,res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article");
        }else{
          res.send(err);
        }
      }
    );
  })
  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function (err){
        if(!err){
          res.send("Successfully deleted");
        }else{
          res.send(err);
        }
      });
  });
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
