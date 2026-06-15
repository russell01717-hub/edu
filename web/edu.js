// Languages definition
const translations = {
    "en": {
        "page_title": "Payment Policy", "page_desc": "Manage tuition structures and financial reporting", "global_mode": "Global Payment Mode",
        "mode_desc": "Select the default payment mode for the academy. Changes apply to future billing cycles.",
        "per_attendance": "Per Attendance", "fixed_monthly": "Fixed Monthly", "default_fee": "Default Monthly Fee",
        "calc_lesson": "Calculated Per Lesson", "based_12": "(based on 12 lessons)", "income_sim": "Income Simulation (Current Month)",
        "expected": "Expected Income", "if_100": "If 100% Fixed Mode", "actual": "Actual Income", "based_active": "Based on active mode",
        "roster_title": "Class Journal (Magazine)", "roster_desc": "Viewing 50 random students. Search and Payments are Admin-only.",
        "reset": "Reset Data", "col_student": "Student", "col_group": "Group", "col_att": "Attendance (12 max)",
        "col_status": "Status", "col_fee": "Calculated Fee", "mod_warn": "Confirm Change",
        "mod_p1": "You are about to switch the global payment model to ", "mod_p2": "This will ONLY affect future calculations. Previous payments and historic records will remain intact.",
        "btn_cancel": "Cancel", "btn_confirm": "Confirm Change", "nav_dash": "Dashboard", "nav_groups": "Groups", "nav_students": "Students", "nav_policy": "Payment Policy",
        "stat_active": "Active", "stat_joined": "Joined Mid", "stat_left": "Left Early", "diff": "Difference: ",
        "matched": " (Income matched Expected)", "unrealized": "Unrealized Income due to absences: ", 
        "col_balance": "Account Balance", "col_action": "Action", "admin_mode": "Enable Admin Mode",
        "search_ph": "Search student...", "ast_ph": "Ask a question...", "btn_pay": "Pay 0 UZS", "paid": "Paid",
        "ast_intro": "Hello! I am your AI assistant. I can help you understand the payment models.", "ast_btn_explain": "Explain modes", "ast_btn_stats": "Analyze income",
        "ast_explain_fixed": "In Fixed Monthly mode, students pay a standard amount regardless of missed classes.", "ast_explain_per": "In Per-Attendance mode, students only pay for lessons they attend.",
        "ast_analysis_good": "Everything looks great! We are collecting expected income.", "ast_analysis_bad": "Warning: There's an income gap due to absences or dropouts! Switch to Fixed mode for financial stability.",
        "ast_ans_search": "To search, enable Admin mode at the top left, then type a name in the search bar above the journal.",
        "ast_ans_pay": "Students accounts have 0 balance by default. An admin can make a manual payment from the Action column.",
        "ast_ans_default": "I'm still learning! But I can help you with payment modes, income stats, and pointing out where to click things."
    },
    "uz": {
        "page_title": "To'lov Siyosati", "page_desc": "O'qish narxlari va moliyaviy hisobotlarni boshqarish", "global_mode": "Global To'lov Usuli",
        "mode_desc": "Akademiya uchun standart to'lov usulini tanlang. O'zgarishlar kelgusi oylarga ta'sir qiladi.",
        "per_attendance": "Davomat bo'yicha", "fixed_monthly": "Oylik qat'iy", "default_fee": "Standart Oylik To'lov",
        "calc_lesson": "Bitta dars bo'yicha hisob", "based_12": "(12 dars asosida)", "income_sim": "Daromad Simulyatsiyasi (Joriy Oy)",
        "expected": "Kutilayotgan Daromad", "if_100": "100% Qat'iy usulda", "actual": "Haqiqiy Daromad", "based_active": "Faol usul asosida",
        "roster_title": "Elektron Jurnal (Magazine)", "roster_desc": "50 ta tasodifiy o'quvchi. Qidiruv va To'lov faqat Admin uchun.",
        "reset": "Qayta Tiklash", "col_student": "O'quvchi", "col_group": "Guruh", "col_att": "Davomat (maks. 12)",
        "col_status": "Holat", "col_fee": "Hisoblangan To'lov", "mod_warn": "O'zgarishni Tasdiqlash",
        "mod_p1": "Global to'lov modelini o'zgartirmoqchisiz: ", "mod_p2": "FAQAT kelajakdagi hisob-kitoblarga ta'sir qiladi.",
        "btn_cancel": "Bekor", "btn_confirm": "Tasdiqlash", "nav_dash": "Asosiy", "nav_groups": "Guruhlar", "nav_students": "O'quvchilar", "nav_policy": "To'lov Siyosati",
        "stat_active": "Faol", "stat_joined": "Qo'shildi", "stat_left": "Tark etdi", "diff": "Farq: ",
        "matched": " (Daromad kutilganga teng)", "unrealized": "Yo'qotilgan daromad: ",
        "col_balance": "Hisob balansi", "col_action": "Harakat", "admin_mode": "Adminni yoqish",
        "search_ph": "Qidirish...", "ast_ph": "Savolingizni yozing...", "btn_pay": "To'lash", "paid": "To'landi",
        "ast_intro": "Salom! Men EduBot tizimiman. Qanday yordam bera olaman?", "ast_btn_explain": "Tizimni tushuntirish", "ast_btn_stats": "Moliya tahlili",
        "ast_explain_fixed": "Qat'iy Oylik rejimida o'quvchilar dars qoldirilishidan qat'i nazar standart to'lov to'lashadi.", "ast_explain_per": "Davomat rejimida o'quvchilar faqat qatnashgan darslari uchun to'lashadi.",
        "ast_analysis_good": "Hamma narsa ajoyib! Kutilayotgan daromad yig'ilmoqda.", "ast_analysis_bad": "Diqqat: Yo'qolgan daromad mavjud! Qat'iy rejimga o'tishni o'ylab ko'ring.",
        "ast_ans_search": "Qidirish uchun tepada Admin rejimini yoqing va jurnal qidiruv panelidan foydalaning.",
        "ast_ans_pay": "O'quvchilar hisobi 0 so'm. Admin to'lovni o'zi harakat qatoridan amalga oshirishi mumkin.",
        "ast_ans_default": "Men hali o'rganyapman! Lekin to'lovlar, daromadlar va admin huquqlari haqida yordam bera olaman."
    },
    "ru": {
        "page_title": "Политика Оплаты", "page_desc": "Управление структурами оплаты и финансами", "global_mode": "Глобальный Режим",
        "mode_desc": "Выберите режим оплаты по умолчанию. Изменения применяются к будущим месяцам.",
        "per_attendance": "За посещаемость", "fixed_monthly": "Фиксированно в месяц", "default_fee": "Ежемесячный Платеж",
        "calc_lesson": "Расчет за урок", "based_12": "(на основе 12 уроков)", "income_sim": "Симуляция Дохода (Текущий Месяц)",
        "expected": "Ожидаемый Доход", "if_100": "Если 100% Фикс. Режим", "actual": "Фактический Доход", "based_active": "На основе активного режима",
        "roster_title": "Журнал (Электронный)", "roster_desc": "50 студентов. Поиск и платежи только для админов.",
        "reset": "Сброс Данных", "col_student": "Студент", "col_group": "Группа", "col_att": "Посещаемость (12)",
        "col_status": "Статус", "col_fee": "Рассчитано", "mod_warn": "Подтвердите Изменение",
        "mod_p1": "Вы собираетесь изменить модель оплаты на ", "mod_p2": "Повлияет ТОЛЬКО на будущие расчеты.",
        "btn_cancel": "Отмена", "btn_confirm": "Подтвердить", "nav_dash": "Панель", "nav_groups": "Группы", "nav_students": "Студенты", "nav_policy": "Политика Оплаты",
        "stat_active": "Активный", "stat_joined": "Присоединился", "stat_left": "Ушел", "diff": "Разница: ",
        "matched": " (Доход совпадает)", "unrealized": "Недополученный доход: ",
        "col_balance": "Баланс счета", "col_action": "Действие", "admin_mode": "Режим Админа",
        "search_ph": "Поиск...", "ast_ph": "Задайте вопрос...", "btn_pay": "Оплатить", "paid": "Оплачено",
        "ast_intro": "Привет! Я ИИ EduBot. Чем могу помочь?", "ast_btn_explain": "Объяснить режимы", "ast_btn_stats": "Анализ дохода",
        "ast_explain_fixed": "В режиме Фиксированный платеж студенты платят стандартную сумму.", "ast_explain_per": "В режиме За посещаемость студенты платят только за посещенные уроки.",
        "ast_analysis_good": "Все отлично! Мы собираем ожидаемый доход.", "ast_analysis_bad": "Внимание! Есть разрыв в доходе из-за пропусков.",
        "ast_ans_search": "Чтобы искать, включите режим админа, затем используйте строку поиска в Журнале.",
        "ast_ans_pay": "Баланс студентов равен 0 сум. Админ может провести платеж в колонке Действие.",
        "ast_ans_default": "Я все еще учусь! Обращайтесь по поводу платежей, финансов и режима администратора."
    }
};

