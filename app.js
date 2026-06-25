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

    // ===== BUSINESS HUB PAGE =====
const loginWarningHub = document.getElementById('loginWarning');
const commentArea = document.getElementById('commentArea');
const commentList = document.getElementById('commentList');
const postBtn = document.getElementById('postCommentBtn');
const newCommentInput = document.getElementById('newComment');

if (loginWarningHub || commentArea) {
    // Simulate login status (use same variable as before)
    let isLoggedIn = false; // In practice, make this global

    // Comment storage (demo using localStorage)
    let comments = [];

    function loadComments() {
        const stored = localStorage.getItem('hubComments');
        if (stored) {
            try {
                comments = JSON.parse(stored);
            } catch (e) {
                comments = getDefaultComments();
            }
        } else {
            comments = getDefaultComments();
            localStorage.setItem('hubComments', JSON.stringify(comments));
        }
        renderComments();
    }

    function getDefaultComments() {
        return [
            { author: "Mzolisi", date: new Date().toLocaleString(), text: "Excited about this new platform!" },
            { author: "Thabo", date: new Date().toLocaleString(), text: "When is the next live session?" }
        ];
    }

    function renderComments() {
        if (!commentList) return;
        if (comments.length === 0) {
            commentList.innerHTML = '<p>No comments yet. Be the first to post!</p>';
            return;
        }
        commentList.innerHTML = '';
        comments.forEach(comm => {
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `
                <div><span class="comment-author">${escapeHtml(comm.author)}</span><span class="comment-date">${comm.date}</span></div>
                <div class="comment-text">${escapeHtml(comm.text)}</div>
            `;
            commentList.appendChild(div);
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function updateHubUI() {
        if (!isLoggedIn) {
            loginWarningHub.classList.remove('hidden');
            commentArea.classList.add('hidden');
        } else {
            loginWarningHub.classList.add('hidden');
            commentArea.classList.remove('hidden');
            loadComments();
        }
    }

    // Post comment
    if (postBtn) {
        postBtn.addEventListener('click', function() {
            if (!isLoggedIn) {
                alert('Please log in to comment.');
                return;
            }
            const newText = newCommentInput.value.trim();
            if (!newText) {
                alert('Please enter a comment.');
                return;
            }
            const comment = {
                author: "LoggedInUser", // In a real system, get from profile
                date: new Date().toLocaleString(),
                text: newText
            };
            comments.push(comment);
            localStorage.setItem('hubComments', JSON.stringify(comments));
            renderComments();
            newCommentInput.value = '';
        });
    }

    // Initial UI update
    updateHubUI();

    // (Optional) expose a way to change login status for testing
    // window.setLoggedInHub = function(status) { isLoggedIn = status; updateHubUI(); };
}
    // Initial UI update
    updateUI();

    // (Optional) If you later change login status, you can call updateUI() again
    // For demo, we keep isLoggedIn = false, but you can set it to true to test.
}

// ===== HIRE ADMIN PAGE =====
const hireAdminForm = document.getElementById('hireAdminForm');
const hireLoginWarning = document.getElementById('loginWarning');
const hireSubmitMsg = document.getElementById('submitMessage');
const startDateInput = document.getElementById('startDate');

if (hireAdminForm) {
    // Simulate login status (use the same variable as before)
    let isLoggedIn = false; // In practice, make this global

    // Show/hide login warning
    if (hireLoginWarning) {
        if (isLoggedIn) {
            hireLoginWarning.classList.add('hidden');
        } else {
            hireLoginWarning.classList.remove('hidden');
        }
    }

    // Set min start date to tomorrow
    if (startDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        startDateInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    }

    // Form submission
    hireAdminForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!isLoggedIn) {
            hireSubmitMsg.innerHTML = '<span style="color:red;">❌ Please <a href="profile.html">log in</a> to submit a request.</span>';
            return;
        }

        // Validate contract length
        const contractLength = document.querySelector('input[name="contractLength"]:checked');
        if (!contractLength) {
            hireSubmitMsg.innerHTML = '<span style="color:red;">❌ Please select a contract length.</span>';
            return;
        }

        // Validate staff count
        const staffCount = document.getElementById('staffCount').value;
        if (staffCount < 1) {
            hireSubmitMsg.innerHTML = '<span style="color:red;">❌ Please enter a valid number of staff.</span>';
            return;
        }

        // In a real app, gather all form data and send to backend
        hireSubmitMsg.innerHTML = '<span style="color:green;">✅ Your request has been received! Our team will contact you within 48 hours to discuss a custom SLA. (Demo – backend pending)</span>';
        // Optionally reset the form
        // hireAdminForm.reset();
    });
}

// ===== REFERRAL PAGE =====
const loginWarningRef = document.getElementById('loginWarning');
const referralContent = document.getElementById('referralContent');
const totalReferralsEl = document.getElementById('totalReferrals');
const totalEarningsEl = document.getElementById('totalEarnings');
const pendingEarningsEl = document.getElementById('pendingEarnings');
const referralLinkEl = document.getElementById('referralLink');
const copyBtn = document.getElementById('copyLinkBtn');
const refreshBtn = document.getElementById('refreshLinkBtn');
const historyDiv = document.getElementById('referralHistory');
const simulateAmount = document.getElementById('simulateAmount');
const simulateBtn = document.getElementById('simulatePurchaseBtn');

