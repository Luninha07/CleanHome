// Dados iniciais
const services = [
    {
        id: 1,
        name: "Limpeza Residencial",
        description: "Limpeza completa da casa incluindo salas, quartos, cozinha e banheiros. Utilizamos produtos ecológicos e equipamentos profissionais.",
        price: 120.00,
        duration: "4 horas",
        category: "Limpeza",
        icon: "🧹"
    },
    {
        id: 2,
        name: "Limpeza de Tapetes",
        description: "Limpeza profissional de tapetes e carpetes com tecnologia a vapor. Remove manchas e ácaros profundamente.",
        price: 80.00,
        duration: "2 horas",
        category: "Limpeza",
        icon: "🧽"
    },
    {
        id: 3,
        name: "Jardineiro",
        description: "Cuidados com plantas, poda de grama, adubação e manutenção completa do jardim. Especialista em paisagismo.",
        price: 150.00,
        duration: "3 horas",
        category: "Manutenção",
        icon: "🌿"
    },
    {
        id: 4,
        name: "Encanador",
        description: "Reparos e manutenção em encanamentos residenciais. Desentupimento, vazamentos e instalações.",
        price: 200.00,
        duration: "2 horas",
        category: "Manutenção",
        icon: "🔧"
    },
    {
        id: 5,
        name: "Eletricista",
        description: "Instalações e reparos elétricos residenciais. Troca de tomadas, lâmpadas e quadros de energia.",
        price: 180.00,
        duration: "2 hours",
        category: "Manutenção",
        icon: "⚡"
    },
    {
        id: 6,
        name: "Lavagem de Janelas",
        description: "Limpeza interna e externa de janelas e vidros. Inclui armações e peitoris. Resultado cristalino.",
        price: 100.00,
        duration: "2 horas",
        category: "Limpeza",
        icon: "🪟"
    }
];

// Sistema de Autenticação
let currentUser = null;
let currentUserType = null;

// Inicialização do localStorage
function initializeStorage() {
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify(services));
    }
    
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('ratings')) {
        localStorage.setItem('ratings', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('providers')) {
        localStorage.setItem('providers', JSON.stringify([]));
    }
    
    // Verificar se há usuário logado
    const loggedInUser = localStorage.getItem('currentUser');
    const loggedInUserType = localStorage.getItem('currentUserType');
    
    if (loggedInUser && loggedInUserType) {
        currentUser = JSON.parse(loggedInUser);
        currentUserType = loggedInUserType;
        showMainApp();
    }
}

// Validação de Email
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Sistema de Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const userType = document.getElementById('login-type').value;
    
    if (!validateEmail(email)) {
        showAlert('Por favor, insira um e-mail válido (exemplo@dominio.com).', 'error');
        return;
    }
    
    if (!userType) {
        showAlert('Por favor, selecione o tipo de usuário.', 'error');
        return;
    }
    
    if (userType === 'client') {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            currentUserType = 'client';
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUserType', 'client');
            showMainApp();
            showAlert('Login realizado com sucesso!', 'success');
        } else {
            showAlert('E-mail ou senha incorretos.', 'error');
        }
    } else if (userType === 'provider') {
        const providers = JSON.parse(localStorage.getItem('providers'));
        const provider = providers.find(p => p.email === email && p.password === password);
        
        if (provider) {
            currentUser = provider;
            currentUserType = 'provider';
            localStorage.setItem('currentUser', JSON.stringify(provider));
            localStorage.setItem('currentUserType', 'provider');
            showMainApp();
            showAlert('Login realizado com sucesso!', 'success');
        } else {
            showAlert('E-mail ou senha incorretos.', 'error');
        }
    }
});

