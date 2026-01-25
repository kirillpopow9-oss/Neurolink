// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КЛАССЫ
// ============================================

// // Класс для таблицы лидеров
// class Leaderboard {
//     constructor() {
//         this.key = 'neuralinkLeaderboard';
//         this.load();
//     }

//     load() {
//         const data = localStorage.getItem(this.key);
//         this.scores = data ? JSON.parse(data) : [];
//     }

//     save() {
//         localStorage.setItem(this.key, JSON.stringify(this.scores));
//     }

//     addScore(name, score, game, accuracy) {
//         const user = {
//             name,
//             score: Math.round(score),
//             game,
//             accuracy: Math.round(accuracy),
//             timestamp: new Date().toISOString(),
//             date: new Date().toLocaleDateString('ru-RU')
//         };
        
//         this.scores.push(user);
//         this.scores.sort((a, b) => b.score - a.score);
//         this.scores = this.scores.slice(0, 20);
//         this.save();
//     }

//     getTopScores(limit = 10) {
//         return this.scores.slice(0, limit);
//     }
// }

// // Глобальные переменные для игр
// let leaderboard = new Leaderboard();



// ============================================
// КОММЕНТАРИИ И АВТОРИЗАЦИЯ
// ============================================

// Инициализация комментариев
function initComments() {
    const commentForm = document.getElementById('commentForm');
    if (!commentForm) return;
    
    const user = localStorage.getItem('neuralinkUser');
    
    if (user) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const commentInput = document.getElementById('comment');
            
            if (!nameInput || !commentInput) return;
            
            const name = nameInput.value;
            const commentText = commentInput.value;
            
            if (name && commentText) {
                const now = new Date();
                const dateString = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getFullYear()}`;
                
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-author">${name}</div>
                        <div class="comment-date">${dateString}</div>
                    </div>
                    <div class="comment-text">${commentText}</div>
                `;
                
                const commentsList = document.getElementById('commentsList');
                if (commentsList) {
                    commentsList.insertBefore(commentDiv, commentsList.firstChild);
                }
                
                nameInput.value = '';
                commentInput.value = '';
                
                showNotification('Комментарий добавлен!', 'success');
            }
        });
    } else {
        const inputs = commentForm.querySelectorAll('input, textarea, button');
        inputs.forEach(element => {
            element.disabled = true;
        });
        
        const submitBtn = commentForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Войдите, чтобы комментировать';
            submitBtn.style.background = '#2a3a4a';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#1c2b4a' : '#2a1c2b'};
        color: ${type === 'success' ? '#6ee7b7' : '#ef4444'};
        border-radius: 10px;
        border-left: 5px solid ${type === 'success' ? '#6ee7b7' : '#ef4444'};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Проверка статуса авторизации
function checkAuthStatus() {
    const user = localStorage.getItem('neuralinkUser');
    const authNav = document.getElementById('authNav');
    
    if (!authNav) return;
    
    if (user) {
        const userData = JSON.parse(user);
        authNav.innerHTML = `
            <div class="auth-status">
                <i class="fas fa-user-check"></i>
                <span>${userData.name}</span>
                <a href="#" onclick="logout()">Выйти</a>
            </div>
        `;
    } else {
        authNav.innerHTML = `
            <div class="auth-status">
                <i class="fas fa-user-lock"></i>
                <a href="gggg.html">Вход / Регистрация</a>
            </div>
        `;
    }
}

// Выход из системы
function logout() {
    if (confirm('Вы действительно хотите выйти?')) {
        localStorage.removeItem('neuralinkUser');
        location.reload();
    }
}

// ============================================
// ОБЩАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт Neuralink загружен');
    
    // Добавляем CSS анимации
    addAnimations();
    
    // Инициализируем игры
    initConcentrationGame();
    initRhythmGame();
    initReactionGame();
    
    // Обновляем таблицу лидеров
    updateLeaderboard();
    
    // Проверяем авторизацию
    checkAuthStatus();
    initComments();
    
    // Плавная прокрутка
    initSmoothScroll();
    
    // Мобильное меню
    initMobileMenu();
});

// Добавить CSS анимации
function addAnimations() {
    if (!document.querySelector('#site-animations')) {
        const style = document.createElement('style');
        style.id = 'site-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes successFlash {
                0%, 100% { 
                    background: radial-gradient(circle at 30% 30%, #00ff88, #00d4ff);
                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.8);
                }
                50% { 
                    background: radial-gradient(circle at 30% 30%, #ffffff, #00ff88);
                    box-shadow: 0 0 50px rgba(0, 255, 136, 1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Мобильное меню
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    }
}
// В файле site.js добавьте в начало DOMContentLoaded:
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    checkAuthStatus();
    // ... остальной код
});

// Функция проверки статуса авторизации
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authNav = document.getElementById('authNav');
    
    if (!authNav) return;
    
    if (isLoggedIn === 'true') {
        const savedUser = localStorage.getItem('neuralinkUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            authNav.innerHTML = `
                <div class="auth-status">
                    <i class="fas fa-user-check"></i>
                    <span>${userData.name}</span>
                    <a href="#" onclick="logout()">Выйти</a>
                </div>
            `;
        }
    } else {
        authNav.innerHTML = `
            <div class="auth-status">
                <i class="fas fa-user-lock"></i>
                <a href="gggg.html">Вход / Регистрация</a>
            </div>
        `;
    }
}

// Функция выхода
function logout() {
    if (confirm('Вы действительно хотите выйти?')) {
        localStorage.removeItem('neuralinkUser');
        localStorage.removeItem('isLoggedIn');
        location.reload();
    }
}
