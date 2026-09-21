import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function getColor(element, variable, fallback) {
  const value = getComputedStyle(element)
    .getPropertyValue(variable)
    .trim();

  return value || fallback;
}

function createLiquidMaterial(color, opacity, phase) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uPhase: { value: phase }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uScroll;
      uniform float uPhase;

      varying vec2 vUv;

      void main() {
        vUv = uv;

        vec3 p = position;

        float movingWave =
          sin(p.x * 0.075 + uTime * 0.42 + uPhase) * 5.0;

        float secondaryWave =
          sin(p.x * 0.16 - uTime * 0.25 + uPhase) * 2.2;

        float scrollWave =
          sin(p.x * 0.035 + uScroll * 7.0 + uPhase) * 2.5;

        p.y += movingWave + secondaryWave + scrollWave;

        p.z +=
          sin(p.x * 0.08 + uTime * 0.35 + uPhase) * 1.8;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;

      varying vec2 vUv;

      void main() {
        float verticalFade =
          smoothstep(0.0, 0.18, vUv.y) *
          smoothstep(1.0, 0.82, vUv.y);

        float horizontalFade =
          smoothstep(0.0, 0.12, vUv.x) *
          smoothstep(1.0, 0.88, vUv.x);

        float softHighlight =
          sin(vUv.x * 18.0) * 0.5 + 0.5;

        vec3 finalColor =
          mix(
            uColor,
            vec3(1.0),
            softHighlight * 0.12
          );

        float alpha =
          uOpacity *
          verticalFade *
          horizontalFade;

        gl_FragColor =
          vec4(finalColor, alpha);
      }
    `
  });
}

export default function Landing3DBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const page = canvas?.closest('.landing-page');

    if (!canvas || !page) {
      return undefined;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -50,
      50,
      50,
      -50,
      -100,
      100
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.5)
    );

    renderer.setClearColor(0x000000, 0);

    const deep = getColor(
      page,
      '--deep',
      '#0e2d31'
    );

    const teal = getColor(
      page,
      '--teal',
      '#1e8583'
    );

    const mint = getColor(
      page,
      '--mint',
      '#d8f1e8'
    );

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    const liquidGroup = new THREE.Group();
    scene.add(liquidGroup);

    /*
     * Main translucent organic sculpture
     */
    const blobGeometry = new THREE.IcosahedronGeometry(
      13,
      4
    );

    const blobMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPointer: {
          value: new THREE.Vector2()
        },
        uScroll: { value: 0 },
        uDeep: {
          value: new THREE.Color(deep)
        },
        uMint: {
          value: new THREE.Color(mint)
        }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uScroll;

        varying vec3 vNormal;
        varying vec3 vWorld;

        void main() {
          vec3 p = position;

          float distortion =
            sin(p.x * 0.55 + uTime * 0.32) * 0.34;

          distortion +=
            sin(p.y * 0.48 - uTime * 0.24) * 0.25;

          distortion +=
            sin(p.z * 0.62 + uTime * 0.21) * 0.18;

          distortion +=
            dot(
              normalize(normal),
              normalize(vec3(uPointer, 0.8))
            ) * 0.6;

          p += normal *
            (distortion + uScroll * 0.14);

          vec4 worldPosition =
            modelMatrix * vec4(p, 1.0);

          vWorld = worldPosition.xyz;
          vNormal = normalize(normalMatrix * normal);

          gl_Position =
            projectionMatrix *
            viewMatrix *
            worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uDeep;
        uniform vec3 uMint;

        varying vec3 vNormal;
        varying vec3 vWorld;

        void main() {
          vec3 viewDirection =
            normalize(cameraPosition - vWorld);

          float edgeLight =
            pow(
              1.0 -
              max(
                dot(
                  normalize(vNormal),
                  viewDirection
                ),
                0.0
              ),
              2.1
            );

          vec3 color =
            mix(uDeep, uMint, edgeLight);

          float alpha =
            0.12 + edgeLight * 0.24;

          gl_FragColor =
            vec4(color, alpha);
        }
      `
    });

    const blob = new THREE.Mesh(
      blobGeometry,
      blobMaterial
    );

    sceneGroup.add(blob);

    /*
     * Soft translucent rings around the organic form
     */
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: mint,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide
    });

    const ringOne = new THREE.Mesh(
      new THREE.TorusGeometry(16, 0.34, 18, 120),
      ringMaterial
    );

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(20, 0.2, 16, 120),
      new THREE.MeshBasicMaterial({
        color: teal,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide
      })
    );

    ringOne.rotation.x = 0.8;
    ringOne.rotation.z = 0.2;

    ringTwo.rotation.x = 1.1;
    ringTwo.rotation.y = 0.5;

    sceneGroup.add(ringOne);
    sceneGroup.add(ringTwo);

    /*
     * Wide liquid ribbons
     */
    const ribbonDefinitions = [
      {
        color: '#78cfc0',
        opacity: 0.38,
        phase: 0.0,
        progress: 0.08,
        rotation: -0.08
      },
      {
        color: mint,
        opacity: 0.32,
        phase: 1.2,
        progress: 0.22,
        rotation: 0.05
      },
      {
        color: teal,
        opacity: 0.22,
        phase: 2.4,
        progress: 0.37,
        rotation: -0.04
      },
      {
        color: '#d8f1e8',
        opacity: 0.34,
        phase: 3.6,
        progress: 0.51,
        rotation: 0.08
      },
      {
        color: '#78cfc0',
        opacity: 0.28,
        phase: 4.8,
        progress: 0.64,
        rotation: -0.06
      },
      {
        color: teal,
        opacity: 0.18,
        phase: 5.8,
        progress: 0.76,
        rotation: 0.05
      },
      {
        color: '#d8f1e8',
        opacity: 0.28,
        phase: 6.8,
        progress: 0.88,
        rotation: -0.05
      }
    ];

    const ribbons = ribbonDefinitions.map(
      ({ color, opacity, phase, progress, rotation }) => {
        const material = createLiquidMaterial(
          color,
          opacity,
          phase
        );

        const geometry = new THREE.PlaneGeometry(
          150,
          28,
          180,
          18
        );

        const mesh = new THREE.Mesh(
          geometry,
          material
        );

        mesh.rotation.z = rotation;

        /*
         * Stores where this ribbon belongs vertically
         * on the full landing page.
         */
        mesh.userData.progress = progress;
        mesh.userData.material = material;

        liquidGroup.add(mesh);

        return mesh;
      }
    );

    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();

    let scrollTarget = 0;
    let scrollCurrent = 0;
    let pageHeight = 100;
    let sceneBaseY = 0;
    let frameId;

    const resize = () => {
      const width = page.clientWidth;
      const height = page.scrollHeight;

      pageHeight =
        (height / Math.max(width, 1)) * 100;

      renderer.setSize(
        width,
        height,
        false
      );

      camera.top = pageHeight / 2;
      camera.bottom = -pageHeight / 2;
      camera.updateProjectionMatrix();

      const scale =
        width <= 720
          ? 0.7
          : width <= 1024
            ? 0.85
            : 1;

      sceneGroup.scale.setScalar(scale);
      liquidGroup.scale.setScalar(scale);

      /*
       * Organic 3D sculpture starts behind
       * the hero section.
       */
      sceneBaseY = pageHeight * 0.28;

      sceneGroup.position.x =
        width <= 720 ? 13 : 25;

      sceneGroup.position.y =
        sceneBaseY;

      sceneGroup.position.z = 0;

      /*
       * Spread liquid ribbons from the top
       * to the bottom of the complete landing page.
       */
      ribbons.forEach((ribbon) => {
        const progress = ribbon.userData.progress;

        ribbon.position.x = 0;

        ribbon.position.y =
          pageHeight / 2 -
          pageHeight * progress;

        ribbon.position.z = -5;
      });

      liquidGroup.position.x = 0;
      liquidGroup.position.y = 0;
      liquidGroup.position.z = -5;
    };

    const updatePointer = (event) => {
      if (window.innerWidth <= 720) {
        return;
      }

      pointerTarget.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * 2
      );
    };

    const updateScroll = () => {
      const maximum =
        document.documentElement.scrollHeight -
        window.innerHeight;

      scrollTarget =
        maximum > 0
          ? window.scrollY / maximum
          : 0;
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(page);

    window.addEventListener(
      'pointermove',
      updatePointer,
      { passive: true }
    );

    window.addEventListener(
      'scroll',
      updateScroll,
      { passive: true }
    );

    resize();
    updateScroll();

    const animate = (time) => {
      const elapsed = time * 0.001;

      pointerCurrent.lerp(
        pointerTarget,
        0.045
      );

      scrollCurrent +=
        (scrollTarget - scrollCurrent) * 0.035;

      blobMaterial.uniforms.uTime.value =
        elapsed;

      blobMaterial.uniforms.uScroll.value =
        scrollCurrent;

      blobMaterial.uniforms.uPointer.value.copy(
        pointerCurrent
      );

      /*
 * Smooth vertical parallax while scrolling.
 * The scene is not fixed; it flows with the page.
 */
      const targetSceneY =
        sceneBaseY - scrollCurrent * 9;

      const targetLiquidY =
        -scrollCurrent * 18;

      sceneGroup.position.y +=
        (targetSceneY - sceneGroup.position.y) *
        0.035;

      liquidGroup.position.y +=
        (targetLiquidY - liquidGroup.position.y) *
        0.035;

      sceneGroup.rotation.x =
        pointerCurrent.y * -0.08 +
        scrollCurrent * 0.08;

      sceneGroup.rotation.y =
        pointerCurrent.x * 0.12 -
        scrollCurrent * 0.1;

      ringOne.rotation.y += 0.0018;
      ringTwo.rotation.z += 0.0012;

      ribbons.forEach((ribbon, index) => {
        const material =
          ribbon.userData.material;

        material.uniforms.uTime.value =
          elapsed + index * 0.8;

        material.uniforms.uScroll.value =
          scrollCurrent;
      });

      renderer.render(scene, camera);

      frameId =
        requestAnimationFrame(animate);
    };

    frameId =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);

      resizeObserver.disconnect();

      window.removeEventListener(
        'pointermove',
        updatePointer
      );

      window.removeEventListener(
        'scroll',
        updateScroll
      );

      blobGeometry.dispose();
      blobMaterial.dispose();

      ringOne.geometry.dispose();
      ringOne.material.dispose();

      ringTwo.geometry.dispose();
      ringTwo.material.dispose();

      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.userData.material.dispose();
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="landing-3d-background"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
