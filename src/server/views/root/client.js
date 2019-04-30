const DOMURL = window.URL || window.webkitURL || window;
const particles = [];
const particleCount = 20;
const halfPi = Math.PI / 180;
const playerWidth = 560;
const playerHeight = 315;
let playing = false;
let canvas, ctx, pS;

const cakeIcon = new Image();
const cakeURL = 'http://localhost:4000/icons/v1.0.0/cake.svg';
const smashedCakeSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <path fill="#fff" d="M45.25 47.625c0-1.035-1.315-1.875-2.938-1.875-.151 0-.296.015-.441.028 0-.01.003-.02.003-.029 0-.967-.729-1.751-1.626-1.751-.584 0-1.091.334-1.378.831-1.321-.57-2.867-.788-4.245-.593-.758.107-1.473.183-2.151.235.052-.141.089-.297.089-.474 0-.516-.252-.934-.563-.934s-.563.418-.563.934c0 .203.047.381.113.534-3.593.182-5.801-.296-5.801-.296l1.622-3.089-2.49-1.55s-2.026 2.402-2.892 3.277c-.694.701-2.604 1.643-6.232 1.924.073-.212.117-.44.117-.681 0-1.07-.784-1.938-1.75-1.938s-1.75.867-1.75 1.938c0 .269.049.523.138.756-2.544-.024-5.173.482-6.136 2.325-.107-.123-.238-.206-.387-.206-.345 0-.625.395-.625.882H45.21c.018-.081.04-.162.04-.248zM4.58 47.875c.018-.083.045-.161.045-.25 0-.621-.448-1.125-1-1.125s-1 .504-1 1.125c0 .089.027.167.045.25h1.91z"/>
  </svg>
