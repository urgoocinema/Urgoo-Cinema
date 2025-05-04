import { fetchBranches, fetchOccupiedSeats } from "./fetch.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .seat-wrapper {
            margin: 10rem auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 500px;
            width: 1000px;
            background-color: antiquewhite;
        }
        .row {
            display: flex;
            justify-content: center;
            margin-bottom: 3px;
        }
        .seat {
            margin: 3px;
            width: 22px;
            height: 22px;
            border: 2px green solid;
            border-radius: 3px 3px 8px 8px;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .hidden {
            visibility: hidden;
        }
    </style>
    <section class="seat-wrapper">
    </section>
`;

export class SeatSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.parent = document.createElement("div");
    this.parent.classList.add("container");
    
    this.shadowRoot.appendChild(this.parent);
    this.parent.appendChild(template.content.cloneNode(true));
    this.container = this.parent.querySelector(".seat-wrapper");

    this.layoutData = [];
    this.occupiedData = [];

    this.seatLayout = [];
    this.occupiedSeats = [];

    this.movieTitle = null;
    this.movieId = null;
    this.branchId = null;
    this.hallId = null;
    this.day = null;
    this.hour = null;
  }

  static get observedAttributes() {
    return ["movie_title", "movie_id", "branch_id", "hall_id", "day", "hour"]
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "movie_title") 
      this.movieTitle = newVal;
    if (attr === "movie_id") 
      this.movieId = Number(newVal);
    if (attr === "branch_id") 
      this.branchId = Number(newVal);
    if (attr === "hall_id") 
      this.hallId = Number(newVal);
    if (attr === "day")
      this.day = newVal;
    if (attr === "hour") 
      this.hour = newVal;
  }

  async connectedCallback() {  
    await this.helperFetch();
    this.renderSeats();
  }

  renderSeats() {
    this.container.innerHTML = "";

    const header = document.createElement("h4");
    header.textContent = `${this.movieTitle} • Өргөө ${this.branchId} • Танхим ${this.hallId} • ${this.day} • ${this.hour}`;
    header.style.color ="black";
    header.style.textAlign = "center";
    this.container.appendChild(header);

    const formattedDay = this.day.replace(/-/g, "");
    const formattedHour = this.hour.replace(":", "");

    const uniqueId = `${this.movieId}_${this.branchId}_${this.hallId}_${formattedDay}_${formattedHour}`;
    console.log(uniqueId);

    this.seatLayout = this.layoutData.find(branch => branch.id === this.branchId).halls.find(hall => hall.id === this.hallId).layout;
    this.occupiedSeats = this.occupiedData?.find(show => show.showtimeId === uniqueId)?.occupiedSeats;
  console.log(this.seatLayout, this.occupiedSeats);
    for(let i=0; i < this.seatLayout.rows; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      row.setAttribute("data-row-id", i+1);

      for(let j=0; j < this.seatLayout.columns; j++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.setAttribute("data-column-id", j+1);
        row.appendChild(seat);
      }
      this.container.appendChild(row);
    }

    for(let i=0; i<this.seatLayout.unavailable_seats.length; i++) {
      const unavailableSeat = this.seatLayout.unavailable_seats[i];
      console.log("Unavailable seat: ", unavailableSeat);
      const row = this.container.querySelector(`[data-row-id="${unavailableSeat.row}"]`);
      const seat = row.querySelector(`[data-column-id="${unavailableSeat.column}"]`);
      seat.classList.add("hidden");
    }
  }

  async helperFetch() {
    const layoutData = await fetchBranches();
    this.layoutData = layoutData.branches;
    const occupiedData = await fetchOccupiedSeats();
    this.occupiedData = occupiedData.OccupiedSeats;
  }

  disconnectedCallback() {}
}

customElements.define("seat-selector", SeatSelector);
