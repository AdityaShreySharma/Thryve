var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/thryve3", {useNewUrlParser: true, useUnifiedTopology: true});

var Food = require("./models/food");
var Profile = require("./models/profile");
var Exercise = require("./models/exercise");

// Food.remove({}, function(err){
//     if(err){
//         console.log(err);
//     }
//     console.log("removed all");
//     const fs1 = require("fs");
//     fs1.exists('foods.json', function(exists){
//         if(exists){
//             var obj = {
//                 table:[]
//             };
            
//             fs1.readFile('foods.json','utf8', function(err,data){
//                 obj = JSON.parse(data);
//                 //console.log(obj.table);
//                 obj.table.forEach(function(food){
//                     Food.create(food, function(err){
//                         if(err){
//                             console.log(err)
//                         }
//                         else{
//                             console.log(food)
//                             console.log("added food");
//                         }
//                     });
//                 });
//             });
//         }
//         else{
//             console.log("error");  
//         } 
//     });   
// });

// Exercise.remove({}, function(err){
//     if(err){
//         console.log(err);
//     }
//     console.log("removed all");
//     const fs1 = require("fs");
//     fs1.exists('exercises.json', function(exists){
//         if(exists){
//             var obj = {
//                 table:[]
//             };
            
//             fs1.readFile('exercises.json','utf8', function(err,data){
//                 obj = JSON.parse(data);
//                 // console.log(obj.table);
//                 obj.table.forEach(function(exercise){
//                     Exercise.create(exercise, function(err){
//                         if(err){
//                             console.log(err)
//                         }
//                         else{
//                             console.log(exercise)
//                             console.log("added exercise");
//                         }
//                     });
//                 });
//             });
//         }
//         else{
//             console.log("error");  
//         } 
//     });   
// });

// const fs1 = require("fs");
// fs1.exists('food3.json', function(exists){
//     if(exists){
//         var obj = {
//             table:[]
//         };
        
//         fs1.readFile('food3.json','utf8', function(err,data){
//             obj = JSON.parse(data);
//             // console.log(obj.table);
//             obj.table.forEach(function(food){
//                 food.energy.amount = food.energy.amount*1000;
//             });
//             var json = JSON.stringify(obj);
//             fs1.writeFile('food3.json', json, 'utf8', function(err){
//                 console.log("done");
//             });
//         });
//     }
//     else{
//         console.log("error");  
//     } 
// });   

// const fs = require("fs");
// fs.exists('food1.json', function(exists){
//     if(exists){
//         var src = {
//             table:[]
//         };
        
//         var des = {
//             table:[]
//         };

//         var res = {
//             table:[]
//         };
        
//         fs.readFile('food1.json','utf8', function(err,desdata){
//             des = JSON.parse(desdata);
//             console.log(des.table.length);
//             const fs1 = require("fs");
//             fs1.readFile('food3.json', 'utf8', function(err,srcdata){
//                 src = JSON.parse(srcdata);
//                 console.log(src.table.length);
//                 res.table = des.table.concat(src.table);
//                 console.log(res.table.length);
//                 var json = JSON.stringify(res);
//                 fs.writeFile('food1.json', json, 'utf8', function(err){
//                     console.log("done");
//                 });
//             });
//         });
//     }
// });

// Food.update({'name': "App"}, {'$set': {
//     'name': "Apple"
// }}, function(err, food) {
//     console.log(food);
// });

// Food.distinct('categoryTag', function(err, Tags){
//     console.log(Tags);
// });

// Exercise.find({}, function(err, exercises){
//     exercises.forEach(function(exercise){
//         Exercise.findById(exercise._id, function(err, e){
//             e.verified = true;
//             e.activeUsers = 0;
//             e.save();
//             console.log(e);
//         });
//     })
// });

// Food.find({}, function(err, foods){
//     foods.forEach(function(food){
//         Food.findById(food._id, function(err, f){
//             f.verified = true;
//             f.activeUsers = 0;
//             f.save();
//             console.log(f);
//         });
//     })
// });
