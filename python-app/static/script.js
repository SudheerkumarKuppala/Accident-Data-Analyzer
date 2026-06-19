// SafeRouteX AI - Main JavaScript

// ---- Navbar scroll effect ----
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// ---- Animated particles in hero ----
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
            opacity: ${Math.random() * 0.5 + 0.1};
        `;
        container.appendChild(p);
    }
}
createParticles();

// ---- Counter animation for hero stats ----
function animateCounter(el, target, duration = 2000, decimals = 0) {
    const start = performance.now();
    const update = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
    };
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const decimals = String(el.dataset.target).includes('.') ? 2 : 0;
            animateCounter(el, target, 1800, decimals);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

// ---- Metric bar animation ----
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const fill = card.querySelector('.metric-bar-fill');
            const valueEl = card.querySelector('.metric-value');
            if (fill) {
                const w = parseFloat(fill.dataset.width);
                setTimeout(() => { fill.style.width = w + '%'; }, 200);
            }
            if (valueEl) {
                const v = parseFloat(valueEl.dataset.value);
                const decimals = String(valueEl.dataset.value).includes('.') ? 2 : 0;
                animateCounter(valueEl, v, 1500, decimals);
                setTimeout(() => {
                    valueEl.textContent = (decimals > 0 ? v.toFixed(decimals) : v) + '%';
                }, 1600);
            }
            metricsObserver.unobserve(card);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.metric-card').forEach(el => metricsObserver.observe(el));

// ---- Prediction Form Submit ----
document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('predictBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    btn.disabled = true;
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');

    const formData = {
        Start_Lat: document.getElementById('Start_Lat').value,
        Start_Lng: document.getElementById('Start_Lng').value,
        End_Lat: document.getElementById('End_Lat').value || '0',
        End_Lng: document.getElementById('End_Lng').value || '0',
        Distance_mi: document.getElementById('Distance_mi').value,
        Temperature_F: document.getElementById('Temperature_F').value,
        Wind_Chill_F: document.getElementById('Wind_Chill_F').value,
        Humidity_pct: document.getElementById('Humidity_pct').value,
        Pressure_in: document.getElementById('Pressure_in').value,
        Visibility_mi: document.getElementById('Visibility_mi').value,
        Wind_Speed_mph: document.getElementById('Wind_Speed_mph').value,
        Precipitation_in: document.getElementById('Precipitation_in').value,
        Year: document.getElementById('Year').value,
        Month: document.getElementById('Month').value,
        Day: document.getElementById('Day').value,
        Hour: document.getElementById('Hour').value,
        Weekday: document.getElementById('Weekday').value,
        State: document.getElementById('State').value,
        City: document.getElementById('City').value,
        County: document.getElementById('County').value,
        Timezone: document.getElementById('Timezone').value,
        Wind_Direction: document.getElementById('Wind_Direction').value,
        Weather_Condition: document.getElementById('Weather_Condition').value,
        Source: 'Source2'
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.error) {
            showError(data.error);
        } else {
            showResult(data);
            updateHistory();
        }
    } catch (err) {
        showError('Network error. Please try again.');
    } finally {
        btn.disabled = false;
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
    }
});

function showResult(data) {
    const placeholder = document.getElementById('resultPlaceholder');
    const content = document.getElementById('resultContent');

    placeholder.classList.add('d-none');
    content.classList.remove('d-none');

    document.getElementById('resultIcon').textContent = data.icon;
    document.getElementById('resultTitle').textContent = data.label;
    document.getElementById('resultSeverity').textContent = `Severity Level ${data.severity} / 4`;
    document.getElementById('resultMessage').innerHTML = `<strong>${data.message}</strong>`;
    document.getElementById('resultRecommendation').innerHTML = `<i class="fa-solid fa-circle-check me-2" style="color:#22c55e"></i>${data.recommendation}`;
    document.getElementById('resultTimestamp').textContent = `Predicted at: ${data.timestamp}`;

    const fill = document.getElementById('riskMeterFill');
    fill.style.background = getSeverityGradient(data.severity);
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = data.meter + '%'; }, 100);

    // Scroll to result on mobile
    if (window.innerWidth < 992) {
        setTimeout(() => {
            document.getElementById('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

function getSeverityGradient(severity) {
    const gradients = {
        1: 'linear-gradient(90deg, #22c55e, #4ade80)',
        2: 'linear-gradient(90deg, #eab308, #fbbf24)',
        3: 'linear-gradient(90deg, #f97316, #fb923c)',
        4: 'linear-gradient(90deg, #ef4444, #f87171)'
    };
    return gradients[severity] || gradients[2];
}

function showError(msg) {
    const placeholder = document.getElementById('resultPlaceholder');
    const content = document.getElementById('resultContent');
    content.classList.add('d-none');
    placeholder.classList.remove('d-none');
    placeholder.querySelector('h5').textContent = 'Prediction Error';
    placeholder.querySelector('p').textContent = msg;
    placeholder.style.color = '#ef4444';
}

function resetForm() {
    document.getElementById('predictionForm').reset();
    document.getElementById('resultContent').classList.add('d-none');
    document.getElementById('resultPlaceholder').classList.remove('d-none');
    document.getElementById('resultPlaceholder').querySelector('h5').textContent = 'Ready to Predict';
    document.getElementById('resultPlaceholder').querySelector('p').textContent = 'Fill in the form and click "Predict Severity" to get an AI-powered road safety assessment.';
    document.getElementById('resultPlaceholder').style.color = '';
}

// ---- Update history table ----
async function updateHistory() {
    try {
        const response = await fetch('/history');
        const history = await response.json();
        const tbody = document.getElementById('historyTableBody');

        if (!history || history.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No predictions yet.</td></tr>';
            return;
        }

        tbody.innerHTML = history.map(h => `
            <tr>
                <td>${h.timestamp}</td>
                <td>${h.location}</td>
                <td><strong style="color: ${getSeverityColor(h.severity)}">${h.icon} Severity ${h.severity}</strong></td>
                <td><span class="badge" style="background:${getSeverityColor(h.severity)}22; color:${getSeverityColor(h.severity)}; border:1px solid ${getSeverityColor(h.severity)}44; border-radius:6px; padding:4px 10px">${h.label}</span></td>
            </tr>
        `).join('');
    } catch (e) { /* silent */ }
}

function getSeverityColor(severity) {
    const colors = { 1: '#22c55e', 2: '#eab308', 3: '#f97316', 4: '#ef4444' };
    return colors[severity] || '#94a3b8';
}

// ---- Download PDF Report ----
function downloadReport() {
    const severity = document.getElementById('resultSeverity').textContent;
    const label = document.getElementById('resultTitle').textContent;
    const message = document.getElementById('resultMessage').textContent;
    const recommendation = document.getElementById('resultRecommendation').textContent;
    const timestamp = document.getElementById('resultTimestamp').textContent;

    const lat = document.getElementById('Start_Lat').value;
    const lng = document.getElementById('Start_Lng').value;
    const temp = document.getElementById('Temperature_F').value;
    const humidity = document.getElementById('Humidity_pct').value;
    const visibility = document.getElementById('Visibility_mi').value;
    const state = document.getElementById('State').value;
    const year = document.getElementById('Year').value;
    const month = document.getElementById('Month').value;
    const day = document.getElementById('Day').value;
    const hour = document.getElementById('Hour').value;

    const reportContent = `
