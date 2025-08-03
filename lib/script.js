const i = document.getElementById("intro");
const c = document.getElementById("cardInner");
const t = document.querySelector(".title");
const s = document.getElementById("scrollIndicator");
const d = document.getElementById("code-section");

let h = false;

i.addEventListener("mouseenter", () => h = true);
i.addEventListener("mouseleave", () => {
  h = false;
  c.style.transform = "";
  t.style.transform = "";
});

i.addEventListener("mousemove", e => {
  if (!h) return;

  const r = c.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const x = (e.clientX - cx) / (window.innerWidth / 2);
  const y = (e.clientY - cy) / (window.innerHeight / 2);
  const rx = Math.max(-1, Math.min(1, x));
  const ry = Math.max(-1, Math.min(1, y));

  c.style.transform = `rotateX(${ry * -8}deg) rotateY(${rx * 8}deg)`;
  t.style.transform = `rotateX(${ry * -4}deg) rotateY(${rx * 4}deg) translateX(${rx * 2}px) translateY(${ry * -2}px)`;
});

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const f = Math.min(y / (window.innerHeight * 0.3), 1);

  i.style.opacity = 1 - f;
  i.style.pointerEvents = f < 0.9 ? "auto" : "none";

  d.style.opacity = f;
  d.style.pointerEvents = f > 0.1 ? "auto" : "none";

  s.style.opacity = f > 0.1 ? 0 : 1;
});

function cc() {
  const b = event.target.closest(".copy-button");
  const str = 'loadstring(game:HttpGet("https://raw.githubusercontent.com/hashed-cmd/unexpected-cmd/refs/heads/main/source.lua"))()';

  navigator.clipboard.writeText(str).then(() => {
    b.style.background = "#28a745";
    setTimeout(() => b.style.background = "#21262d", 2000);
  });
}

d.style.opacity = 0;

// Disable known fingerprinting APIs
Object.defineProperty(navigator, 'plugins', { get: () => [] });
Object.defineProperty(navigator, 'languages', { get: () => ['en-US'] });
Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 });
Object.defineProperty(navigator, 'deviceMemory', { get: () => 1 });
Object.defineProperty(navigator, 'webdriver', { get: () => false });

// Spoof screen and timezone
Object.defineProperty(window, 'screen', {
  get: () => ({ width: 1920, height: 1080, availWidth: 1920, availHeight: 1040 })
});
Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
  value: () => ({ timeZone: 'UTC' })
});

// Canvas fingerprinting prevention
const offscreen = document.createElement('canvas');
const ctx = offscreen.getContext('2d');
['toDataURL', 'getImageData', 'toBlob'].forEach(method => {
  if (ctx[method]) {
    ctx[method] = () => ''; // return dummy data
  }
});

// Audio fingerprinting prevention
try {
  const AudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (AudioContext) {
    window.OfflineAudioContext = class extends AudioContext {
      constructor(...args) {
        super(...args);
        this.oncomplete = null;
      }
      startRendering() {
        const dummyBuffer = this.createBuffer(1, 1, 44100);
        const event = { renderedBuffer: dummyBuffer };
        if (typeof this.oncomplete === 'function') {
          this.oncomplete(event);
        }
      }
    };
  }
} catch (e) {}

// WebGL spoofing (return empty strings)
const getParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function(param) {
  // Block vendor-specific info
  if (param === 37445 || param === 37446) return '';
  return getParameter.call(this, param);
};

// Block known fingerprinting scripts
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    m.addedNodes.forEach((n) => {
      if (n.tagName === 'SCRIPT' && n.src.match(/fingerprint|track|analytics/i)) {
        n.parentNode.removeChild(n);
      }
    });
  });
});
observer.observe(document.documentElement, { childList: true, subtree: true });

if ('DeviceMotionEvent' in window) {
  window.DeviceMotionEvent = undefined;
}
if ('DeviceOrientationEvent' in window) {
  window.DeviceOrientationEvent = undefined;
}

navigator.geolocation.getCurrentPosition = function() {
  console.warn('[antiTrack] Geolocation blocked.');
};
navigator.geolocation.watchPosition = function() {
  console.warn('[antiTrack] Geolocation blocked.');
};

navigator.mediaDevices = {
  enumerateDevices: () => Promise.resolve([]),
  getUserMedia: () => Promise.reject(new Error("Camera/mic access blocked"))
};

Object.defineProperty(navigator, 'userAgent', {
  get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
});

Object.defineProperty(document, 'hidden', { get: () => false });
document.addEventListener = new Proxy(document.addEventListener, {
  apply(target, thisArg, args) {
    if (args[0] === 'visibilitychange') return;
    return target.apply(thisArg, args);
  }
});

if (navigator.getBattery) {
  navigator.getBattery = () => Promise.resolve({
    charging: true,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    level: 1,
    addEventListener: () => {},
    removeEventListener: () => {}
  });
}

window.SpeechRecognition = undefined;
window.webkitSpeechRecognition = undefined;
window.speechSynthesis = {
  speak: () => {},
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  getVoices: () => []
};

navigator.mediaDevices.enumerateDevices = () => Promise.resolve([]);

if (window.RTCPeerConnection) {
  const orig = window.RTCPeerConnection;
  window.RTCPeerConnection = function(...args) {
    const pc = new orig(...args);
    pc.createDataChannel = () => null;
    return pc;
  };
}

Object.defineProperty(window, 'screen', {
  get: () => ({
    width: 1920,
    height: 69420,
    availWidth: 1920,
    availHeight: 69400,
    colorDepth: 24,
    pixelDepth: 24
  })
});
