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

  console.log("Создаём MindARThree...");
  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: "./assets/target.mind", // наш таргет
  });

  const { renderer, scene, camera } = mindarThree;

  // Немного настроек рендерера для мобильных
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  // Свет
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.8);
  scene.add(hemi);

  // Якорь по первому таргету из target.mind
  const anchor = mindarThree.addAnchor(0);

  // DEBUG-куб — чтобы 100% увидеть, что таргет работает
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      metalness: 0.4,
      roughness: 0.4,
    }),
  );
  cube.position.set(-0.5, 0, 0);
  anchor.group.add(cube);

  // T-Rex модель
  const loader = new GLTFLoader();
  let trex = null;

  loader.load(
    "./assets/trex.glb",
    (gltf) => {
      trex = gltf.scene;
      trex.scale.set(0.35, 0.35, 0.35);
      trex.position.set(0.4, -0.2, 0);
      anchor.group.add(trex);
      console.log("Модель T-Rex загружена.");
    },
    undefined,
    (error) => {
      console.error("Ошибка загрузки trex.glb:", error);
      setHint("Ошибка загрузки модели T-Rex (см. консоль).");
    },
  );

  // Реакция на появление/пропадание таргета
  anchor.onTargetFound = () => {
    console.log("TARGET FOUND");
    setHint("Маркер найден! Видишь куб и T-Rex? (потом здесь будет квиз)");
  };

  anchor.onTargetLost = () => {
    console.log("TARGET LOST");
    setHint("Маркер потерян. Наведи камеру на картинку ещё раз.");
  };

  // Старт AR
  await mindarThree.start();
  console.log("MindAR запущен.");
  setHint("Камера запущена. Наведи на маркер T-Rex Quest.");

  // Рендер-цикл
  renderer.setAnimationLoop(() => {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;

    if (trex) {
      trex.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
  });

  // Обработка ресайза
  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