// Sistema de Registro Cliente
document.getElementById('register-form-client').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name-client').value;
    const email = document.getElementById('register-email-client').value;
    const phone = document.getElementById('register-phone-client').value;
    const password = document.getElementById('register-password-client').value;
    
    if (!validateEmail(email)) {
        showAlert('Por favor, insira um e-mail válido (exemplo@dominio.com).', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.find(u => u.email === email)) {
        showAlert('Este e-mail já está cadastrado.', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        address: '',
        preferences: {
            notifyEmail: true,
            notifySMS: true,
            preferredTime: 'afternoon'
        },
        profileImage: null,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    currentUserType = 'client';
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('currentUserType', 'client');
    showMainApp();
    showAlert('Conta criada com sucesso! Bem-vindo ao CleanHome.', 'success');
});

// Sistema de Registro Prestador
document.getElementById('register-form-provider').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name-provider').value;
    const email = document.getElementById('register-email-provider').value;
    const phone = document.getElementById('register-phone-provider').value;
    const service = document.getElementById('register-service-provider').value;
    const bio = document.getElementById('register-bio-provider').value;
    const password = document.getElementById('register-password-provider').value;
    
    if (!validateEmail(email)) {
        showAlert('Por favor, insira um e-mail válido (exemplo@dominio.com).', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    if (!service) {
        showAlert('Por favor, selecione um serviço.', 'error');
        return;
    }
    
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    if (providers.find(p => p.email === email)) {
        showAlert('Este e-mail já está cadastrado.', 'error');
        return;
    }
    
    const newProvider = {
        id: Date.now(),
        name,
        email,
        phone,
        service,
        bio,
        password,
        profileImage: null,
        availability: {
            morning: true,
            afternoon: true,
            cities: ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Paulista', 'Camaragibe']
        },
        rating: 0,
        totalServices: 0,
        earnings: 0,
        createdAt: new Date().toISOString()
    };
    
    providers.push(newProvider);
    localStorage.setItem('providers', JSON.stringify(providers));
    
    currentUser = newProvider;
    currentUserType = 'provider';
    localStorage.setItem('currentUser', JSON.stringify(newProvider));
    localStorage.setItem('currentUserType', 'provider');
    showMainApp();
    showAlert('Conta de prestador criada com sucesso!', 'success');
});

// Alternar entre formulários
document.getElementById('show-register-client').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form-provider').classList.remove('active');
    document.getElementById('register-form-client').classList.add('active');
});

document.getElementById('show-register-provider').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form-client').classList.remove('active');
    document.getElementById('register-form-provider').classList.add('active');
});

document.getElementById('show-login-from-client').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-form-client').classList.remove('active');
    document.getElementById('register-form-provider').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
});

document.getElementById('show-login-from-provider').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-form-client').classList.remove('active');
    document.getElementById('register-form-provider').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
});

// Logout
document.getElementById('logout-btn-client')?.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
});

document.getElementById('logout-btn-provider')?.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
});

function logout() {
    currentUser = null;
    currentUserType = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    showLoginScreen();
    showAlert('Você saiu da sua conta.', 'success');
}

// Mostrar/Esconder telas
function showMainApp() {
    document.getElementById('login-screen').style.display = 'none';
    
    if (currentUserType === 'client') {
        document.getElementById('main-app-client').style.display = 'block';
        document.getElementById('main-app-provider').style.display = 'none';
        loadServices();
        loadAppointments();
        loadRatings();
        updateStats();
        loadProfileData();
        setupProfileImageUpload('client');
        setupProfileTabs('client');
        setupFilters();
    } else if (currentUserType === 'provider') {
        document.getElementById('main-app-client').style.display = 'none';
        document.getElementById('main-app-provider').style.display = 'block';
        loadProviderDashboard();
        loadProviderSchedule();
        loadProviderServices();
        loadProviderRatings();
        loadProviderProfile();
        setupProfileImageUpload('provider');
        setupProfileTabs('provider');
    }
    
    setupMobileMenu();
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-app-client').style.display = 'none';
    document.getElementById('main-app-provider').style.display = 'none';
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form-client').classList.remove('active');
    document.getElementById('register-form-provider').classList.remove('active');
    document.getElementById('login-form').reset();
    document.getElementById('register-form-client').reset();
    document.getElementById('register-form-provider').reset();
}

// Mobile Menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn') || document.getElementById('mobile-menu-btn-provider');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
}

// Navegação entre seções
function setupNavigation(appType) {
    const navLinks = document.querySelectorAll(`#main-app-${appType} .nav-link`);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('logout')) return;
            
            document.querySelectorAll(`#main-app-${appType} .nav-link`).forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll(`#main-app-${appType} .content-section`).forEach(section => {
                section.classList.remove('active');
            });
            
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Fechar menu mobile após clicar
            const mainNav = document.querySelector(`#main-app-${appType} .main-nav`);
            if (mainNav) {
                mainNav.classList.remove('active');
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Setup navigation for both apps
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation('client');
    setupNavigation('provider');
});

