/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   HOMEPAGE JAVASCRIPT
   ============================================================

   Purpose:
   - Homepage-specific interactions
   - Hero visual behavior
   - Condition navigation
   - Scroll reveal
   - Appointment CTA interactions
   - Testimonial/video controls
   - FAQ accordion
   - Accessibility enhancements
   - Reduced-motion support

   This file is designed to work alongside:
   - root.js
   - root.css

   Global navigation and global utilities remain in root.js.
   ============================================================ */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
(() => {
  "use strict";

  /* ============================================================
     01. DOM HELPERS
     ============================================================ */

  const $ = (selector, scope = document) => scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const html = document.documentElement;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ============================================================
     02. HOMEPAGE STATE
     ============================================================ */

  const state = {
    activeCondition: "pain",
    activeTestimonial: 0,
    videoPlaying: false
  };
/* ============================================================
   FAVOR 3D ANATOMICAL ENGINE
   ============================================================ */

const initFavorAnatomy3D = (map) => {

  const canvas = $("#favor-anatomy-3d", map);
  const loading = $("#favor-anatomy-loading", map);
  const errorMessage = $("#favor-anatomy-error", map);
console.info("[Favor 3D] initFavorAnatomy3D started", {
    canvas,
    loading,
    errorMessage
});   
if (loading) {
    loading.hidden = false;
}

if (errorMessage) {
    errorMessage.hidden = true;
}

if (!canvas) {
    return null;
}

  /*
   * Respect browser support.
   */
  let renderer;

  try {

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
console.info("[Favor 3D] WebGL renderer created");
  } catch (error) {

    console.warn(
      "Three.js WebGL renderer could not be created.",
      error
    );

    if (loading) {
      loading.hidden = true;
    }

    if (errorMessage) {
      errorMessage.hidden = false;
    }

    return null;
  }


  /* ==========================================================
     RENDERER
     ========================================================== */

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.75)
  );

  renderer.setClearColor(
    0x000000,
    0
  );

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure = 0.98;


  /* ==========================================================
     SCENE
     ========================================================== */

  const scene = new THREE.Scene();


  /* ==========================================================
     CAMERA
     ========================================================== */

  const camera =
    new THREE.PerspectiveCamera(
      28,
      1,
      0.1,
      100
    );

  camera.position.set(
    0,
    0,
    9.4
  );
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = !prefersReducedMotion;
controls.dampingFactor = 0.07;

controls.enablePan = false;
controls.enableZoom = true;
controls.enableRotate = true;

controls.minDistance = 7.2;
controls.maxDistance = 12;

controls.minPolarAngle = 1.05;
controls.maxPolarAngle = 2.05;

controls.target.set(0, 0, 0);
controls.update();
   
const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const projectedPoint =
  new THREE.Vector3();

const anatomyAnchors = new Map();

const hotspotElements =
  $$("[data-location]", map);

let hoveredZone = null;

let pointerInside = false;

let pointerDownX = 0;
let pointerDownY = 0;

let pointerDragged = false;

const normalizeZoneName = (name) => {

    const normalized =
        String(name || "").toLowerCase();

    return normalized === "toes"
        ? "toe"
        : normalized;
};


const updateHotspotPosition = (
    location
) => {

    const hotspot =
        hotspotElements.find(
            (element) =>
                element.dataset.location === location
        );

    const anchor =
        anatomyAnchors.get(location);

    if (!hotspot || !anchor) {
        return;
    }

    projectedPoint
        .copy(anchor)
        .project(camera);

    const rect =
        canvas.getBoundingClientRect();

    const x =
        (projectedPoint.x * 0.5 + 0.5)
        * rect.width;

    const y =
        (-projectedPoint.y * 0.5 + 0.5)
        * rect.height;

    hotspot.style.left =
        `${x}px`;

    hotspot.style.top =
        `${y}px`;

    hotspot.classList.toggle(
        "is-left",
        x > rect.width * 0.58
    );
};


const updateAllHotspotPositions = () => {

    if (!anatomyAnchors.size) {
        return;
    }

    anatomyAnchors.forEach(
        (_, location) => {
            updateHotspotPosition(
                location
            );
        }
    );

};

let hoverCallback = null;

const setHoveredZone = (
    location
) => {

    if (hoveredZone === location) {
        return;
    }

    hoveredZone = location;

    hotspotElements.forEach(
        (hotspot) => {

            hotspot.classList.toggle(
                "is-3d-visible",
                hotspot.dataset.location === location
            );

        }
    );

    if (hoverCallback) {
        hoverCallback(location);
    }

};

const updatePointerInteraction = (
    event
) => {

    if (!anatomyParts.length) {
        return;
    }

    const rect =
        canvas.getBoundingClientRect();

    pointer.x =
        ((event.clientX - rect.left) /
            rect.width) * 2 - 1;

    pointer.y =
        -((event.clientY - rect.top) /
            rect.height) * 2 + 1;

    raycaster.setFromCamera(
        pointer,
        camera
    );

    const intersections =
        raycaster.intersectObjects(
            anatomyParts.map(
                ({ object }) => object
            ),
            false
        );

    if (!intersections.length) {

        setHoveredZone(null);

        return;
    }

    const hit =
        intersections[0].object;

    const location =
        normalizeZoneName(hit.name);

    const validZones = [
        "leg",
        "ankle",
        "heel",
        "foot",
        "toe"
    ];

    if (
        !validZones.includes(location)
    ) {
        setHoveredZone(null);

        return;
    }

    setHoveredZone(location);
};
canvas.addEventListener(
    "pointerenter",
    () => {
        pointerInside = true;
    },
    { passive:true }
);


canvas.addEventListener(
    "pointermove",
    (event) => {

        pointerInside = true;

        updatePointerInteraction(
            event
        );

    },
    { passive:true }
);


canvas.addEventListener(
    "pointerleave",
    () => {

        pointerInside = false;

        if (
            window.matchMedia(
                "(hover:hover)"
            ).matches
        ) {
            setHoveredZone(null);
        }

    },
    { passive:true }
);


canvas.addEventListener(
    "pointerdown",
    (event) => {

        pointerDownX =
            event.clientX;

        pointerDownY =
            event.clientY;

        pointerDragged = false;

    },
    { passive:true }
);


canvas.addEventListener(
    "pointermove",
    (event) => {

        if (
            Math.hypot(
                event.clientX - pointerDownX,
                event.clientY - pointerDownY
            ) > 6
        ) {
            pointerDragged = true;
        }

    },
    { passive:true }
);
canvas.addEventListener(
    "click",
    () => {

        if (pointerDragged) {
            return;
        }

        if (!hoveredZone) {
            return;
        }

        const hotspot =
            hotspotElements.find(
                (element) =>
                    element.dataset.location ===
                    hoveredZone
            );

        if (hotspot) {
            hotspot.click();
        }

    }
);


  /* ==========================================================
     LIGHTING
     ========================================================== */

  const hemisphereLight =
    new THREE.HemisphereLight(
      0xffffff,
      0xe6e9ff,
      2.2
    );

  scene.add(hemisphereLight);


  const keyLight =
    new THREE.DirectionalLight(
      0xffffff,
      3.0
    );

  keyLight.position.set(
    3,
    5,
    5
  );

  scene.add(keyLight);


  const fillLight =
    new THREE.DirectionalLight(
      0x9ca8ff,
      1.25
    );

  fillLight.position.set(
    -4,
    2,
    3
  );

  scene.add(fillLight);


  const rimLight =
    new THREE.DirectionalLight(
      0xdfe4ff,
      1.4
    );

  rimLight.position.set(
    2,
    -2,
    -4
  );

  scene.add(rimLight);


  /* ==========================================================
     MODEL GROUP
     ========================================================== */

  const modelGroup =
    new THREE.Group();

  scene.add(modelGroup);


  let anatomyModel = null;

  let anatomyParts = [];


  /* ==========================================================
     MODEL CONFIGURATION
     ========================================================== */
const MODEL_URL =
  new URL(
    "../models/favor-lower-extremity.glb",
    import.meta.url
  ).href;


  /*
   * The GLB should be exported Y-up.
   *
   * If the supplied model is rotated differently,
   * change these values only.
   */

  const MODEL_ROTATION = {
    x: 0,
    y: -0.10,
    z: 0
};


  /* ==========================================================
     MATERIAL NORMALIZATION
     ========================================================== */
const prepareModelMaterials = (root) => {

    root.traverse((object) => {

        if (!object.isMesh) {
            return;
        }

        object.castShadow = false;
        object.receiveShadow = false;

        const sourceMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];

        const materials = sourceMaterials.map((source) => {

            if (!source) {
                return source;
            }

            const material = source.clone();

            if (
                material.isMeshStandardMaterial ||
                material.isMeshPhysicalMaterial
            ) {

                material.roughness =
                    Math.min(
                        material.roughness || 0.72,
                        0.82
                    );

                material.metalness = 0;

                if (material.color) {
                    material.color.set(0xd6dae5);
                }

            }

            return material;

        });

        object.material =
            Array.isArray(object.material)
                ? materials
                : materials[0];

    });

};


  /* ==========================================================
     COLLECT ANATOMICAL PARTS
     ========================================================== */

  const collectAnatomyParts = (root) => {

    anatomyParts = [];

    root.traverse((object) => {

      if (!object.isMesh) {
        return;
      }

      anatomyParts.push({
        object,
        name: (
          object.name ||
          ""
        ).toLowerCase()
      });

    });

  };


  /* ==========================================================
     FRAME MODEL
     ========================================================== */

  const frameModel = () => {

    if (!anatomyModel) {
      return;
    }

    const box =
      new THREE.Box3()
        .setFromObject(anatomyModel);

    const size =
      box.getSize(
        new THREE.Vector3()
      );

    const center =
      box.getCenter(
        new THREE.Vector3()
      );

    /*
     * Scale first, then recenter the scaled object.
     * This avoids the offset caused by scaling after
     * applying an unscaled center translation.
     */

    const maxDimension =
      Math.max(
        size.x,
        size.y,
        size.z
      );

    const targetHeight = 4.25;

    const scale =
      targetHeight / maxDimension;

    anatomyModel.position.set(0, 0, 0);
    anatomyModel.scale.setScalar(scale);

    const scaledBox =
      new THREE.Box3()
        .setFromObject(anatomyModel);

    const scaledCenter =
      scaledBox.getCenter(
        new THREE.Vector3()
      );

    anatomyModel.position.sub(scaledCenter);

    /*
     * Slight vertical lift so the foot has
     * visual breathing room.
     */

    anatomyModel.position.y += 0.05;


    /*
     * Camera distance.
     */

camera.position.set(
  0,
  0,
  9.4
);

controls.target.set(
  0,
  0,
  0
);

controls.update();

  };


  /* ==========================================================
     RESIZE
     ========================================================== */

  const resize = () => {

    const rect =
      canvas.getBoundingClientRect();

    const width =
      Math.max(
        1,
        rect.width
      );

    const height =
      Math.max(
        1,
        rect.height
      );

    renderer.setSize(
      width,
      height,
      false
    );

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

  };


  /* ==========================================================
     LOAD GLB
     ========================================================== */

  const loader =
    new GLTFLoader();