let currentLang = 'en';
const FIXED_MONTHLY_FEE = 300000;
const TOTAL_LESSONS = 12;
const PER_LESSON_FEE = FIXED_MONTHLY_FEE / TOTAL_LESSONS; // 25,000 UZS

let isFixedMode = true;
let isAdmin = false;
let students = [];

const firstNames = ["Aziz", "Malika", "Javohir", "Gulnoza", "Dilshod", "Zarina", "Rustam", "Madina", "Sardor", "Shahzoda", "Ivan", "Maria", "Alexey", "Oleg", "Anna", "Dmitry", "Elena", "Kamila", "Anvar", "Nigina"];
const lastNames = ["Rakhimov", "Yusupova", "Tursunov", "Karimova", "Abdullaev", "Ergasheva", "Khodjaev", "Ivanov", "Smirnov", "Petrov", "Sokolova", "Volkov", "Morozov", "Kurbanov", "Aliev", "Umarov", "Ismailova", "Nazarov", "Rustamov"];
const groups = ["Beginner English", "Advanced Math", "Russian For Adults", "Web Development", "IELTS Prep"];

function generateFakeStudents(count) {
    let result = [];
    for (let i = 1; i <= count; i++) {
        const rand = Math.random();
        let status = 'active'; let joinedMidMonth = false; let leftEarly = false; let totalPossible = 12; let attended = 12;

        if (rand > 0.9) { status = 'new'; joinedMidMonth = true; totalPossible = Math.floor(Math.random() * 8) + 2; attended = Math.floor(Math.random() * (totalPossible + 1)); }
        else if (rand > 0.8) { status = 'left'; leftEarly = true; totalPossible = Math.floor(Math.random() * 6) + 3; attended = Math.floor(Math.random() * totalPossible); }
        else { attended = Math.floor(Math.random() * 4) + 9; if(attended > 12) attended = 12; }

        result.push({
            id: i,
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            group: groups[Math.floor(Math.random() * groups.length)],
            status, joinedMidMonth, leftEarly, attended, totalPossible,
            balance: 0 // Magazine logic: Everyone's account starts at 0 som
        });
    }
    return result;
}

