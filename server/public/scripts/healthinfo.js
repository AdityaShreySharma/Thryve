$(document).ready(function() {
    $.get("/api", function(user, status){
        var profile = user.profile;
        var weight = profile.weight.magnitude;
        var height = profile.height.magnitude;
        var BMI = Number((weight/(height*height/10000)).toFixed(1));
        var text = "";
        if(BMI<18.5){
            text = "Underweight";
            $("#bmiTag").css("color", "orange");

        }
        else if(BMI>=18.5 && BMI<=24.9){
            text = "Healthy";
            $("#bmiTag").css("color", "green");
        }
        else if(BMI>=25 && BMI<29.9){
            text = "Overweight";
            $("#bmiTag").css("color", "orange");
        }
        else if(BMI>=30){
            text = "Obese";
            $("#bmiTag").css("color", "red");
        }

        $("#bmi").html(BMI);
        $("#bmiTag").html("(" + text + ")");
    });

    $.get("/api", function(user, status){
        var data = [];
        user.profile.weightHist.forEach(function(object){
            data.push({x: object.timestamp, y: object.weight.magnitude});
        });
        
        var points = [];
        data.forEach(function(d){
            var date = new Date(d.x)
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getFullYear();
            var HH = date.getHours();
            var MM = date.getMinutes();
            var SS = date.getSeconds();
            points.push({x: new Date(yyyy, mm, dd, HH, MM, SS), y: d.y});
        });
        var chart = new CanvasJS.Chart("weightHist", {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2",
            title:{
                text: "Your Weight History"
            },
            axisX: {
                valueFormatString: "HH MM DD MMM YYYY",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY:{
                title: "Weight (in kg)",
                includeZero: true,
                stripLines: [{
                    value: user.profile.targetWeight,
                    label: "target: " + user.profile.targetWeight.toFixed(2),
                    labelFontColor: "#808080",
                    labelAlign: "near"
                }],
                crosshair: {
                    enabled: true
                }
            },
            toolTip:{
                shared:true
            },
            data: [{        
                type: "line",
                name: "weight",
                indexLabelFontSize: 16,
                dataPoints: points
            }]
        });
        chart.render();
    });

    $.get("/api", function(user, status){
        var diet = user.diet;

        var data = []
        var points = []
        var sum = 0
        diet.forEach(function(d){
            if(!data[d.food.categoryTag]){
                data[d.food.categoryTag] = 1;
            }
            else{
                data[d.food.categoryTag]++;  
            }
            sum++;
        });
        
        for(var key in data){
            points.push({y: Number((data[key]/sum*100).toFixed(2)), label: key})
        }
        var chart = new CanvasJS.Chart("foodDist", {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Your Diet Distribution"
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: points
            }]
        });
        chart.render();
    });

    $.get("/api", function(user, status){
        var diet = user.diet;
        var proteinSum = 0;
        var fatSum = 0;
        var carbohydratesSum = 0;
        diet.forEach(function(d){
            proteinSum += d.food.nutrients.protein.amount * d.quantity.amount/100;
            fatSum += d.food.nutrients.fat.amount * d.quantity.amount/100;
            carbohydratesSum += d.food.nutrients.carbohydrates.amount * d.quantity.amount/100;
        });
        var sum = proteinSum + fatSum + carbohydratesSum;

        var points = [
            {y: Number((proteinSum/sum*100).toFixed(2)), label: "protein"},
            {y: Number((fatSum/sum*100).toFixed(2)), label: "fat"},
            {y: Number((carbohydratesSum/sum*100).toFixed(2)), label: "carbohydrates"}
        ]
        var chart = new CanvasJS.Chart("nutritionDist", {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: ""
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: points
            }]
        });
        chart.render();
    });

    $.get("/api", function(user, status){
        var dataS = [];
        var dataD = []
        user.profile.bpHist.forEach(function(object){
            dataS.push({x: object.timestamp, y: object.bp.systolic});
            dataD.push({x: object.timestamp, y: object.bp.diastolic});
        });
        
        var pointsS = [];
        var pointsD = [];
        dataS.forEach(function(d){
            var date = new Date(d.x)
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getFullYear();
            var HH = date.getHours();
            var MM = date.getMinutes();
            var SS = date.getSeconds();
            pointsS.push({x: new Date(yyyy, mm, dd, HH, MM, SS), y: d.y});
        });
        dataD.forEach(function(d){
            var date = new Date(d.x)
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getFullYear();
            var HH = date.getHours();
            var MM = date.getMinutes();
            var SS = date.getSeconds();
            pointsD.push({x: new Date(yyyy, mm, dd, HH, MM, SS), y: d.y});
        });
        var chart = new CanvasJS.Chart("bpHist", {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2",
            title:{
                text: "Your Blood Pressure History"
            },
            axisX: {
                valueFormatString: "HH MM DD MMM YYYY",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY:{
                title: "Blood Pressure (mm Hg)",
                includeZero: false,
            },
            toolTip:{
                shared:true
            },  
            data: [
                {        
                    type: "line",
                    lineDashType: "dash",
                    indexLabelFontSize: 16,
                    showInLegend: true,
                    name: "systolic",
                    markerType: "square",
                    xValueFormatString: "DD MMM, YYYY",
                    color: "#F08080",
                    dataPoints: pointsS
                },
                {
                    type: "line",
                    lineDashType: "dash",
                    indexLabelFontSize: 16,
                    showInLegend: true,
                    name: "diastolic",
                    markerType: "square",
                    xValueFormatString: "DD MMM, YYYY",
                    dataPoints: pointsD 
                }
            ]
        });
        chart.render();
    });

    $.get("/api", function(user, status){
        var data = [];
        user.profile.sugarHist.forEach(function(object){
            data.push({x: object.timestamp, y: object.sugar});
        });
        
        var points = [];
        data.forEach(function(d){
            var date = new Date(d.x)
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getFullYear();
            var HH = date.getHours();
            var MM = date.getMinutes();
            var SS = date.getSeconds();
            points.push({x: new Date(yyyy, mm, dd, HH, MM, SS), y: d.y});
        });
        var chart = new CanvasJS.Chart("sugarHist", {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2",
            title:{
                text: "Your Blood Sugar History"
            },
            axisX: {
                valueFormatString: "HH MM DD MMM YYYY",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY:{
                title: "Blood Sugar (mg/dl)",
                includeZero: false,
                crosshair: {
                    enabled: true,
                }
            },
            toolTip:{
                shared:true
            },
            data: [{        
                type: "line",
                name: "blood sugar",
                indexLabelFontSize: 16,
                dataPoints: points
            }]
        });
        chart.render();
    });

    $("#twbtn").click(function(){
        if($("#tw").css("display") == "block"){
            $("#tw").css("display", "none");
        }
        else{
            $("#tw").css("display", "block")
        }
    });
});