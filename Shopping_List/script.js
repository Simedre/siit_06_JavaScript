var shoppingList = [];
var shoppingListArr = [];
var index2;
var dir;
var url = "https://shopping-list-3f532.firebaseio.com/.json";
var indexEdit = -1;

class Item {
    constructor(denumire, mark){
        this.denumire = denumire;
        this.mark = false;
    }
}

async function ajaxPromise(url,method, body){
    return new Promise(function(resolve,reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if ( this.readyState == 4 ){
                if ( this.status == 200 ){
                    resolve(this.responseText)
                } else {
                    reject(this);
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    });
}

async function addItem(event){
    event.preventDefault();
    if (event.target.id == "shopping_submit"){
        var product = document.getElementById("product").value;
        if (product){
            var temp ={
                denumire : product,
                mark : false
            };
            await ajaxPromise( "https://shopping-list-3f532.firebaseio.com/.json","POST",JSON.stringify(temp));
            document.getElementById("product").value = "";
        }
    }
}
document.getElementById("shopping_form").addEventListener("click", addItem);

async function getLista(){
    var responseText = await ajaxPromise("https://shopping-list-3f532.firebaseio.com/.json","GET");
    window.shoppingList = JSON.parse(responseText);
    window.shoppingListArr = Object.keys(shoppingList).map(function(key) {
        return [Number(key), shoppingList[key]];
      });
    drawList();
}

function drawList(){
    if (event.target.id == "shopping_submit"){
        var show = document.getElementById("show_shoppind");
        show.className = " show";
    }
    var tableShopping = document.getElementById("table_shopping");
    var tableDataShopping = "";
    var table = document.getElementById("table_shopping");
    var rows = table.rows;
    if (event.target.id == "shopping_submit" && Number(rows.length) > 1){
        var nrRow = rows.length;
        var newRow = tableShopping.insertRow(nrRow);
        var x = newRow.insertCell(0);
        var y = newRow.insertCell(1);
        var nr = shoppingListArr.length
        x.innerHTML = `${shoppingListArr[nr-1][1].denumire}`;
        y.innerHTML = `Mark as buyed`;
        y.setAttribute("id", "mark");
    } else if (event.target.id == "shopping_submit" || event.target.id == "asc" || event.target.id == "dsc"){
        var tableHeadShopping = `<tr>
                                <th>Item description</th>
                                <th>Action</th>
                                </tr>`;
        for (var i = 0; i<shoppingListArr.length; i++){
            if (shoppingListArr[i][1].mark == true){
                tableDataShopping += `<tr>
                                        <td class="marked">${shoppingListArr[i][1].denumire}</td>
                                        <td id="mark">Mark as buyed</td>
                                    </tr>`;
            } else {
                tableDataShopping += `<tr>
                                        <td>${shoppingListArr[i][1].denumire}</td>
                                        <td id="mark">Mark as buyed</td>
                                    </tr>`;
            }
        }
    tableShopping.innerHTML = tableHeadShopping + tableDataShopping;
    }
}
document.getElementById("shopping_form").addEventListener("click", drawList);

async function markBuyed(){
    index2 = Number(event.target.parentElement.rowIndex - 1);
    if (event.target.id == "mark"){
        var table = document.getElementById("table_shopping");
        var rows = table.rows;
        var cell = rows[index2+1].cells[0];
        cell.className = "marked";
        var keys = Object. keys(shoppingList) ;
        indexEdit = keys[index2];
        var temp = {
            denumire : shoppingListArr[index2][1].denumire,
            mark : true
        }
            await ajaxPromise(
                `https://shopping-list-3f532.firebaseio.com/${indexEdit}.json`,
                "PUT",
                JSON.stringify(temp));
    }
}
document.getElementById("table_shopping").addEventListener("click", markBuyed);

async function sort(shoppingListArr, dir){
    for (var i = 0; i < shoppingListArr.length; i++){
        for (var j = i + 1; j < shoppingListArr.length; j++){
            if (dir === "dsc"){
                if (shoppingListArr[i][1].denumire > shoppingListArr[j][1].denumire){
                    var temp = shoppingListArr[i];
                    shoppingListArr[i] = shoppingListArr[j];
                    shoppingListArr[j] = temp;
                }
            } else if (dir === "asc"){
                if (shoppingListArr[i][1].denumire < shoppingListArr[j][1].denumire){
                    var temp = shoppingListArr[i];
                    shoppingListArr[i] = shoppingListArr[j];
                    shoppingListArr[j] = temp; 
                }
            }
        }
    }
    drawList(shoppingListArr);
}

function criteriu(){
        dir = event.target.id;
        if (dir == "asc"){
            dir = "dsc";
        } else{
            dir = "asc";
        }
        sort(shoppingList, dir);
}
document.getElementById("asc").addEventListener("click", criteriu);
document.getElementById("dsc").addEventListener("click", criteriu);
