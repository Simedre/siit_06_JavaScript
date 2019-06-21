var elevi = [];
var eleviArr = [];
var nr;
var url = "https://students-catalog.firebaseio.com/.json";

class Elev {
    constructor(nume, nota, medie,order){
        this.nume = nume;
        this.nota =  nota;
        this.medie = medie;
        this.order = order;
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

function faraDate(){
    if (elevi.length == 0){
        var nuAvemDate = document.getElementById("faraElevi");
        nuAvemDate.innerHTML = "Nici un elev adaugat";
    }
}

async function addElev(){
    event.preventDefault();
    var nume = document.getElementById("nume").value;
    var newElev = new Elev (nume,[0],0,eleviArr.length+1);
    var errorElev = document.getElementById("errorElev");
    if ( nume ){
        await ajaxPromise( "https://students-catalog.firebaseio.com/.json","POST",JSON.stringify(newElev));
        errorElev.innerHTML = "";
    } else {
        errorElev.innerHTML = "Numele elevului trebuie completat!";
    }
    //console.log(nume);
    //console.log(elevi);
    //draw();
}
document.getElementById("addNewElev").addEventListener("click", addElev);

async function getElevi(){
    var responseText = await ajaxPromise("https://students-catalog.firebaseio.com/.json","GET");
    window.elevi = JSON.parse(responseText);
    window.eleviArr = Object.keys(elevi).map(function(key) {
        return [Number(key), elevi[key]];
      });
    draw();
}
document.getElementById("addNewElev").addEventListener("click", getElevi);

function draw(){
    var tableElevi = document.getElementById("eleviTable");
    var tableData = "";
    var tableHead = `
            <tr>
                <th>Nr. Crt.</th>
                <th>Nume</th>
                <th>Medie Note</th>
                <th>Afisare Note</th>
            </tr>
    `;
    for (var i in elevi){
        if (elevi[i].nota > 0){
            var x = elevi[i].nota.reduce(sum) / elevi[i].nota.length;
            elevi[i].medie = Math.round(x * 100) / 100;
        }
        tableData += `
                        <tr>
                            <td>${elevi[i].order}
                            <td>${elevi[i].nume}</td>
                            <td>${elevi[i].medie}</td>
                            <td id="arataNotele">Vezi Notele</td>
                        </tr>`;
        /*
        if (elevi[i].nota > 0){
            var x = elevi[i].nota.reduce(sum) / elevi[i].nota.length;
            elevi[i].medie = Math.round(x * 100) / 100;
            tableData += `
                <tr>
                    <td>${elevi[i].order}
                    <td>${elevi[i].nume}</td>
                    <td>${elevi[i].medie}</td>
                    <td id="arataNotele">Vezi Notele</td>
                </tr>
            `;
        } else {
            tableData += `
                <tr>
                    <td>${elevi[i].order}
                    <td>${elevi[i].nume}</td>
                    <td></td>
                    <td id="arataNotele">Vezi Notele</td>
                </tr>
            `;
        }
        */
    }
    tableElevi.innerHTML = tableHead + tableData;
    var nuAvemDate = document.getElementById("faraElevi");
    nuAvemDate.innerHTML = "";
}

function showNote(){
    index = Number(event.target.parentElement.rowIndex - 1);
    if (eleviArr[index][1].nota.length == 0 ){
        var nuAvemNote = document.getElementById("faraNote");
        nuAvemNote.innerHTML = "Nici avem nici-o nota";
    }
    if (eleviArr.length > 0){
        var show = document.getElementById("note");
        show.className = "show";
        var smaller = document.getElementById("afisareElevi");
        smaller.className = "smaller";
        var numeElev = document.getElementById("numeElev");
        numeElev.innerHTML = `Note elev: ${eleviArr[index][1].nume}`;
    }
    nr = index;
    if (eleviArr[nr][1].nota.length > 0){
        var tableNote = document.getElementById("afisareNote");
        var tableData = "";
        var tableHead = `
                <tr>
                    <th>Nota</th>
                </tr>
        `;
        for (var i = 0; i < eleviArr[nr].nota.length; i++){
                tableData += `
                    <tr>
                        <td>${eleviArr[nr].nota[i]}</td>
                    </tr>
                `;
        }
        tableNote.innerHTML = tableHead + tableData;
    } else {
        var tableNote = document.getElementById("afisareNote");
        var tableData = "";
        var tableHead = "";
        tableNote.innerHTML = tableHead + tableData;
    }
    //console.log(index);
    //console.log(elevi);
    //console.log(nr);

}
document.getElementById("eleviTable").addEventListener("click", showNote);

function hideNote(){
    if (event.target.id == "hide"){
        var show = document.getElementById("note");
        show.className = "hidden";
        var smaller = document.getElementById("afisareElevi");
        smaller.className = "normal";
    }
}
document.getElementById("hide").addEventListener("click", hideNote);

async function addNota(){
    var keys = Object.keys(elevi);
    var indexEdit = keys[nr];
    if (event.target.id == "addNota"){
        var nota = document.getElementById("nota").value;
        var newNota = elevi[indexEdit].nota.push(nota);
        //eleviArr[nr].nota.push(newNota);
        var temp = new Elev (elevi[indexEdit].nume,[newNota],elevi[indexEdit].medie,elevi[indexEdit].order);
        await ajaxPromise( `https://students-catalog.firebaseio.com/${indexEdit}.json`,"PUT",JSON.stringify(temp));
    }
    console.log(elevi[indexEdit]);
    var nuAvemNote = document.getElementById("faraNote");
    nuAvemNote.innerHTML = "";
    var tableNote = document.getElementById("afisareNote");
    var tableData = "";
    var tableHead = `
            <tr>
                <th>Nota</th>
            </tr>
    `;
    for (var i in elevi){
        for (var j = 0; j<elevi[i].nota.length; j++){
            tableData += `
                <tr>
                    <td>${elevi[i].nota[j]}</td>
                </tr>
            `;
        }
    }
    tableNote.innerHTML = tableHead + tableData;
    draw(elevi);
}
document.getElementById("addNota").addEventListener("click", addNota);

function sum(a,b){
    return Number(a) + Number(b);
}

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    if (event.target.id == "sortMedie"){
        table = document.getElementById("eleviTable");
    } else if (event.target.id == "sortNote"){
        table = document.getElementById("afisareNote");
    }
    switching = true;
    dir = "asc"; 
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            if (event.target.id == "sortMedie"){
                x = rows[i].getElementsByTagName("TD")[2];
                y = rows[i + 1].getElementsByTagName("TD")[2];
            } else if (event.target.id == "sortNote"){
                x = rows[i].getElementsByTagName("TD")[0];
                y = rows[i + 1].getElementsByTagName("TD")[0];
            }
            if (dir == "asc") {
                if (x.innerHTML > y.innerHTML) {
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML < y.innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;      
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    // sort array
    for (var i = 0; i < elevi.length; i++){
        for (var j = i + 1; j < elevi.length; j++){
            if (dir === "asc"){
                if (elevi[i].medie > elevi[j].medie){
                    var temp = elevi[i];
                    elevi[i] = elevi[j];
                    elevi[j] = temp;
                }
            } else if (dir === "desc"){
                if (elevi[i].medie < elevi[j].medie){
                    var temp = elevi[i];
                    elevi[i] = elevi[j];
                    elevi[j] = temp; 
                }
            }
        }
    }
}
document.getElementById("sortMedie").addEventListener("click", sortTable);
document.getElementById("sortNote").addEventListener("click", sortTable);