if (loginWarningRef && referralContent) {
    // Simulate login status (use same variable as before)
    let isLoggedIn = false; // In practice, make this global

    // Referral data structure
    let referralData = {
        referralCode: '',
        referrals: [],
        totalEarned: 0
    };

    function loadReferralData() {
        const stored = localStorage.getItem('legacyReferral');
        if (stored) {
            try {
                referralData = JSON.parse(stored);
            } catch (e) {
                initReferralData();
            }
        } else {
            initReferralData();
        }
        updateReferralUI();
    }

    function initReferralData() {
        referralData.referralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
        referralData.referrals = [];
        referralData.totalEarned = 0;
        localStorage.setItem('legacyReferral', JSON.stringify(referralData));
    }

    function updateReferralUI() {
        if (!referralContent) return;

        // Update stats
        if (totalReferralsEl) totalReferralsEl.innerText = referralData.referrals.length;
        if (totalEarningsEl) totalEarningsEl.innerText = 'R' + referralData.totalEarned;
        if (pendingEarningsEl) pendingEarningsEl.innerText = 'R0'; // Demo – could be enhanced

        // Update link
        if (referralLinkEl) {
            const linkBase = window.location.origin + window.location.pathname.replace('referral.html', '') + '?ref=';
            referralLinkEl.innerText = linkBase + referralData.referralCode;
        }

        // Update history
        if (historyDiv) {
            if (referralData.referrals.length === 0) {
                historyDiv.innerHTML = '<p>No referrals yet. Share your link to get started!</p>';
            } else {
                let html = '<ul class="referral-history-list">';
                referralData.referrals.forEach(ref => {
                    html += `<li class="referral-history-item">
                                <strong>${escapeHtml(ref.referredEmail) || 'Anonymous'}</strong> – Spent R${ref.purchaseAmount} → Earned R${ref.earnings}<br>
                                <small>${ref.date}</small>
                            </li>`;
                });
                html += '</ul>';
                historyDiv.innerHTML = html;
            }
        }
    }

    function addReferral(email, amount) {
        const earnings = amount * 0.1;
        referralData.referrals.push({
            referredEmail: email || 'Guest',
            purchaseAmount: amount,
            earnings: Math.round(earnings * 100) / 100,
            date: new Date().toLocaleString(),
            status: 'completed'
        });
        referralData.totalEarned += earnings;
        localStorage.setItem('legacyReferral', JSON.stringify(referralData));
        updateReferralUI();
    }

    // Copy link
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const linkText = referralLinkEl.innerText;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(linkText).then(() => {
                    showToast('Referral link copied to clipboard!', 'success');
                }).catch(() => {
                    fallbackCopy(linkText);
                });
            } else {
                fallbackCopy(linkText);
            }
        });
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Referral link copied to clipboard!', 'success');
        } catch (e) {
            alert('Could not copy. Please select and copy manually.');
        }
        document.body.removeChild(textarea);
    }

    // Refresh / generate new link
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            if (confirm('Generating a new link will invalidate the old one. Any pending referrals using the old link will not be credited. Continue?')) {
                referralData.referralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
                localStorage.setItem('legacyReferral', JSON.stringify(referralData));
                updateReferralUI();
                showToast('New referral link generated!', 'success');
            }
        });
    }

    // Simulate purchase
    if (simulateBtn && simulateAmount) {
        simulateBtn.addEventListener('click', function() {
            const amount = parseFloat(simulateAmount.value);
            if (isNaN(amount) || amount < 1000) {
                showToast('Please enter a valid amount of R1,000 or more.', 'error');
                return;
            }
            addReferral('Simulated User', amount);
            simulateAmount.value = '';
            showToast(`Referral recorded! You earned R${(amount * 0.1).toFixed(2)}.`, 'success');
        });
    }

    // Simple toast notification
    function showToast(message, type) {
        // Check if toast container exists, create if not
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; max-width:350px;';
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            font-family: 'Segoe UI', sans-serif;
            font-size: 0.9rem;
        `;
        toast.innerText = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Inject slideIn animation if not already present
    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Update UI based on login status
    function updateReferralVisibility() {
        if (!isLoggedIn) {
            loginWarningRef.classList.remove('hidden');
            referralContent.classList.add('hidden');
        } else {
            loginWarningRef.classList.add('hidden');
            referralContent.classList.remove('hidden');
            loadReferralData();
        }
    }

    // Initial setup
    updateReferralVisibility();

    // (Optional) Expose login toggle for testing
    // window.setLoggedInReferral = function(status) { isLoggedIn = status; updateReferralVisibility(); };
}

// ===== MOBILE TOGGLE (Top Nav + Sidebar) =====
const menuBtnTop = document.getElementById('menuToggleTop');
const topNav = document.getElementById('topNav');
const menuBtnSide = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuBtnTop && topNav) {
    menuBtnTop.addEventListener('click', function(e) {
        e.stopPropagation();
        topNav.classList.toggle('show');
    });
}

if (menuBtnSide && sidebar) {
    menuBtnSide.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });
}
