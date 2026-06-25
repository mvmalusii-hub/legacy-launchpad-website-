// ===== MARKET LEADS PAGE =====
const loginWarning = document.getElementById('loginWarning');
const dataConsentSection = document.getElementById('dataConsentSection');
const databaseSection = document.getElementById('databaseSection');
const agreeBtn = document.getElementById('agreeBtn');
const consentCheckbox = document.getElementById('dataConsent');
const companyListEl = document.getElementById('companyList');
const regForm = document.getElementById('registerCompanyForm');

if (loginWarning || dataConsentSection || databaseSection) {
    // Simulate login status (use same variable as before)
    let isLoggedIn = false; // In practice, make this global

    // Sample initial companies (database) – will be overridden by localStorage if present
    let companies = [
        { name: "ABC Logistics", industry: "Logistics", services: "Freight & courier services", logoData: null },
        { name: "CleanCo", industry: "Cleaning", services: "Office & industrial cleaning", logoData: null },
        { name: "Steel Masters", industry: "Manufacturing", services: "Steel fabrication", logoData: null }
    ];

    // Load from localStorage (demo persistence)
    if (localStorage.getItem('marketCompanies')) {
        try {
            companies = JSON.parse(localStorage.getItem('marketCompanies'));
        } catch (e) { /* ignore */ }
    }

    function renderCompanies() {
        if (!companyListEl) return;
        if (companies.length === 0) {
            companyListEl.innerHTML = '<p>No companies yet. Be the first to register!</p>';
            return;
        }
        companyListEl.innerHTML = '';
        companies.forEach(comp => {
            const card = document.createElement('div');
            card.className = 'company-card';
            let logoHtml = '';
            if (comp.logoData) {
                logoHtml = `<img src="${comp.logoData}" alt="Logo">`;
            } else {
                logoHtml = `<div class="company-logo"><i class="fas fa-building"></i></div>`;
            }
            card.innerHTML = `
                ${logoHtml}
                <h3>${comp.name}</h3>
                <div class="industry">${comp.industry}</div>
                <p>${comp.services}</p>
                <a href="#" class="btn-small">Order Service →</a>
            `;
            companyListEl.appendChild(card);
        });
    }

    function updateUI() {
        if (!isLoggedIn) {
            loginWarning.classList.remove('hidden');
            dataConsentSection.classList.add('hidden');
            databaseSection.classList.add('hidden');
            return;
        }
        loginWarning.classList.add('hidden');
        // Check if user has already agreed (stored in localStorage)
        const hasAgreed = localStorage.getItem('marketConsent') === 'true';
        if (hasAgreed) {
            dataConsentSection.classList.add('hidden');
            databaseSection.classList.remove('hidden');
            renderCompanies();
        } else {
            dataConsentSection.classList.remove('hidden');
            databaseSection.classList.add('hidden');
        }
    }

    // Handle agree button
    if (agreeBtn) {
        agreeBtn.addEventListener('click', function() {
            if (!consentCheckbox.checked) {
                alert('You must agree to the data sharing policy to access the database.');
                return;
            }
            localStorage.setItem('marketConsent', 'true');
            dataConsentSection.classList.add('hidden');
            databaseSection.classList.remove('hidden');
            renderCompanies();
        });
    }

    // Register new company
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regCompanyName').value.trim();
            const industry = document.getElementById('regIndustry').value.trim();
            const services = document.getElementById('regServices').value.trim();
            const logoFile = document.getElementById('regLogo').files[0];
            const msgEl = document.getElementById('regMessage');

            if (!name || !industry || !services) {
                msgEl.innerHTML = '<span style="color:red;">❌ Please fill in all required fields.</span>';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(evt) {
                const logoData = evt.target.result || null;
                companies.push({ name, industry, services, logoData });
                localStorage.setItem('marketCompanies', JSON.stringify(companies));
                renderCompanies();
                msgEl.innerHTML = '<span style="color:green;">✅ Company registered and now appears in the database!</span>';
                regForm.reset();
            };
            if (logoFile) {
                reader.readAsDataURL(logoFile);
            } else {
                // No logo – push without reading
                companies.push({ name, industry, services, logoData: null });
                localStorage.setItem('marketCompanies', JSON.stringify(companies));
                renderCompanies();
                msgEl.innerHTML = '<span style="color:green;">✅ Company registered and now appears in the database!</span>';
                regForm.reset();
            }
        });
    }

    // Initial UI update
    updateUI();

    // (Optional) If you later change login status, you can call updateUI() again
    // For demo, we keep isLoggedIn = false, but you can set it to true to test.
}
