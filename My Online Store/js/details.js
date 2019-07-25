var url = new URL(document.URL);
var id = url.searchParams.get('id');

document.addEventListener('DOMContentLoaded', function () {
    var myCarousel = document.getElementById("myCarousel");
    getData();
    showNrProd();

    function getData() {
        return fetch("https://siit-bucuresti-acba0.firebaseio.com/store/.json", {
            method: "GET"
        })
            .then((response) => response.json())
            .then((data) => {
                window.products = data;
                draw(data);
            })
    }

    function draw(obj) {
        var title = document.getElementById("title");
        var description = document.getElementById("description");
        var characteristics = document.getElementById("characteristics");
        var price = document.getElementById("price");
        var imgCarousel = "";
        var related = document.getElementById("related");
        var newRelated = "";
        var nrRelated = 0;
        for (var i = 0; i < obj[id].tags.length; i++) {
            characteristics.innerHTML += `<li>${obj[id].tags[i]}</li>`;
            for (var j in products){
                for (var x = 0; x < products[j].tags.length; x++){
                    if (obj[id].tags[i] === products[j].tags[x]){
                        if (nrRelated < 4 ){
                            newRelated +=`
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <a href="./details.html?id=${j}">
                                        <img class="img-fluid" src="${products[j].imagine[0]}" alt="">
                                    </a>
                                </div>
                            `;
                            nrRelated++;
                        } else {
                            break;
                        }
                    }
                }
                if ( nrRelated >= 4 ){
                    break;
                }
            }
        }
        related.innerHTML = newRelated;
        title.innerHTML = obj[id].nume;
        description.innerHTML = obj[id].descriere;
        price.innerHTML = "Pret: " + obj[id].pret + " RON";
        for (var i = 0; i < obj[id].imagine.length; i++) {
            if (i < 3) {
                if (i === 0) {
                    imgCarousel += `
                <div class="carousel-item active">
                    <img class="d-block w-100" src="${obj[id].imagine[i]}" alt="First slide">
                </div>
            `;
                } else {
                    imgCarousel += `
                    <div class="carousel-item">
                        <img class="d-block w-100" src="${obj[id].imagine[i]}">
                    </div>
                `;
                }
            }
        }
        myCarousel.innerHTML = imgCarousel;
    }

    document.getElementById("addToCart").addEventListener("click", addToCart);


    function addToCart() {
        var produs = {
            id: id,
            nume: products[id].nume,
            pret: products[id].pret,
            stoc: products[id].stoc,
            cantitate: Number(document.getElementById("quantity").value)
        }
        if (localStorage.getItem("cart")) {
            var cart = JSON.parse(localStorage.getItem('cart'))
            if (cart[id]) {
                produs.cantitate += Number(cart[id].cantitate);
            }
        } else {
            var cart = {};
        }
        cart[id] = produs;
        localStorage.setItem('cart', JSON.stringify(cart));
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

}, false);