import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.module.js";
import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";

document.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: "./assets/target.mind",  // твой маркер
  });

  const { renderer, scene, camera } = mindarThree;

  // === 1. Якорь для появления модели ===
  const anchor = mindarThree.addAnchor(0);

  // === 2. Загружаем T-Rex ===
  const loader = new THREE.GLTFLoader();
  let trex;

  loader.load("./assets/trex.glb", (gltf) => {
    trex = gltf.scene;
    trex.scale.set(0.4, 0.4, 0.4);
    trex.position.set(0, -0.2, 0);
    anchor.group.add(trex);
  });

  // === 3. Свет ===
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
  scene.add(light);

  // === 4. Запускаем AR ===
  await mindarThree.start();

  // === 5. Анимационный рендер-цикл ===
  renderer.setAnimationLoop(() => {
    if (trex) {
      trex.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  });
});