const modeToggle = document.getElementById('paymentModeToggle');
const modeBadge = document.getElementById('modeBadge');
const tbody = document.getElementById('studentTableBody');
const expectedEl = document.getElementById('expectedIncome');
const actualEl = document.getElementById('actualIncome');
const varianceAlertEl = document.getElementById('varianceAlert');
const modal = document.getElementById('warningModal');
const btnCancelMode = document.getElementById('cancelModeBtn');
const btnConfirmMode = document.getElementById('confirmModeBtn');
const newModeText = document.getElementById('modalNewMode');
const btnReset = document.getElementById('resetBtn');
const langSelect = document.getElementById('langSelect');
const themeToggle = document.getElementById('themeToggle');
const adminToggle = document.getElementById('adminRoleToggle');
const adminLabel = document.getElementById('adminLabel');
const searchBarContainer = document.getElementById('searchBarContainer');
const searchInput = document.getElementById('searchInput');

// Assistant DOM
const assistantAvatar = document.getElementById('assistantAvatar');
const assistantBubble = document.getElementById('assistantBubble');
const closeAssistant = document.getElementById('closeAssistant');
const astChatBody = document.getElementById('astChatBody');
const astInput = document.getElementById('astInput');
const astSendBtn = document.getElementById('astSendBtn');
const astBtnExplain = document.getElementById('astBtnExplain');
const astBtnStats = document.getElementById('astBtnStats');
const astNotif = document.getElementById('astNotif');

let pendingModeChange = null;

function init() {
    students = generateFakeStudents(50); // The 50 student requirement for the Magazine
    applyTranslations();
    renderTable();
    updateStats();
}

