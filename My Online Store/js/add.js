document.getElementById("salveaza").addEventListener("click", addProduct);

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
        document.getElementById("mesaj").innerHTML = "Produsul a fost adaugat cu succes!";
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