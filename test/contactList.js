import { ContactCard } from "./contactCard.js";

export class ContactList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.container = document.createElement("div");
    this.container.id = "list";
    this.clearBtn = document.createElement("button");
    this.clearBtn.innerText = "Delete All";
    this.clearBtn.style.display = "block";
    this.clearBtn.style.margin = "0 auto";
    this.container.appendChild(this.clearBtn);
    this.shadowRoot.appendChild(this.container);
  }

  static get observedAttributes() {}

  attributeChangedCallback(attr, oldVal, newVal) {}

  connectedCallback() {
    this.render();
    this.addEventListener("remove-me", (e) => {
      this.container
        .querySelector(`contact-card[id="${e.detail.id}"]`)
        .remove();
    });
    this.clearBtn.addEventListener("click", () => {
      this.container
        .querySelectorAll("contact-card")
        .forEach((contact) => contact.remove());
    });
  }

  disconnectedCallback() {}

  async render() {
    for (let i = 0; i < 6; i++) {
      const data = await this.fetchData(this.getRandomID(1, 10));

      const contact = document.createElement("contact-card");
      contact.setAttribute("id", data.id);
      contact.setAttribute("name", data.name);
      contact.setAttribute("email", data.email);
      contact.setAttribute("company", data.company.name);
      contact.setAttribute(
        "img",
        `https://avatar.iran.liara.run/public/${this.getRandomID(1, 100)}.png`
      );
      this.container.appendChild(contact);

      const nickname = document.createElement("span");
      nickname.setAttribute("slot", "note");
      nickname.textContent = `Acquaintance from ${data.address.city}`;
      contact.appendChild(nickname);
    }
  }

  async fetchData(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    return await res.json();
  }

  getRandomID(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

customElements.define("contact-list", ContactList);
