import { fetchBranches, fetchOccupiedSeats } from "./fetch.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :host {
      display: block;
      padding: 1rem;
      background: #fff;
      color: #272727;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    .container {
      padding: 4rem;
    }
    .order-summary-container {

    }
    h3 {
      margin-top: 0;
      font-size: 1.2em;
      color: #ffa500; /* Orange to match theme */
    }
    p {
      font-size: 0.9em;
      margin-bottom: 10px;
    }

    .ticket-quantity {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
            .button-group {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      }
    .label {
      background-image: linear-gradient(90deg, #dc6a1a, #eec42a);
      color: transparent;
      background-clip: text;
      font-weight: 350;
      letter-spacing: 0.035em;
      font-size: 1.5rem;
      text-align: left;
    }
      #num-tickets {
        font-size: 1.15rem;
        font-weight: bold;
      }
    .ticket-quantity button {
      padding: 5px 10px;
      background-color: transparent;;
      color: black;
      border: 1px solid #d6d6d6;
      border-radius: 50%;
      cursor: pointer;
      width: 39px;
      height: 39px;
    }
    .selected-seats-list {
      list-style: none;
      padding: 0;
      margin: 10px 0;
      font-size: 0.85em;
    }
    .selected-seats-list li {
      padding: 3px 0;
    }
    .total-price {
      font-weight: bold;
      font-size: 1.1em;
      margin-top: 15px;
    }
    .total-price span {
      color: #ffa500;
    }
    .confirm-button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #4caf50; /* Green for confirm */
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
    }
    .confirm-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .initial-question h2 {
      background-image: linear-gradient(90deg, #dc6a1a, #eec42a);
      color: transparent;
      background-clip: text;
      font-weight: 350;
      letter-spacing: 0.035em;
      margin-bottom: 2rem;
    }
      //seat-category-container
                p {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          .seat-category-container {
            display: flex;
            flex-direction: column;
          }
          .button-item {
            display: flex;
            gap: 10px;
            width: 100%;
            border: 1px solid black;
            border-left: 5.6px solid black;
            border-radius: 5px;
            background-color: transparent;
            font-family: Roboto Condensed, sans-serif;
            cursor: pointer;
            padding: 12px;
            margin-bottom: 1rem;
            color: #272727;
          }
          .legend-heading {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            & .legend-seat-name {
              text-align: left;
              font-size: 1rem;
            }
            & .legend-price {
              font-size: 1rem;
              font-weight: bold;
            }
          }
          .legend-caption {
            font-size: 0.75rem;
            font-weight: 300;
            margin-top: 0.2rem;
            text-align: left;
          }
          .legend-wrapper {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
          }
          .legend-arrow {
          }
          .legend-icon.vip {
          }
          .regular {
            border-left: 5.6px solid black;
            & .legend-icon {
              margin-top: 3px;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              background-image: url("./pics/seat-icons/regular_seat_icon.svg");
            }
          }
          .saver {
            border-left: 5.6px solid #41d282;
            & .legend-icon {
              margin-top: 3px;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              background-image: url("./pics/seat-icons/saver_seat_icon.svg");
            }
          }
          .super-saver {
            border-left: 5.6px solid #c81919;
            & .legend-icon {
              margin-top: 3px;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              background-image: url("./pics/seat-icons/super_saver_seat_icon.svg");
            }
          }
          .vip {
            border-left: 5.6px solid black;
            & .legend-icon {
              margin-top: 3px;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              background-image: url("./pics/seat-icons/vip_seat_icon.svg");
            }
          }

    #selected-seats-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .selected-item {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
      .selected-icon {
    width: 25px;
    height: 25px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
        border: none;
      }
    .selected-text {
      font-size: 0.7rem;
      display: flex;
      flex-direction: column;
    }
    .selected-row-span {
      opacity: 0.5;
    }
      .selected-icon.vip {
        background-image: url("./pics/seat-icons/selected_vip_seat_icon.svg");
      }
      .selected-icon.regular {
        background-image: url("./pics/seat-icons/selected_regular_seat_icon.svg");
      }
      .selected-icon.saver {
        background-image: url("./pics/seat-icons/selected_saver_seat_icon.svg");
      }
      .selected-icon.super-saver {
        background-image: url("./pics/seat-icons/selected_super_saver_seat_icon.svg");
      }
      @media (max-width: 1250px) {
        .container {
          padding: 2rem;
        }
        .order-summary-container {
          margin: 0 1rem;
        }
      }
      @media (max-width: 1028px) {
        .container {
          padding: 1rem;
        }
          .initial-question h2, .label {
            margin-top: 0.5rem;
            margin-bottom: 1rem;
            font-size: 1.3rem;
          }
      }
      @media (max-width: 650px) {
          .initial-question h2, .label {
            font-size: 1.2rem;
          }
      }

  </style>
  <div class="initial-question">
    <h2>СУУДЛЫН ТӨРЛӨӨ СОНГОНО УУ</h2>
    <section class="type-picker-container">
      <div class="seat-category-container"></div>
    </section>
  </div>
  <div class="order-summary-container">

    <div class="ticket-quantity">
      <div class="label">СУУДЛЫН ТОО</div>
      <div class="button-group">
      <button id="decrement-tickets" aria-label="Decrease ticket count">
        ➖
      </button>
      <span id="num-tickets"></span>
      <button id="increment-tickets" aria-label="Increase ticket count">
        ➕
      </button>
      </div>
    </div>

    <div id="selected-seats-list">
    </div>

    <div class="total-price">
      Нийт дүн: <span id="total-price-value">0</span>₮
    </div>

    <button id="confirm-booking" class="confirm-button" disabled>
      Захиалга баталгаажуулах
    </button>
  </div>
`;

export class OrderSteps extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));
    this.orderSummaryContainer = this.container.querySelector(
      ".order-summary-container"
    );
    this.initialQuestionContainer =
      this.container.querySelector(".initial-question");

    this.selectedSeats = [];
    this.showtimeId = null;
    this.movieTitle = "Кино";
    this.moviePoster = null;
    this.seatTypes = [];
    this.showtimeDetailsText = "N/A";
    this.ticketQuantity = 1;
    this.initialSeatPickerRendered = false;

    this.movieTitleDisplay = this.shadowRoot.getElementById(
      "movie-title-display"
    );
    this.showtimeDetailsDisplay =
      this.shadowRoot.getElementById("showtime-details");
    this.numTicketsInput = this.shadowRoot.getElementById("num-tickets");
    this.decrementButton = this.shadowRoot.getElementById("decrement-tickets");
    this.incrementButton = this.shadowRoot.getElementById("increment-tickets");
    this.selectedSeatsList = this.shadowRoot.getElementById(
      "selected-seats-list"
    );
    this.totalPriceValue = this.shadowRoot.getElementById("total-price-value");
    this.confirmButton = this.shadowRoot.getElementById("confirm-booking");
  }

  static get observedAttributes() {
    return ["showtime-id", "movie-poster"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "showtime-id") {
      this.showtimeId = newVal;
    }
    if (attr === "movie-poster") {
      this.moviePoster = newVal;
    }
  }

  connectedCallback() {
    this.seatSelector = this.getRootNode().querySelector("seat-selector");

    if (this.seatSelector) {
      this.seatSelector.addEventListener("seats-updated", (e) =>
        this.handleSeatsUpdated(e.detail)
      );
      this.seatSelector.setAttribute(
        "allowed-seats",
        this.ticketQuantity.toString()
      );
    } else {
      console.error("OrderSteps: seat-selector олдсонгүй.");
    }

    this.orderSummaryContainer.style.display = "none";

    this.decrementButton.addEventListener("click", () =>
      this.updateTicketQuantity(-1)
    );
    this.incrementButton.addEventListener("click", () =>
      this.updateTicketQuantity(1)
    );
    this.confirmButton.addEventListener("click", () =>
      this.handleConfirmBooking()
    );
  }

  renderInitialSeatPicker() {
    this.initialQuestionContainer.style.display = "block";

    const container = this.container.querySelector(".seat-category-container");
    container.innerHTML = "";
    this.seatTypes.forEach((type) => {
      const formattedPrice = type.price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const btn = document.createElement("button");
      btn.classList.add("button-item", type.type);
      btn.innerHTML = `
        <div class="legend-icon"></div>
        <div class="legend-wrapper">
          <div class="legend-text">
            <span class="legend-heading"
              ><span class="legend-seat-name">${type.label} суудал</span
              ><span class="legend-price">${formattedPrice}₮</span></span
            >
            <p class="legend-caption">${type.caption}</p>
          </div>
          <div class="legend-arrow">
            <svg width="30px" height="30px" viewBox="-286 411.9 18 18">
              <path
                fill="none"
                stroke="#bbb"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width=".8"
                d="M-277.5 417l3 3.9-3 3.9"
              ></path>
            </svg>
          </div>
        </div>
      `;
      container.appendChild(btn);
      btn.addEventListener("click", () => {
        this.seatAutoPicker(2, type.type);
        this.renderOrderSummary();
      });
    });
    this.initialSeatPickerRendered = true;
  }

  seatAutoPicker(count, type) {
    const seatSelector = this.getRootNode().querySelector("seat-selector");
    if (seatSelector) {
      this.ticketQuantity = count;
      seatSelector.setAttribute("allowed-seats", count.toString());
      seatSelector.setAttribute("auto-picker", type);
    } else {
      console.error("OrderSteps: seat-selector олдсонгүй.");
    }
  }

  renderOrderSummary() {
    this.initialQuestionContainer.style.display = "none";
    this.orderSummaryContainer.style.display = "block";
    this.numTicketsInput.textContent  = this.ticketQuantity;

    if (this.selectedSeats.length > 0) {
      this.selectedSeatsList.innerHTML = this.selectedSeats
        .map(
          (seat) =>
          `<span class="selected-item">
          <span class="selected-icon ${seat.type}"></span>
          <span class="selected-text">
            <span class="selected-row-span">Эгнээ ${seat.row}</span> <span class="selected-seat-span">Суудал ${seat.column}</span>
          </span>
        </span> 
        `
        )
        .join("");
      this.confirmButton.disabled = false;
    } else {
      this.selectedSeatsList.innerHTML = "<li>Суудал сонгоогүй байна.</li>";
      this.confirmButton.disabled = true;
    }

    const totalPrice = this.calculateTotalPrice();
    this.totalPriceValue.textContent = totalPrice.toLocaleString();
  }

  updateTicketQuantity(change) {
    const newQuantity = this.ticketQuantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.ticketQuantity = newQuantity;
      this.numTicketsInput.textContent = this.ticketQuantity;
      if (this.seatSelector) {
        this.seatSelector.setAttribute(
          "allowed-seats",
          this.ticketQuantity.toString()
        );
      }
    }
  }

  handleSeatsUpdated(detail) {
    this.selectedSeats = detail.selectedSeats || [];
    this.showtimeId = detail.showtimeId;
    this.movieTitle = detail.movieTitle || "Кино";
    this.moviePoster = detail.moviePoster || null;
    this.seatTypes = detail.seatTypes || null;

    if (Array.isArray(detail.seatTypes) && detail.seatTypes.length > 1) {
      this.seatTypes = detail.seatTypes;
      if (this.initialSeatPickerRendered === false) {
        this.renderInitialSeatPicker();
      } else {
        this.renderOrderSummary();
      }
    } else {
      this.renderOrderSummary();
    }
  }

  calculateTotalPrice() {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }

  handleConfirmBooking() {
    if (this.selectedSeats.length === 0) {
      alert("Та эхлээд суудлаа сонгоно уу!");
      return;
    }
    // Here you would proceed with the booking
    console.log("Booking Confirmed (Placeholder):");
    console.log("Showtime ID:", this.showtimeId);
    console.log("Movie:", this.movieTitle);
    console.log("Showtime:", this.showtimeDetailsText);
    console.log("Selected Seats:", this.selectedSeats);
    console.log("Total Price:", this.calculateTotalPrice());
    alert("Захиалга баталгаажлаа! (Дэлгэрэнгүйг console дээр харах)");
    // Potentially navigate to a confirmation page or show a modal
  }

  disconnectedCallback() {
    // Clean up event listeners if seatSelector might be removed/re-added, though less common here
    if (this.seatSelector) {
      this.seatSelector.removeEventListener(
        "seats-updated",
        this.handleSeatsUpdated
      );
    }
  }
}

customElements.define("order-steps", OrderSteps);
