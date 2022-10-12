$(document).ready(function(){
    $.get("/foods/api", function(foods, status){
        var points = []
        for(var i=0; i<10; i++){
            if(foods[i].activeUsers>0){
                points.push({y: foods[i].activeUsers, label: foods[i].name.charAt(0).toUpperCase() + foods[i].name.slice(1)});
            }
        }
        var chart = new CanvasJS.Chart("foodsTrending", {
            animationEnabled: true,
            
            title:{
                text:"Trending Foods"
            },
            axisX:{
                interval: 1
            },
            axisY2:{
                interlacedColor: "rgba(1,77,101,.2)",
                gridColor: "rgba(1,77,101,.1)",
                title: "Number of Active Subscribers"
            },
            data: [{
                type: "bar",
                name: "foods",
                axisYType: "secondary",
                color: "#014D65",
                dataPoints: points.reverse()
            }]
        });
        chart.render();
    });

    $.get("/exercises/api", function(exercises, status){
        var points = []
        for(var i=0; i<10; i++){
            if(exercises[i].activeUsers>0){
                points.push({y: exercises[i].activeUsers, label: exercises[i].name.charAt(0).toUpperCase() + exercises[i].name.toLowerCase().slice(1)});
            }
        }
        var chart = new CanvasJS.Chart("exercisesTrending", {
            animationEnabled: true,
            
            title:{
                text:"Trending Exercises"
            },
            axisX:{
                interval: 1
            },
            axisY2:{
                interlacedColor: "rgba(1,77,101,.2)",
                gridColor: "rgba(1,77,101,.1)",
                title: "Number of Active Subscribers"
            },
            data: [{
                type: "bar",
                name: "exercises",
                axisYType: "secondary",
                color: "#014D65",
                dataPoints: points.reverse()
            }]
        });
        chart.render();
    });

    $.get("/api", function(user, status){
        var diet = user.diet;
        var targetCalorieSum = 0;
        var proteinSum = 0;
        var fatSum = 0;
        var carbohydratesSum = 0;
        var currentCalorieSum = 0;
        diet.forEach(function(d){
            if(d.check){
                currentCalorieSum += d.food.energy.amount * d.quantity.amount/100;
            }
            targetCalorieSum += d.food.energy.amount * d.quantity.amount/100;
            proteinSum += d.food.nutrients.protein.amount * d.quantity.amount/100;
            fatSum += d.food.nutrients.fat.amount * d.quantity.amount/100;
            carbohydratesSum += d.food.nutrients.carbohydrates.amount * d.quantity.amount/100;
        });
        targetCalorieSum = targetCalorieSum.toFixed(2);
        proteinSum = proteinSum.toFixed(2);
        fatSum = fatSum.toFixed(2);
        carbohydratesSum = carbohydratesSum.toFixed(2);
        currentCalorieSum = currentCalorieSum.toFixed(2);
        $("#calorieTotal").html("<b>" + targetCalorieSum + " kcal</b>");
        $("#proteinTotal").html("<b>" + proteinSum + " g</b>");
        $("#fatTotal").html("<b>" + fatSum + " g</b>");
        $("#carbohydratesTotal").html("<b>" + carbohydratesSum + " g</b>");
        $("#currentCalorieTotal").html("<b>" + currentCalorieSum + " kcal</b>");

        var workout = user.workout;
        var targetCalorieBurn = 0;
        var currentCalorieBurn = 0;
        var diff_ms = Date.now() - new Date(user.profile.dob).getTime();
        var age_dt = new Date(diff_ms)
        var age = Math.abs(age_dt.getUTCFullYear() - 1970);
        var BMR = (10*user.profile.weight.magnitude) + (6.25*user.profile.height.magnitude) - (5*age);
        if(user.profile.gender == "male"){
            BMR += 5;
        }
        else{
            BMR -= 161;
        }
        workout.forEach(function(w){
            if(w.check){
                currentCalorieBurn += w.duration*w.exercise.MET*3.5*user.profile.weight.magnitude/200;
            }
            targetCalorieBurn += w.duration*w.exercise.MET*3.5*user.profile.weight.magnitude/200;
        });
        currentCalorieBurn = currentCalorieBurn.toFixed(2);
        targetCalorieBurn = targetCalorieBurn.toFixed(2);

        $("#currentCalorieBurnId").html("<b>" + currentCalorieBurn + "</b>");
        $("#targetCalorieBurnId").html("<b>" + targetCalorieBurn + "</b>");
    });
});