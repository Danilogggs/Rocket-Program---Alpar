const teamsList = document.getElementById("teamsList");
const loadMoreButton = document.getElementById("loadMoreButton");
const fillTeamsBtn = document.getElementById("fillTeamsBtn");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const darkModeSwitch = document.getElementById("darkModeSwitch");
const mainNavbar = document.getElementById("mainNavbar");
const configModalContent = document.getElementById("configModalContent");
const languageToggleBtn = document.getElementById("languageToggleBtn");
const configNavText = document.getElementById("configNavText");
const configModalTitle = document.getElementById("configModalTitle");
const languageLabel = document.getElementById("languageLabel");

let allTeams = [];
let displayedCount = 0;
const itemsPerClick = 12;
let currentLanguage = "pt";

const translations = {
    pt: {
        configNav: "Configurações",
        configTitle: "Configurações",
        darkMode: "Dark mode",
        language: "Idioma",
        languageButton: "English",
        searchPlaceholder: "Ex: Corinthians",
        searchAria: "Pesquisar",
        searchButton: "Pesquisar",
        showAll: "Mostrar todos os times",
        loadMore: "Carregar mais",
        loadError: "Não foi possível carregar os times.",
        noResults: "Nenhum time encontrado.",
        name: "Nome",
        country: "País",
        code: "Código",
        founded: "Fundado em",
        national: "Seleção nacional",
        yes: "Sim",
        no: "Não",
        stadium: "Estádio",
        city: "Cidade",
        capacity: "Capacidade",
        surface: "Superfície",
        notProvided: "Não informado"
    },
    en: {
        configNav: "Settings",
        configTitle: "Settings",
        darkMode: "Dark mode",
        language: "Language",
        languageButton: "Português",
        searchPlaceholder: "Ex: Corinthians",
        searchAria: "Search",
        searchButton: "Search",
        showAll: "Show all teams",
        loadMore: "Load more",
        loadError: "Could not load teams.",
        noResults: "No teams found.",
        name: "Name",
        country: "Country",
        code: "Code",
        founded: "Founded in",
        national: "National team",
        yes: "Yes",
        no: "No",
        stadium: "Stadium",
        city: "City",
        capacity: "Capacity",
        surface: "Surface",
        notProvided: "Not informed"
    }
};

function getText() {
    return translations[currentLanguage];
}

function updateStaticTexts() {
    const text = getText();

    document.documentElement.lang = currentLanguage === "pt" ? "pt-BR" : "en";
    configNavText.textContent = text.configNav;
    configModalTitle.textContent = text.configTitle;
    document.querySelector('label[for="darkModeSwitch"]').textContent = text.darkMode;
    languageLabel.textContent = text.language;
    languageToggleBtn.textContent = text.languageButton;
    searchInput.placeholder = text.searchPlaceholder;
    searchInput.setAttribute("aria-label", text.searchAria);
    searchButton.textContent = text.searchButton;
    fillTeamsBtn.textContent = text.showAll;
    loadMoreButton.textContent = text.loadMore;
}

