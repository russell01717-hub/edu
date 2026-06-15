// Three.js 3D Background Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create Particles
const geometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00ff88,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// Add Floating Shapes
const shapes = [];
const shapeGeom = new THREE.IcosahedronGeometry(1, 0);
const shapeMat = new THREE.MeshNormalMaterial({ wireframe: true });

for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(shapeGeom, shapeMat);
    mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    scene.add(mesh);
    shapes.push(mesh);
}

camera.position.z = 5;

// Animation Loop
const clock = new THREE.Clock(); // Add a clock for smooth animation

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    shapes.forEach((shape, i) => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
        // Add some subtle floating movement
        shape.position.y += Math.sin(elapsedTime + i) * 0.002;
    });

    // Gentle mouse interaction logic could go here

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Form Logic
const form = document.getElementById('regForm');
const modal = document.getElementById('modal');
const modalMsg = document.getElementById('modal-msg');
const courseSelect = document.getElementById('course');
const priceDisplay = document.getElementById('price-display');

// Update Price on Selection
if (courseSelect) {
    courseSelect.addEventListener('change', () => {
        const val = courseSelect.value;
        if (val === 'arab') {
            priceDisplay.innerHTML = "Narxi: <span style='color:var(--primary)'>300,000 so'm/oy</span>";
        } else if (val === 'cefr' || val === 'ielts' || val === 'russian') {
            priceDisplay.innerHTML = "Narxi: <span style='color:var(--secondary)'>Telefonda gaplashiladi</span>";
        } else {
            priceDisplay.innerHTML = "Kurs narxi tanlanganda chiqadi";
        }
    });
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const course = courseSelect.options[courseSelect.selectedIndex].text;

        // Message Simulation
        modalMsg.innerHTML = `
            Hurmatli <b>${name}</b>, so'rovingiz qabul qilindi.<br><br>
            Tanlangan kurs: <b>${course}</b><br>
            Sizning raqamingiz: <b>${phone}</b><br><br>
            Ushbu ma'lumotlar quyidagi adminlarga yuborildi:<br>
            📞 <b>+998 90 478 74 48</b><br>
            📞 <b>+998 90 515 15 40</b><br><br>
            Tez orada siz bilan bog'lanamiz!
        `;
        modal.classList.add('active');

        form.reset();
        priceDisplay.innerHTML = "Kurs narxi tanlanganda chiqadi";
    });
}

function closeModal() {
    modal.classList.remove('active');
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.from('header h1', { duration: 1.5, y: -100, opacity: 0, ease: 'bounce' });
gsap.from('header p', { duration: 1.5, y: 50, opacity: 0, delay: 0.5, ease: 'power2.out' });
gsap.from('header .btn', { duration: 1.5, scale: 0, opacity: 0, delay: 1, ease: 'elastic.out(1, 0.3)' });

gsap.utils.toArray('section').forEach(section => {
    gsap.from(section.children, {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3
    });
});