// Sistema de Upload de Foto de Perfil
function setupProfileImageUpload(userType) {
    const avatarInput = document.getElementById(`avatar-input-${userType}`);
    const uploadBtn = document.getElementById(`upload-btn-${userType}`);
    const avatarImage = document.getElementById(`avatar-image-${userType}`);
    const avatarPlaceholder = document.getElementById(`avatar-placeholder-${userType}`);
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => avatarInput.click());
    }
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    showAlert('A imagem deve ser menor que 5MB.', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarImage.src = e.target.result;
                    avatarImage.style.display = 'block';
                    avatarPlaceholder.style.display = 'none';
                    
                    // Salvar imagem
                    currentUser.profileImage = e.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateUsersStorage();
                    showAlert('Foto de perfil atualizada com sucesso!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function updateUsersStorage() {
    if (currentUserType === 'client') {
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    } else if (currentUserType === 'provider') {
        const providers = JSON.parse(localStorage.getItem('providers'));
        const providerIndex = providers.findIndex(p => p.id === currentUser.id);
        if (providerIndex !== -1) {
            providers[providerIndex] = currentUser;
            localStorage.setItem('providers', JSON.stringify(providers));
        }
    }
}

// Sistema de Abas do Perfil
function setupProfileTabs(userType) {
    const tabBtns = document.querySelectorAll(`#main-app-${userType} .tab-btn`);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`#main-app-${userType} .tab-pane`).forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// Carregar Dados do Perfil Cliente
function loadProfileData() {
    if (!currentUser) return;
    
    document.getElementById('profile-name-client').textContent = currentUser.name;
    document.getElementById('profile-email-client').textContent = currentUser.email;
    document.getElementById('edit-name-client').value = currentUser.name;
    document.getElementById('edit-phone-client').value = currentUser.phone;
    document.getElementById('edit-email-client').value = currentUser.email;
    document.getElementById('edit-address-client').value = currentUser.address || '';
    
    // Preferências
    if (currentUser.preferences) {
        document.getElementById('notify-email-client').checked = currentUser.preferences.notifyEmail;
        document.getElementById('notify-sms-client').checked = currentUser.preferences.notifySMS;
        document.getElementById('preferred-time-client').value = currentUser.preferences.preferredTime;
    }
    
    // Foto de perfil
    const avatarImage = document.getElementById('avatar-image-client');
    const avatarPlaceholder = document.getElementById('avatar-placeholder-client');
    
    if (currentUser.profileImage) {
        avatarImage.src = currentUser.profileImage;
        avatarImage.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
    }
    
    updateProfileStats();
}

// Carregar Dados do Perfil Prestador
function loadProviderProfile() {
    if (!currentUser) return;
    
    document.getElementById('profile-name-provider').textContent = currentUser.name;
    document.getElementById('profile-service-provider').textContent = currentUser.service;
    document.getElementById('profile-email-provider').textContent = currentUser.email;
    document.getElementById('edit-name-provider').value = currentUser.name;
    document.getElementById('edit-phone-provider').value = currentUser.phone;
    document.getElementById('edit-email-provider').value = currentUser.email;
    document.getElementById('edit-service-provider').value = currentUser.service;
    document.getElementById('edit-bio-provider').value = currentUser.bio || '';
    
    // Disponibilidade - Inicializar com todas as cidades se não existir
    if (!currentUser.availability) {
        currentUser.availability = {
            morning: true,
            afternoon: true,
            cities: [
                'Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Paulista',
                'Camaragibe', 'São Lourenço da Mata', 'Cabo de Santo Agostinho',
                'Igarassu', 'Abreu e Lima', 'Moreno', 'Itapissuma',
                'Ilha de Itamaracá', 'Ipojuca', 'Araçoiaba'
            ]
        };
    }
    
    // Horários de trabalho
    document.getElementById('morning-availability').checked = currentUser.availability.morning;
    document.getElementById('afternoon-availability').checked = currentUser.availability.afternoon;
    
    // Cidades - Marcar checkboxes baseado nas cidades salvas
    const cityCheckboxes = document.querySelectorAll('input[name="cities"]');
    cityCheckboxes.forEach(checkbox => {
        checkbox.checked = currentUser.availability.cities?.includes(checkbox.value) || false;
    });
    
    // Foto de perfil
    const avatarImage = document.getElementById('avatar-image-provider');
    const avatarPlaceholder = document.getElementById('avatar-placeholder-provider');
    
    if (currentUser.profileImage) {
        avatarImage.src = currentUser.profileImage;
        avatarImage.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
    }
    
    updateProviderProfileStats();
}

// Formulários do Perfil Cliente
document.getElementById('info-form-client')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    currentUser.name = document.getElementById('edit-name-client').value;
    currentUser.phone = document.getElementById('edit-phone-client').value;
    currentUser.email = document.getElementById('edit-email-client').value;
    currentUser.address = document.getElementById('edit-address-client').value;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUsersStorage();
    loadProfileData();
    showAlert('Informações atualizadas com sucesso!', 'success');
});

