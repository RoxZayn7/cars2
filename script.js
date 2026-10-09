const CarAPI = (() => {
    const DB = [
        { id: 1, make: "Toyota", model: "Kluger", year: 2016, km: 171931, body: "Wagon", trans: "Automatic", price: 29880, img: "https://images.carexpert.com.au/resize/800/-/cms/v1/media/2026-toyota-kluger-grande-hero.png?auto=format&fit=crop&w=600&q=60"},
        { id: 2, make: "Toyota", model: "Aurion", year: 2012, km: 256681, body: "Sedan", trans: "Auto Sequential", price: 14120, img: "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2025/09/2012_toyota_aurion_front.jpg?q=49&fit=crop&w=825&dpr=2?auto=format&fit=crop&w=600&q=60"},
        { id: 3, make: "Toyota", model: "RAV4", year: 2016, km: 93651, body: "Wagon", trans: "Automatic", price: 26086, img: "https://hips.hearstapps.com/mtg-prod/65a721355eb9780008af4375/2016-toyota-rav4-hybrid-front-three-quarter-view.jpg?auto=format&fit=crop&w=600&q=60"},
        { id: 4, make: "Toyota", model: "Kluger", year: 2008, km: 210344, body: "Wagon", trans: "Automatic", price: 12990, img: "https://images-archive.allbids.com.au/auctions/43100/cars/medium/43100-1a_ex.JPG?auto=format&fit=crop&w=600&q=60"},
        { id: 5, make: "Toyota", model: "Camry", year: 2015, km: 132400, body: "Sedan", trans: "Automatic", price: 17490, img: "https://hips.hearstapps.com/hmg-prod/amv-prod-cad-assets/images/14q3/612022/2015-toyota-camry-first-drive-review-car-and-driver-photo-628681-s-original.jpg?auto=format&fit=crop&w=600&q=60"},
        { id: 6, make: "Toyota", model: "Yaris", year: 2013, km: 98220, body: "Hatchback", trans: "Manual", price: 9990, img: "https://img2.carmax.com/assets/mmy-toyota-yaris-2013/image/1.jpg?width=800&height=600?auto=format&fit=crop&w=600&q=60"},
        { id: 7, make: "Mazda", model: "CX-5", year: 2019, km: 61200, body: "Wagon", trans: "Automatic", price: 31490, img: "https://file.kelleybluebookimages.com/kbb/base/evox/CP/11980/2019-MAZDA-CX-5-front_11980_032_2400x1800_25D.png?auto=format&fit=crop&w=600&q=60"},
        { id: 8, make: "Honda", model: "Civic", year: 2017, km: 78450, body: "Sedan", trans: "Automatic", price: 18990, img: "https://di-uploads-pod3.dealerinspire.com/sussexhonda/uploads/2017/07/2017-Civic-Sedan.png?auto=format&fit=crop&w=600&q=60"},
        { id: 9, make: "Ford", model: "Ranger", year: 2020, km: 45210, body: "Ute", trans: "Automatic", price: 44990, img: "https://images.hgmsites.net/lrg/2020-ford-ranger-xlt-4wd-supercrew-5-box-angular-front-exterior-view_100741418_l.jpg?auto=format&fit=crop&w=600&q=60"},
        { id: 10, make: "Hyundai", model: "i30", year: 2018, km: 55200, body: "Hatchback", trans: "Automatic", price: 16990, img: "https://i0.wp.com/practicalmotoring.com.au/wp-content/uploads/2017/08/image154584_b.jpg?fit=1024%2C682&ssl=1?auto=format&fit=crop&w=600&q=60"},
        { id: 11, make: "Subaru", model: "Outback", year: 2019, km: 39800, body: "Wagon", trans: "Automatic", price: 33990, img: "https://platform.cstatic-images.com/in/v2/stock_photos/45b6456c-7ebd-4a23-abaf-ef5b8650f873/15631f7b-8685-4367-968f-33c0edd72149.png?auto=format&fit=crop&w=600&q=60"},
        { id: 12, make: "Nissan", model: "Navara", year: 2021, km: 22100, body: "Ute", trans: "Automatic", price: 47990, img: "https://www.carnichiwa.com/wp-content/uploads/2020/11/21NSNAV1000.jpeg?auto=format&fit=crop&w=600&q=60"},
    ];

    function fetchListings(params = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let results = DB.slice();
                const { query, minPrice, maxPrice, body, trans, sort } = params;

                if (query) {
                    const q = query.trim().toLowerCase();
                    results = results.filter(c =>
                        `${c.make} ${c.model} ${c.body}`.toLowerCase().includes(q)
                    );
                }
                if (minPrice != null) results = results.filter(c => c.price >= minPrice);
                if (maxPrice != null) results = results.filter(c => c.price <= maxPrice);
                if (body) results = results.filter(c => c.body === body);
                if (trans) results = results.filter(c => c.trans === trans);

                switch(sort) {
                    case "price-asc": results.sort((a,b) => a.price - b.price); break;
                    case "price-desc": results.sort((a,b) => b.price - a.price); break;
                    case "km-asc": results.sort((a,b) => a.km - b.km); break;
                    case "year-desc": results.sort((a,b) => b.year - a.price); break;
                }
                resolve(results);
            }, 150);
        });
    }

    function getFacets() {
        const bodies = [...new Set(DB.map(c => c.body))];
        const transmissions = [...new Set(DB.map(c => c.trans))];
        return { bodies, transmissions };
    }

    return { fetchListings, getFacets };
})();