console.info("[Favor 3D] Starting GLB load:", MODEL_URL);
  loader.load(

    MODEL_URL,

(gltf) => {
    console.info(
        "[Favor 3D] GLB load callback fired",
        gltf
    );
if (!gltf || !gltf.scene) {

    console.error(
        "Favor GLB loaded but no scene was found.",
        gltf
    );

    if (loading) {
        loading.hidden = true;
    }

    if (errorMessage) {
        errorMessage.textContent =
            "Clinical visualization unavailable. Please refresh the page.";
        errorMessage.hidden = false;
    }

    return;
}

    anatomyModel =
        gltf.scene;

    anatomyModel.rotation.set(
        MODEL_ROTATION.x,
        MODEL_ROTATION.y,
        MODEL_ROTATION.z
      );

      prepareModelMaterials(
        anatomyModel
      );

      collectAnatomyParts(
        anatomyModel
      );

modelGroup.add(
    anatomyModel
);
console.info(
    "[Favor 3D] Model added to scene",
    {
        children: modelGroup.children.length,
        anatomyParts: anatomyParts.length
    }
);
if (loading) {
    loading.hidden = true;
}
   
frameModel();

resize();

if (loading) {
    loading.hidden = true;
}

anatomyAnchors.clear();

anatomyParts.forEach(
    ({ object, name }) => {

        const location =
            normalizeZoneName(name);

        const box =
            new THREE.Box3()
                .setFromObject(object);

        const center =
            box.getCenter(
                new THREE.Vector3()
            );

        anatomyAnchors.set(
            location,
            center
        );

    }
);

// updateAllHotspotPositions();
      /*
       * Apply the default/selected clinical zone after
       * the GLB has finished loading.
       */

 //     applyZone(activeZone);

      console.info(
        "Favor 3D anatomy loaded.",
        anatomyParts.map(
          (part) => part.name
        )
      );

    },

    (xhr) => {

        if (!loading) {
            return;
        }

        if (xhr.lengthComputable && xhr.total > 0) {

            const percent =
                Math.round(
                    (xhr.loaded / xhr.total) * 100
                );

            const loadingText =
                loading.querySelector("span:last-child");

            if (loadingText) {
                loadingText.textContent =
                    `Loading clinical visualization ${percent}%`;
            }

        }

    },

(loadError) => {

    console.error(
        "Favor 3D anatomy failed to load.",
        {
            url: MODEL_URL,
            error: loadError
        }
    );

    if (loading) {
        loading.hidden = true;
    }

    if (errorMessage) {

        errorMessage.textContent =
            "Clinical visualization unavailable. Please refresh the page.";

        errorMessage.hidden = false;
    }

}

  );


  /* ==========================================================
     RENDER LOOP
     ========================================================== */

  let animationFrame = null;

