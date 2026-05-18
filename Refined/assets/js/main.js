document.addEventListener('DOMContentLoaded', () => {
    if(!window.location.pathname.includes('login_page.html')) {
        loadComponents();
    }
});

async function loadComponents() {
    try {
        const [headerRes, sidebarRes, footerRes] = await Promise.all([
            fetch('components/header.html'),
            fetch('components/sidebar.html'),
            fetch('components/footer.html')
        ]);
        if (headerRes.ok) document.getElementById('header-container').innerHTML = await headerRes.text();
        if (sidebarRes.ok) document.getElementById('sidebar-container').innerHTML = await sidebarRes.text();
        if (footerRes.ok) document.getElementById('footer-container').innerHTML = await footerRes.text();

        initSidebar();
        initClockSystem();
    } catch (e) { console.error('Error loading components:', e); }
}

function initSidebar() {
    const currentPath = window.location.pathname.split('/').pop() || 'admin_dashboard.html';
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
        const a = li.querySelector('a');
        if (a && a.getAttribute('href') === currentPath) {
            li.classList.add('active');
        }
    });
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    }
}

function initClockSystem() {
    const clockBtn = document.getElementById('clock-btn');
    const clockStatus = document.getElementById('clock-status');
    const clockTime = document.getElementById('clock-time');

    if(clockTime) {
        setInterval(() => {
            clockTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }, 1000);
    }

    if (!clockBtn) return;
    let isClockedIn = localStorage.getItem('isClockedIn') === 'true';
    let clockInTime = localStorage.getItem('clockInTime');

    const updateUI = () => {
        if (isClockedIn) {
            clockBtn.classList.replace('btn-primary', 'btn-danger');
            clockBtn.innerHTML = '<i class="bi bi-box-arrow-right me-2"></i> Clock Out';
            if (clockStatus && clockInTime) {
                clockStatus.textContent = `Punched in at ${new Date(parseInt(clockInTime)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }
        } else {
            clockBtn.classList.replace('btn-danger', 'btn-primary');
            clockBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i> Clock In';
            if (clockStatus) clockStatus.textContent = 'Not Punched In';
        }
    };
    updateUI();

    clockBtn.addEventListener('click', () => {
        isClockedIn = !isClockedIn;
        if (isClockedIn) {
            localStorage.setItem('isClockedIn', 'true');
            localStorage.setItem('clockInTime', Date.now().toString());
        } else {
            localStorage.setItem('isClockedIn', 'false');
        }
        updateUI();
    });
}
