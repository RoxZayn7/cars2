const API_URL = "https://api.jsonbin.io/v3/b/6abaad90ac6210605afeeae5/latest";
let cache = null;

async function loadAll(){
    if (!cache) {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        cache = Array.isArray(json) ? json : json.record;
    }
    return cache;
}

const CarAPI = {
    async fetchListings(params = {}) {
        let results = (await loadAll()).slice();
        const { query, minPrice, maxPrice, body, trans, sort } = params;

            if (query) {
                const q = query.trim().toLowerCase();
                results = results.filter(c =>
                    `${c.make} ${c.model} ${c.body}`.toLowerCase().includes(q));
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
                return results;
            },

            async getFacets() {
                const DB = await loadAll();
                return {
                    bodies: [...new Set(DB.map(c => c.body))],
                    transmissions: [...new Set(DB.map(c => c.trans))]
            };
        }
};

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

async function buildFacets() {
    const { bodies, transmissions } = await CarAPI.getFacets();
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