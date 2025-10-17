import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";

/* Utility functions */
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

/* Create text texture */
function createTextTexture(gl, text, font = "bold 30px Figtree", color = "white") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.3);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

/* Title below image */
class Title {
  constructor({ gl, plane, text, textColor = "#ffffff", font = "30px Figtree" }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.6;
    this.mesh.setParent(this.plane);
  }
}

/* Image plane */
class Media {
  constructor({ geometry, gl, image, index, length, scene, screen, text, viewport, bend, textColor, borderRadius = 0.05, font }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;

    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    const program = new Program(this.gl, {
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform vec2 uPlaneSizes;
        uniform vec2 uImageSizes;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if (d > 0.0) discard;
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    this.program = program;
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;

    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  update(scroll) {
    const total = this.widthTotal;
    const wrappedX = ((this.x - scroll.current) % total + total) % total - total / 2;
    this.plane.position.x = wrappedX;

    const H = this.viewport.width / 2;
    const R = (H * H + this.bend * this.bend) / (2 * this.bend);
    const effectiveX = Math.min(Math.abs(wrappedX), H);
    const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
    this.plane.position.y = -arc;
  }
}

/* Renderer App */
class App {
  constructor(container, { items, bend, textColor, borderRadius, font, scrollEase = 0.05 }) {
    this.container = container;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.autoVelocity = 0.04;
    this.userInteracting = false;
    this.autoScrollEnabled = false;
    this.idleTimer = null;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  setAutoScroll(enabled) {
    this.autoScrollEnabled = enabled;
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
  }

  createMedias(items, bend, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600`, text: "Bridge" },
      { image: `https://picsum.photos/seed/2/800/600`, text: "Desk Setup" },
      { image: `https://picsum.photos/seed/3/800/600`, text: "Waterfall" },
      { image: `https://picsum.photos/seed/4/800/600`, text: "Strawberries" },
      { image: `https://picsum.photos/seed/5/800/600`, text: "City Lights" },
      { image: `https://picsum.photos/seed/6/800/600`, text: "Mountains" },
    ];

    const galleryItems = items?.length ? items : defaultItems;
    this.medias = galleryItems.concat(galleryItems).map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: galleryItems.length * 2,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  setUserActive() {
    this.userInteracting = true;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.userInteracting = false;
    }, 3000);
  }

  /* Manual scroll (wheel left-right only) */
  onWheel(e) {
    // Ignore normal vertical scroll (so page scroll works)
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

    this.scroll.target += e.deltaY * 0.002 + e.deltaX * 0.002;
    this.setUserActive();
  }

  /* Drag scroll */
  onDrag(dx) {
    this.scroll.target -= dx * 0.03;
    this.setUserActive();
  }

  update() {
    if (this.autoScrollEnabled && !this.userInteracting)
      this.scroll.target += this.autoVelocity;

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    if (this.medias) this.medias.forEach((m) => m.update(this.scroll));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    requestAnimationFrame(this.update.bind(this));
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias)
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this), { passive: true });

    // Mouse drag
    let isDown = false;
    let startX = 0;
    this.container.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.clientX;
      this.setUserActive();
    });
    this.container.addEventListener("mouseup", () => (isDown = false));
    this.container.addEventListener("mouseleave", () => (isDown = false));
    this.container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      this.onDrag(dx);
      startX = e.clientX;
    });

    // Touch drag
    let touchStartX = 0;
    this.container.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      this.setUserActive();
    });
    this.container.addEventListener("touchmove", (e) => {
      const dx = e.touches[0].clientX - touchStartX;
      this.onDrag(dx);
      touchStartX = e.touches[0].clientX;
    });
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("wheel", this.onWheel);
    if (this.renderer.gl.canvas.parentNode)
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
  }
}

/* React wrapper */
export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px Figtree",
  scrollEase = 2.7,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, scrollEase });

    // Auto-scroll starts only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          app.setAutoScroll(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollEase]);

  return <div className="circular-gallery" ref={containerRef} />;
}