document.getElementById('security-form-client')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password-client').value;
    const newPassword = document.getElementById('new-password-client').value;
    const confirmPassword = document.getElementById('confirm-password-client').value;
    
    if (currentPassword !== currentUser.password) {
        showAlert('Senha atual incorreta.', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('A nova senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('As senhas não coincidem.', 'error');
        return;
    }
    
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUsersStorage();
    document.getElementById('security-form-client').reset();
    showAlert('Senha alterada com sucesso!', 'success');
});

document.getElementById('preferences-form-client')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    currentUser.preferences = {
        notifyEmail: document.getElementById('notify-email-client').checked,
        notifySMS: document.getElementById('notify-sms-client').checked,
        preferredTime: document.getElementById('preferred-time-client').value
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUsersStorage();
    showAlert('Preferências salvas!', 'success');
});

// Formulários do Perfil Prestador
document.getElementById('provider-info-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    currentUser.name = document.getElementById('edit-name-provider').value;
    currentUser.phone = document.getElementById('edit-phone-provider').value;
    currentUser.email = document.getElementById('edit-email-provider').value;
    currentUser.service = document.getElementById('edit-service-provider').value;
    currentUser.bio = document.getElementById('edit-bio-provider').value;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUsersStorage();
    loadProviderProfile();
    showAlert('Informações profissionais atualizadas com sucesso!', 'success');
});

document.getElementById('provider-security-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password-provider').value;
    const newPassword = document.getElementById('new-password-provider').value;
    const confirmPassword = document.getElementById('confirm-password-provider').value;
    
    if (currentPassword !== currentUser.password) {
        showAlert('Senha atual incorreta.', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('A nova senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('As senhas não coincidem.', 'error');
        return;
    }
    
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUsersStorage();
    document.getElementById('provider-security-form').reset();
    showAlert('Senha alterada com sucesso!', 'success');
});

document.getElementById('provider-availability-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedCities = Array.from(document.querySelectorAll('input[name="cities"]:checked'))
        .map(checkbox => checkbox.value);
    
    currentUser.availability = {
        morning: document.getElementById('morning-availability').checked,
        afternoon: document.getElementById('afternoon-availability').checked,
        cities: selectedCities
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUsersStorage();
    showAlert('Disponibilidade atualizada com sucesso!', 'success');
});

// Sistema de Filtros e Busca
function setupFilters() {
    const searchInput = document.getElementById('service-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterServices);
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterServices();
        });
    });
}