const render = () => {

    animationFrame =
        window.requestAnimationFrame(
            render
        );

    controls.update();

    updateAllHotspotPositions();

if (!window.__favor3DRendered) {
    window.__favor3DRendered = true;

    console.info(
        "[Favor 3D] First render",
        {
            sceneChildren: scene.children.length,
            modelChildren: modelGroup.children.length,
            cameraPosition: camera.position.toArray()
        }
    );
}

   
    renderer.render(
        scene,
        camera
    );

};

  render();


  /* ==========================================================
     RESIZE OBSERVER
     ========================================================== */

  const resizeObserver =
    new ResizeObserver(
      resize
    );

  resizeObserver.observe(
    canvas
  );


  /* ==========================================================
     VISIBILITY OPTIMIZATION
     ========================================================== */

  const handleVisibility = () => {

    if (document.hidden) {

      if (animationFrame) {
        cancelAnimationFrame(
          animationFrame
        );

        animationFrame = null;
      }

      return;
    }

    if (!animationFrame) {
      render();
    }

  };

  document.addEventListener(
    "visibilitychange",
    handleVisibility
  );


  /*
   * Return the controller so the Clinical Map
   * can communicate with the 3D anatomy.
   */

  let activeZone = "leg";

  const applyZone = (location) => {

    if (!anatomyParts.length) {
      return;
    }

    anatomyParts.forEach(
      ({ object, name }) => {

        /*
         * The production GLB contains five named meshes:
         * LEG, ANKLE, HEEL, FOOT and TOES.
         * The name match is therefore deterministic and
         * does not depend on source-file bone names.
         */

        const matches =
          name === location ||
          (location === "toe" && name === "toes");

        const materials =
          Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach(
          (material) => {

            if (!material) {
              return;
            }

if (material.color) {
    material.color.set(
        matches
            ? 0x8b7cf6
            : 0xd6dae5
    );
}

if ("emissive" in material) {

    if (matches) {

        material.emissive.set(
            0x4f46e5
        );

        material.emissiveIntensity =
            0.65;

    } else {

        material.emissive.set(
            0x000000
        );

        material.emissiveIntensity =
            0;

    }
}

          }

        );

      }
    );

  };


