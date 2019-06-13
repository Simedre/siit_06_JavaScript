var shoppingList = [];
var index2;
var dir;

class Item {
    constructor(denumire, mark){
        this.denumire = denumire;
        this.mark = false;
    }
}

function addItem(event){
    event.preventDefault();
    if (event.target.id == "shopping_submit"){
        var product = document.getElementById("product").value;
        if (product){
            var temp = new Item(product);
            shoppingList.push(temp)
            document.getElementById("product").value = "";
        }
    }
    //console.log(shoppingList);
}
document.getElementById("shopping_form").addEventListener("click", addItem);

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
        x.innerHTML = `${shoppingList[shoppingList.length-1].denumire}`;
        y.innerHTML = `Mark as buyed`;
        y.setAttribute("id", "mark");
    } else if (event.target.id == "shopping_submit" || event.target.id == "asc" || event.target.id == "dsc"){
    var tableHeadShopping = `<tr>
                                <th>Item description</th>
                                <th>Action</th>
                            </tr>`;
    for (var i = 0; i < shoppingList.length; i++){
        if (shoppingList[i].mark == true){
            tableDataShopping += `<tr>
                                        <td class="marked">${shoppingList[i].denumire}</td>
                                        <td id="mark">Mark as buyed</td>
                                </tr>`;
        } else {
            tableDataShopping += `<tr>
                                    <td>${shoppingList[i].denumire}</td>
                                    <td id="mark">Mark as buyed</td>
                                </tr>`;
        }
    }
    tableShopping.innerHTML = tableHeadShopping + tableDataShopping;
}
//console.log(Number(rows.length));
}
document.getElementById("shopping_form").addEventListener("click", drawList);

function markBuyed(){
    index2 = Number(event.target.parentElement.rowIndex - 1);
    if (event.target.id == "mark"){
        var table = document.getElementById("table_shopping");
        var rows = table.rows;
        shoppingList[index2].mark = true;
        var cell = rows[index2+1].cells[0];
        cell.className = "marked";
    }
    //console.log(shoppingList);
    //console.log(rows);
    //console.log(index2);
    //console.log(cell);
}
document.getElementById("table_shopping").addEventListener("click", markBuyed);

function sort(shoppingList, dir){
    for (var i = 0; i < shoppingList.length; i++){
        for (var j = i + 1; j < shoppingList.length; j++){
            if (dir === "dsc"){
                if (shoppingList[i].denumire > shoppingList[j].denumire){
                    var temp = shoppingList[i];
                    shoppingList[i] = shoppingList[j];
                    shoppingList[j] = temp;
                }
            } else if (dir === "asc"){
                if (shoppingList[i].denumire < shoppingList[j].denumire){
                    var temp = shoppingList[i];
                    shoppingList[i] = shoppingList[j];
                    shoppingList[j] = temp; 
                }
            }
        }
    }
    drawList(shoppingList);
}

function criteriu(){
        dir = event.target.id;
        if (dir == "asc"){
            dir = "dsc";
            culoareColoana1 = "green";
        } else{
            dir = "asc";
            culoareColoana1 = "red";
        }
        sort(shoppingList, dir);
}
document.getElementById("asc").addEventListener("click", criteriu);
document.getElementById("dsc").addEventListener("click", criteriu);