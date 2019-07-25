// add articol
var mesaj = document.getElementById("mesaj");
var adaugaForm = document.getElementById("adaugaForm");
var products = {};
var productsArr = [];
var foundItems = {};

async function load(){
    await getData();
    draw(products);
}


document.getElementById("salveaza").addEventListener("click", addProduct);
document.getElementById("adauga").addEventListener("click", show);
document.getElementById("renunta").addEventListener("click", hide);

function addProduct(){
    var newProduct = {
        imagine: [
            document.getElementById("imagine1").value,
            document.getElementById("imagine2").value,
            document.getElementById("imagine3").value,
            document.getElementById("imagine4").value,
            document.getElementById("imagine5").value,
        ],
        pret: document.getElementById("pret").value,
        nume: document.getElementById("nume").value,
        stoc: document.getElementById("stoc").value,
        descriere: document.getElementById("descriere").value,
        tags: document.getElementById("tags").value.split(/[\n\r]+/g)
    };
    fetch("https://siit-bucuresti-acba0.firebaseio.com/store/.json",{
        method: "POST",
        body: JSON.stringify(newProduct)
    })
    .then(function(){
        mesaj.innerHTML = "Produsul a fost adaugat cu succes!";
    })
    document.getElementById("imagine1").value = "";
    document.getElementById("imagine2").value = "";
    document.getElementById("imagine3").value = "";
    document.getElementById("imagine4").value = "";
    document.getElementById("imagine5").value = "";
    document.getElementById("pret").value = "";
    document.getElementById("nume").value = "";
    document.getElementById("stoc").value = "";
    document.getElementById("descriere").value = "";
    document.getElementById("tags").value = "";
}

function show(){
    if (event.target.id == "adauga" || event.target.classList.contains('modifica')){
        adaugaForm.className = "show";
    }
}

function hide(){
    if (event.target.id == "renunta"){
        adaugaForm.classList.remove("show");
        adaugaForm.className = "hidden";
    }
}

async function getData(){
    return fetch ("https://siit-bucuresti-acba0.firebaseio.com/store/.json",{
        method: "GET"
    })
    .then((response)=>response.json())
    .then((data)=>{
        window.products=data;
        for(var i in products){
            window.productsArr.push([i, products[i]]);
        }
    })
}

function draw(obj){
    var ultimileProduse = document.getElementById("ultimileProduse");
    var ultimile10 = "";
    var ten = 0;
    for (var i in obj){
        if (ten < 10){
            ultimile10 +=`
                <tr>
                    <th scope="row" class="border-0">
                        <div class="p-2" data-toggle="collapse" href="#collapseExample-${i}" role="button" aria-expanded="false" aria-controls="collapseExample">
                            <img src="${obj[i].imagine[0]}" alt="" width="70" class="img-fluid rounded shadow-sm"/>
                        </div>
                    </th>
                    <td class="border-0 align-middle">
                        <h5 class="mb-0">
                            <a href="./details.html?id=${i}" class="text-dark d-inline-block align-middle">${obj[i].nume.substring(0, 20)}...</a>
                        </h5>
                    </td>
                    <td class="border-0 align-middle">
                            <strong>${obj[i].pret} RON</strong>
                    </td>
                    <td class="border-0 align-middle">
                        <button id="${i}" class="modifica btn btn-info"><i id="${i}" class="far fa-edit"></i></button>
                    </td>
                    <td class="border-0 align-middle">
                        <button id="${i}" class="delete btn btn-danger"><i id="${i}" class="far fa-trash-alt"></i></button>
                    </td>
                </tr>
                <tr class="collapse float-none" id="collapseExample-${i}">
                    <td colspan="5" class="text-white bg-dark">
                        <h5 class="mb-0">${obj[i].nume}</h5>
                        <span>${obj[i].descriere}</span>
                    </td>
                </tr>
            `;
            if (Object.keys(foundItems).length > 0){
                ten = 0;
            }
        } else {
            break;
        }
        ten++;
    }
    ultimileProduse.innerHTML = ultimile10;

    ultimileProduse.querySelectorAll('.delete').forEach(function (element) {
        element.addEventListener('click',function(){
            window.location.assign(`./delete.html?id=${event.target.id}&name=${obj[event.target.id].nume}`);
        });
    });

    ultimileProduse.querySelectorAll('.modifica').forEach(function (element) {
        element.addEventListener('click',function(){
            window.location.assign(`./edit.html?id=${event.target.id}`);
        });
    });
}

document.querySelector('#searchBtn').addEventListener('click', function () {
    //console.log("merge");
    let query = document.querySelector('#inputField').value.trim();
    if (query) {
        for (let key in products) {
            let arr = products[key].descriere.split(/[\s,]+/);
            for (let a = 0; a < arr.length; a++){
                arr[a] = arr[a].toLowerCase();
            }
            let arrNume = products[key].nume.split(/[\s,]+/g);
            for (let b = 0; b < arrNume.length; b++){
                //console.log(arrNume[b].toLowerCase());
            }
            let arrTag;
            for (var i=0; i<products[key].tags.length; i++){
                arrTag += products[key].tags[i].toLowerCase();
            }
            if (arr.includes(query) || arrNume.includes(query) || arrTag.includes(query)) {
                foundItems[key] = products[key];
                console.log(foundItems);
            }
        }
        if (Object.keys(foundItems).length > 0) {            
            draw(foundItems);
        }
    }
});