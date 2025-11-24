// ar.js
import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#container");
  const hint = document.querySelector("#hint");

  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: "./assets/target.mind", // наш маркер
  });

  const { renderer, scene, camera } = mindarThree;

  // якорь, привязанный к первому таргету из target.mind
  const anchor = mindarThree.addAnchor(0);

  // простой объект: куб
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      metalness: 0.4,
      roughness: 0.3,
    })
  );
  cube.position.set(0, 0, 0);
  anchor.group.add(cube);

  // свет
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.6);
  scene.add(light);

  // когда таргет виден — показываем подсказку про квест
  anchor.onTargetFound = () => {
    if (hint) {
      hint.textContent = "Маркер найден! Здесь будет квест про T-Rex.";
    }
  };

  // когда таргет теряется — просим снова навести камеру
  anchor.onTargetLost = () => {
    if (hint) {
      hint.textContent = "Маркер потерян. Наведи камеру на маркер ещё раз.";
    }
  };

  // старт AR
  await mindarThree.start();
  if (hint) {
    hint.textContent = "Камера запущена. Наведи на маркер.";
  }

  // рендер-цикл
  renderer.setAnimationLoop(() => {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;
    renderer.render(scene, camera);
  });
});
