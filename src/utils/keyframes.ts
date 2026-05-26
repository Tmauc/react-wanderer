// La rotation s'appuie sur `animation: spin ...`. Plutôt que de dépendre d'un
// keyframe `spin` global (Tailwind, etc.), la lib l'injecte elle-même une seule
// fois. Idempotent et safe en SSR (no-op si pas de document).
let injected = false;

export const SPIN_KEYFRAMES_ID = "react-wanderer-keyframes";

export const ensureSpinKeyframes = (): void => {
  if (injected || typeof document === "undefined") return;

  if (document.getElementById(SPIN_KEYFRAMES_ID)) {
    injected = true;
    return;
  }

  const style = document.createElement("style");
  style.id = SPIN_KEYFRAMES_ID;
  style.textContent =
    "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";
  document.head.appendChild(style);
  injected = true;
};
