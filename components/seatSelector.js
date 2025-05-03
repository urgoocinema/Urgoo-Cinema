const template = document.createElement("template");
template.innerHTML = `
  <style>
    :root {
      --primary-color: #ffa500;
      --secondary-color: #ffb733;
      --text-color: white;
      --bg-color: rgb(22, 22, 22);
      --seat-available: #444;
      --seat-selected: var(--primary-color);
      --seat-occupied: #777;
      --seat-unavailable: #2c2c2c;
      --seat-hover: #666;
      --screen-glow: rgba(255, 255, 255, 0.15);
    }
    
    .container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      color: var(--text-color);
      font-family: Arial, sans-serif;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1rem;
    }
    
    .movie-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .movie-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }
    
    .movie-info {
      display: flex;
      gap: 1rem;
      color: #aaa;
      font-size: 0.9rem;
    }
    
    .cinema-hall {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: auto;
      position: relative;
      padding: 2rem 0;
    }
    
    .screen-container {
      position: relative;
      width: 80%;
      margin-bottom: 3rem;
    }
    
    .screen {
      height: 15px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.5));
      border-radius: 50% 50% 0 0 / 100% 100% 0 0;
      box-shadow: 0 0 30px var(--screen-glow), 0 0 60px var(--screen-glow);
      transform: perspective(200px) rotateX(-40deg);
      margin-bottom: 3rem;
    }
    
    .screen-shadow {
      position: absolute;
      top: 15px;
      left: 0;
      right: 0;
      height: 80px;
      background: radial-gradient(ellipse at center, var(--screen-glow), transparent 70%);
      border-radius: 50% / 30%;
      z-index: -1;
      opacity: 0.4;
    }
    
    .screen-label {
      position: absolute;
      bottom: -25px;
      left: 0;
      right: 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.8rem;
      text-transform: uppercase;
    }
    
    .seats-container {
      display: grid;
      gap: 0.5rem;
      padding: 1rem;
    }
    
    .row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .row-label {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      color: #888;
    }
    
    .seat {
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 5px 5px 0 0;
      background-color: var(--seat-available);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    
    .seat:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0 0 2px 2px;
    }
    
    .seat:hover {
      background-color: var(--seat-hover);
      transform: translateY(-2px);
    }
    
    .seat.selected {
      background-color: var(--seat-selected);
      color: black;
      transform: translateY(-2px);
    }
    
    .seat.occupied {
      background-color: var(--seat-occupied);
      cursor: not-allowed;
    }
    
    .seat.unavailable {
      background-color: var(--seat-unavailable);
      cursor: not-allowed;
      opacity: 0.5;
    }
    
    .aisle {
      width: 1rem;
    }
    
    .legend {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #bbb;
    }
    
    .legend-color {
      width: 1rem;
      height: 1rem;
      border-radius: 3px;
    }
    
    .legend-available {
      background-color: var(--seat-available);
    }
    
    .legend-selected {
      background-color: var(--seat-selected);
    }
    
    .legend-occupied {
      background-color: var(--seat-occupied);
    }
    
    .legend-unavailable {
      background-color: var(--seat-unavailable);
      opacity: 0.5;
    }
    
    .selection-summary {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .summary-title {
      font-weight: bold;
      font-size: 1.1rem;
      color: var(--primary-color);
    }
    
    .selected-seats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
    
    .selected-seat-tag {
      background: rgba(255,255,255,0.1);
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    
    .remove-seat {
      cursor: pointer;
      color: var(--primary-color);
      font-size: 1.2rem;
      line-height: 1;
    }
    
    .price-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
    }
    
    .total-price {
      font-weight: bold;
      color: var(--primary-color);
      font-size: 1.1rem;
    }
    
    .proceed-btn {
      background: var(--primary-color);
      border: none;
      padding: 0.8rem;
      border-radius: 4px;
      color: black;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
    }
    
    .proceed-btn:hover, .proceed-btn:focus {
      background: var(--secondary-color);
      transform: translateY(-2px);
    }
    
    .proceed-btn:disabled {
      background: #555;
      cursor: not-allowed;
      transform: none;
      opacity: 0.7;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      
      .screen-container {
        width: 95%;
      }
      
      .seat {
        width: 1.5rem;
        height: 1.5rem;
        font-size: 0.6rem;
      }
      
      .row-label {
        width: 1.2rem;
        height: 1.2rem;
        font-size: 0.7rem;
      }
      
      .aisle {
        width: 0.8rem;
      }
    }
    
    @media (max-width: 480px) {
      .seat {
        width: 1.3rem;
        height: 1.3rem;
        font-size: 0.5rem;
      }
      
      .legend {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  </style>
  
  <div class="container">
    <div class="header">
      <div class="movie-details">
        <h2 class="movie-title">Loading...</h2>
        <div class="movie-info">
          <span class="branch"></span>
          <span class="date"></span>
          <span class="time"></span>
        </div>
      </div>
    </div>
    
    <div class="cinema-hall">
      <div class="screen-container">
        <div class="screen"></div>
        <div class="screen-shadow"></div>
        <div class="screen-label">Screen</div>
      </div>
      
      <div class="seats-container">
        <!-- Seats will be rendered here -->
        Loading seats...
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color legend-available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-selected"></div>
          <span>Selected</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-occupied"></div>
          <span>Occupied</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-unavailable"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
    
    <div class="selection-summary">
      <div class="summary-title">Selected Seats</div>
      <div class="selected-seats">
        <div class="no-selection">No seats selected</div>
      </div>
      <div class="price-summary">
        <div class="price-row">
          <span>Regular Price (x<span class="ticket-count">0</span>)</span>
          <span class="regular-price">0 MNT</span>
        </div>
        <div class="price-row total-price">
          <span>Total</span>
          <span class="total-amount">0 MNT</span>
        </div>
      </div>
      <button class="proceed-btn" disabled>Proceed to Booking</button>
    </div>
  </div>
`;

