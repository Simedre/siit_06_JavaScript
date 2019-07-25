var url = new URL(document.URL);
var productId = url.searchParams.get('id');
var productName = url.searchParams.get('name');

document.querySelector('#productName').innerHTML = productName;

document.querySelector('#deleteBtn').addEventListener('click', function () {
    fetch(`https://siit-bucuresti-acba0.firebaseio.com/store/${productId}.json`, {
        method: 'DELETE'
    })
        .then(() => window.location.assign('./admin.html'))
        .catch(err => console.log(err));
});

document.querySelector('#cancelBtn').addEventListener('click', function () {
    window.location.assign('./admin.html');
});