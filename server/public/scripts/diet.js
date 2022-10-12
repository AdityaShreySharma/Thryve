$(document).ready(function(){
    
    $("#chk").click(function(){
        $.get("/api", function(user, status){
            var diet = user.diet;
            var sum = 0;
            diet.forEach(function(d){
                sum += d.food.energy.amount * d.quantity.amount/100;
            });
            $("#total").html("<b>" + sum + "</b>");
        });
    });

    //AUTOCOMPLETE
    var data = [];
    function autocomplete(inp, arr) {
        var currentFocus;
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) { return false;}
            if(val.length<3){
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
           
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    // b.style.position="relative"
                    // b.style.zIndex="100";
                    // document.getElementsByTagName('div').style.zIndex='100';
                    b.addEventListener("click", function(e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        document.getElementById("submitbutton1").click();
                        closeAllLists();
                    });
                    a.appendChild(b);
                    
                }
            }
        });
    
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { //up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                document.getElementById("submitbutton1").click();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
    
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
    
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
    $.get("/foods/api", function(foods, status){
        foods.forEach(function(food){
            data.push(food.name);
        });
    })
    autocomplete(document.getElementById("searchbar"), data);
});