`;
const splatIcon = new Image();
const splatSVG = new Blob([smashedCakeSVG], { type: 'image/svg+xml' });
const splatURL = DOMURL.createObjectURL(splatSVG);

function onYouTubeIframeAPIReady() {
  let partying = false;
  let timeCheck;
  
  const enableParty = () => {
    partying = true;
    document.body.classList.add('party-time');
    pS.start();
  };
  
  const disableParty = () => {
    clearInterval(timeCheck);
    partying = false;
    document.body.classList.remove('party-time');
    pS.stop();
  };
  
  const handleTimeChange = () => {
    const time = player.getCurrentTime();
    
    if(time >= 99.5){
      if(!partying) enableParty();
      else if(time >= 108) disableParty();
    }
  };
  
  const player = new YT.Player('player', {
    width: playerWidth,
    height: playerHeight,
    videoId: 'gAYL5H46QnQ',
    playerVars: { start: 93 },
    events: {
      onStateChange: (ev) => {
        switch(ev.data){
          case YT.PlayerState.PLAYING:
            clearInterval(timeCheck);
            handleTimeChange();
            timeCheck = setInterval(handleTimeChange, 10);
            break;
          
          case YT.PlayerState.PAUSED:
            disableParty();
            break;
        }
      }
    }
  });
}

const random = (min, max) => Math.floor(Math.random() * max) + min;

function getRandomColor() {
  let r = 0, g = 0, b = 0;
  while (r < 100 && g < 100 && b < 100){
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

class Particle {
  static spawn(inst) {
    const { xMin, xMax, yMin, yMax } = inst.bounds();
    inst.x = random(xMin, xMax);
    inst.y = random(yMin, yMax);
    inst.vx = 4 * Math.random() - 2;
    inst.gravity = random(1, -6);
    inst.rotation = random(1, 360);
    inst.opacity = +((100 * Math.random()) / 100).toFixed(2);
    inst.color = getRandomColor();
    inst.splat = false;
  }
  
  constructor({ bounds }) {
    this.bounds = bounds;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = cakeIcon.width;
    this._canvas.height = cakeIcon.height;
    
    Particle.spawn(this);
    this.drawImg();
  }
  
  drawImg() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.save();
    this._ctx.translate(this._canvas.width/2, this._canvas.height/2);
    this._ctx.rotate( this.rotation * halfPi );
    this._ctx.drawImage(cakeIcon, -(this._canvas.width/2), -(this._canvas.height/2));
    this._ctx.translate(-(this._canvas.width/2), -(this._canvas.height/2));
    this._ctx.globalAlpha = this.opacity;
    this._ctx.globalCompositeOperation = 'source-atop';
    this._ctx.fillStyle = this.color;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }
  
  draw() {
    this.drawImg();
    ctx.drawImage(this._canvas, this.x, this.y);
  }
  
  update() {
    const inc = 5;
    
    this.x += this.vx;
    this.y += this.gravity;
    this.rotation = ((this.rotation + inc) > 360) ? 0 : this.rotation + inc;

    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y <= canvas.height - this._canvas.height) this.gravity += 0.25;
    else this.splat = true;
  }
  
  reset() {
    Particle.spawn(this);
  }
}

const loadIcons = new Promise((res, rej) => {
  let loaded = 0;
  const loadHandler = (url) => () => { 
    DOMURL.revokeObjectURL(url);
    loaded += 1;
    if(loaded === 2) res();
  };
  cakeIcon.onload = loadHandler(cakeURL);
  splatIcon.onload = loadHandler(splatURL);
  
  cakeIcon.src = cakeURL;
  splatIcon.src = splatURL;
});

const handleResize = () => {
  let resizeDebounce;
  
  return () => {
    pS.stop();
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pS.start();
    }, 200);
  };
};

class ParticleSystem {
  constructor({
    Particle,
    count,
    bounds,
  }) {
    this.particles = [];
    this.splatted = [];
    this.Particle = Particle;
    this.emitting = false;
    this.count = count;
    this.bounds = bounds;
    
    this.emit = this.emit.bind(this);
    
    this.build();
  }
  
  build() {
    for(let i=0; i<this.count; i++){
      this.particles.push(new this.Particle({ bounds: this.bounds }));
    }
  }
  
  start() {
    this.emitting = true;
    this.emit();
  }
  
  stop() {
    this.emitting = false;
  }
  
  emit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i=0; i<this.particles.length; i++) {
      const particle = this.particles[i];
      
      if(!particle.splat){
        particle.update();
        particle.draw();
      }
      else {
        const splat = {
          canvas: document.createElement('canvas'),
          scale: random(1, 10),
          x: particle.x,
          y: particle.y,
        };
        const factor = 1.5;
        const width = splatIcon.width * factor;
        const height = splatIcon.height * factor;
        splat.ctx = splat.canvas.getContext('2d');
        splat.canvas.width = width;
        splat.canvas.height = height;
        splat.ctx.scale(factor, factor);
        splat.ctx.drawImage(splatIcon, 0, 0);
        splat.ctx.globalAlpha = particle.opacity;
        splat.ctx.globalCompositeOperation = 'source-atop';
        splat.ctx.fillStyle = particle.color;
        splat.ctx.fillRect(0, 0, width, height);
        
        this.splatted.push(splat);
        
        // limit count to save on memory
        if(this.splatted.length > 100) this.splatted.shift();
        
        if(this.emitting) particle.reset();
      }
    }
    
    for(let i=0; i<this.splatted.length; i++){
      const splat = this.splatted[i];
      
      ctx.drawImage(splat.canvas, splat.x, splat.y - splatIcon.height + 10);
    }
    
    if(
      this.emitting 
      || !this.emitting && this.splatted.length !== this.particles.length
    ) requestAnimationFrame(this.emit);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  
  loadIcons.then(() => {
    pS = new ParticleSystem({
      Particle,
      count: 20,
      bounds: () => ({
        xMin: canvas.width / 2 - playerWidth / 2,
        xMax: playerWidth,
        yMin: canvas.height / 2 - playerHeight / 2,
        yMax: playerHeight,
      }),
    });
  });
  
  window.addEventListener('resize', handleResize());
});