export class SeatSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.selectedSeats = [];
    this.seatData = null;
    this.movieData = null;
    
    // Constants
    this.SEAT_PRICE = 17000;  // Regular seat price in MNT
  }

  static get observedAttributes() {
    return ["movie_id", "branch", "day", "hour"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.resetSelection();
      
      // Only fetch data if we have all required attributes
      if (
        this.getAttribute("movie_id") &&
        this.getAttribute("branch") &&
        this.getAttribute("day") &&
        this.getAttribute("hour")
      ) {
        this.fetchData();
      }
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.seats-container').addEventListener('click', this.handleSeatClick.bind(this));
    this.shadowRoot.querySelector('.selected-seats').addEventListener('click', this.handleRemoveSeat.bind(this));
    this.shadowRoot.querySelector('.proceed-btn').addEventListener('click', this.handleProceed.bind(this));
  }

  async fetchData() {
    try {
      const movieId = this.getAttribute("movie_id");
      const branch = this.getAttribute("branch");
      const day = this.getAttribute("day");
      const hour = this.getAttribute("hour");
      
      // First fetch the movie details
      const movieResponse = await fetch(`./data/movies-list.json`);
      const movieData = await movieResponse.json();
      
      this.movieData = movieData.movies.find(movie => movie.id.toString() === movieId);
      if (!this.movieData) throw new Error("Movie not found");
  
      // Update movie details in the UI
      this.updateMovieDetails();
      
      // Now fetch the seat data from the branch-specific file
      try {
        const seatResponse = await fetch(`./data/seats/${branch}.json`);
        this.seatData = await seatResponse.json();
        this.renderSeats();
      } catch (seatError) {
        console.error("Error fetching seat data:", seatError);
        // Fall back to generated data if JSON file isn't available
        this.seatData = this.generateSampleSeatData(branch, day, hour);
        this.renderSeats();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      this.showError("Failed to load seating data. Please try again.");
    }
  }

  generateSampleSeatData(branch, day, hour) {
    // Create a sample seating arrangement
    // In a real app, this would come from your backend
    const rows = 8;
    const seatsPerHalf = 6;
    const totalSeats = rows * seatsPerHalf * 2;
    
    // Create a layout with an aisle in the middle
    const layout = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      const rowChar = String.fromCharCode(65 + row); // A, B, C, etc.
      
      for (let seat = 0; seat < seatsPerHalf * 2; seat++) {
        // Add an aisle in the middle
        if (seat === seatsPerHalf) {
          rowSeats.push({ type: "aisle" });
        }
        
        // Generate seat status - 10% occupied, 5% unavailable
        const seatNum = seat < seatsPerHalf ? seat + 1 : seat;
        const seatId = `${rowChar}${seatNum}`;
        const status = this.getSeatStatus();
        
        rowSeats.push({
          id: seatId,
          row: rowChar,
          number: seatNum,
          status: status
        });
      }
      
      layout.push(rowSeats);
    }
    
    return {
      hall: `Hall ${branch.substring(6)}`, // Extract hall number from branch name
      layout: layout,
      totalSeats: totalSeats
    };
  }

  getSeatStatus() {
    // Generate random seat status for demo
    const rand = Math.random();
    if (rand < 0.1) return "occupied";
    if (rand < 0.15) return "unavailable";
    return "available";
  }

  updateMovieDetails() {
    if (!this.movieData) return;
    
    const title = this.shadowRoot.querySelector(".movie-title");
    const branch = this.shadowRoot.querySelector(".branch");
    const date = this.shadowRoot.querySelector(".date");
    const time = this.shadowRoot.querySelector(".time");
    
    title.textContent = this.movieData.title;
    
    // Parse branch name from attribute (e.g., "branch-1" → "Өргөө 1")
    const branchName = this.getBranchName(this.getAttribute("branch"));
    branch.textContent = branchName;
    
    // Format date
    const dayObj = new Date(this.getAttribute("day"));
    const formattedDate = dayObj.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    date.textContent = formattedDate;
    
    // Display hour
    time.textContent = this.getAttribute("hour");
  }

  getBranchName(branchId) {
    const branchMap = {
      "branch-1": "Өргөө 1 (Хороолол)",
      "branch-2": "Өргөө 2 (IT Парк)",
      "branch-3": "Өргөө 3 (IMAX Шангри-Ла)",
      "branch-4": "Өргөө 4 (Дархан хот)"
    };
    
    return branchMap[branchId] || branchId;
  }

  renderSeats() {
    if (!this.seatData) return;
    
    const seatsContainer = this.shadowRoot.querySelector(".seats-container");
    seatsContainer.innerHTML = "";
    
    // Check if we have the expected data structure
    if (Array.isArray(this.seatData.layout)) {
      // Process the row-based layout from our JSON files
      this.seatData.layout.forEach((rowData, rowIndex) => {
        const row = document.createElement("div");
        row.classList.add("row");
        
        // Add row label (A, B, C, etc.)
        const rowLabel = document.createElement("div");
        rowLabel.classList.add("row-label");
        
        // If the row has seat objects with row property, use that
        // Otherwise fall back to index-based labeling
        const rowChar = rowData.length > 0 && rowData[0].row 
          ? rowData[0].row 
          : String.fromCharCode(65 + rowIndex);
          
        rowLabel.textContent = rowChar;
        row.appendChild(rowLabel);
        
        // Add each seat in the row
        rowData.forEach(seat => {
          if (seat.type === "aisle") {
            const aisle = document.createElement("div");
            aisle.classList.add("aisle");
            row.appendChild(aisle);
          } else {
            const seatElement = document.createElement("div");
            seatElement.classList.add("seat", seat.status);
            seatElement.dataset.id = seat.id;
            seatElement.dataset.row = seat.row;
            seatElement.dataset.number = seat.number;
            seatElement.textContent = seat.number;
            row.appendChild(seatElement);
          }
        });
        
        seatsContainer.appendChild(row);
      });
      
      // Add aisle between rows if needed (for larger theaters)
      if (this.seatData.layout.length > 5) {
        // Insert an aisle after the 3rd row
        const aisleRow = document.createElement("div");
        aisleRow.classList.add("row", "row-aisle");
        aisleRow.style.height = "1rem";
        
        // Insert after 3rd row (index 2)
        const rowsContainer = seatsContainer;
        if (rowsContainer.children.length > 3) {
          rowsContainer.insertBefore(aisleRow, rowsContainer.children[3]);
        }
      }
    } else {
      // Handle unexpected data format
      this.showError("Invalid seat layout data received.");
    }
  }

  handleSeatClick(event) {
    const seat = event.target.closest('.seat');
    if (!seat) return;
    
    if (seat.classList.contains('occupied') || seat.classList.contains('unavailable')) {
      return; // Can't select these seats
    }
    
    if (seat.classList.contains('selected')) {
      // Deselect seat
      seat.classList.remove('selected');
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.dataset.id);
    } else {
      // Select seat
      seat.classList.add('selected');
      this.selectedSeats.push({
        id: seat.dataset.id,
        row: seat.dataset.row,
        number: seat.dataset.number
      });
    }
    
    this.updateSummary();
  }

  handleRemoveSeat(event) {
    const removeBtn = event.target.closest('.remove-seat');
    if (!removeBtn) return;
    
    const seatId = removeBtn.dataset.id;
    
    // Remove from selectedSeats array
    this.selectedSeats = this.selectedSeats.filter(s => s.id !== seatId);
    
    // Remove selected class from the seat
    const seat = this.shadowRoot.querySelector(`.seat[data-id="${seatId}"]`);
    if (seat) seat.classList.remove('selected');
    
    this.updateSummary();
  }

  updateSummary() {
    const selectedSeatsEl = this.shadowRoot.querySelector('.selected-seats');
    const ticketCountEl = this.shadowRoot.querySelector('.ticket-count');
    const regularPriceEl = this.shadowRoot.querySelector('.regular-price');
    const totalAmountEl = this.shadowRoot.querySelector('.total-amount');
    const proceedBtn = this.shadowRoot.querySelector('.proceed-btn');
    
    if (this.selectedSeats.length === 0) {
      selectedSeatsEl.innerHTML = '<div class="no-selection">No seats selected</div>';
      proceedBtn.disabled = true;
    } else {
      // Generate seat tags
      selectedSeatsEl.innerHTML = this.selectedSeats
        .sort((a, b) => a.id.localeCompare(b.id)) // Sort by seat ID
        .map(seat => `
          <div class="selected-seat-tag">
            ${seat.id}
            <span class="remove-seat" data-id="${seat.id}">&times;</span>
          </div>
        `)
        .join("");
      proceedBtn.disabled = false;
    }
    
    // Update counts and prices
    const totalAmount = this.SEAT_PRICE * this.selectedSeats.length;
    
    ticketCountEl.textContent = this.selectedSeats.length;
    regularPriceEl.textContent = `${this.formatPrice(this.SEAT_PRICE * this.selectedSeats.length)} MNT`;
    totalAmountEl.textContent = `${this.formatPrice(totalAmount)} MNT`;
  }

  formatPrice(price) {
    return new Intl.NumberFormat().format(price);
  }

  handleProceed() {
    if (this.selectedSeats.length === 0) return;
    
    // Create ticket booking event with all the necessary information
    this.dispatchEvent(
      new CustomEvent("ticket-booking", {
        detail: {
          movieId: this.getAttribute("movie_id"),
          movieTitle: this.movieData?.title,
          branch: this.getAttribute("branch"),
          branchName: this.getBranchName(this.getAttribute("branch")),
          day: this.getAttribute("day"),
          hour: this.getAttribute("hour"),
          seats: this.selectedSeats,
          totalPrice: this.SEAT_PRICE * this.selectedSeats.length,
          hall: this.seatData?.hall
        },
        bubbles: true,
        composed: true
      })
    );
  }

  resetSelection() {
    this.selectedSeats = [];
    this.updateSummary();
  }

  showError(message) {
    const seatsContainer = this.shadowRoot.querySelector(".seats-container");
    seatsContainer.innerHTML = `
      <div style="color: #ff6b6b; text-align: center; padding: 2rem;">
        <div style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️</div>
        <div>${message}</div>
      </div>
    `;
  }

  disconnectedCallback() {
    // Clean up event listeners
    this.shadowRoot.querySelector('.seats-container').removeEventListener('click', this.handleSeatClick);
    this.shadowRoot.querySelector('.selected-seats').removeEventListener('click', this.handleRemoveSeat);
    this.shadowRoot.querySelector('.proceed-btn').removeEventListener('click', this.handleProceed);
  }
}

customElements.define("seat-selector", SeatSelector);