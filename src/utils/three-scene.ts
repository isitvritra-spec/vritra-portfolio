import * as THREE from 'three';

export class ParticleSystem {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private particles: THREE.Points;
    private mouse = { x: 0, y: 0 };
    private targetMouse = { x: 0, y: 0 };
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles
        this.particles = this.createParticles();
        this.scene.add(this.particles);

        // Add lighting
        this.addLighting();

        // Event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();
    }

    private createParticles(): THREE.Points {
        const particleCount = 80; // Reduced from 150 for cleaner look
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random positions
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 5;

            // Colors (white to light blue)
            const intensity = Math.random() * 0.5 + 0.5;
            colors[i3] = intensity;
            colors[i3 + 1] = intensity;
            colors[i3 + 2] = 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
        });

        return new THREE.Points(geometry, material);
    }

    private addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00aaff, 1, 10);
        pointLight.position.set(2, 2, 2);
        this.scene.add(pointLight);
    }

    private setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        });

        // Scroll effect
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            this.particles.rotation.y = scrollY * 0.0005;
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Rotate particles based on mouse
        this.particles.rotation.x = this.mouse.y * 0.2;
        this.particles.rotation.y += 0.001;

        // Animate individual particles
        const positions = this.particles.geometry.attributes.position.array as Float32Array;
        const time = Date.now() * 0.001;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    };

    public destroy() {
        this.renderer.dispose();
        this.particles.geometry.dispose();
        (this.particles.material as THREE.Material).dispose();
    }
}

export class ProfileImage3D {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh | null = null;
    private mouse = { x: 0, y: 0 };
    private targetMouse = { x: 0, y: 0 };
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, imageSrc: string) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100
        );
        this.camera.position.z = 3;

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.loadImage(imageSrc);
        this.addLighting();
        this.setupEventListeners();
        this.animate();
    }

    private loadImage(imageSrc: string) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageSrc, (texture) => {
            const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
            });

            this.mesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.mesh);
        });
    }

    private addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 10);
        pointLight.position.set(2, 2, 3);
        this.scene.add(pointLight);

        const rimLight = new THREE.PointLight(0x00aaff, 0.5, 10);
        rimLight.position.set(-2, 0, -2);
        this.scene.add(rimLight);
    }

    private setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.targetMouse.x = 0;
            this.targetMouse.y = 0;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        // Smooth interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        if (this.mesh) {
            this.mesh.rotation.y = this.mouse.x * 0.3;
            this.mesh.rotation.x = this.mouse.y * 0.3;
        }

        this.renderer.render(this.scene, this.camera);
    };

    public destroy() {
        this.renderer.dispose();
        if (this.mesh) {
            this.mesh.geometry.dispose();
            (this.mesh.material as THREE.Material).dispose();
        }
    }
}

export default { ParticleSystem, ProfileImage3D };