function filterServices() {
    const searchTerm = document.getElementById('service-search').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const serviceName = card.querySelector('.service-title').textContent.toLowerCase();
        const serviceCategory = card.querySelector('.service-feature:last-child span').textContent;
        const categoryMatch = activeFilter === 'all' || serviceCategory === activeFilter;
        const searchMatch = serviceName.includes(searchTerm);
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Carregar Serviços
function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    const serviceSelect = document.getElementById('service-select');
    
    if (servicesGrid) servicesGrid.innerHTML = '';
    if (serviceSelect) serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    
    const storedServices = JSON.parse(localStorage.getItem('services'));
    
    storedServices.forEach(service => {
        if (servicesGrid) {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <div class="service-header">
                    <div class="service-icon">${service.icon}</div>
                    <h3 class="service-title">${service.name}</h3>
                </div>
                <p class="service-description">${service.description}</p>
                <div class="service-price">R$ ${service.price.toFixed(2)}</div>
                <div class="service-features">
                    <div class="service-feature">
                        <span>⏱️ ${service.duration}</span>
                    </div>
                    <div class="service-feature">
                        <span>📦 ${service.category}</span>
                    </div>
                </div>
                <button class="btn btn-primary select-service" data-id="${service.id}">
                    Selecionar Serviço
                </button>
            `;
            servicesGrid.appendChild(serviceCard);
        }
        
        if (serviceSelect) {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = `${service.name} - R$ ${service.price.toFixed(2)}`;
            serviceSelect.appendChild(option);
        }
    });
    
    document.querySelectorAll('.select-service').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-id');
            document.getElementById('service-select').value = serviceId;
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="schedule"]').classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('schedule').classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Formulário de Agendamento
document.getElementById('schedule-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const serviceId = parseInt(document.getElementById('service-select').value);
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    const address = document.getElementById('client-address').value;
    const requests = document.getElementById('special-requests').value;
    
    if (!serviceId || !date || !time || !address) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    const services = JSON.parse(localStorage.getItem('services'));
    const selectedService = services.find(s => s.id === serviceId);
    
    // Encontrar prestador disponível para este serviço
    const providers = JSON.parse(localStorage.getItem('providers'));
    const availableProviders = providers.filter(p => p.service === selectedService.name);
    
    if (availableProviders.length === 0) {
        showAlert('Não há prestadores disponíveis para este serviço no momento.', 'error');
        return;
    }
    
    // Selecionar prestador aleatório (em uma aplicação real, seria mais sofisticado)
    const selectedProvider = availableProviders[Math.floor(Math.random() * availableProviders.length)];
    
    const newAppointment = {
        id: Date.now(),
        serviceId,
        serviceName: selectedService.name,
        serviceIcon: selectedService.icon,
        servicePrice: selectedService.price,
        date,
        time,
        clientName: currentUser.name,
        clientAddress: address,
        specialRequests: requests,
        status: 'pending',
        userId: currentUser.id,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        createdAt: new Date().toISOString()
    };
    
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    this.reset();
    showAlert('Serviço agendado com sucesso!', 'success');
    loadAppointments();
    updateStats();
    
    // Navegar para histórico
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="history"]').classList.add('active');
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('history').classList.add('active');
});

// Carregar Agendamentos Cliente
function loadAppointments() {
    const historyTable = document.getElementById('history-table')?.querySelector('tbody');
    
    if (!historyTable) return;
    
    historyTable.innerHTML = '';
    
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const userAppointments = appointments.filter(a => a.userId === currentUser.id);
    
    if (userAppointments.length === 0) {
        historyTable.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum serviço agendado ainda.</td></tr>';
        return;
    }
    
    userAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    userAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        const ratings = JSON.parse(localStorage.getItem('ratings'));
        const hasRated = ratings.some(r => r.appointmentId === appointment.id);
        const rating = ratings.find(r => r.appointmentId === appointment.id);
        
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">${appointment.serviceIcon}</span>
                    ${appointment.serviceName}
                </div>
            </td>
            <td>
                <strong>${formatDate(appointment.date)}</strong><br>
                <small>${appointment.time}</small>
            </td>
            <td><span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span></td>
            <td>
                ${hasRated ? 
                    `<div class="rating-stars">${generateStars(rating.rating)}</div>` :
                    appointment.status === 'completed' ?
                    '<span style="color: var(--gray);">Não avaliado</span>' :
                    '<span style="color: var(--gray);">-</span>'
                }
            </td>
            <td>
                ${appointment.status === 'completed' && !hasRated ? 
                    `<button class="btn btn-secondary rate-service" data-id="${appointment.id}">
                        Avaliar
                    </button>` : ''}
                ${appointment.status === 'pending' ? 
                    `<button class="btn btn-outline cancel-appointment" data-id="${appointment.id}">
                        Cancelar
                    </button>` : ''}
            </td>
        `;
        
        historyTable.appendChild(row);
    });
    
    document.querySelectorAll('.rate-service').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = parseInt(this.getAttribute('data-id'));
            openRatingModal(appointmentId);
        });
    });
    
    document.querySelectorAll('.cancel-appointment').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = parseInt(this.getAttribute('data-id'));
            cancelAppointment(appointmentId);
        });
    });
}