function formatMoney(amount) { return amount.toLocaleString() + " UZS"; }
function calculateStudentFee(student) {
    if (isFixedMode) {
        if (student.joinedMidMonth || student.leftEarly) return student.totalPossible * PER_LESSON_FEE;
        return FIXED_MONTHLY_FEE;
    } else {
        return student.attended * PER_LESSON_FEE;
    }
}

function t(key) { return translations[currentLang][key] || key; }

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (translations[currentLang][el.getAttribute('data-i18n')]) el.innerText = translations[currentLang][el.getAttribute('data-i18n')];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        if (translations[currentLang][el.getAttribute('data-i18n-ph')]) el.placeholder = translations[currentLang][el.getAttribute('data-i18n-ph')];
    });
    modeBadge.innerText = isFixedMode ? t("fixed_monthly") : t("per_attendance");
    updateStats();
    renderTable();
}

function renderTable() {
    tbody.innerHTML = '';
    const q = searchInput.value.toLowerCase();
    
    students.forEach((student, index) => {
        if (q && !student.name.toLowerCase().includes(q) && !student.group.toLowerCase().includes(q)) return; // Search Filter

        const fee = calculateStudentFee(student);
        let statusClass = student.status === 'active' ? 'status-active' : student.status === 'new' ? 'status-new' : 'status-left';
        let statusKey = student.status === 'active' ? 'stat_active' : student.status === 'new' ? 'stat_joined' : 'stat_left';
        let missedPenalty = isFixedMode && student.attended < student.totalPossible && !student.joinedMidMonth && !student.leftEarly;

        let tr = document.createElement('tr');
        
        let actionCell = `<span class="text-muted" style="font-size:0.8rem">Waiting</span>`;
        if (student.balance > 0) {
            actionCell = `<span class="badge" style="background:var(--success-color); color:white">${t('paid')}</span>`;
        } else if (isAdmin && student.balance === 0) {
            actionCell = `<button class="btn btn-success action-btn" onclick="makePayment(${index}, ${fee})">${t('btn_pay')}</button>`;
        }

        tr.innerHTML = `
            <td>
                <div class="student-info">
                    <span class="student-name">${student.name}</span>
                    <span class="student-sub">ID: ${(student.id).toString().padStart(3, '0')}</span>
                </div>
            </td>
            <td>${student.group}</td>
            <td>
                <div class="attendance-controls">
                    <button class="att-btn" onclick="updateAttendance(${index}, -1)" ${student.attended <= 0 ? 'disabled' : ''}>-</button>
                    <strong>${student.attended} / ${student.totalPossible}</strong>
                    <button class="att-btn" onclick="updateAttendance(${index}, 1)" ${student.attended >= student.totalPossible ? 'disabled' : ''}>+</button>
                </div>
            </td>
            <td><span class="status-badge ${statusClass}">${t(statusKey)}</span></td>
            <td class="text-right">
                <span class="fee-calc ${missedPenalty ? 'missed' : ''}">${formatMoney(fee)}</span>
            </td>
            <td class="text-right">
                <span class="balance-account ${student.balance > 0 ? 'paid' : ''}">${formatMoney(student.balance)}</span>
            </td>
            <td class="text-center">${actionCell}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateAttendance = function(index, delta) {
    let s = students[index]; let newVal = s.attended + delta;
    if (newVal >= 0 && newVal <= s.totalPossible) {
        s.attended = newVal; renderTable(); updateStats();
    }
}

window.makePayment = function(index, amount) {
    if(!isAdmin) return; // Only admin
    students[index].balance = amount; // Sets balance to calculated fee
    renderTable();
}

function updateStats() {
    let expected = 0; let actual = 0;
    students.forEach(s => {
        let exp = FIXED_MONTHLY_FEE;
        if(s.joinedMidMonth || s.leftEarly) exp = s.totalPossible * PER_LESSON_FEE;
        expected += exp;
        actual += calculateStudentFee(s);
    });
    
    expectedEl.textContent = formatMoney(expected);
    actualEl.textContent = formatMoney(actual);
    let variance = expected - actual;
    
    if (variance === 0) {
        varianceAlertEl.style.color = 'var(--success-color)'; varianceAlertEl.style.background = 'rgba(16, 185, 129, 0.1)'; varianceAlertEl.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        varianceAlertEl.innerHTML = `<span data-i18n="diff">${t('diff')}</span> <b style="color:var(--success-color)">0 UZS</b> <span data-i18n="matched">${t('matched')}</span>`;
    } else {
        varianceAlertEl.style.color = 'var(--warning-color)'; varianceAlertEl.style.background = 'rgba(245, 158, 11, 0.1)'; varianceAlertEl.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        varianceAlertEl.innerHTML = `<span data-i18n="unrealized">${t('unrealized')}</span> <b style="color:var(--danger-color)">-${formatMoney(variance)}</b>`;
    }
}

// Events
searchInput.addEventListener('input', renderTable);

adminToggle.addEventListener('change', (e) => {
    isAdmin = e.target.checked;
    adminLabel.classList.toggle('active', isAdmin);
    searchBarContainer.classList.toggle('active', isAdmin);
    if(!isAdmin) { searchInput.value = ''; } // Clear search if admin leaves
    renderTable(); // Re-render to show/hide pay buttons and search results
});

langSelect.addEventListener('change', (e) => { currentLang = e.target.value; applyTranslations(); });
themeToggle.addEventListener('click', () => { document.body.classList.toggle('light-mode'); themeToggle.innerHTML = document.body.classList.contains('light-mode') ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>"; });

modeToggle.addEventListener('change', (e) => {
    e.preventDefault(); pendingModeChange = e.target.checked; modeToggle.checked = !pendingModeChange;
    newModeText.textContent = pendingModeChange ? t("fixed_monthly") : t("per_attendance");
    modal.classList.add('active');
});

btnCancelMode.addEventListener('click', () => { modal.classList.remove('active'); pendingModeChange = null; });
btnConfirmMode.addEventListener('click', () => {
    isFixedMode = pendingModeChange; modeToggle.checked = isFixedMode;
    const labels = document.querySelectorAll('.toggle-label');
    if (isFixedMode) { labels[0].classList.remove('active'); labels[1].classList.add('active'); modeBadge.textContent = t("fixed_monthly"); modeBadge.style.color = "var(--primary-color)"; modeBadge.style.background = "rgba(59, 130, 246, 0.2)"; }
    else { labels[1].classList.remove('active'); labels[0].classList.add('active'); modeBadge.textContent = t("per_attendance"); modeBadge.style.color = "var(--warning-color)"; modeBadge.style.background = "rgba(245, 158, 11, 0.2)"; }
    modal.classList.remove('active'); renderTable(); updateStats();
});

btnReset.addEventListener('click', () => { students = generateFakeStudents(50); renderTable(); updateStats(); });

// ==== AI Assistant ==== //
assistantAvatar.addEventListener('click', () => {
    assistantBubble.classList.toggle('active');
    astNotif.classList.add('hidden');
});

closeAssistant.addEventListener('click', () => { assistantBubble.classList.remove('active'); });

function addChatMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user-msg' : 'bot-msg'}`;
    msg.innerText = text;
    astChatBody.appendChild(msg);
    astChatBody.scrollTop = astChatBody.scrollHeight;
}

astBtnExplain.addEventListener('click', () => { addChatMessage(isFixedMode ? t("ast_explain_fixed") : t("ast_explain_per"), false); });
astBtnStats.addEventListener('click', () => { 
    if (varianceAlertEl.innerHTML.includes('0 UZS')) addChatMessage(t("ast_analysis_good"), false); 
    else addChatMessage(t("ast_analysis_bad"), false); 
});

function handleAiInput() {
    const text = astInput.value.trim().toLowerCase();
    if(!text) return;
    addChatMessage(astInput.value, true);
    astInput.value = '';

    // Simulate typing
    const typing = document.createElement('div');
    typing.className = 'chat-message bot-msg typing-indicator';
    typing.innerText = "Typing...";
    astChatBody.appendChild(typing);
    astChatBody.scrollTop = astChatBody.scrollHeight;

    setTimeout(() => {
        typing.remove();
        if (text.includes('search') || text.includes('qidir') || text.includes('поиск')) {
            addChatMessage(t("ast_ans_search"), false);
        } else if (text.includes('pay') || text.includes('to\'la') || text.includes('оплат')) {
            addChatMessage(t("ast_ans_pay"), false);
        } else {
            addChatMessage(t("ast_ans_default"), false);
        }
    }, 800);
}

astSendBtn.addEventListener('click', handleAiInput);
astInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAiInput(); });

init();
