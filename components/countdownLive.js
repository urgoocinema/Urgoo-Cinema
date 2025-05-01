class CountdownLive extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.countdownInterval = null;
    this.animationInterval = null;
  }

  static get observedAttributes() {
    return ['days', 'hours', 'seconds'];
  }

  connectedCallback() {
    this.render();
    this.startCountdown();
    this.injectAnimationStyles();
    this.startAnimation();
  }

  disconnectedCallback() {
    clearInterval(this.countdownInterval);
    clearInterval(this.animationInterval);
  }

  attributeChangedCallback() {
    this.render();
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      let days = parseInt(this.getAttribute('days')) || 0;
      let hours = parseInt(this.getAttribute('hours')) || 0;
      let seconds = parseInt(this.getAttribute('seconds')) || 0;

      if (seconds > 0) {
        seconds--;
      } else if (hours > 0) {
        hours--;
        seconds = 59;
      } else if (days > 0) {
        days--;
        hours = 23;
        seconds = 59;
      }

      this.setAttribute('days', days);
      this.setAttribute('hours', hours);
      this.setAttribute('seconds', seconds);
    }, 1000);
  }

  startAnimation() {
    // Create stars every 4 seconds
    this.animationInterval = setInterval(() => {
      this.createStars();
    }, 800);
  }

  createStars() {
    // Get the host's current position (viewport coordinates)
    const rect = this.getBoundingClientRect();
    // We'll create a random number of stars (5 to 10)
    const starCount = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < starCount; i++) {
      // Create stars in an area that extends a little beyond the container
      const margin = 20;
      const x = rect.left + window.scrollX + Math.random() * (rect.width + margin * 2) - margin;
      const y = rect.top + window.scrollY + Math.random() * (rect.height + margin * 2) - margin;
      this.createStar(x, y);
    }
  }

  createStar(x, y) {
    const star = document.createElement('div');
    // Randomizing star size and animation delay
    const size = Math.random() * 3 + 1; // 3px to 6px
    const delay = Math.random() * 1; // 0 to 1 second
    
    Object.assign(star.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      background: 'white',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9999,
      animation: `sparkle-animation 3s ${delay}s forwards`
    });
    
    // Remove the star after the animation ends
    star.addEventListener('animationend', () => {
      star.remove();
    });
    
    document.body.appendChild(star);
  }

  injectAnimationStyles() {
    // Prevent duplicate stylesheet injection
    if (document.getElementById('star-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'star-animation-styles';
    style.textContent = `
      @keyframes sparkle-animation {
        0% {
          opacity: 0;
          transform: scale(1) rotate(0deg);
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
        }
        50% {
          opacity: 1;
          transform: scale(1.5) rotate(180deg);
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        75% {
          opacity: 0.8;
          transform: scale(1) rotate(270deg);
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        100% {
          opacity: 0;
          transform: scale(0.5) rotate(360deg);
          filter: drop-shadow(0 0 1px rgba(255,255,255,0));
        }
      }
    `;
    document.head.appendChild(style);
  }

  render() {
    const days = this.getAttribute('days') || '0';
    const hours = this.getAttribute('hours') || '0';
    const seconds = this.getAttribute('seconds') || '0';

    this.shadowRoot.innerHTML = `
      <style>
        .countdown {
          position: relative;
          display: flex;
          justify-content: center;
          gap: 20px;
          font-family: Arial, sans-serif;
          font-size: 1.5rem;
          color: #fff;
          background: linear-gradient(45deg, rgb(126, 84, 7), rgb(244, 186, 13));
          padding: 10px 20px;
          border-radius: 10px;
          /* Allow inner stars to be visible even if they slightly exceed */
          overflow: visible;
        }
        .countdown div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .countdown span {
          font-size: 0.8rem;
          color: #ddd;
        }
      </style>
      <div class="countdown">
        <div>
          <div>${days}</div>
          <span>Өдөр</span>
        </div>
        <div>
          <div>${hours}</div>
          <span>Цаг</span>
        </div>
        <div>
          <div>${seconds}</div>
          <span>Секунд</span>
        </div>
      </div>
    `;
  }
}

customElements.define('countdown-live', CountdownLive);