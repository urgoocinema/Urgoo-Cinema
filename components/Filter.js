class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._day_of_week = "all-times";
    this._branch = "";
    this._start_time = "";
  }
  static get observedAttributes() {}
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "day-of-week" && oldValue !== newValue) {
      this._day_of_week = newValue;
      // this.render();
    }
  }
  async render() {
    const dayAtt = this.getAttribute("day-of-week") || this._day_of_week;
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
        .day.active{
          background-color: orange;
        }
        </style>
        <div class="filter-container">
        <select name="branch" id="branch">
            <option value="">Салбар сонгох</option>
            ${branches.branches
              .map(
                (branch) => `
                <option value = "${branch.id}">${branch.name} (${branch.location})</option>
              `
              )
              .join("")}
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
        <div class = "start-time-container">
        <label for="appt">Select a time:</label>
        <input type="time" id="appt" name="appt">
        </div>
    </div>
      `;
      this.shadowRoot
        .querySelector("#branch")
        .addEventListener("change", (e) => {
          this._branch = e.target.value;
          this.setAttribute("branch", e.target.value);
          this.dispatchEvent(
            new CustomEvent("filter-changed", {
              detail: {
                branch: e.target.value,
                dayOfWeek: this._day_of_week,
                startTime: this._start_time,
              },
              bubbles: true,
              composed: true,
            })
          );
        });

      this.shadowRoot.querySelectorAll(".day").forEach((e1) => {
        e1.addEventListener("click", (e) => {
          let day = "";
          if (e.target.classList.contains("active")) {
            e.target.classList.remove("active");
            day = "all-times";
          } else {
            this.shadowRoot
              .querySelectorAll(".day")
              .forEach((dayEl) => dayEl.classList.remove("active"));
            day = e.target.textContent.trim();
            e.target.classList.add("active");
          }

          this._day_of_week = day;
          this.setAttribute("day-of-week", day);
          this.dispatchEvent(
            new CustomEvent("filter-changed", {
              detail: {
                branch: this._branch,
                dayOfWeek: day,
                startTime: this._start_time,
              },
              bubbles: true,
              composed: true,
            })
          );
        });
      });
      this.shadowRoot.querySelector("#appt").addEventListener("change", (e) => {
        this.setAttribute("start-time", e.target.value);
        this._start_time = e.target.value;
        this.dispatchEvent(
          new CustomEvent("filter-changed", {
            detail: {
              branch: this._branch,
              dayOfWeek: this._day_of_week,
              startTime: e.target.value,
            },
            bubbles: true,
            composed: true,
          })
        );
      });
    } catch (error) {
      console.error("Error loading filter:", error);
      this.shadowRoot.innerHTML = `<p>Error loading filter.</p>`;
    }
  }
}
customElements.define("film-filter", Filter);
