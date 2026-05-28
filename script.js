// ==========================================================================
// 1. GESTÃO DE DADOS (Renderização Dinâmica)
// ==========================================================================

// Dados para a Galeria/Carrossel
const caezinhosGaleria = [
    { src: 'https://placedog.net/600/400?id=1', alt: 'Filhote de Golden Retriever deitado na grama sorrindo' },
    { src: 'https://placedog.net/600/400?id=2', alt: 'Cachorrinho Pug olhando curioso para a câmera' },
    { src: 'https://placedog.net/600/400?id=3', alt: 'Corgi feliz correndo em um parque ensolarado' }
];

// Dados para o Acordeão de Cuidados
const cuidadosDados = [
    { id: '1', titulo: 'Alimentação Balanceada', conteudo: 'Ofereça ração de alta qualidade adequada à idade e ao porte do seu cãozinho. Evite doces e alimentos proibidos como chocolate.' },
    { id: '2', titulo: 'Rotina de Exercícios', conteudo: 'Cachorros fofos também acumulam energia! Passeios diários e brincadeiras interativas mantêm a saúde mental e física em dia.' },
    { id: '3', titulo: 'Consultas ao Veterinário', conteudo: 'Mantenha a carteira de vacinação atualizada e faça visitas regulares ao veterinário para garantir uma vida longa e saudável.' }
];

// Inicializador da renderização dinâmica
function renderizarConteudo() {
    // Renderizar Carrossel
    const carouselContainer = document.getElementById('carousel-container');
    caezinhosGaleria.forEach((dog, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.setAttribute('role', 'group');
        item.setAttribute('aria-roledescription', 'slide');
        item.setAttribute('aria-label', `Slide ${index + 1} de ${caezinhosGaleria.length}`);
        
        item.innerHTML = `<img src="${dog.src}" alt="${dog.alt}">`;
        carouselContainer.appendChild(item);
    });

    // Renderizar Acordeão
    const accordionContainer = document.getElementById('accordion-container');
    cuidadosDados.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('accordion-item');

        wrapper.innerHTML = `
            <button class="accordion-trigger" aria-expanded="false" aria-controls="panel-${item.id}">
                ${item.titulo}
                <span class="icon" aria-hidden="true">+</span>
            </button>
            <div id="panel-${item.id}" class="accordion-panel" role="region" aria-labelledby="button-${item.id}">
                <p>${item.conteudo}</p>
            </div>
        `;
        accordionContainer.appendChild(wrapper);
    });
}

// ==========================================================================
// 2. ACESSIBILIDADE (Contraste e Fonte)
// ==========================================================================

// Alto Contraste
const btnContrast = document.getElementById('btn-contrast');
btnContrast.addEventListener('click', () => {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    btnContrast.setAttribute('aria-pressed', isHighContrast);
});

// Controle de Fonte Global
let currentFontSize = 100; // Porcentagem base
const btnFontIncrease = document.getElementById('btn-font-increase');
const btnFontDecrease = document.getElementById('btn-font-decrease');

btnFontIncrease.addEventListener('click', () => {
    if (currentFontSize < 140) {
        currentFontSize += 10;
        document.documentElement.style.fontSize = `${currentFontSize}%`;
    }
});

btnFontDecrease.addEventListener('click', () => {
    if (currentFontSize > 80) {
        currentFontSize -= 10;
        document.documentElement.style.fontSize = `${currentFontSize}%`;
    }
});

// ==========================================================================
// 3. COMPONENTES INTERATIVOS (Carrossel e Acordeão)
// ==========================================================================

// Lógica do Carrossel
let currentSlide = 0;

function setupCarousel() {
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const container = document.getElementById('carousel-container');
    const slides = document.querySelectorAll('.carousel-item');

    function updateCarousel() {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    });
}

// Lógica do Acordeão Acessível
function setupAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            const panel = trigger.nextElementSibling;
            const icon = trigger.querySelector('.icon');

            // Fecha todos os painéis abertos (Opcional - comportamento clássico de acordeão)
            document.querySelectorAll('.accordion-trigger').forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                t.nextElementSibling.style.maxHeight = null;
                t.querySelector('.icon').textContent = '+';
            });

            if (!expanded) {
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + "px";
                icon.textContent = '−';
            }
        });
    });
}

// ==========================================================================
// 4. ANIMAÇÕES (Scroll Reveal)
// ==========================================================================
function setupScrollReveal() {
    const sections = document.querySelectorAll('.reveal-section');

    const observerOptions = {
        root: null,
        threshold: 0.15 // Dispara quando 15% da seção está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Roda a animação apenas uma vez
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ==========================================================================
// INICIALIZAÇÃO GERAL
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarConteudo();
    setupCarousel();
    setupAccordion();
    setupScrollReveal();
});
