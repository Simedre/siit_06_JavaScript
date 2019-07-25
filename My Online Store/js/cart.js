var cart;
var alertStoc = "";

//drawCart();
getData();

function drawCart() {
    var showNrProd = document.getElementById("nrProd");
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem('cart'))
    } else {
        document.getElementById("erorrs").innerHTML = "Cosul de cumparaturi este gol!";
    }
    var cartDetail = document.getElementById("cartTable");
    var newCart = "";
    var total = 0;
    var alertNume = "";
    var alertPret = "";
    var produs = {};
    var nrProd = 0;
    for (var i in cart) {
        var tags = "";
        for (var j = 0; j < products[i].tags.length; j++) {
            tags += products[i].tags[j] + ", ";
        }
        if (products[i].nume !== cart[i].nume) {
            alertNume = `Denumirea produsului a fost modificata in: ${products[i].nume}`;
            produs = {
                id: i,
                nume: products[i].nume,
                pret: cart[i].pret,
                stoc: cart[i].stoc,
                cantitate: cart[i].cantitate
            }
            delete cart[i];
            cart[i] = produs;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        if (Number(products[i].pret) !== Number(cart[i].pret)) {
            alertPret = `Pretul produsului a fost modificata de la ${cart[i].pret} RON la ${products[i].pret} RON`;
            produs = {
                id: i,
                nume: cart[i].nume,
                pret: products[i].pret,
                stoc: cart[i].stoc,
                cantitate: cart[i].cantitate
            }
            delete cart[i];
            cart[i] = produs;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        if (Number(products[i].stoc) < Number(cart[i].cantitate)) {
            alertStoc = `Stocul produsului este mai mic decat cantitatea dorita ${cart[i].cantitate}buc. Stoc: ${products[i].stoc} buc. `;
            produs = {
                id: i,
                nume: cart[i].nume,
                pret: cart[i].pret,
                stoc: cart[i].stoc,
                cantitate: products[i].stoc
            }
            delete cart[i];
            cart[i] = produs;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        newCart += `
        <tr>
            <th scope="row" class="border-0">
                <div class="p-2">
                    <img src="${products[i].imagine[0]}" alt="" width="70" class="img-fluid rounded shadow-sm">
                    <div class="ml-3 d-inline-block align-middle">
                        <spam id="erorrs">${alertNume}</spam></br>
                        <h5 class="mb-0">
                            <a href="./details.html?id=${i}" class="text-dark d-inline-block align-middle">${cart[i].nume}</a>
                        </h5>
                        <span class="text-muted font-weight-normal font-italic d-block">Categorie: ${tags}</span>
                    </div>
                </div>
            </th>
            <td class="border-0 align-middle">
                <spam id="erorrs">${alertPret}</spam></br>
                <strong>${cart[i].pret} RON</strong>
            </td>
            <td class="border-0 align-middle">
                <spam id="erorrs">${alertStoc}</spam></br>
                <div class="col-10 d-flex text-center">
                    <button data-id="${i}" class="minus btn btn-primary">-</button>
                    <input data-id="${i}" class="text-center stoc" type="text" value="${cart[i].cantitate}" size="1" disabled>
                    <button data-id="${i}" class="plus btn btn-primary">+</button>
                </div>
            </td>
            <td class="border-0 align-middle">
                <button id="${i}"class="delete btn btn-danger"><i class="far fa-trash-alt"></i></button>
            </td>
        </tr>
        `;
        total += cart[i].pret * cart[i].cantitate;
        alertNume = "";
        alertPret = "";
        alertStoc = "";
        nrProd++;
    }

    showNrProd.innerHTML = nrProd;

    cartDetail.innerHTML = newCart;
    cartDetail.querySelectorAll('.delete').forEach(function (element) {
        element.addEventListener('click', removeItem);
    });
    cartDetail.querySelectorAll('.plus').forEach(function (element) {
        element.addEventListener('click', updateCart);
    });
    cartDetail.querySelectorAll('.minus').forEach(function (element) {
        element.addEventListener('click', updateCart);
    });

    var totalFaraTva = Math.round(total / 1.19);
    var tva = total - totalFaraTva;
    var shipping = 0;

    if (totalFaraTva < 10000) {
        shipping = 300;
    } else if (totalFaraTva < 15000) {
        shipping = 200;
    } else {
        shipping = 0;
    }
    var grandTotal = Math.round(total + shipping);
    var showTotal = document.getElementById("desfasurator");
    showTotal.innerHTML = `
            <li class="d-flex justify-content-between py-3 border-bottom">
                <strong class="text-muted">Subtotal </strong>
                <strong>${totalFaraTva.toFixed(2)} RON</strong>
            </li>
            <li class="d-flex justify-content-between py-3 border-bottom">
                <strong class="text-muted">Transport</strong>
                <strong>${shipping.toFixed(2)} RON</strong>
            </li>
            <li class="d-flex justify-content-between py-3 border-bottom">
                <strong class="text-muted">TVA</strong>
                <strong>${tva.toFixed(2)} RON</strong>
            </li>
            <li class="d-flex justify-content-between py-3 border-bottom">
                <strong class="text-muted">Total</strong>
                <h5 class="font-weight-bold">${grandTotal.toFixed(2)} RON</h5>
            </li>
    `;
}

function getData() {
    return fetch("https://siit-bucuresti-acba0.firebaseio.com/store/.json", {
        method: "GET"
    })
        .then((response) => response.json())
        .then((data) => {
            //draw(data);
            window.products = data;
        })
        .then(function () {
            drawCart();
        })
}

function removeItem() {
    let id = this.id;
    delete cart[id];
    localStorage.setItem('cart', JSON.stringify(cart));
    drawCart();
}

function updateCart() {
    let id = this.dataset.id;
    console.log(id);
    if (event.target.classList.contains('minus')) {
        if (cart[id].cantitate == 1) {

        } else {
            cart[id].cantitate = Number(cart[id].cantitate) - 1;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    if (event.target.classList.contains('plus')) {
        if (Number(products[id].stoc) === Number(cart[id].cantitate)) {
            alertStoc = "Cantitatea comandata nu poate depasi stocul!";
        } else {
            cart[id].cantitate = Number(cart[id].cantitate) + 1;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    drawCart();
}

document.getElementById("placeOrder").addEventListener("click", async function () {
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem('cart'))
    }
    let arr =[];
    for (var i in cart) {
        var buy = products[i].stoc - cart[i].cantitate;
        arr.push(fetch(`https://siit-bucuresti-acba0.firebaseio.com/store/${i}/stoc.json`, {
            method: "PUT",
            body: buy
        }));
    }
    await Promise.all(arr);
    //cart = "";
    localStorage.removeItem("cart");
});