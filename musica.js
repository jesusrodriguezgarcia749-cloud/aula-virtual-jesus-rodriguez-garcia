// musica.js — Música ambiental real (fondo.mp3) para estudiar, Aula Virtual JRG
// Se agrega con: <script src="musica.js"></script> antes de </body>
// (NO se incluye en actividad.html, que ya tiene sus propios sonidos)

(function () {
  const CLAVE_STORAGE = 'jrg_musica_activa';
  const CLAVE_VOLUMEN = 'jrg_musica_volumen';
  const VOLUMEN_INICIAL = 0.6;

  let sonando = false;

  const volumenGuardado = parseFloat(localStorage.getItem(CLAVE_VOLUMEN));
  const volumenActual = !isNaN(volumenGuardado) ? volumenGuardado : VOLUMEN_INICIAL;

  // --- Elemento de audio real, en bucle ---
  const audio = document.createElement('audio');
  audio.src = 'fondo.mp3';
  audio.loop = true;
  audio.volume = volumenActual;
  audio.preload = 'auto';
  document.body.appendChild(audio);

  // --- Botón flotante + panel de volumen ---
  const estilos = document.createElement('style');
  estilos.textContent = `
    #jrgMusicaBtn {
      position: fixed; top: 66px; right: 66px; z-index: 998;
      width: 42px; height: 42px; border-radius: 50%;
      background: rgba(23,20,15,0.72); backdrop-filter: blur(3px);
      border: none; color: #f2ece1; font-size: 1.15rem;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-family: Georgia, serif;
    }
    #jrgVolumenPanel {
      position: fixed; top: 114px; right: 16px; z-index: 998;
      background: rgba(23,20,15,0.9); backdrop-filter: blur(3px);
      border-radius: 20px; padding: 10px 14px;
      display: none; align-items: center; gap: 8px;
      font-family: Georgia, serif; color: #f2ece1; font-size: 0.85rem;
    }
    #jrgVolumenPanel.visible { display: flex; }
    #jrgVolumenSlider {
      width: 110px; accent-color: #d99a3d;
    }
  `;
  document.head.appendChild(estilos);

  const btn = document.createElement('button');
  btn.id = 'jrgMusicaBtn';
  btn.setAttribute('aria-label', 'Activar o pausar música');
  document.body.appendChild(btn);

  const panelVolumen = document.createElement('div');
  panelVolumen.id = 'jrgVolumenPanel';
  panelVolumen.innerHTML = `
    <span>🔉</span>
    <input type="range" id="jrgVolumenSlider" min="0" max="100" value="${Math.round(volumenActual * 100)}">
    <span>🔊</span>
  `;
  document.body.appendChild(panelVolumen);
  const slider = panelVolumen.querySelector('#jrgVolumenSlider');

  function actualizarIcono() {
    btn.innerHTML = sonando ? '🔈' : '🔇';
  }

  function iniciarMusica() {
    audio.play().then(() => {
      sonando = true;
      actualizarIcono();
      localStorage.setItem(CLAVE_STORAGE, '1');
    }).catch((err) => {
      console.warn('No se pudo reproducir la música todavía:', err);
    });
  }

  function detenerMusica() {
    audio.pause();
    sonando = false;
    actualizarIcono();
    localStorage.setItem(CLAVE_STORAGE, '0');
  }

  btn.addEventListener('click', () => {
    if (sonando) {
      detenerMusica();
      panelVolumen.classList.remove('visible');
    } else {
      iniciarMusica();
      panelVolumen.classList.add('visible');
    }
  });

  slider.addEventListener('input', () => {
    const nuevoVolumen = slider.value / 100;
    audio.volume = nuevoVolumen;
    localStorage.setItem(CLAVE_VOLUMEN, nuevoVolumen);
  });

  actualizarIcono();

  // Si el usuario ya la había activado en otra página, la reanudamos
  // (requiere un toque en la pantalla la primera vez, por política del navegador)
  if (localStorage.getItem(CLAVE_STORAGE) === '1') {
    const reanudarConPrimerToque = () => {
      iniciarMusica();
      document.removeEventListener('click', reanudarConPrimerToque);
      document.removeEventListener('touchstart', reanudarConPrimerToque);
    };
    document.addEventListener('click', reanudarConPrimerToque, { once: true });
    document.addEventListener('touchstart', reanudarConPrimerToque, { once: true });
  }
})();
