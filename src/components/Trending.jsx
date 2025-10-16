import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef, useState } from "react";
import ToolModal from "./ToolModal";

const TOOLS = [
  {
    image: "/icons/chatgpt.png",
    name: "ChatGPT",
    description: "Conversational AI for writing, coding, and more.",
    link: "https://chat.openai.com/",
  },
  {
    image: "/icons/midjourney.png",
    name: "Midjourney",
    description: "AI art generator that brings your imagination to life.",
    link: "https://www.midjourney.com/",
  },
  {
    image: "/icons/cursor.png",
    name: "Cursor",
    description: "Smart AI-powered code editor that understands you.",
    link: "https://cursor.sh/",
  },
  {
    image: "/icons/perplexity.png",
    name: "Perplexity",
    description: "Ask anything, get AI answers with citations.",
    link: "https://www.perplexity.ai/",
  },
  {
    image: "/icons/claude.png",
    name: "Claude AI",
    description: "A reliable AI assistant built by Anthropic.",
    link: "https://claude.ai/",
  },
];

// ===== Smooth interpolation =====
function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

// ===== Media Card (curved + glass style) =====
class Media {
  constructor({ gl, geometry, data, index, total, scene, viewport }) {
    this.gl = gl;
    this.geometry = geometry;
    this.data = data;
    this.index = index;
    this.total = total;
    this.scene = scene;
    this.viewport = viewport;

    this.createTexture();
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createTexture() {
    this.texture = new Texture(this.gl);
    const img = new Image();
    img.src = this.data.image;
    img.onload = () => (this.texture.image = img);
  }

  createShader() {
    this.program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uCurve;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          // Gentle arc (horizontal curve)
          pos.z += sin(pos.x * 3.1415) * uCurve * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(tMap, vUv);
          // Glass effect
          vec4 glass = vec4(0.0, 1.0, 1.0, 0.15);
          vec4 border = vec4(0.0, 1.0, 1.0, 0.8);
          float dist = length(vUv - 0.5);
          float edge = smoothstep(0.45, 0.48, dist);
          vec4 color = mix(glass, border, edge);
          gl_FragColor = color;
        }
      `,
      uniforms: {
        tMap: { value: this.texture },
        uCurve: { value: 1.5 },
      },
      transparent: true,
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.scene.addChild(this.mesh);
  }

  onResize({ viewport } = {}) {
    this.viewport = viewport;
    this.mesh.scale.set(4.5, 6, 1);
    const spacing = 6;
    this.mesh.position.x = (this.index - this.total / 2) * spacing;
    this.mesh.position.y = 0;
  }

  update(scroll) {
    const offset = this.mesh.position.x - scroll.current * 0.02;
    this.mesh.position.x = (this.index - this.total / 2) * 6 - scroll.current * 0.05;
    this.mesh.rotation.y = offset * 0.05;
  }
}

// ===== Main App (scene + scroll) =====
class App {
  constructor(container, { items, onClick }) {
    this.container = container;
    this.items = items;
    this.onClick = onClick;
    this.scroll = { current: 0, target: 0, ease: 0.07 };

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createGeometry();
    this.createMedias();
    this.onResize();
    this.addEventListeners();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, { widthSegments: 20, heightSegments: 20 });
  }

  createMedias() {
    this.medias = this.items.map(
      (data, i) =>
        new Media({
          gl: this.gl,
          geometry: this.geometry,
          data,
          index: i,
          total: this.items.length,
          scene: this.scene,
          viewport: this.viewport,
        })
    );
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) this.medias.forEach((m) => m.onResize({ viewport: this.viewport }));
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    if (this.medias) this.medias.forEach((m) => m.update(this.scroll));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    requestAnimationFrame(() => this.update());
  }

  addEventListeners() {
    this.container.addEventListener("wheel", (e) => {
      this.scroll.target += e.deltaY * 0.3;
    });

    let isDragging = false;
    let startX = 0;
    this.container.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      startX = e.clientX;
      this.scroll.target -= delta * 0.3;
    });
    window.addEventListener("mouseup", () => (isDragging = false));

    this.container.addEventListener("click", () => {
      const index = Math.abs(Math.round(this.scroll.current / 300)) % this.items.length;
      this.onClick(this.items[index]);
    });

    window.addEventListener("resize", this.onResize.bind(this));
  }

  destroy() {
    this.renderer.gl.canvas.remove();
  }
}

// ===== React Wrapper =====
export default function Trending() {
  const containerRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    const app = new App(containerRef.current, {
      items: TOOLS,
      onClick: (tool) => setSelectedTool(tool),
    });
    return () => app.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "650px",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
        borderRadius: "20px",
      }}
    >
      {selectedTool && <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
    </div>
  );
}