SafeRouteX AI - Accident Severity Prediction Report
${'='.repeat(55)}

Project: SafeRouteX AI - AI-Powered Road Safety Prediction System
Institution: Bonam Venkata Chalamayya Engineering College, Odalarevu
Department: Computer Science & Engineering (AI & ML)

${timestamp.replace('Predicted at: ', 'Report Generated: ')}

${'='.repeat(55)}
PREDICTION RESULT
${'='.repeat(55)}

${severity}
Risk Status: ${label}

Assessment: ${message}
Recommendation: ${recommendation}

${'='.repeat(55)}
INPUT PARAMETERS
${'='.repeat(55)}

Location
  Start Latitude  : ${lat}
  Start Longitude : ${lng}
  State           : ${state}

Date & Time
  Date            : ${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}
  Hour            : ${hour}:00

Weather Conditions
  Temperature     : ${temp} °F
  Humidity        : ${humidity} %
  Visibility      : ${visibility} mi

${'='.repeat(55)}
MODEL INFORMATION
${'='.repeat(55)}

Algorithm       : XGBoost Classifier
Model Accuracy  : 87.88%
Features Used   : 24
Dataset         : US Accidents Dataset (1.1M+ records)
Severity Scale  : 1 (Very Safe) → 4 (Dangerous)

