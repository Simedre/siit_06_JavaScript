var url = new URL(document.URL);
var productId = url.searchParams.get('id');

document.querySelector('#renunta').addEventListener('click', function () {
    window.open('./admin.html', '_self');
});


fetch(`https://siit-bucuresti-acba0.firebaseio.com/store/${productId}.json`)
    .then(response => {
        if (response.status === 200)
            return response.json();
        else
            console.log(response.status);
    })
    .then(result => {
        document.getElementById("imagine1").value = result.imagine[0];
        document.getElementById("imagine2").value = result.imagine[1];
        document.getElementById("imagine3").value = result.imagine[2];
        document.getElementById("imagine4").value = result.imagine[3];
        document.getElementById("imagine5").value = result.imagine[4];
        document.getElementById("pret").value = result.pret;
        document.getElementById("nume").value = result.nume;
        document.getElementById("stoc").value = result.stoc;
        document.getElementById("descriere").value = result.descriere;
        document.getElementById("tags").value = result.tags.join("\n");
    })
    .catch(err => console.log(err));

document.querySelector('#salveaza').addEventListener('click', function () {

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
    fetch(`https://siit-bucuresti-acba0.firebaseio.com/store/${productId}.json`,{
        method: "PUT",
        body: JSON.stringify(newProduct)
    })
    .then(() => window.open('./admin.html', '_self'))
    .catch(err => console.log(err));
});