const state = {
    query: "",
    minPrice: 0,
    maxPrice: 100000,
    body: "",
    trans: "",
    sort: "relevance"
}

const grid = document.getElementById('grid');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const priceLabel = document.getElementById('priceLabel');
const bodyChips = document.getElementById('bodyChips');
const transSelect = document.getElementById('transSelect');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');

function fmtMoney(n) { return '$' + n.toLocaleString(); }
function fmtKm(n) { return n.toLocaleString() + ' km'; }

function buildFacets() {
    const { bodies, transmissions } = CarAPI.getFacets();
    bodyChips.innerHTML = `<div class="chip active" data-val="">All</div>` +
        bodies.map(b => `<div class="chip" data-val="${b}">${b}</div>`).join('');
    bodyChips.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            bodyChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.body = chip.dataset.val;
            render();
        });
    });

    transSelect.innerHTML = `<option value=""> Any</option>` +
        transmissions.map(t => `<option value="${t}">${t}</option>`).join('');
    transSelect.addEventListener('change', () => {
        state.trans = transSelect.value;
        render(); 
    });
}

function updatePriceLabel() {
    priceLabel.textContent = `${fmtMoney(state.minPrice)} to ${fmtMoney(state.maxPrice)}`;
}

function wirePriceSliders() {
    priceMin.addEventListener('input', () => {
        let lo = parseInt(priceMin.value, 10);
        let hi = parseInt(priceMax.value, 10);
        if (lo > hi) { lo = hi; priceMin.value = lo; }
        state.minPrice = lo;
        updatePriceLabel();
        render();
    });
    priceMax.addEventListener('input', () => {
        let lo = parseInt(priceMin.value, 10);
        let hi = parseInt(priceMax.value, 10);
        if (hi < lo) { hi = lo; priceMax.value = hi; }
        state.maxPrice = hi;
        updatePriceLabel();
        render();
    });
}

function wireSearch() {
    const trigger = () => { state.query = searchInput.value; render(); };
    searchBtn.addEventListener('click', trigger);
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') trigger(); });
    searchInput.addEventListener('input', () => {
        state.query = searchInput.value;
        render();
    });
}

function wireSort() {
    sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        render();
    });
}

function wireReset() {
    resetBtn.addEventListener('click', () => {
        state.query = ''; state.minPrice = 0; state.maxPrice = 100000;
        state.body = ''; state.trans = ''; state.sort = 'relevance';
        searchInput.value = '';
        priceMin.value = 0; priceMax.value = 100000;
        transSelect.value = '';
        sortSelect.value = 'relevance';
        bodyChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        bodyChips.querySelector('.chip[data-val=""]').classList.add('active');
        updatePriceLabel();
        render();
    });
}

function cardHTML(car) {
    return `
        <div class="card">
            <img class="card-img" src="${car.img}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
            <div class="car-body">
                <div class="card-title">${car.year} ${car.make} ${car.model}</div>
                <div class="spec-line"><span class="icon">🛣️</span> ${fmtKm(car.km)}</div>
                <div class="spec-line"><span class="icon">🚗</span> ${car.body}</div>
                <div class="spec-line"><span class="icon">⚙️</span> ${car.trans}</div>
                <div class="card-price">${fmtMoney(car.price)}</div>
            </div>
        </div>
    `;            
}

async function render() {
    const results = await CarAPI.fetchListings({
        query: state.query,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        body: state.body,
        trans: state.trans,
        sort: state.sort
    });

    resultsTitle.textContent = state.query ? `Search results for "${state.query}"` : "All cars";
    resultsCount.textContent = `(${results.length} found)`;

    if (results.length === 0) {
        grid.innerHTML = `<div class="no-results"><div class="big">🚗</div> No cars match your filters.<br> Try widening your search.</div>`;
        return;
    }
    grid.innerHTML = results.map(cardHTML).join('');
}

buildFacets();
wirePriceSliders();
wireSearch();
wireSort();
wireReset();
updatePriceLabel();
render();