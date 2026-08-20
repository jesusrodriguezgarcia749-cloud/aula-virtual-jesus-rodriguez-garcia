// musica.js — Música ambiental suave para estudiar, Aula Virtual JRG
// Se agrega con: <script src="musica.js"></script> antes de </body>
// (NO se incluye en actividad.html, que ya tiene sus propios sonidos)

(function () {
  const CLAVE_STORAGE = 'jrg_musica_activa';

  let audioCtx = null;
  let sonando = false;
  let temporizadorNota = null;

  // Escala pentatónica mayor, registro agudo-medio (agradable, sin disonancias)
  const ESCALA = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5 D5 E5 G5 A5 C6

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

  // --- Una sola nota suave, tipo campanita, con ataque rápido y caída lenta ---
  function reproducirNota() {
    if (!sonando) return;
    const ctx = getAudioCtx();
    const ahora = ctx.currentTime;

    const frecuencia = ESCALA[Math.floor(Math.random() * ESCALA.length)];

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frecuencia;

    // Un segundo oscilador una octava arriba, muy suave, da brillo tipo "campanita"
    const oscArmonico = ctx.createOscillator();
    oscArmonico.type = 'sine';
    oscArmonico.frequency.value = frecuencia * 2;

    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 3500;
    filtro.connect(ctx.destination);

    const gainNota = ctx.createGain();
    gainNota.gain.setValueAtTime(0.0001, ahora);
    gainNota.gain.exponentialRampToValueAtTime(0.16, ahora + 0.04); // ataque rápido
    gainNota.gain.exponentialRampToValueAtTime(0.0001, ahora + 2.8); // caída lenta

    const gainArmonico = ctx.createGain();
    gainArmonico.gain.setValueAtTime(0.0001, ahora);
    gainArmonico.gain.exponentialRampToValueAtTime(0.05, ahora + 0.04);
    gainArmonico.gain.exponentialRampToValueAtTime(0.0001, ahora + 2.2);

    osc.connect(gainNota);
    gainNota.connect(filtro);
    oscArmonico.connect(gainArmonico);
    gainArmonico.connect(filtro);

    osc.start(ahora);
    osc.stop(ahora + 3);
    oscArmonico.start(ahora);
    oscArmonico.stop(ahora + 2.5);
  }

  function programarSiguienteNota() {
    if (!sonando) return;
    // Entre 2 y 4.5 segundos, para que se sienta orgánico, no mecánico
    const espera = 2000 + Math.random() * 2500;
    temporizadorNota = setTimeout(() => {
      reproducirNota();
      programarSiguienteNota();
    }, espera);
  }

  function iniciarMusica() {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    sonando = true;
    actualizarIcono();
    localStorage.setItem(CLAVE_STORAGE, '1');
    reproducirNota();
    programarSiguienteNota();
  }

  function detenerMusica() {
    sonando = false;
    if (temporizadorNota) clearTimeout(temporizadorNota);
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
