document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
});

const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
const pathPrefix = isRoot ? '' : '../';

async function loadComponents() {
    try {
        const [headerRes, sidebarRes, footerRes] = await Promise.all([
            fetch(`${pathPrefix}components/header.html`),
            fetch(`${pathPrefix}components/sidebar.html`),
            fetch(`${pathPrefix}components/footer.html`)
        ]);

        if (headerRes.ok) document.getElementById('header-container').innerHTML = await headerRes.text();
        if (sidebarRes.ok) document.getElementById('sidebar-container').innerHTML = await sidebarRes.text();
        if (footerRes.ok) document.getElementById('footer-container').innerHTML = await footerRes.text();

        initSidebar();
        initClockSystem();
        initDashboardData();
        initTableData();
        initForms();
    } catch (error) {
        console.error('Failed to load components:', error);
    }
}

function initSidebar() {
    // Highlight Active Menu
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
        const a = li.querySelector('a');
        if (a) {
            const href = a.getAttribute('href').split('/').pop();
            if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
                li.classList.add('active');
            }
        }
    });

    // Mobile Toggle
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function initClockSystem() {
    const timeDisplay = document.getElementById('current-time');
    const clockBtn = document.getElementById('clock-btn');
    const clockText = document.getElementById('clock-btn-text');
    const clockIcon = document.getElementById('clock-btn-icon');
    const clockStatus = document.getElementById('clock-status');
    const totalHours = document.getElementById('total-hours');

    if (timeDisplay) {
        setInterval(() => {
            timeDisplay.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }

    if (!clockBtn) return;

    let isClockedIn = localStorage.getItem('isClockedIn') === 'true';
    let clockInTime = localStorage.getItem('clockInTime');

    const updateUI = () => {
        if (isClockedIn) {
            clockBtn.classList.replace('btn-light', 'btn-danger');
            clockBtn.classList.replace('btn-primary', 'btn-danger');
            if (clockText) clockText.textContent = 'Clock Out';
            if (clockIcon) clockIcon.className = 'bi bi-box-arrow-right me-2 fs-5';
            
            if (clockInTime && clockStatus) {
                const timeStr = new Date(parseInt(clockInTime)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                clockStatus.textContent = `Punched in at ${timeStr}`;
            }
        } else {
            clockBtn.classList.replace('btn-danger', isRoot ? 'btn-light' : 'btn-primary');
            if (clockText) clockText.textContent = 'Clock In';
            if (clockIcon) clockIcon.className = 'bi bi-box-arrow-in-right me-2 fs-5';
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
            if (totalHours) totalHours.textContent = '08:15 h'; // dummy calculation
        }
        updateUI();
    });
}

function initDashboardData() {
    const summaryContainer = document.getElementById('summary-cards');
    if (!summaryContainer) return;

    const cards = [
        { title: 'Total Employees', value: '1,248', icon: 'bi-people', color: 'primary' },
        { title: 'Present Today', value: '1,180', icon: 'bi-person-check', color: 'success' },
        { title: 'Absent Today', value: '22', icon: 'bi-person-x', color: 'danger' },
        { title: 'On Leave', value: '46', icon: 'bi-calendar2-minus', color: 'warning' }
    ];

    summaryContainer.innerHTML = cards.map(c => `
        <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 h-100 hover-card">
                <div class="card-body p-4 d-flex align-items-center justify-content-between">
                    <div>
                        <p class="text-muted small fw-bold text-uppercase mb-1">${c.title}</p>
                        <h3 class="fw-bold mb-0 text-dark">${c.value}</h3>
                    </div>
                    <div class="bg-${c.color} bg-opacity-10 text-${c.color} rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                        <i class="${c.icon} fs-4"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const recentActivity = document.getElementById('recent-activity-table');
    if (recentActivity) {
        recentActivity.innerHTML = `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="avatar bg-primary text-white me-3">JD</div>
                        <div><div class="fw-bold">John Doe</div><div class="small text-muted">Engineering</div></div>
                    </div>
                </td>
                <td>Clocked In</td>
                <td>08:55 AM</td>
                <td class="pe-4"><span class="badge bg-success-subtle text-success rounded-pill px-3">Success</span></td>
            </tr>
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="avatar bg-info text-white me-3">AS</div>
                        <div><div class="fw-bold">Anna Smith</div><div class="small text-muted">HR</div></div>
                    </div>
                </td>
                <td>Applied Leave</td>
                <td>Yesterday</td>
                <td class="pe-4"><span class="badge bg-warning-subtle text-warning rounded-pill px-3">Pending</span></td>
            </tr>
        `;
    }
}

function initTableData() {
    const empTable = document.getElementById('employee-table');
    if (empTable) {
        empTable.innerHTML = `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="avatar bg-primary text-white me-3">ER</div>
                        <div><div class="fw-bold">Elena Rodriguez</div><div class="small text-muted">elena@company.com</div></div>
                    </div>
                </td>
                <td>Design</td>
                <td>Senior Designer</td>
                <td><span class="badge bg-success-subtle text-success rounded-pill px-3">Active</span></td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-light text-primary"><i class="bi bi-pencil"></i></button>
                </td>
            </tr>
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="avatar bg-secondary text-white me-3">MT</div>
                        <div><div class="fw-bold">Marcus Thorne</div><div class="small text-muted">marcus@company.com</div></div>
                    </div>
                </td>
                <td>Engineering</td>
                <td>Lead Developer</td>
                <td><span class="badge bg-warning-subtle text-warning rounded-pill px-3">On Leave</span></td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-light text-primary"><i class="bi bi-pencil"></i></button>
                </td>
            </tr>
        `;
    }
}

function initForms() {
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'addEmployeeForm') {
            e.preventDefault();
            alert('Employee Added Successfully!');
            e.target.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
            if(modal) modal.hide();
        }
        if (e.target.id === 'leaveRequestForm') {
            e.preventDefault();
            alert('Leave Request Submitted!');
            e.target.reset();
        }
    });
}
