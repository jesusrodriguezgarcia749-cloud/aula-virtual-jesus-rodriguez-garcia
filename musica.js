// musica.js — Música ambiental real (fondo.mp3) para estudiar, Aula Virtual JRG
// Se agrega con: <script src="musica.js"></script> antes de </body>
// (NO se incluye en actividad.html, que ya tiene sus propios sonidos)
//
// VERSIÓN SIMPLIFICADA: sin panel deslizante de volumen. Solo un botón fijo
// abajo a la derecha para encender/apagar la música. El volumen inicia al
// 80% y, si alguien quiere ajustarlo, usa el control físico del celular.

(function () {
  const CLAVE_STORAGE = 'jrg_musica_activa';
  const VOLUMEN_FIJO = 0.8;

  let sonando = false;

  // --- Elemento de audio real, en bucle ---
  const audio = document.createElement('audio');
  audio.src = 'fondo.mp3';
  audio.loop = true;
  audio.volume = VOLUMEN_FIJO;
  audio.preload = 'auto';
  document.body.appendChild(audio);

  // --- Estilos: botón fijo abajo a la derecha, lejos del menú ---
  const estilos = document.createElement('style');
  estilos.textContent = `
    #jrgMusicaBtn {
      position: fixed; right: 16px; bottom: 20px; z-index: 998;
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(23,20,15,0.72); backdrop-filter: blur(3px);
      border: none; color: #f2ece1; font-size: 1.2rem;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-family: Georgia, serif;
    }
  `;
  document.head.appendChild(estilos);

  const btn = document.createElement('button');
  btn.id = 'jrgMusicaBtn';
  btn.setAttribute('aria-label', 'Activar o pausar música');
  document.body.appendChild(btn);

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
    } else {
      iniciarMusica();
    }
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
