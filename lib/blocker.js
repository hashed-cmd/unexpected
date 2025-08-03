(() => {
  // blocks fingerprint, embrace privacy! <3
  Object.defineProperty(navigator,'plugins',{get:()=>[]});
  Object.defineProperty(navigator,'languages',{get:()=>['en-US']});
  Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>2});
  Object.defineProperty(navigator,'deviceMemory',{get:()=>1});
  Object.defineProperty(navigator,'webdriver',{get:()=>false});
  Object.defineProperty(navigator,'userAgent',{get:()=> 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0'});

  Object.defineProperty(window,'screen',{get:()=>({width:1920,height:69420,availWidth:1920,availHeight:69400,colorDepth:24,pixelDepth:24})});
  Object.defineProperty(Intl.DateTimeFormat.prototype,'resolvedOptions',{value:()=>({timeZone:'UTC'})});

  let canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  ['toDataURL','getImageData','toBlob'].forEach(f => { if (ctx[f]) ctx[f] = () => ''; });

  try {
    let Audio = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (Audio) {
      window.OfflineAudioContext = class extends Audio {
        constructor(...args) { super(...args); this.oncomplete = null; }
        startRendering() {
          let buffer = this.createBuffer(1, 1, 44100), e = { renderedBuffer: buffer };
          typeof this.oncomplete === 'function' && this.oncomplete(e);
        }
      };
    }
  } catch (e) {}

  let originalGL = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(p) {
    if (p === 37445 || p === 37446) return '';
    return originalGL.call(this, p);
  };

  let observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.tagName === 'SCRIPT' && /fingerprint|track|analytics|heatmap|mouseflow/i.test(n.src)) n.remove();
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  'DeviceMotionEvent' in window && (window.DeviceMotionEvent = undefined);
  'DeviceOrientationEvent' in window && (window.DeviceOrientationEvent = undefined);

  navigator.geolocation.getCurrentPosition = () => console.warn('[antiTrack] geo blocked');
  navigator.geolocation.watchPosition = () => console.warn('[antiTrack] geo blocked');

  navigator.mediaDevices = {
    enumerateDevices: () => Promise.resolve([]),
    getUserMedia: () => Promise.reject(new Error('mic/cam blocked'))
  };

  Object.defineProperty(document, 'hidden', { get: () => false });
  document.addEventListener = new Proxy(document.addEventListener, {
    apply(target, thisArg, args) {
      if (args[0] === 'visibilitychange') return;
      return target.apply(thisArg, args);
    }
  });

  navigator.getBattery && (navigator.getBattery = () => Promise.resolve({
    charging: true, chargingTime: Infinity, dischargingTime: Infinity, level: 1,
    addEventListener: () => {}, removeEventListener: () => {}
  }));

  window.SpeechRecognition = undefined;
  window.webkitSpeechRecognition = undefined;
  window.speechSynthesis = {
    speak: () => {}, cancel: () => {}, pause: () => {}, resume: () => {}, getVoices: () => []
  };

  navigator.mediaDevices.enumerateDevices = () => Promise.resolve([]);

  if (window.RTCPeerConnection) {
    let OriginalRTCPeer = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
      let inst = new OriginalRTCPeer(...args);
      inst.createDataChannel = () => null;
      return inst;
    };
  }

  performance.now = () => 42;
  Object.defineProperty(navigator,'connection',{get:()=>({effectiveType:'4g',downlink:10,rtt:50})});
  Object.defineProperty(window, 'outerWidth', { get: () => 1920 });
  Object.defineProperty(window, 'outerHeight', { get: () => 70000 });
})();
