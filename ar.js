// ar.js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MindARThree } from "mindar-image-three";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#container");
  const hint = document.querySelector("#hint");

  const setHint = (text) => {
    if (hint) hint.textContent = text;
    console.log("[HINT]", text);
  };

  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: "./assets/target.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  // свет
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.8);
  scene.add(hemi);

  // якорь для таргета
  const anchor = mindarThree.addAnchor(0);

  // T-Rex
  const loader = new GLTFLoader();
  let trex = null;

  loader.load(
    "./assets/trex.glb",
    (gltf) => {
      trex = gltf.scene;
      trex.scale.set(0.35, 0.35, 0.35);
      trex.position.set(0, -0.2, 0);
      anchor.group.add(trex);
      console.log("T-Rex загружен");
    },
    undefined,
    (err) => {
      console.error("Ошибка загрузки trex.glb:", err);
      setHint("Не удалось загрузить модель T-Rex (см. консоль).");
    }
  );

  // события маркера → для квиза
  anchor.onTargetFound = () => {
    console.log("TARGET FOUND");
    setHint("Маркер найден! Сейчас начнётся квиз про T-Rex.");
    window.dispatchEvent(new CustomEvent("trex-marker-found"));
  };

  anchor.onTargetLost = () => {
    console.log("TARGET LOST");
    setHint("Маркер потерян. Наведи камеру на картинку ещё раз.");
    window.dispatchEvent(new CustomEvent("trex-marker-lost"));
  };

  await mindarThree.start();
  console.log("MindAR запущен");
  setHint("Камера запущена. Наведи на маркер T-Rex.");

  // анимация
  renderer.setAnimationLoop(() => {
    if (trex) {
      trex.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  });

  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
