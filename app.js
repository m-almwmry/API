// بيانات المستخدمين (يمكن استبدالها بخادم حقيقي)
let users = [
    {
        username: "admin",
        password: "admin123",
        expiration: new Date("2025-05-31").getTime(),
        notificationDate: new Date("2025-03-20").getTime()
    },
{
        username: "kdabra",
        password: "admin123",
        expiration: new Date("2025-05-31").getTime(),
        notificationDate: new Date("2025-02-20").getTime()
    },
{
        username: "bcard",
        password: "771795306",
        expiration: new Date("2025-05-31").getTime(),
        notificationDate: new Date("2026-02-23").getTime()
    },
{
        username: "sadam",
        password: "778221128",
        expiration: new Date("2025-05-31").getTime(),
        notificationDate: new Date("2026-02-23").getTime()
    },


    // يمكن إضافة المزيد من المستخدمين هنا
];

// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
    } else {
        const user = JSON.parse(loggedInUser);
        checkPasswordExpiry(user);
    }
}

// التحقق من انتهاء الصلاحية
function checkPasswordExpiry(user) {
    const now = new Date().getTime();
    const expiryDate = user.expiration;
    const notificationDate = user.notificationDate;

    if (now > expiryDate) {
        alert('كلمة المرور منتهية الصلاحية! يرجى الاتصال بالدعم.');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    } else if (now >= notificationDate) {
        const daysLeft = Math.ceil((expiryDate - now) / (1000 * 3600 * 24));
        alert(`
تنبيه: الاشتراك سيتنهي  خلال ${daysLeft} أيام!`);
    }
}

// تسجيل الدخول
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('بيانات الدخول غير صحيحة!');
    }
});

// تسجيل الخروج
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// إضافة زر تسجيل الخروج
function addLogoutButton() {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> تسجيل الخروج';
    logoutBtn.onclick = logout;
    document.body.appendChild(logoutBtn);
}

// تهيئة الصفحة الرئيسية
if (window.location.pathname.endsWith('index.html')) {
    checkAuth();
    addLogoutButton();
}

// إدارة المستخدمين (واجهة الإدارة)
function addUser(username, password, expirationDate) {
    const notificationDate = new Date(expirationDate);
    notificationDate.setDate(notificationDate.getDate() - 2);
    
    users.push({
        username,
        password,
        expiration: expirationDate.getTime(),
        notificationDate: notificationDate.getTime()
    });
}

// مثال لإضافة مستخدم:
// addUser('user2', 'pass123', new Date('2024-06-30'));








document.addEventListener('DOMContentLoaded', function() {
    const exchangeRate = 560;
    const serviceRates = {
        
        "شحن يويو": { costPerUnit: 0.000787, suggestedPerUnit: 0.000848 },
               "شحن تيك توك": { costPerUnit: 0.01186, suggestedPerUnit: 0.01275 },
        "زينا لايف": { costPerUnit: 0.0005, suggestedPerUnit: 0.0006 },
        "شحن يوهو": { costPerUnit: 0.0001079, suggestedPerUnit: 0.0001104 },
        "شحن ببجي": { costPerUnit: 0.0001079, suggestedPerUnit: 0.0001104 },
        "شحن لايكي": { costPerUnit: 0.01866, suggestedPerUnit: 0.02088 },
        "بيلا شات": { costPerUnit: 0.0010215, suggestedPerUnit: 0.0010525 },
        "شحن بيجو لايف": { costPerUnit: 0.01846, suggestedPerUnit: 0.01922 }
    };

    // وظيفة نسخ النص
    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('click', async function() {
            const match = this.textContent.match(/\((.*?)\)/);
            if (!match) return;
            
            const text = match[1];
            try {
                await navigator.clipboard.writeText(text);
                this.classList.add('copied');
                setTimeout(() => this.classList.remove('copied'), 2000);
            } catch (err) {
                alert('تعذر النسخ، يرجى المحاولة مرة أخرى');
            }
        });
    });

    // تبديل الوضع الليلي
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const btn = document.querySelector('.dark-mode-toggle');
        btn.textContent = document.body.classList.contains('dark-mode') 
            ? '🌓 ربط تطبيقات vip' 
            : '🌓 ربط تطبيقات vip';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    document.querySelector('.dark-mode-toggle').addEventListener('click', toggleDarkMode);

    // استعادة التفضيلات
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // وظائف الحساب
    function extractNumber(text) {
        const number = parseInt(text.replace(/[^\d]/g, '')) || 0;
        return Math.max(0, number);
    }

    function smartFormat(number, isRY) {
        if (isNaN(number)) return '0.00';
        
        return number.toLocaleString('en-US', {
            minimumFractionDigits: isRY ? 2 : 3,
            maximumFractionDigits: isRY ? 2 : 3
        });
    }

    function calculatePrices() {
        document.querySelectorAll('.service-section').forEach(section => {
            const title = section.querySelector('.service-title').textContent.trim();
            const service = serviceRates[title];
            
            if (!service) return;

            section.querySelectorAll('tbody tr').forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                const quantity = extractNumber(cells[0].textContent);
                
                const costUSD = quantity * service.costPerUnit;
                const suggestedUSD = quantity * service.suggestedPerUnit;
                const costRY = costUSD * exchangeRate;
                const suggestedRY = suggestedUSD * exchangeRate;

                if (cells[1]) cells[1].innerHTML = `${smartFormat(costRY, true)} <span class="currency-symbol">ر.ي</span>`;
                if (cells[2]) cells[2].innerHTML = `${smartFormat(costUSD, false)} <span class="currency-symbol">USD</span>`;
                if (cells[3]) cells[3].innerHTML = `${smartFormat(suggestedRY, true)} <span class="currency-symbol">ر.ي</span>`;
                if (cells[4]) cells[4].innerHTML = `${smartFormat(suggestedUSD, false)} <span class="currency-symbol">USD</span>`;
            });
        });
    }

    calculatePrices();
});