return {

    setZone(location) {

        const validZones = [
            "leg",
            "ankle",
            "heel",
            "foot",
            "toe"
        ];

        if (!validZones.includes(location)) {
            return;
        }

        activeZone = location;
        applyZone(location);

    },

    onHover(callback) {
        hoverCallback =
            typeof callback === "function"
                ? callback
                : null;
    },

    resize
   
   };
   
};
/* ============================================================
   03. FAVOR CLINICAL MAP
   ============================================================ */

const initFavorClinicalMap = () => {

  const map = $("[data-favor-map]");

  if (!map) {
    return;
  }

  const hotspots = $$("[data-location]", map);
  const anatomy3D =
  initFavorAnatomy3D(map);

  const panelKicker = $("[data-favor-panel-kicker]", map);
  const panelTitle = $("[data-favor-panel-title]", map);
  const panelText = $("[data-favor-panel-text]", map);
  const panelLink = $("[data-favor-panel-link]", map);

  const locations = {

    leg: {
      kicker: "LEG CONDITIONS",
      title: "Support, movement & lower-leg concerns",
      text: "Explore care for conditions affecting the lower leg, support, movement and complex lower-extremity concerns.",
      url: "services.html#conditions"
    },

    ankle: {
      kicker: "ANKLE CONDITIONS",
      title: "Stability, injury & joint problems",
      text: "Explore care for ankle pain, injuries, instability, arthritis and other conditions affecting ankle function.",
      url: "services.html#conditions"
    },

    heel: {
      kicker: "HEEL CONCERNS",
      title: "Pain, pressure & mobility",
      text: "Explore common causes of heel pain and conditions that can affect comfort, weight-bearing and mobility.",
      url: "services.html#conditions"
    },

    foot: {
      kicker: "FOOT CONDITIONS",
      title: "Structure, function & foot pain",
      text: "Explore care for foot pain, structural problems, diabetic foot concerns and conditions affecting function.",
      url: "services.html#conditions"
    },

    toe: {
      kicker: "TOE CONDITIONS",
      title: "Gout, deformity & other concerns",
      text: "Explore care for gout, toe deformities, nail and skin concerns and other conditions affecting the forefoot.",
      url: "services.html#conditions"
    }

  };


const activateLocation = (location) => {

    const data = locations[location];

    if (!data) {
        return;
    }

    if (anatomy3D) {
        anatomy3D.setZone(location);
    }

    hotspots.forEach((hotspot) => {

        const isActive =
            hotspot.dataset.location === location;

        hotspot.classList.toggle(
            "is-active",
            isActive
        );

        hotspot.setAttribute(
            "aria-pressed",
            isActive ? "true" : "false"
        );

    });

    if (panelKicker) {
        panelKicker.textContent = data.kicker;
    }

    if (panelTitle) {
        panelTitle.textContent = data.title;
    }

    if (panelText) {
        panelText.textContent = data.text;
    }

    if (panelLink) {
        panelLink.href = data.url;
    }

};


/* 3D anatomy hover → clinical map */
if (anatomy3D) {
    anatomy3D.onHover(
        (location) => {

            if (!location) {
                return;
            }

            activateLocation(location);

        }
    );
}


  hotspots.forEach((hotspot) => {

    const location =
      hotspot.dataset.location;

    hotspot.setAttribute(
      "aria-pressed",
      "false"
    );


    hotspot.addEventListener(
      "mouseenter",
      () => {

        if (window.innerWidth > 768) {
          activateLocation(location);
        }

      }
    );


    hotspot.addEventListener(
      "focus",
      () => {
        activateLocation(location);
      }
    );


    hotspot.addEventListener(
      "click",
      () => {
        activateLocation(location);
      }
    );

  });


  /*
   * Desktop:
   * Show the first clinical area automatically.
   *
   * Mobile:
   * Keep the hero neutral until the patient selects an area.
   */
};
  /* ============================================================
     04. CONDITION FINDER
     ============================================================

     Allows visitors to select a condition category and instantly
     see relevant conditions.

     This keeps the homepage patient-focused:
     "I have this problem → show me the care."
     ============================================================ */

  const initConditionFinder = () => {
    const finder = $("[data-condition-finder]");

    if (!finder) {
      return;
    }

    const categories = $$("[data-condition-category]", finder);
    const groups = $$("[data-condition-group]", finder);
    const title = $("[data-condition-title]", finder);

    const activateCategory = (category) => {
      state.activeCondition = category;

      categories.forEach((button) => {
        const isActive =
          button.dataset.conditionCategory === category;

        button.classList.toggle("is-active", isActive);
        button.setAttribute(
          "aria-selected",
          isActive ? "true" : "false"
        );

        if (isActive) {
          button.setAttribute("tabindex", "0");
        } else {
          button.setAttribute("tabindex", "-1");
        }
      });

      groups.forEach((group) => {
        const isActive =
          group.dataset.conditionGroup === category;

        group.classList.toggle("is-active", isActive);
        group.hidden = !isActive;
      });

      const activeButton = categories.find(
        (button) =>
          button.dataset.conditionCategory === category
      );

      if (title && activeButton) {
        const label = activeButton.querySelector(
          "[data-condition-label]"
        );

        title.textContent = label
          ? label.textContent.trim()
          : activeButton.textContent.trim();
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    categories.forEach((button, index) => {
      button.addEventListener("click", () => {
        activateCategory(button.dataset.conditionCategory);
      });

      button.addEventListener("keydown", (event) => {
        let nextIndex = null;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % categories.length;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex =
            (index - 1 + categories.length) %
            categories.length;
        }

        if (nextIndex !== null) {
          event.preventDefault();

          categories[nextIndex].focus();

          activateCategory(
            categories[nextIndex].dataset.conditionCategory
          );
        }
      });
    });

    groups.forEach((group) => {
      group.hidden =
        group.dataset.conditionGroup !== state.activeCondition;
    });

    activateCategory(state.activeCondition);
  };


  /* ============================================================
     05. CONDITION RESULT INTERACTIONS
     ============================================================

     Condition cards can point patients toward the Services page.
     ============================================================ */

  const initConditionResults = () => {
    const results = $$("[data-condition-result]");

    if (!results.length) {
      return;
    }

    results.forEach((result) => {
      result.addEventListener("click", () => {
        const condition =
          result.dataset.conditionResult ||
          result.textContent.trim();

        const servicesUrl = result.dataset.servicesUrl;

        if (servicesUrl) {
          window.location.href =
            `${servicesUrl}?condition=${encodeURIComponent(condition)}`;
          return;
        }

        window.location.href = "services.html";
      });
    });
  };


  /* ============================================================
     06. HOME FAQ ACCORDION
     ============================================================ */

  const initFaq = () => {
    const faqItems = $$("[data-faq-item]");

    if (!faqItems.length) {
      return;
    }

    faqItems.forEach((item) => {
      const trigger = $("[data-faq-trigger]", item);
      const answer = $("[data-faq-answer]", item);

      if (!trigger || !answer) {
        return;
      }

      const setState = (open) => {
        item.classList.toggle("is-open", open);

        trigger.setAttribute(
          "aria-expanded",
          open ? "true" : "false"
        );

        answer.hidden = !open;
      };

      setState(item.classList.contains("is-open"));

      trigger.addEventListener("click", () => {
        const currentlyOpen =
          trigger.getAttribute("aria-expanded") === "true";

        faqItems.forEach((otherItem) => {
          if (otherItem === item) {
            return;
          }

          const otherTrigger =
            $("[data-faq-trigger]", otherItem);

          const otherAnswer =
            $("[data-faq-answer]", otherItem);

          if (otherTrigger && otherAnswer) {
            otherItem.classList.remove("is-open");
            otherTrigger.setAttribute(
              "aria-expanded",
              "false"
            );
            otherAnswer.hidden = true;
          }
        });

        setState(!currentlyOpen);
      });
    });
  };


  /* ============================================================
     07. TESTIMONIAL / VIDEO OVERLAY
     ============================================================ */

  const initVideo = () => {
    const video = $("#home-video");
    const playButton = $("[data-video-play]");
    const overlay = $("[data-video-overlay]");

    if (!video) {
      return;
    }

    const updateVideoState = () => {
      const playing = !video.paused && !video.ended;

      state.videoPlaying = playing;

      if (overlay) {
        overlay.classList.toggle("is-hidden", playing);
      }

      if (playButton) {
        playButton.setAttribute(
          "aria-label",
          playing
            ? "Pause practice video"
            : "Play practice video"
        );
      }
    };

    if (playButton) {
      playButton.addEventListener("click", async () => {
        try {
          if (video.paused) {
            await video.play();
          } else {
            video.pause();
          }
        } catch (error) {
          console.warn(
            "Video playback could not be started.",
            error
          );
        }

        updateVideoState();
      });
    }

    video.addEventListener("play", updateVideoState);
    video.addEventListener("pause", updateVideoState);
    video.addEventListener("ended", updateVideoState);

    updateVideoState();
  };


  /* ============================================================
     08. SCROLL REVEAL
     ============================================================

     Homepage-specific reveal behavior.

     root.js may already provide global reveal functionality.
     This function only targets elements using the homepage
     attribute [data-home-reveal].
     ============================================================ */

  const initScrollReveal = () => {
    const elements = $$("[data-home-reveal]");

    if (!elements.length) {
      return;
    }

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  };


  /* ============================================================
     09. COUNTER ANIMATION
     ============================================================

     Animates numerical trust indicators such as:
     29+ Years
     100% Patient Focus
     etc.

     HTML example:

     <strong data-counter="29" data-suffix="+">0</strong>
     ============================================================ */

  const initCounters = () => {
    const counters = $$("[data-counter]");

    if (!counters.length) {
      return;
    }

    if (prefersReducedMotion) {
      counters.forEach((counter) => {
        counter.textContent =
          counter.dataset.counter +
          (counter.dataset.suffix || "");
      });

      return;
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach((counter) => {
        counter.textContent =
          counter.dataset.counter +
          (counter.dataset.suffix || "");
      });

      return;
    }

    const animateCounter = (element) => {
      const target = Number(element.dataset.counter);

      if (!Number.isFinite(target)) {
        return;
      }

      const suffix = element.dataset.suffix || "";
      const duration = 1200;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(
          elapsed / duration,
          1
        );

        const eased =
          1 - Math.pow(1 - progress, 3);

        const value = Math.round(
          target * eased
        );

        element.textContent =
          value + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(update);
        }
      };

      window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.6
      }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  };


  /* ============================================================
     10. APPOINTMENT CTA TRACKING
     ============================================================

     Adds a lightweight interaction state to appointment buttons.

     No external analytics dependency is required.
     ============================================================ */

  const initAppointmentCtas = () => {
    const buttons = $$(
      'a[href*="contact.html"], a[href^="tel:"]'
    );

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.add("is-clicked");

        window.setTimeout(() => {
          button.classList.remove("is-clicked");
        }, 450);
      });
    });
  };


  /* ============================================================
     11. MOBILE CONDITION NAVIGATION
     ============================================================

     Improves horizontal condition category navigation on smaller
     screens by automatically bringing the active category into
     view.
     ============================================================ */

  const initMobileConditionScroll = () => {
    const container =
      $("[data-condition-categories]");

    if (!container) {
      return;
    }

    const observer = new MutationObserver(() => {
      const active = $(
        "[data-condition-category].is-active",
        container
      );

      if (!active) {
        return;
      }

      if (window.innerWidth <= 768) {
        active.scrollIntoView({
          behavior: prefersReducedMotion
            ? "auto"
            : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    });

    observer.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  };


  /* ============================================================
     12. STICKY MOBILE CTA
     ============================================================

     Displays a mobile appointment bar after the user moves past
     the hero.

     HTML:

     <div class="mobile-appointment-bar" data-mobile-cta>
       ...
     </div>
     ============================================================ */

  const initMobileCta = () => {
    const bar = $("[data-mobile-cta]");
    const hero = $(".home-hero");

    if (!bar || !hero) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        bar.classList.toggle(
          "is-visible",
          !entry.isIntersecting
        );
      },
      {
        threshold: 0
      }
    );

    observer.observe(hero);
  };


  /* ============================================================
     13. HERO CTA FOCUS
     ============================================================

     Ensures that keyboard users can clearly identify the primary
     conversion action.
     ============================================================ */

  const initHeroCtaFocus = () => {
    const primaryCta =
      $(".home-hero [data-primary-cta]");

    if (!primaryCta) {
      return;
    }

    primaryCta.addEventListener("focus", () => {
      primaryCta.classList.add("is-focus-visible");
    });

    primaryCta.addEventListener("blur", () => {
      primaryCta.classList.remove("is-focus-visible");
    });
  };


  /* ============================================================
     14. IMAGE ERROR HANDLING
     ============================================================

     Adds a diagnostic class if a homepage image fails to load.

     It does not replace the image with fabricated content.
     ============================================================ */

  const initImageErrors = () => {
    const images = $$("img");

    images.forEach((image) => {
      image.addEventListener("error", () => {
        image.classList.add("is-image-error");
      });
    });
  };


  /* ============================================================
     15. LAZY MEDIA INITIALIZATION
     ============================================================ */

  const initMedia = () => {
    const videos = $$("video");

    videos.forEach((video) => {
      if (!video.hasAttribute("preload")) {
        video.setAttribute("preload", "metadata");
      }

      video.setAttribute(
        "playsinline",
        ""
      );
    });
  };


  /* ============================================================
     16. BACKGROUND VISUAL PERFORMANCE
     ============================================================

     Disables decorative motion when the browser tab is hidden.
     ============================================================ */

  const initVisibilityOptimization = () => {
    document.addEventListener(
      "visibilitychange",
      () => {
        const heroVisual =
          $(".home-hero__visual");

        if (!heroVisual) {
          return;
        }

        if (document.hidden) {
          heroVisual.style.willChange = "auto";
        } else if (!prefersReducedMotion) {
          heroVisual.style.willChange =
            "transform";
        }
      }
    );
  };


  /* ============================================================
     17. REDUCED MOTION
     ============================================================ */

  const initReducedMotion = () => {
    if (prefersReducedMotion) {
      html.classList.add("reduce-motion");
    }
  };


  /* ============================================================
     18. CURRENT YEAR
     ============================================================ */

  const initCurrentYear = () => {
    const yearElements =
      $$("[data-current-year]");

    if (!yearElements.length) {
      return;
    }

    const year =
      new Date().getFullYear();

    yearElements.forEach((element) => {
      element.textContent = year;
    });
  };


  /* ============================================================
     19. EXTERNAL LINKS
     ============================================================

     Adds safe target/rel attributes to external links while
     leaving internal navigation untouched.
     ============================================================ */

  const initExternalLinks = () => {
    $$(
      'a[href^="http://"], a[href^="https://"]'
    ).forEach((link) => {
      try {
        const url =
          new URL(
            link.href,
            window.location.href
          );

        if (
          url.origin !==
          window.location.origin
        ) {
          link.target = "_blank";
          link.rel =
            "noopener noreferrer";
        }
      } catch {
        /* Ignore malformed URLs. */
      }
    });
  };


  /* ============================================================
     20. KEYBOARD ACCESSIBILITY
     ============================================================ */

  const initKeyboardMode = () => {
    const handleKeyboard = (event) => {
      if (event.key === "Tab") {
        html.classList.add(
          "using-keyboard"
        );
      }
    };

    const handlePointer = () => {
      html.classList.remove(
        "using-keyboard"
      );
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    document.addEventListener(
      "mousedown",
      handlePointer,
      { passive: true }
    );

    document.addEventListener(
      "touchstart",
      handlePointer,
      { passive: true }
    );
  };


  /* ============================================================
     21. LUCIDE ICON REFRESH
     ============================================================ */

  const refreshIcons = () => {
    if (
      window.lucide &&
      typeof window.lucide.createIcons ===
        "function"
    ) {
      window.lucide.createIcons();
    }
  };


  /* ============================================================
     22. HOMEPAGE INITIALIZATION
     ============================================================ */

  const init = () => {
    initFavorClinicalMap();
    initConditionFinder();
    initConditionResults();
    initFaq();
    initVideo();
    initScrollReveal();
    initCounters();
    initAppointmentCtas();
    initMobileConditionScroll();
    initMobileCta();
    initHeroCtaFocus();
    initImageErrors();
    initMedia();
    initVisibilityOptimization();
    initReducedMotion();
    initCurrentYear();
    initExternalLinks();
    initKeyboardMode();
    refreshIcons();

    html.classList.add(
      "homepage-js-ready"
    );
  };


  /* ============================================================
     23. DOM READY
     ============================================================ */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
