getData();
showNrProd();

var objKey = [];

function getData() {
    return fetch("https://siit-bucuresti-acba0.firebaseio.com/store/.json", {
        method: "GET"
    })
        .then((response) => response.json())
        .then(function (data) {
            window.products = data;
            objKey = Object.keys(products);
            draw(data);
        })
}

function shuffle(a) {
    var j, x, i;
    for (i = objKey.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = objKey[i];
        objKey[i] = objKey[j];
        objKey[j] = x;
    }
    return objKey;
}

function draw(obj) {
    var listaProduse = document.getElementById("listaProduse");
    var carousel = document.getElementById("carousel-produse");
    var cat = document.getElementById("cat");
    var nrTags = "";
    var tags = [];
    for (var key in obj) {
        for (let j = 0; j < obj[key].tags.length; j++) {
            tags.push(obj[key].tags[j]);
        }
    }
    tags.sort();

    var current = null;
    var cnt = 0;
    for (let x = 0; x < tags.length; x++) {
        if (tags[x] != current) {
            if (cnt > 0) {
                nrTags += `
                        <button id="${current}" class="dropdown-item">
                            ${current} 
                            <span class="badge badge-primary badge-pill float-none">
                                ${cnt}
                            </span>
                        </button>
                    `;
            }
            current = tags[x];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        nrTags += `
                <button id="${current}" class="dropdown-item">
                    ${current} 
                    <span class="badge badge-primary badge-pill float-none">
                        ${cnt}
                    </span>
                </button>
            `;
    }
    cat.innerHTML = nrTags;
    cat.querySelectorAll('.dropdown-item').forEach(function (element) {
        element.addEventListener('click', search);
    });
    var newProdus = "";
    var imgCarusel = [];
    var showCarusel = "";
    var x = 0;
    //console.log(tags);
    objKey = shuffle(objKey);
    //console.log(objKey);
    for (var i = 0; i < objKey.length; i++) {
        // for (var key in obj) {
        if (x < 6) {
            newProdus += `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100">
                            <a href="./pages/details.html?id=${objKey[i]}"><img class="card-img-top" src="${obj[objKey[i]].imagine[0]}" alt=""></a>
                            <div class="card-body">
                                <h4 class="card-title">
                                    <a href="./pages/details.html?id=${objKey[i]}">${obj[objKey[i]].nume.substring(0, 20)}...</a>
                                </h4>
                                <h5>${obj[objKey[i]].pret} RON</h5>
                                <p class="card-text">${obj[objKey[i]].descriere.substring(0, 50)}...</p>
                            </div>
                        </div>
                    </div>
                `;
            imgCarusel.push(obj[objKey[i]].imagine[0]);
        }
        x++;
    }
    for (var x = 0; x < 3; x++) {
        let nr = Math.floor(Math.random() * imgCarusel.length);
        if (x === 0) {
            showCarusel += `
                        <div class="carousel-item active">
                            <img class="d-block w-100" src="${imgCarusel[nr]}" alt="First slide">
                        </div>
                    `;
        } else {
            showCarusel += `
                            <div class="carousel-item">
                                <img class="d-block w-100" src="${imgCarusel[nr]}">
                            </div>
                        `;
        }
    }
    listaProduse.innerHTML = newProdus;
    carousel.innerHTML = showCarusel;
}

document.querySelector('#searchBtn').addEventListener('click', search);

function search() {
    console.log("merge");
    let foundItems = {};
    let query = "";
    if (event.target.id == "searchBtn" || event.target.id == "searchIcon") {
        query = document.querySelector('#inputField').value.trim();
        window.location.assign(`#src=${query}`);
    } else {
        query = event.target.id.toLowerCase();
        window.location.assign(`#src=${query}`);
        console.log(event.target.id);
    }
    //console.log(query);
    if (query) {
        console.log(query);
        for (let key in products) {
            let arrTag = "";
            for (var i = 0; i < products[key].tags.length; i++) {
                arrTag = products[key].tags[i].toLowerCase();
            }
            //console.log(arrTag);
            let arr = products[key].descriere.split(/[\s,]+/);
            for (let a = 0; a < arr.length; a++) {
                arr[a] = arr[a].toLowerCase();
            }
            //console.log(arr);
            let arrNume = products[key].nume.split(/[\s,]+/g);
            for (let b = 0; b < arrNume.length; b++) {
                arrNume[b] = arrNume[b].toLowerCase();
            }
            //console.log(arrNume);
            if (arr.includes(query) || arrNume.includes(query) || arrTag.includes(query)) {
                foundItems[key] = products[key];
                console.log(foundItems);
            }
        }
        if (Object.keys(foundItems).length > 0) {
            objKey = Object.keys(foundItems);
            draw(foundItems);
        }
    }
}

function showNrProd(){
    if (localStorage.getItem("cart")) {
        var cart = JSON.parse(localStorage.getItem('cart'))
        var showNrProd = document.getElementById("nrProd");
        var nrProd = 0;
        for (var i in cart){
            nrProd++;
        }
        showNrProd.innerHTML = nrProd;
    }
}
