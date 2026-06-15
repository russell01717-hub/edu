// Multi-language dictionary
const dict = {
    en: {
        heroTitle: "The Cosmic Frontier",
        heroDesc: "Experience the greatest journey into the unknown. Explore distant galaxies and uncover the truth.",
        watchTrailer: "Watch Trailer",
        allGenres: "All Genres",
        action: "Action",
        scifi: "Sci-Fi",
        drama: "Drama",
        horror: "Horror",
        comedy: "Comedy",
        thriller: "Thriller",
        documentary: "Documentary",
        searchPlaceholder: "Search movies, genres...",
        viewAll: "View All",
        toastAdded: "Added to Watchlist",
        toastRemoved: "Removed from Watchlist",
        modalDesc: "Dive deeper into this amazing piece of cinematic history. This video feature provides an exclusive look."
    },
    uz: {
        heroTitle: "Kosmik Chegara",
        heroDesc: "Noma'lumlikka qilingan eng buyuk sayohatni his eting. Uzoq galaktikalarni kashf qiling.",
        watchTrailer: "Treyilerni ko'rish",
        allGenres: "Barcha Janrlar",
        action: "Jangari",
        scifi: "Fantastika",
        drama: "Drama",
        horror: "Qo'rqinchli",
        comedy: "Komediya",
        thriller: "Triller",
        documentary: "Hujjatli",
        searchPlaceholder: "Kinolar, janrlarni qidirish...",
        viewAll: "Barchasini ko'rish",
        toastAdded: "Ro'yxatga qo'shildi",
        toastRemoved: "Ro'yxatdan o'chirildi",
        modalDesc: "Ushbu ajoyib kinematografiya tarixiga chuqurroq kirib boring. Ushbu video xususiyati eksklyuziv ko'rinishni taqdim etadi."
    },
    ru: {
        heroTitle: "Космический Рубеж",
        heroDesc: "Испытайте величайшее путешествие в неизвестность. Исследуйте далекие галактики.",
        watchTrailer: "Смотреть трейлер",
        allGenres: "Все жанры",
        action: "Боевик",
        scifi: "Фантастика",
        drama: "Драма",
        horror: "Ужасы",
        comedy: "Комедия",
        thriller: "Триллер",
        documentary: "Документальный",
        searchPlaceholder: "Поиск фильмов, жанров...",
        viewAll: "Показать все",
        toastAdded: "Добавлено в список",
        toastRemoved: "Удалено из списка",
        modalDesc: "Погрузитесь глубже в этот удивительный кусочек кинематографической истории. Эксклюзивный просмотр."
    }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Starfield Entrance Animation ---
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, stars = [];

        const initStars = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars = Array.from({ length: 400 }).map(() => ({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width
            }));
        };

        const animateStars = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;

            stars.forEach(star => {
                star.z -= 0.8; // Star speed
                if (star.z <= 0) {
                    star.x = Math.random() * width - cx;
                    star.y = Math.random() * height - cy;
                    star.z = width;
                }
                const scale = width / star.z;
                const px = cx + star.x * scale;
                const py = cy + star.y * scale;
                const r = Math.max(0.1, 1.2 * scale);

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            requestAnimationFrame(animateStars);
        };
        initStars();
        animateStars();
        window.addEventListener('resize', initStars);
    }

    // --- 1. Language Configuration System ---
    const langSelect = document.getElementById('langSelect');

    const applyTranslations = (lang) => {
        currentLang = lang;
        const text = dict[lang];
        document.getElementById('t-hero-title').textContent = text.heroTitle;
        document.getElementById('t-hero-desc').textContent = text.heroDesc;
        document.getElementById('t-watch-trailer').textContent = text.watchTrailer;
        document.getElementById('searchInput').placeholder = text.searchPlaceholder;

        document.getElementById('t-genre-all').textContent = text.allGenres;
        document.getElementById('t-genre-action').textContent = text.action;
        document.getElementById('t-genre-scifi').textContent = text.scifi;
        document.getElementById('t-genre-drama').textContent = text.drama;
        document.getElementById('t-genre-horror').textContent = text.horror;
        document.getElementById('t-genre-comedy').textContent = text.comedy;
        document.getElementById('t-genre-thriller').textContent = text.thriller;
        document.getElementById('t-genre-doc').textContent = text.documentary;

        renderContentSections();
    };

    langSelect.addEventListener('change', (e) => applyTranslations(e.target.value));

    // --- 2. Movie Data Dictionary ---
    const genresList = ["Action", "Sci-Fi", "Drama", "Horror", "Comedy", "Thriller", "Documentary"];

    const mockVids = [
        "https://www.w3schools.com/html/mov_bbb.mp4",
        "https://download.blender.org/peach/trailer/trailer_400p.ogg",
        "https://media.w3.org/2010/05/sintel/trailer.mp4"
    ];

    const mockPosters = [
        "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjCvM26CR.jpg",
        "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
        "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclRVc.jpg",
        "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
        "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
        "https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
        "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
        "https://image.tmdb.org/t/p/w500/vIUffpzqwfOclNdEcb1zEMh0gXb.jpg"
    ];

    let fullMovieDatabase = [];

    genresList.forEach((genre, gIndex) => {
        for (let i = 1; i <= 10; i++) {
            fullMovieDatabase.push({
                id: genre + i,
                title: `${genre} Epic ${i}`,
                genre: genre,
                year: 2026 - Math.floor(Math.random() * 5),
                rating: (7 + (Math.random() * 2.5)).toFixed(1),
                img: mockPosters[(i + gIndex) % mockPosters.length],
                vid: mockVids[i % mockVids.length] // Used only for modal clicks now
            });
        }
    });

    // --- 3. Rendering Logic ---
    const mainContainer = document.getElementById('mainContentContainer');
    let activeFilter = 'all';

    const renderCardsHtml = (movies) => {
        return movies.map(item => `
            <div class="card reveal-fade" data-id="${item.id}">
                <div class="card-media">
                    <img src="${item.img}" class="card-img" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-overlay">
                    <div class="card-badges">
                        <span class="rating"><i class="ph-fill ph-star"></i> ${item.rating}</span>
                        <button class="watchlist-btn"><i class="ph ph-heart"></i></button>
                    </div>
                    <div class="card-info">
                        <h3 class="card-title">${item.title}</h3>
                        <div class="card-meta">
                            <span>${item.year}</span>
                            <span style="color:var(--accent)"><i class="ph-fill ph-play-circle"></i> Trailer</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    };

    const setupInteractionsAndObservers = (containerNode) => {
        // Observers for fading rendering
        const revealElements = containerNode.querySelectorAll('.reveal-fade');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));

        // Hover Video Playbacks and Modal Triggers
        containerNode.querySelectorAll('.card').forEach(card => {
            const wlBtn = card.querySelector('.watchlist-btn');

            // Watchlist Toggle
            wlBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent modal opening
                const icon = wlBtn.querySelector('i');
                const isAdded = wlBtn.classList.toggle('active');
                if (isAdded) {
                    icon.classList.remove('ph-heart'); icon.classList.add('ph-fill', 'ph-heart');
                    showToast(dict[currentLang].toastAdded);
                } else {
                    icon.classList.add('ph-heart'); icon.classList.remove('ph-fill', 'ph-heart');
                    showToast(dict[currentLang].toastRemoved);
                }
                wlBtn.style.transform = 'scale(1.3)';
                setTimeout(() => wlBtn.style.transform = '', 150);
            });

            // Open Modal Video Player on Card Click
            card.addEventListener('click', () => {
                const movieId = card.dataset.id;
                const movie = fullMovieDatabase.find(m => m.id === movieId);
                openVideoModal(movie);
            });
        });

        // Horizontal Carousel Sliders
        containerNode.querySelectorAll('.movie-row-wrapper').forEach(wrapper => {
            const row = wrapper.querySelector('.movie-row');
            const prev = wrapper.querySelector('.slider-prev');
            const next = wrapper.querySelector('.slider-next');

            if (prev) prev.addEventListener('click', () => row.scrollBy({ left: -row.clientWidth * 0.8, behavior: 'smooth' }));
            if (next) next.addEventListener('click', () => row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' }));
        });
    };

    const renderContentSections = () => {
        mainContainer.innerHTML = '';
        const genresToRender = activeFilter === 'all' ? genresList : [activeFilter];

        genresToRender.forEach(genre => {
            const sectionMovies = fullMovieDatabase.filter(m => m.genre === genre);
            if (sectionMovies.length === 0) return;

            const translationKey = genre.replace('-', '').toLowerCase();
            const localizedHeader = dict[currentLang][translationKey] || genre;

            const section = document.createElement('section');
            section.className = 'collection';
            section.innerHTML = `
                <div class="section-header reveal-fade">
                    <h2>${localizedHeader} <i class="ph-bold ph-caret-right" style="color:var(--accent); font-size:1.2rem;"></i></h2>
                    <button class="view-all">${dict[currentLang].viewAll} <i class="ph ph-arrow-right"></i></button>
                </div>
                <div class="movie-row-wrapper">
                    <button class="slider-btn slider-prev"><i class="ph-bold ph-caret-left"></i></button>
                    <div class="movie-row">
                        ${renderCardsHtml(sectionMovies)}
                    </div>
                    <button class="slider-btn slider-next"><i class="ph-bold ph-caret-right"></i></button>
                </div>
            `;
            mainContainer.appendChild(section);
        });

        setupInteractionsAndObservers(mainContainer);
    };

    // --- 4. Video Modal System ---
    const videoModal = document.getElementById('videoModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeModalBtn = document.getElementById('closeModal');

    const openVideoModal = (movie) => {
        modalTitle.textContent = movie.title;
        modalDesc.innerHTML = `${dict[currentLang].modalDesc} <br><br><strong>Genre:</strong> ${movie.genre} | <strong>Rating:</strong> <span style="color:#FFD700"><i class="ph-fill ph-star"></i> ${movie.rating}</span>`;
        modalVideoPlayer.src = movie.vid;

        videoModal.classList.add('active');
        modalVideoPlayer.play().catch(() => { });
    };

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        setTimeout(() => {
            modalVideoPlayer.pause();
            modalVideoPlayer.src = "";
        }, 400); // Wait for transition
    };

    closeModalBtn.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideoModal();
    });

    // --- 5. Globals Setup ---
    const header = document.getElementById('mainHeader');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
                ticking = false;
            });
            ticking = true;
        }
    });

    // Toast
    const showToast = (message) => {
        const toastCtx = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span>${message}</span>`;
        toastCtx.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastFadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Genre Filtering Tabs
    document.querySelectorAll('.genre-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.genre-pill').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.dataset.filter === 'all' ? 'all' : e.target.dataset.filter;
            renderContentSections();
        });
    });

    // Boot Up
    setTimeout(() => { document.querySelectorAll('.hero .reveal-slide').forEach(e => e.classList.add('visible')); }, 100);
    applyTranslations('en');
});
