class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._day_of_week = 'all-times';
  }
  static get observedAttributes() {
    return ['day-of-week', 'branch'];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "day-of-week" && oldValue !== newValue) {
      this._day_of_week = newValue;
      this.render();
    }
  }
  async render() {
    const dayAtt = this.getAttribute('day-of-week') || this._day_of_week;
    if (!dayAtt) {
      this.shadowRoot.innerHTML = `<p>Day of week attribute is missing.</p>`;
      return;
    }
    try {
      const response = await fetch("../data/ongoing/movies-list.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const branchResponse = await fetch("../data/branches/branch-list.json");
      if (!branchResponse.ok) {
        throw new Error(`HTTP error! status: ${branchResponse.status}`);
      }
      const branches = await branchResponse.json();
      const films = await response.json();
      this.shadowRoot.innerHTML = `
        <style>
        .filter-container {
            display: flex;
            justify-content: space-around;
            width:50%;
            gap: 20px;
            margin: clamp(0.5rem, 1rem, 1.5rem) 10rem;
            padding: 1rem 0;
            border-top: 1px solid orange;
        }

        .days-container {
            display: flex;
            flex-direction: row;
            justify-content: start;
            gap: 15px;
            width: 100%;
        }

        .day {
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        }

        .day:hover {
            background-color: orange;
        }
        </style>
        <div class="filter-container">
        <select name="branch" id="branch">
            <option value="">Салбар сонгох</option>
            ${branches.branches.map(branch => `
                <option value = "${branch.id}">${branch.name} (${branch.location})</option>
              `).join('')}
        </select>
        <div class="days-container">
            <div class="day">
                Today
            </div>
            <div class="day">
                Tomorrow
            </div>
            <div class="day">
                Tuesday
            </div>
            <div class="day">
                Wednesday
            </div>
            <div class="day">
                Thursday
            </div>
            <div class="day">
                Friday
            </div>

        </div>
    </div>
      `;

    }
    catch (error) {
      console.error("Error fetching films:", error);
      this.shadowRoot.innerHTML = `<p>Error loading filter.</p>`;
    }

  }
}
customElements.define("film-filter", Filter);