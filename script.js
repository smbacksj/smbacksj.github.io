
let map;
let positions = [];
let markers = [];

function initMap() {
    kakao.maps.load(function() {
        map = new kakao.maps.Map(document.getElementById('map'), {
            center: new kakao.maps.LatLng(36.817, 127.157),
            level: 4
        });
        loadData();
    });
}

function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            positions = data;
            displayMarkers();
        });
}

function displayMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    let list = document.getElementById('list');
    list.innerHTML = '';
    positions.forEach(place => {
        let marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.lat, place.lng)
        });
        kakao.maps.event.addListener(marker, 'click', function() {
            alert(place.name + "\n" + place.address + "\n전화: " + place.phone);
        });
        markers.push(marker);
        list.innerHTML += `<div class='list-item'><b>${place.category}</b> - ${place.name}<br>${place.address} <a href='tel:${place.phone}'>전화</a></div>`;
    });
}

function searchPlaces() {
    let category = document.getElementById('category').value;
    let keyword = document.getElementById('keyword').value;
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            positions = data.filter(p =>
                (category === '' || p.category === category) &&
                (p.name.includes(keyword) || p.address.includes(keyword))
            );
            displayMarkers();
        });
}

function moveToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let loc = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(loc);
        });
    } else {
        alert("위치 정보를 사용할 수 없습니다.");
    }
}

window.onload = initMap;
