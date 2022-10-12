var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/thryve3", {useNewUrlParser: true, useUnifiedTopology: true});

var Exercise = require("./models/exercise");

const fs = require("fs");
fs.exists('exercises.json', function(exists){
   if(exists){
        console.log("delete the existing exercises.json first");
   }
   else{
        Exercise.find({}, function(err, exercises){
            var obj = {
                table:[]
            };
            obj.table = exercises;
            var json = JSON.stringify(obj);
            fs.writeFile('exercises.json', json, 'utf8', function(err){
                console.log("done");
            });   
       });
   }
});