
let map;
let positions = [];
let markers = [];
let currentCategory = '';

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
            positions = data.stores;
            renderCategoryButtons(data.categories);
            displayMarkers();
        });
}

function renderCategoryButtons(categories) {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.innerText = '전체';
    allBtn.onclick = () => filterCategory('');
    container.appendChild(allBtn);
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.onclick = () => filterCategory(cat);
        container.appendChild(btn);
    });
}

function displayMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    let list = document.getElementById('list');
    list.innerHTML = '';
    positions.forEach(place => {
        if (currentCategory === '' || place.카테고리 === currentCategory) {
            let marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.위도, place.경도)
            });
            kakao.maps.event.addListener(marker, 'click', function() {
                alert(place.이름 + "\n" + place.주소 + "\n전화: " + place.전화);
            });
            markers.push(marker);
            list.innerHTML += `<div class='list-item'><b>${place.카테고리}</b> - ${place.이름}<br>${place.주소}<br>☎ ${place.전화 !== '없음' ? `<a href='tel:${place.전화}'>${place.전화}</a>` : '없음'}</div>`;
        }
    });
}

function searchPlaces() {
    let keyword = document.getElementById('keyword').value;
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            positions = data.stores.filter(p =>
                (currentCategory === '' || p.카테고리 === currentCategory) &&
                (p.이름.includes(keyword) || p.주소.includes(keyword))
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

function filterCategory(category) {
    currentCategory = category;
    loadData();
}

window.onload = initMap;