// Carregar Agenda do Prestador
function loadProviderSchedule() {
    const scheduleTable = document.getElementById('provider-schedule-table')?.querySelector('tbody');
    
    if (!scheduleTable) return;
    
    scheduleTable.innerHTML = '';
    
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const providerAppointments = appointments.filter(a => a.providerId === currentUser.id);
    
    if (providerAppointments.length === 0) {
        scheduleTable.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum agendamento encontrado.</td></tr>';
        return;
    }
    
    providerAppointments.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    
    providerAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${appointment.clientName}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${appointment.serviceIcon}</span>
                    ${appointment.serviceName}
                </div>
            </td>
            <td>
                <strong>${formatDate(appointment.date)}</strong><br>
                <small>${appointment.time}</small>
            </td>
            <td>${appointment.clientAddress}</td>
            <td><span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span></td>
            <td>
                ${appointment.status === 'pending' ? 
                    `<button class="btn btn-primary confirm-appointment" data-id="${appointment.id}">
                        Confirmar
                    </button>
                    <button class="btn btn-outline cancel-appointment-provider" data-id="${appointment.id}">
                        Recusar
                    </button>` : 
                    appointment.status === 'confirmed' ? 
                    `<button class="btn btn-primary complete-appointment" data-id="${appointment.id}">
                        Concluir
                    </button>` : 
                    '-'
                }
            </td>
        `;
        
        scheduleTable.appendChild(row);
    });
    
    // Event listeners para ações do prestador
    document.querySelectorAll('.confirm-appointment').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = parseInt(this.getAttribute('data-id'));
            updateAppointmentStatus(appointmentId, 'confirmed');
        });
    });
    
    document.querySelectorAll('.cancel-appointment-provider').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = parseInt(this.getAttribute('data-id'));
            updateAppointmentStatus(appointmentId, 'cancelled');
        });
    });
    
    document.querySelectorAll('.complete-appointment').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = parseInt(this.getAttribute('data-id'));
            updateAppointmentStatus(appointmentId, 'completed');
        });
    });
}

// Carregar Serviços do Prestador
function loadProviderServices() {
    const servicesGrid = document.getElementById('provider-services-grid');
    
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    
    const services = JSON.parse(localStorage.getItem('services'));
    const providerServices = services.filter(service => service.name === currentUser.service);
    
    providerServices.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <div class="service-header">
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-title">${service.name}</h3>
            </div>
            <p class="service-description">${service.description}</p>
            <div class="service-price">R$ ${service.price.toFixed(2)}</div>
            <div class="service-features">
                <div class="service-feature">
                    <span>⏱️ ${service.duration}</span>
                </div>
                <div class="service-feature">
                    <span>📦 ${service.category}</span>
                </div>
            </div>
            <div class="service-stats">
                <div class="stat">
                    <strong>${currentUser.totalServices || 0}</strong>
                    <span>Serviços Realizados</span>
                </div>
                <div class="stat">
                    <strong>${currentUser.rating || 0}</strong>
                    <span>Avaliação Média</span>
                </div>
            </div>
        `;
        servicesGrid.appendChild(serviceCard);
    });
}

// Carregar Dashboard do Prestador
function loadProviderDashboard() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const providerAppointments = appointments.filter(a => a.providerId === currentUser.id);
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    
    // Estatísticas
    const totalServices = providerAppointments.length;
    const pendingServices = providerAppointments.filter(a => a.status === 'pending').length;
    const completedServices = providerAppointments.filter(a => a.status === 'completed').length;
    
    // Calcular avaliação média
    let averageRating = 0;
    const providerRatings = ratings.filter(r => 
        providerAppointments.some(a => a.id === r.appointmentId)
    );
    
    if (providerRatings.length > 0) {
        averageRating = providerRatings.reduce((acc, rating) => acc + rating.rating, 0) / providerRatings.length;
    }
    
    // Calcular ganhos
    const earnings = providerAppointments
        .filter(a => a.status === 'completed')
        .reduce((acc, appointment) => acc + appointment.servicePrice, 0);
    
    // Atualizar UI
    document.getElementById('provider-total-services').textContent = totalServices;
    document.getElementById('provider-pending-services').textContent = pendingServices;
    document.getElementById('provider-rating').textContent = averageRating.toFixed(1);
    document.getElementById('provider-earnings').textContent = `R$ ${earnings.toFixed(2)}`;
    
    // Próximos agendamentos
    const upcomingContainer = document.getElementById('provider-upcoming-appointments');
    if (upcomingContainer) {
        upcomingContainer.innerHTML = '';
        
        const upcomingAppointments = providerAppointments
            .filter(a => a.status === 'pending' || a.status === 'confirmed')
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
            .slice(0, 5);
        
        if (upcomingAppointments.length === 0) {
            upcomingContainer.innerHTML = '<p class="text-center">Nenhum agendamento próximo.</p>';
            return;
        }
        
        upcomingAppointments.forEach(appointment => {
            const appointmentItem = document.createElement('div');
            appointmentItem.className = 'appointment-item';
            appointmentItem.innerHTML = `
                <div class="appointment-header">
                    <div class="appointment-service">${appointment.serviceName}</div>
                    <div class="appointment-date">${formatDate(appointment.date)} às ${appointment.time}</div>
                </div>
                <div class="appointment-client">Cliente: ${appointment.clientName}</div>
                <div class="appointment-address">${appointment.clientAddress}</div>
                <div class="appointment-status">
                    <span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span>
                </div>
            `;
            upcomingContainer.appendChild(appointmentItem);
        });
    }
}

