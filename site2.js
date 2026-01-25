document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('neuralinkUser');
    if (savedUser) {
        // Если пользователь уже авторизован, перенаправляем на главную
        window.location.href = 'index.html';
        return;
    }
    
    // Инициализация переключения паролей
    initPasswordToggles();
    
    // Инициализация переключения вкладок
    initAuthTabs();
    
    // Инициализация форм
    initLoginForm();
    initRegisterForm();
    
    // Скрываем все сообщения
    hideAllMessages();
});

// Показать/скрыть пароль
function initPasswordToggles() {
    // Для формы входа
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            const passwordField = document.getElementById('loginPassword');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Для формы регистрации (пароль)
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    if (toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener('click', function() {
            const passwordField = document.getElementById('registerPassword');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Для формы регистрации (подтверждение пароля)
    const toggleRegisterConfirmPassword = document.getElementById('toggleRegisterConfirmPassword');
    if (toggleRegisterConfirmPassword) {
        toggleRegisterConfirmPassword.addEventListener('click', function() {
            const passwordField = document.getElementById('registerConfirmPassword');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

// Переключение вкладок авторизации/регистрации
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех вкладок и форм
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке и форме
            this.classList.add('active');
            document.getElementById(tabId + 'Form').classList.add('active');
            
            // Скрываем сообщения об ошибках при переключении
            hideAllMessages();
        });
    });
}

// Форма входа
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Скрываем предыдущие сообщения
        hideAllMessages();
        
        // Проверяем существование пользователя
        const savedUser = localStorage.getItem('neuralinkUser');
        
        if (savedUser) {
            const user = JSON.parse(savedUser);
            
            // Простая проверка
            if (user.email === email && user.password === password) {
                // Показываем успешное сообщение
                const loginSuccess = document.getElementById('loginSuccess');
                if (loginSuccess) {
                    loginSuccess.style.display = 'flex';
                }
                
                // Сохраняем статус авторизации
                localStorage.setItem('isLoggedIn', 'true');
                
                // Перенаправляем на главную страницу через 1 секунду
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                // Показываем ошибку
                const loginError = document.getElementById('loginError');
                const loginErrorText = document.getElementById('loginErrorText');
                if (loginError && loginErrorText) {
                    loginErrorText.textContent = 'Неверный email или пароль';
                    loginError.style.display = 'flex';
                }
            }
        } else {
            // Показываем ошибку
            const loginError = document.getElementById('loginError');
            const loginErrorText = document.getElementById('loginErrorText');
            if (loginError && loginErrorText) {
                loginErrorText.textContent = 'Пользователь не найден. Зарегистрируйтесь.';
                loginError.style.display = 'flex';
            }
            
            // Переключаем на вкладку регистрации
            document.querySelector('[data-tab="register"]').click();
        }
    });
}

// Форма регистрации
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Скрываем предыдущие сообщения
        hideAllMessages();
        
        // Валидация
        let isValid = true;
        let errorMessage = '';
        
        // Проверка имени
        if (name.trim().length < 2) {
            isValid = false;
            errorMessage = 'Имя должно содержать минимум 2 символа';
        }
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            errorMessage = 'Введите корректный email адрес';
        }
        
        // Проверка пароля
        if (password.length < 8) {
            isValid = false;
            errorMessage = 'Пароль должен содержать минимум 8 символов';
        }
        
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            isValid = false;
            errorMessage = 'Пароли не совпадают';
        }
        
        if (!isValid) {
            // Показываем ошибку
            const registerError = document.getElementById('registerError');
            const registerErrorText = document.getElementById('registerErrorText');
            if (registerError && registerErrorText) {
                registerErrorText.textContent = errorMessage;
                registerError.style.display = 'flex';
            }
            return;
        }
        
        // Создаем объект пользователя
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            joinDate: new Date().toLocaleDateString('ru-RU'),
            avatarLetter: name.charAt(0).toUpperCase()
        };
        
        // Сохраняем пользователя в localStorage
        localStorage.setItem('neuralinkUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Показываем успешное сообщение
        const registerSuccess = document.getElementById('registerSuccess');
        if (registerSuccess) {
            registerSuccess.style.display = 'flex';
        }
        
        // Перенаправляем на главную страницу через 1.5 секунды
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        // Очищаем форму
        registerForm.reset();
    });
}

// Скрыть все сообщения об ошибках и успехах
function hideAllMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        message.style.display = 'none';
    });
}

// Обработка кнопки "Забыли пароль"
const forgotPassword = document.querySelector('.forgot-password');
if (forgotPassword) {
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Функция восстановления пароля будет доступна в следующем обновлении.');
    });
}

// Обработка ссылок на условия использования
const termsLinks = document.querySelectorAll('a[href="#"]');
termsLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Документы будут доступны после запуска бета-версии Neuralink.');
    });
});