${'='.repeat(55)}
DISCLAIMER
${'='.repeat(55)}

Predictions are generated using historical accident data and
machine learning techniques. Results are for informational
purposes only and should not replace official traffic advisories
or real-time road safety information.

${'='.repeat(55)}
© 2026 SafeRouteX AI. All Rights Reserved.
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SafeRouteX_Report_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ---- Leaflet Map with Hotspots ----
function initMap() {
    const map = L.map('accidentMap', {
        center: [37.5, -98.5],
        zoom: 4,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
    }).addTo(map);

    const hotspots = [
        { lat: 34.05, lng: -118.24, level: 'High', name: 'Los Angeles, CA', count: 45230, color: '#ef4444' },
        { lat: 25.77, lng: -80.19, level: 'High', name: 'Miami, FL', count: 38900, color: '#ef4444' },
        { lat: 33.45, lng: -112.07, level: 'High', name: 'Phoenix, AZ', count: 32100, color: '#ef4444' },
        { lat: 36.17, lng: -115.14, level: 'High', name: 'Las Vegas, NV', count: 28400, color: '#ef4444' },
        { lat: 29.76, lng: -95.37, level: 'High', name: 'Houston, TX', count: 41500, color: '#ef4444' },
        { lat: 30.27, lng: -97.74, level: 'Moderate', name: 'Austin, TX', count: 18700, color: '#f97316' },
        { lat: 39.95, lng: -75.17, level: 'Moderate', name: 'Philadelphia, PA', count: 21300, color: '#f97316' },
        { lat: 33.75, lng: -84.39, level: 'Moderate', name: 'Atlanta, GA', count: 26800, color: '#f97316' },
        { lat: 36.17, lng: -86.78, level: 'Moderate', name: 'Nashville, TN', count: 15600, color: '#f97316' },
        { lat: 39.10, lng: -84.51, level: 'Moderate', name: 'Cincinnati, OH', count: 12300, color: '#f97316' },
        { lat: 44.98, lng: -93.27, level: 'Low', name: 'Minneapolis, MN', count: 8900, color: '#22c55e' },
        { lat: 43.05, lng: -76.15, level: 'Low', name: 'Syracuse, NY', count: 5600, color: '#22c55e' },
        { lat: 46.87, lng: -96.79, level: 'Low', name: 'Fargo, ND', count: 3200, color: '#22c55e' },
        { lat: 47.61, lng: -122.33, level: 'Low', name: 'Seattle, WA', count: 9800, color: '#22c55e' },
        { lat: 45.52, lng: -122.68, level: 'Low', name: 'Portland, OR', count: 7400, color: '#22c55e' }
    ];

    hotspots.forEach(h => {
        const radius = h.level === 'High' ? 22 : h.level === 'Moderate' ? 16 : 10;
        L.circleMarker([h.lat, h.lng], {
            radius: radius,
            fillColor: h.color,
            color: h.color,
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.4
        }).addTo(map).bindPopup(`
            <div style="background:#0d2137;color:#f1f5f9;border:1px solid rgba(59,130,246,0.3);border-radius:10px;padding:12px;min-width:160px">
                <strong style="color:#60a5fa">${h.name}</strong><br>
                <span style="color:#94a3b8">Risk Level:</span> <strong style="color:${h.color}">${h.level}</strong><br>
                <span style="color:#94a3b8">Accidents:</span> <strong>${h.count.toLocaleString()}</strong>
            </div>
        `, { className: 'custom-popup' });
    });
}

// Wait for DOM to be ready before initializing map
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    setTimeout(initMap, 300);
}

// ---- Scroll reveal animation ----
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    const revealItems = document.querySelectorAll(
        '.overview-card, .feature-card, .metric-card, .importance-card, .footer-card, .info-stat-card'
    );
    revealItems.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        revealObserver.observe(el);
    });

    updateHistory();
});