// Carregar Avaliações do Prestador
function loadProviderRatings() {
    const ratingsContainer = document.getElementById('provider-ratings-container');
    
    if (!ratingsContainer) return;
    
    ratingsContainer.innerHTML = '';
    
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const providerAppointments = appointments.filter(a => a.providerId === currentUser.id);
    const providerRatings = ratings.filter(r => providerAppointments.some(a => a.id === r.appointmentId));
    
    if (providerRatings.length === 0) {
        ratingsContainer.innerHTML = '<div class="text-center" style="padding: 3rem; color: var(--gray);">Nenhuma avaliação recebida ainda.</div>';
        return;
    }
    
    providerRatings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    providerRatings.forEach(rating => {
        const appointment = providerAppointments.find(a => a.id === rating.appointmentId);
        
        if (appointment) {
            const ratingCard = document.createElement('div');
            ratingCard.className = 'service-card';
            ratingCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">${appointment.clientName}</h4>
                        <p style="color: var(--gray); margin: 0; display: flex; align-items: center; gap: 8px;">
                            ${appointment.serviceIcon} ${appointment.serviceName}
                        </p>
                        <p style="color: var(--gray); margin: 0.25rem 0 0 0;">${formatDate(appointment.date)}</p>
                    </div>
                    <div class="rating-stars">
                        ${generateStars(rating.rating)}
                    </div>
                </div>
                ${rating.comment ? `
                    <div style="background: var(--lighter-gray); padding: 1rem; border-radius: 8px;">
                        <p style="margin: 0; font-style: italic;">"${rating.comment}"</p>
                    </div>
                ` : ''}
            `;
            ratingsContainer.appendChild(ratingCard);
        }
    });
}

// Sistema de Avaliações Cliente
function loadRatings() {
    const ratingsContainer = document.getElementById('ratings-container');
    
    if (!ratingsContainer) return;
    
    ratingsContainer.innerHTML = '';
    
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const userAppointments = appointments.filter(a => a.userId === currentUser.id);
    const userRatings = ratings.filter(r => userAppointments.some(a => a.id === r.appointmentId));
    
    if (userRatings.length === 0) {
        ratingsContainer.innerHTML = '<div class="text-center" style="padding: 3rem; color: var(--gray);">Nenhuma avaliação ainda.</div>';
        return;
    }
    
    userRatings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    userRatings.forEach(rating => {
        const appointment = userAppointments.find(a => a.id === rating.appointmentId);
        
        if (appointment) {
            const ratingCard = document.createElement('div');
            ratingCard.className = 'service-card';
            ratingCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem;">
                            ${appointment.serviceIcon} ${appointment.serviceName}
                        </h4>
                        <p style="color: var(--gray); margin: 0;">${formatDate(appointment.date)}</p>
                    </div>
                    <div class="rating-stars">
                        ${generateStars(rating.rating)}
                    </div>
                </div>
                ${rating.comment ? `
                    <div style="background: var(--lighter-gray); padding: 1rem; border-radius: 8px;">
                        <p style="margin: 0; font-style: italic;">"${rating.comment}"</p>
                    </div>
                ` : ''}
            `;
            ratingsContainer.appendChild(ratingCard);
        }
    });
}

// Modal de Avaliação
function openRatingModal(appointmentId) {
    const modal = document.getElementById('rating-modal');
    const stars = document.querySelectorAll('#rating-modal .star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.classList.remove('filled');
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
        });
    });
    
    document.getElementById('rating-service-id').value = appointmentId;
    
    modal.style.display = 'flex';
    
    document.querySelector('.modal-close').onclick = function() {
        modal.style.display = 'none';
    };
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

