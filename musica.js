// musica.js — Música ambiental suave para estudiar, Aula Virtual JRG
// Se agrega con: <script src="musica.js"></script> antes de </body>
// (NO se incluye en actividad.html, que ya tiene sus propios sonidos)

(function () {
  const CLAVE_STORAGE = 'jrg_musica_activa';

  let audioCtx = null;
  let nodosActivos = [];
  let sonando = false;

  // --- Botón flotante ---
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
  `;
  document.head.appendChild(estilos);

  const btn = document.createElement('button');
  btn.id = 'jrgMusicaBtn';
  btn.setAttribute('aria-label', 'Activar o pausar música');
  document.body.appendChild(btn);

  function actualizarIcono() {
    btn.innerHTML = sonando ? '🔈' : '🔇';
  }

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  // --- Pad ambiental: acorde suave con "respiración" lenta, en bucle indefinido ---
  function iniciarMusica() {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 900;
    filtro.connect(ctx.destination);

    const gainMaestro = ctx.createGain();
    gainMaestro.gain.setValueAtTime(0.0001, ctx.currentTime);
    gainMaestro.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2.5);
    gainMaestro.connect(filtro);

    // Acorde suave (Do mayor, octava baja) con ligero desafine para calidez
    const frecuencias = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4

    frecuencias.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.004);

      const gainOsc = ctx.createGain();
      gainOsc.gain.value = 0.5;

      // LFO lento para dar sensación de "respiración"
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.01;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(gainOsc.gain);

      osc.connect(gainOsc);
      gainOsc.connect(gainMaestro);

      osc.start();
      lfo.start();

      nodosActivos.push(osc, lfo, gainOsc, lfoGain, gainMaestro, filtro);
    });

    sonando = true;
    actualizarIcono();
    localStorage.setItem(CLAVE_STORAGE, '1');
  }

  function detenerMusica() {
    const nodosAntiguos = nodosActivos;
    const ctx = audioCtx;
    if (ctx) {
      nodosAntiguos.forEach((nodo) => {
        if (nodo.gain) {
          try {
            nodo.gain.cancelScheduledValues(ctx.currentTime);
            nodo.gain.setValueAtTime(nodo.gain.value, ctx.currentTime);
            nodo.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
          } catch (e) {}
        }
      });
    }
    setTimeout(() => {
      nodosAntiguos.forEach((nodo) => {
        try {
          if (nodo.stop) nodo.stop();
          nodo.disconnect();
        } catch (e) {}
      });
    }, 700);
    nodosActivos = [];
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
