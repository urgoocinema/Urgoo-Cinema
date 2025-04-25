export class ContactCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          margin: 1rem;
          padding: 1rem;
          display: inline-block;
          border: 2px solid gray;
          border-radius: 10px;
        }
        h2 {
          text-align: center;
          text-transform: capitalize;
        }
        #avatar {
          width: 5rem;
        }
        slot[name="note"] {
          display: block;
          margin: 1rem;
          color: gray;
        }
      </style>
      <div class="card">
        <h2 id="name"></h2>
        <p id="email"></p>
        <p id="company"></p>
        <img id="avatar">
        <slot name="note">Nickname not set</slot>
        <button>Delete</button>
      </div>
    `;
  }

  static get observedAttributes() {
    return ["id", "name", "email", "company", "img"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "name") {
      this.shadowRoot.querySelector("#name").textContent = newVal;
    }
    if (attr === "email") {
      this.shadowRoot.querySelector("#email").textContent = newVal;
    }
    if (attr === "company") {
      this.shadowRoot.querySelector("#company").textContent = newVal;
    }
    if (attr === "img") {
      this.shadowRoot.querySelector("#avatar").src = newVal;
      this.shadowRoot.querySelector(
        "#avatar"
      ).alt = `Avatar of ${this.getAttribute("name")}`;
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("remove-me", {
          detail: {
            id: this.getAttribute("id"),
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  disconnectedCallback() {}
}

customElements.define("contact-card", ContactCard);