document.getElementById('rating-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const appointmentId = parseInt(document.getElementById('rating-service-id').value);
    const rating = document.querySelectorAll('#rating-modal .star.filled').length;
    const comment = document.getElementById('rating-comment').value;
    
    if (rating === 0) {
        showAlert('Por favor, selecione uma avaliação.', 'error');
        return;
    }
    
    const newRating = {
        appointmentId,
        rating,
        comment,
        date: new Date().toISOString()
    };
    
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    ratings.push(newRating);
    localStorage.setItem('ratings', JSON.stringify(ratings));
    
    document.getElementById('rating-modal').style.display = 'none';
    this.reset();
    showAlert('Avaliação enviada com sucesso!', 'success');
    
    loadAppointments();
    loadRatings();
    updateStats();
    updateProfileStats();
});

// Atualizar Status do Agendamento (Prestador)
function updateAppointmentStatus(appointmentId, status) {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = status;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Atualizar estatísticas do prestador se o serviço foi concluído
        if (status === 'completed') {
            updateProviderStats(appointments[appointmentIndex]);
        }
        
        showAlert(`Agendamento ${getStatusText(status).toLowerCase()} com sucesso!`, 'success');
        loadProviderSchedule();
        loadProviderDashboard();
    }
}

function updateProviderStats(appointment) {
    const providers = JSON.parse(localStorage.getItem('providers'));
    const providerIndex = providers.findIndex(p => p.id === currentUser.id);
    
    if (providerIndex !== -1) {
        providers[providerIndex].totalServices = (providers[providerIndex].totalServices || 0) + 1;
        providers[providerIndex].earnings = (providers[providerIndex].earnings || 0) + appointment.servicePrice;
        
        localStorage.setItem('providers', JSON.stringify(providers));
        currentUser = providers[providerIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Cancelar Agendamento (Cliente)
function cancelAppointment(appointmentId) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments'));
        const updatedAppointments = appointments.map(a => {
            if (a.id === appointmentId) {
                return {...a, status: 'cancelled'};
            }
            return a;
        });
        
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        showAlert('Agendamento cancelado.', 'success');
        loadAppointments();
        updateStats();
        updateProfileStats();
    }
}

// Atualizar Estatísticas Cliente
function updateStats() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    
    const userAppointments = appointments.filter(a => a.userId === currentUser.id);
    const userRatings = ratings.filter(r => userAppointments.some(a => a.id === r.appointmentId));
    
    const completedServices = userAppointments.filter(a => a.status === 'completed').length;
    const totalRatings = userRatings.length;
    
    let averageRating = 0;
    if (totalRatings > 0) {
        averageRating = userRatings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings;
    }
    
    document.getElementById('average-rating').textContent = averageRating.toFixed(1);
    document.getElementById('total-ratings').textContent = totalRatings;
    document.getElementById('completed-services').textContent = completedServices;
}

// Atualizar Estatísticas do Perfil Cliente
function updateProfileStats() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const userAppointments = appointments.filter(a => a.userId === currentUser.id);
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    const userRatings = ratings.filter(r => userAppointments.some(a => a.id === r.appointmentId));
    
    document.getElementById('profile-services-client').textContent = userAppointments.length;
    
    let avgRating = 0;
    if (userRatings.length > 0) {
        avgRating = userRatings.reduce((acc, rating) => acc + rating.rating, 0) / userRatings.length;
    }
    document.getElementById('profile-rating-client').textContent = avgRating.toFixed(1);
}

// Atualizar Estatísticas do Perfil Prestador
function updateProviderProfileStats() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const providerAppointments = appointments.filter(a => a.providerId === currentUser.id);
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    const providerRatings = ratings.filter(r => providerAppointments.some(a => a.id === r.appointmentId));
    
    document.getElementById('profile-total-services').textContent = providerAppointments.length;
    
    let avgRating = 0;
    if (providerRatings.length > 0) {
        avgRating = providerRatings.reduce((acc, rating) => acc + rating.rating, 0) / providerRatings.length;
    }
    document.getElementById('profile-avg-rating').textContent = avgRating.toFixed(1);
}

// Funções Auxiliares
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Pendente';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Concluído';
        case 'cancelled': return 'Cancelado';
        default: return status;
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<span class="star filled">★</span>' : '<span class="star">★</span>';
    }
    return stars;
}

function showAlert(message, type) {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '10000';
    alert.style.maxWidth = '400px';
    alert.style.boxShadow = 'var(--shadow-lg)';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    
    // Definir data mínima para agendamento (amanhã)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduleDate = document.getElementById('schedule-date');
    if (scheduleDate) {
        scheduleDate.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Adicionar validação em tempo real para email
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = '';
            }
        });
    });
});