async function loadTeams() {
    const url = "https://v3.football.api-sports.io/teams?country=Brazil";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-apisports-key": "0a5712cc37d4f9bbbe73fd668db56602"
            }
        });

        const data = await response.json();
        allTeams = data.response;
        showMoreTeams();
    } catch (error) {
        console.error("Error loading teams:", error);
        teamsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    ${getText().loadError}
                </div>
            </div>
        `;
        loadMoreButton.style.display = "none";
    }
}

function createTeamCard(item, index) {
    const team = item.team;
    const venue = item.venue;
    const text = getText();

    const modalId = `modal-${team.id}-${index}`;

    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-4";

    card.innerHTML = `
        <div class="card h-100 text-center shadow-sm team-card" role="button"
            data-bs-toggle="modal" data-bs-target="#${modalId}"
            style="cursor: pointer;">
            <div class="card-body">
                <img src="${team.logo}" alt="${team.name}" class="img-fluid mb-3 rounded" style="max-height: 120px; object-fit: contain;">
                <h5 class="card-title">${team.name}</h5>
                <p class="card-text">${venue.city}</p>
            </div>
        </div>

        <div class="modal fade team-modal" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${team.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${team.logo}" alt="${team.name}" class="img-fluid mb-3" style="max-height: 120px; object-fit: contain;">
                        <p><strong>${text.name}:</strong> ${team.name}</p>
                        <p><strong>${text.country}:</strong> ${team.country || text.notProvided}</p>
                        <p><strong>${text.code}:</strong> ${team.code || text.notProvided}</p>
                        <p><strong>${text.founded}:</strong> ${team.founded || text.notProvided}</p>
                        <p><strong>${text.national}:</strong> ${team.national ? text.yes : text.no}</p>
                        <hr>
                        <p><strong>${text.stadium}:</strong> ${venue.name || text.notProvided}</p>
                        <p><strong>${text.city}:</strong> ${venue.city || text.notProvided}</p>
                        <p><strong>${text.capacity}:</strong> ${venue.capacity || text.notProvided}</p>
                        <p><strong>${text.surface}:</strong> ${venue.surface || text.notProvided}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return card;
}

function showMoreTeams() {
    const nextTeams = allTeams.slice(displayedCount, displayedCount + itemsPerClick);

    nextTeams.forEach((item, index) => {
        const card = createTeamCard(item, displayedCount + index);
        teamsList.appendChild(card);
    });

    displayedCount += nextTeams.length;

    if (displayedCount >= allTeams.length) {
        loadMoreButton.style.display = "none";
    } else {
        loadMoreButton.style.display = "inline-block";
    }

    applyDarkMode();
}

function applyDarkMode() {
    const isDark = darkModeSwitch.checked;
    const cards = document.querySelectorAll(".team-card");
    const teamModals = document.querySelectorAll(".team-modal .modal-content");

    if (isDark) {
        document.body.classList.add("bg-dark", "text-light");

        mainNavbar.classList.remove("bg-light");
        mainNavbar.classList.add("bg-dark", "navbar-dark", "border-secondary");

        configModalContent.classList.add("bg-dark", "text-light");

        cards.forEach(card => {
            card.classList.add("bg-secondary", "text-light", "border-secondary");
        });

        teamModals.forEach(modal => {
            modal.classList.add("bg-dark", "text-light");
        });

        loadMoreButton.classList.remove("btn-primary");
        loadMoreButton.classList.add("btn-outline-light");
    } else {
        document.body.classList.remove("bg-dark", "text-light");

        mainNavbar.classList.remove("bg-dark", "navbar-dark", "border-secondary");
        mainNavbar.classList.add("bg-light");

        configModalContent.classList.remove("bg-dark", "text-light");

        cards.forEach(card => {
            card.classList.remove("bg-secondary", "text-light", "border-secondary");
        });

        teamModals.forEach(modal => {
            modal.classList.remove("bg-dark", "text-light");
        });

        loadMoreButton.classList.remove("btn-outline-light");
        loadMoreButton.classList.add("btn-primary");
    }
}

function rerenderTeams() {
    const searchedTerm = searchInput.value.trim().toLowerCase();
    teamsList.innerHTML = "";

    if (searchedTerm !== "") {
        const filteredTeams = allTeams.filter(item =>
            item.team.name.toLowerCase().includes(searchedTerm)
        );

        if (filteredTeams.length === 0) {
            teamsList.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        ${getText().noResults}
                    </div>
                </div>
            `;
            loadMoreButton.style.display = "none";
            return;
        }

        filteredTeams.forEach((item, index) => {
            const card = createTeamCard(item, index);
            teamsList.appendChild(card);
        });

        loadMoreButton.style.display = "none";
        applyDarkMode();
        return;
    }

    displayedCount = 0;
    showMoreTeams();
}

fillTeamsBtn.addEventListener("click", function () {
    searchInput.value = "";
    teamsList.innerHTML = "";
    displayedCount = 0;
    showMoreTeams();
});

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchedTerm = searchInput.value.trim().toLowerCase();

    if (searchedTerm === "") {
        teamsList.innerHTML = "";
        displayedCount = 0;
        showMoreTeams();
        return;
    }

    const filteredTeams = allTeams.filter(item =>
        item.team.name.toLowerCase().includes(searchedTerm)
    );

    teamsList.innerHTML = "";

    if (filteredTeams.length === 0) {
        teamsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    ${getText().noResults}
                </div>
            </div>
        `;
        loadMoreButton.style.display = "none";
        return;
    }

    filteredTeams.forEach((item, index) => {
        const card = createTeamCard(item, index);
        teamsList.appendChild(card);
    });

    loadMoreButton.style.display = "none";
    applyDarkMode();
});

loadMoreButton.addEventListener("click", showMoreTeams);

darkModeSwitch.addEventListener("change", applyDarkMode);

languageToggleBtn.addEventListener("click", function () {
    currentLanguage = currentLanguage === "pt" ? "en" : "pt";
    updateStaticTexts();
    rerenderTeams();
});

loadMoreButton.style.display = "none";

updateStaticTexts();

window.addEventListener("load", function () {
    const welcomeModalElement = document.getElementById("welcomeModal");

    const welcomeModal = new bootstrap.Modal(welcomeModalElement, {
        backdrop: "static",
        keyboard: false
    });

    welcomeModal.show();

    welcomeModalElement.addEventListener("hidden.bs.modal", function () {
        loadTeams();
    }, { once: true });
});