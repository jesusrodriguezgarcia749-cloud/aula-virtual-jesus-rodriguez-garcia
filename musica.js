// musica.js — Música ambiental real (fondo.mp3) para estudiar, Aula Virtual JRG
// Se agrega con: <script src="musica.js"></script> antes de </body>
// (NO se incluye en actividad.html, que ya tiene sus propios sonidos)

(function () {
  const CLAVE_STORAGE = 'jrg_musica_activa';
  const CLAVE_VOLUMEN = 'jrg_musica_volumen';
  const VOLUMEN_INICIAL = 0.6;

  let sonando = false;
  let temporizadorOcultar = null;

  const volumenGuardado = parseFloat(localStorage.getItem(CLAVE_VOLUMEN));
  const volumenActual = !isNaN(volumenGuardado) ? volumenGuardado : VOLUMEN_INICIAL;

  // --- Elemento de audio real, en bucle ---
  const audio = document.createElement('audio');
  audio.src = 'fondo.mp3';
  audio.loop = true;
  audio.volume = volumenActual;
  audio.preload = 'auto';
  document.body.appendChild(audio);

  // --- Estilos ---
  const estilos = document.createElement('style');
  estilos.textContent = `
    #jrgMusicaBtn {
      position: fixed; right: 66px; z-index: 998;
      width: 42px; height: 42px; border-radius: 50%;
      background: rgba(23,20,15,0.72); backdrop-filter: blur(3px);
      border: none; color: #f2ece1; font-size: 1.15rem;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-family: Georgia, serif;
    }
    #jrgVolumenPanel {
      position: fixed; right: 16px; z-index: 998;
      background: rgba(23,20,15,0.92); backdrop-filter: blur(3px);
      border-radius: 20px; padding: 10px 14px;
      display: flex; align-items: center; gap: 8px;
      font-family: Georgia, serif; color: #f2ece1; font-size: 0.85rem;
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
    }
    #jrgVolumenPanel.visible { opacity: 1; pointer-events: auto; }
    #jrgVolumenSlider { width: 110px; accent-color: #d99a3d; }
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

  // --- Posición dinámica según la altura real del encabezado de la página ---
  function ubicarControles() {
    const header = document.querySelector('header');
    const alturaHeader = header ? header.getBoundingClientRect().bottom : 60;
    const topBoton = Math.round(alturaHeader + 12);
    btn.style.top = topBoton + 'px';
    panelVolumen.style.top = (topBoton + 50) + 'px';
  }
  ubicarControles();
  window.addEventListener('resize', ubicarControles);
  window.addEventListener('load', ubicarControles);

  function actualizarIcono() {
    btn.innerHTML = sonando ? '🔈' : '🔇';
  }

  function mostrarPanelTemporalmente() {
    panelVolumen.classList.add('visible');
    if (temporizadorOcultar) clearTimeout(temporizadorOcultar);
    temporizadorOcultar = setTimeout(() => {
      panelVolumen.classList.remove('visible');
    }, 3000);
  }

  function iniciarMusica() {
    audio.play().then(() => {
      sonando = true;
      actualizarIcono();
      localStorage.setItem(CLAVE_STORAGE, '1');
      mostrarPanelTemporalmente();
    }).catch((err) => {
      console.warn('No se pudo reproducir la música todavía:', err);
    });
  }

  function detenerMusica() {
    audio.pause();
    sonando = false;
    actualizarIcono();
    localStorage.setItem(CLAVE_STORAGE, '0');
    panelVolumen.classList.remove('visible');
    if (temporizadorOcultar) clearTimeout(temporizadorOcultar);
  }

  btn.addEventListener('click', () => {
    if (sonando) {
      detenerMusica();
    } else {
      iniciarMusica();
    }
  });

  // Mientras el usuario toca el control, no se oculta; al soltar, cuenta de nuevo los 3s
  ['input', 'mousedown', 'touchstart'].forEach((evento) => {
    slider.addEventListener(evento, () => {
      panelVolumen.classList.add('visible');
      if (temporizadorOcultar) clearTimeout(temporizadorOcultar);
    });
  });
  ['change', 'mouseup', 'touchend'].forEach((evento) => {
    slider.addEventListener(evento, () => {
      if (temporizadorOcultar) clearTimeout(temporizadorOcultar);
      temporizadorOcultar = setTimeout(() => {
        panelVolumen.classList.remove('visible');
      }, 3000);
    });
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
