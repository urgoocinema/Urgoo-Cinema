import { durationConverter } from "../utils/duration-converter.js";
import { convertToMinutes } from "../utils/getMinutes.js";
import { isSameDay } from "../utils/isSameDay.js";
import { day_to_number } from "../utils/day-to-number.js";
import { Cardtemplate } from './templates/movieCard.js'
const template = document.createElement("template");
template.innerHTML = Cardtemplate;

export class MovieCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("article");
    this.container.classList.add("movie");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));

    this._isFiltered = false;
    this._isFilteredByDay = false;
    this._isFilteredByTime = false;

    this._selectedBranch = "";
    this._selectedDayofWeek = "all-times";
    this._selectedTime = "";

    this.cast = [];
    this.genres = [];
    this.showtimes = {};
    this.allowedPreorderDays = 3;
    this.startDate = new Date();
    this.endDate = new Date();
    this.branches = [];
    this.mongolianWeekdays = [
      "Ням",
      "Даваа",
      "Мягмар",
      "Лхагва",
      "Пүрэв",
      "Баасан",
      "Бямба",
    ];
  }

  static get observedAttributes() {
    return [
      "id",
      "title",
      "description",
      "duration",
      "poster_url",
      "age_rating",
      "cc",
      "imdb_rating",
    ];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "title") {
      this.container.querySelector(".title").textContent = newVal;
    }
    if (attr === "description") {
      this.container.querySelector(".caption").textContent = newVal;
    }
    if (attr === "duration") {
      this.container.querySelector(".duration-text").textContent =
        durationConverter(newVal);
    }
    if (attr === "poster_url") {
      this.container
        .querySelectorAll(".poster img")
        .forEach((img) => (img.src = newVal));
      this.container
        .querySelectorAll(".poster img")
        .forEach((img) => (img.alt = `${newVal}'s poster`));
    }
    if (attr === "age_rating") {
      this.container.querySelector(".rating").textContent = newVal;
      this.container
        .querySelector(".title-flex .rating")
        .classList.add(`${newVal}`);
    }
    if (attr === "cc") {
      this.container.querySelector(".lang span").textContent = `${newVal === "mongolian" ? "Монгол хэл" : "Англи хэл"
        }`;
      // this.container.querySelector(".lang .flag-container").innerHTML = `<img src="./pics/mongolia-flag.png" alt="flag of mongolia" height="20px" width="20px">`;
    }
  }

  connectedCallback() {
    this.renderCast();
    if (!this.hasMovieStartedHandler()) return;
    this.renderShowtimes(0);
    this.renderButtons();
    this.noTouchScreenHandler();


    if (this.container.querySelector(".timetable-container .branch") === null) {
      if (
        this.container.querySelector(".time-button.active") &&
        this.container.querySelector(".button-group #day-1")
      ) {
        this.container
          .querySelector(".time-button.active")
          .classList.remove("active");
        this.container.querySelector(".button-group #day-0").remove();
        this.container
          .querySelector(".button-group #day-1")
          .classList.add("active");
        this.renderShowtimes(0);
        const parent = this.container.querySelector(".showtime-details");
        const newChild = document.createElement("div");
        newChild.classList.add("notice-no-today");
        newChild.innerHTML = `<span class="info-icon">ⓘ</span> Өнөөдрийн цаг дууссан. <span class="tomorrow">Маргаашийн цагийг</span> харуулж байна.`;
        parent.insertBefore(newChild, parent.firstChild);
      }
    }

    this.container
      .querySelector(".showtime-details")
      .addEventListener("click", (e) => {
        const btn = e.target.closest("[data-day]");
        if (!btn) return;
        const branch = btn.dataset.branch;
        const hall = btn.dataset.hall;
        const day = btn.dataset.day;
        const hour = btn.dataset.hour;
        this.dispatchEvent(
          new CustomEvent("time-selected", {
            detail: {
              movieTitle: this.getAttribute("title"),
              movieId: this.getAttribute("id"),
              moviePoster: this.getAttribute("poster_url"),
              branch,
              hall,
              day,
              hour,
            },
            bubbles: true,
            composed: true,
          })
        );
      });
    document.addEventListener("filter-changed", (e) => this.onFilterChanged(e));
  }
  onFilterChanged(e) {
    const { branch, dayOfWeek, startTime } = e.detail;
    this._selectedBranch = branch;
    this._selectedDayofWeek = dayOfWeek;
    this._selectedTime = startTime;
    this._isFiltered = true;
    const today = new Date();
    const currentDay = new Date(today);
    const currentDayName = currentDay
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentTime = today.getHours() * 60 + today.getMinutes();
    console.log(this._selectedBranch, this._selectedDayofWeek, this._selectedTime);

    if (this._selectedDayofWeek != "all-times") {

      const detailsEl = this.container.querySelector('.showtime-details .timetable-container');
      detailsEl.innerHTML = '';
      let day_offset = day_to_number(this._selectedDayofWeek) - new Date().getDay();
      console.log(day_offset);
      this.container.querySelector(".button-group").innerHTML = `<div class="time-button active" > ${this._selectedDayofWeek}</div>`;
      this.renderShowtimes(day_offset);

    }
    if (this._selectedBranch != "") {
      const todayShowtimes = this.container.querySelector(
        ".showtime-details .timetable-container"
      );
      const detailsEl = this.container.querySelector('.showtime-details .timetable-container');
      detailsEl.innerHTML = '';
      const i = this._selectedBranch - 1;
      const branchConstructor = document.createElement("div");
      branchConstructor.classList.add("branch", `branch-${i + 1}`);
      branchConstructor.innerHTML = `<p>${this.branches[i].name} <span class="location">${this.branches[i].location}</span></p><div class="schedule"></div>`;
      const branch = todayShowtimes.appendChild(branchConstructor);
      const hall = this.showtimes[`branch${i + 1}`]?.hallId;
      const showtimes =
        this.showtimes?.[`branch${i + 1}`]?.schedule?.[currentDayName];
      console.log(showtimes);

      if (isSameDay(currentDay, today)) {
        branch.querySelector(".schedule").innerHTML = showtimes
          ? showtimes
            .map((time) =>
              /^[0-2][0-9]:[0-5][0-9]$/.test(time) &&
                convertToMinutes(time) >= currentTime + 30
                ? `<a href="#" class="time" data-day="${currentDay
                  .toISOString()
                  .slice(0, 10)}" data-hour="${time}" data-branch="${i + 1
                }" data-hall="${hall}">${time}</a>`
                : ``
            )
            .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
        if (branch.querySelector(".schedule").innerHTML === "") {
          branch.remove();
        }
      } else {
        branch.querySelector(".schedule").innerHTML = showtimes
          ? showtimes
            .map(
              (time) =>
                `<a href="#" class="time" data-day="${currentDay
                  .toISOString()
                  .slice(0, 10)}" data-hour="${time}" data-branch="${i + 1
                }" data-hall="${hall}">${time}</a>`
            )
            .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
        if (branch.querySelector(".schedule").innerHTML === "") {
          branch.remove();
        }
      }
    }

    if (this._selectedBranch == "" && this._selectedDayofWeek == "all-times" && this._selectedTime == "") {
      this.container.querySelector(".button-group").innerHTML = ``;

      this.container.querySelector(".button-group").innerHTML = `<button class="time-button active" id="day-0">ӨНӨӨДӨР</button>
        <button class="time-button" id="day-1">МАРГААШ</button>
        <button class="show-all-times">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path
              d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"
            />
          </svg>
          БҮХ ЦАГ (<span></span>)
        </button>`;
      this.renderButtons();
      this.renderShowtimes(0);
    }

  }


  renderCast() {
    this.container.querySelector(".cast .gray").textContent =
      this.cast.join(", ");
  }

  renderShowtimes(day) {
    const today = new Date();
    const currentDay = new Date(today);
    currentDay.setDate(currentDay.getDate() + day);
    const currentTime = today.getHours() * 60 + today.getMinutes();

    const currentDayName = currentDay
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayShowtimes = this.container.querySelector(
      ".showtime-details .timetable-container"
    );
    todayShowtimes.innerHTML = "";

    const selectedDateConstructor = document.createElement("div");
    selectedDateConstructor.classList.add("selected-date");
    selectedDateConstructor.innerHTML = `
    Сонгогдсон<span class="desktop"> өдөр</span>:
    <span class="mo-day"></span> <span class="garig"></span>
    `;
    const selectedDate = todayShowtimes.appendChild(selectedDateConstructor);

    for (let i = 0; i < this.branches.length; i++) {
      const branchConstructor = document.createElement("div");
      branchConstructor.classList.add("branch", `branch-${i + 1}`);
      branchConstructor.innerHTML = `<p>${this.branches[i].name} <span class="location">${this.branches[i].location}</span></p><div class="schedule"></div>`;
      const branch = todayShowtimes.appendChild(branchConstructor);
      const hall = this.showtimes[`branch${i + 1}`]?.hallId;
      const showtimes =
        this.showtimes?.[`branch${i + 1}`]?.schedule?.[currentDayName];
      if (isSameDay(currentDay, today)) {
        branch.querySelector(".schedule").innerHTML = showtimes
          ? showtimes
            .map((time) =>
              /^[0-2][0-9]:[0-5][0-9]$/.test(time) &&
                convertToMinutes(time) >= currentTime + 30
                ? `<a href="#" class="time" data-day="${currentDay
                  .toISOString()
                  .slice(0, 10)}" data-hour="${time}" data-branch="${i + 1
                }" data-hall="${hall}">${time}</a>`
                : ``
            )
            .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
        if (branch.querySelector(".schedule").innerHTML === "") {
          branch.remove();
        }
      } else {
        branch.querySelector(".schedule").innerHTML = showtimes
          ? showtimes
            .map(
              (time) =>
                `<a href="#" class="time" data-day="${currentDay
                  .toISOString()
                  .slice(0, 10)}" data-hour="${time}" data-branch="${i + 1
                }" data-hall="${hall}">${time}</a>`
            )
            .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
        if (branch.querySelector(".schedule").innerHTML === "") {
          branch.remove();
        }
      }
    }

    if (todayShowtimes.querySelector(".branch") === null) {
      todayShowtimes.innerHTML = `
        <p style="font-style: italic;"><span style="opacity: 0.5">Захиалга байхгүй байна.</span> <span class="select-other-day" style="color:orange; cursor:pointer;">Өөр өдөр сонгоно уу.</span></p>
      `;
      todayShowtimes
        .querySelector(".select-other-day")
        .addEventListener("click", () => {
          if (this.container.querySelector(".show-all-times")) {
            this.renderMoreButtons();
          } else {
            this.renderButtons("tomorrow");
          }
        });
    }

    const selectedDateMoDay = selectedDate.querySelector(".mo-day");
    const selectedDateGarig = selectedDate.querySelector(".garig");

    selectedDateMoDay.innerHTML = `${currentDay.getMonth() + 1
      }/${currentDay.getDate()}`;
    selectedDateGarig.innerHTML = `${this.mongolianWeekdays[currentDay.getDay()]
      }`;
  }

  renderButtons(activeChangeIndex = -1) {
    this.timeButtons = Array.from(
      this.container.querySelectorAll(".time-button")
    );

    if (
      activeChangeIndex !== -1 &&
      !this.container.querySelector(".time-button.active")
    ) {
      this.timeButtons.forEach((button) => {
        button.classList.remove("active");
      });
      this.timeButtons[0].classList.add("active");
      this.renderShowtimes(activeChangeIndex);
    }

    if (activeChangeIndex === "tomorrow") {
      this.timeButtons.forEach((button) => {
        button.classList.remove("active");
      });
      if (this.timeButtons[1]) {
        this.timeButtons[1].classList.add("active");
        this.renderShowtimes(1);
      } else {
        this.timeButtons[0].classList.add("active");
        this.renderShowtimes(0);
        alert(
          "Тухайн үзвэрт нэмэлт захиалга байхгүй байна. Та маргааш дахин оролдоно уу."
        );
      }
    }



    /*Choosing the active button*/
    let activeButton =
      this.container.querySelector(".time-button.active") ||
      this.timeButtons[1];
    this.timeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.closest(".time-button") !== activeButton) {
          activeButton.classList.remove("active");
          e.target.closest(".time-button").classList.add("active");
          activeButton = e.target.closest(".time-button");
          const day = parseInt(
            e.target.closest(".time-button").id.split("-")[1]
          );
          this.renderShowtimes(day);
        }
      });
    });

    if (this.container.querySelector(".show-all-times")) {
      if (this.allowedPreorderDays > 2) {
        this.container
          .querySelector(".show-all-times")
          .addEventListener("click", () => {
            setTimeout(() => {
              this.renderMoreButtons();
            }, 0);
          });
        this.container.querySelector(".show-all-times span").textContent =
          this.allowedPreorderDays - 2;
      } else if (this.allowedPreorderDays === 2) {
        this.container.querySelector(".show-all-times").remove();
      } else if (this.allowedPreorderDays === 1) {
        this.container.querySelector(".show-all-times").remove();
        this.container
          .querySelector(".showtime-details .button-group #day-1")
          .remove();
      } else if (this.allowedPreorderDays === 0) {
        this.container.querySelector(".desktop-poster").style.maxHeight =
          "350px";
        this.container.querySelector(".showtime-details").innerHTML = `<div
          style="display:flex;justify-content:center;align-items:center;padding-top:1rem;text-align:center;cursor:not-allowed;height:100%;"
        >
          <span
            ><h3 style="">Тасалбарын хуваарь тавигдаагүй байна.</h3>
            <p>☎️7010-7711</p></span
          >
        </div>`;
        this.container.querySelector(".showtime-details").style.height = "100%";
      }
    }
  }

  renderMoreButtons() {
    const btnGrp = this.container.querySelector(
      ".showtime-details .button-group"
    );
    this.container.querySelector(".show-all-times").remove();

    for (let i = 0; i < this.allowedPreorderDays - 2; i++) {
      const nextDayBtn = document.createElement("button");
      nextDayBtn.classList.add("time-button");
      nextDayBtn.classList.add("additional-day");
      nextDayBtn.id = `day-${i + 2}`;
      const daysAfterTomorrow = new Date();
      daysAfterTomorrow.setDate(daysAfterTomorrow.getDate() + (i + 2));
      nextDayBtn.innerHTML = `<span class="colored">${daysAfterTomorrow.getMonth() + 1
        }/${daysAfterTomorrow.getDate()}</span> ${this.mongolianWeekdays[daysAfterTomorrow.getDay()]
        }`;
      btnGrp.appendChild(nextDayBtn);
    }

    this.renderButtons();
    this.buttonResetter();
  }

  buttonResetter() {
    const btnGrp = this.container.querySelector(
      ".showtime-details .button-group"
    );
    const showLessBtn = document.createElement("button");
    showLessBtn.classList.add("show-less-times");
    showLessBtn.textContent = "⤺ Хураах";
    btnGrp.appendChild(showLessBtn);
    showLessBtn.addEventListener("click", () => {
      this.container.querySelectorAll(".additional-day").forEach((btn) => {
        btn.remove();
      });
      const showAllBtn = document.createElement("button");
      showAllBtn.classList.add("show-all-times");
      showAllBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"/></svg>БҮХ ЦАГ (<span></span>)`;
      showLessBtn.remove();
      btnGrp.appendChild(showAllBtn);
      if (this.container.querySelector(".button-group #day-0")) {
        this.renderButtons(0);
      } else {
        this.container
          .querySelector(".button-group #day-1")
          .classList.add("active");
        this.renderButtons(0);
        this.renderShowtimes(1);
      }
    });
  }

  hasMovieStartedHandler() {
    if (this.hasMovieStarted(this.startDate) === false) {
      this.container.querySelector(".showtime-details").innerHTML = `<div
        style="display:flex;justify-content:center;align-items:center;text-align:center;cursor:not-allowed;height:100%;"
      >
        <span style="margin: 2rem 0;"
          ><h2 style="margin-bottom: 1rem;">Тасалбар захиалга нээгдэхэд</h2>
          <countdown-live
            start-date="${this.startDate.toISOString()}"
          ></countdown-live
        ></span>
      </div>`;
      this.container.querySelector(".showtime-details").style.height = "100%";
      this.addEventListener("countdown-ended", (e) => {
        this.container.querySelector(".showtime-details").innerHTML =
          templateShowtimeContainer.innerHTML;
        this.renderShowtimes(0);
        this.renderButtons();
        this.noTouchScreenHandler();
        this.addEventListener("click", (e) => {
          const btn = e.target.closest("a[data-day]");
          if (!btn) return;
          const day = btn.dataset.day;
          const hour = btn.dataset.hour;
          this.dispatchEvent(
            new CustomEvent("time-selected", {
              detail: {
                movieId: this.getAttribute("id"),
                day,
                hour,
              },
              bubbles: true,
              composed: true,
            })
          );
        });
      });
      return false;
    }
    return true;
  }

  hasMovieStarted(startDate) {
    const today = new Date();
    return startDate <= today;
  }

  noTouchScreenHandler() {
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) {
      this.container.id = "touch";
    }
  }

  disconnectedCallback() {
    document.removeEventListener("filter-changed");
  }
}

customElements.define("movie-card", MovieCard);

const templateShowtimeContainer = document.createElement("template");
templateShowtimeContainer.innerHTML = ` <div class="button-group">
    <button class="time-button active" id="day-0">ӨНӨӨДӨР</button>
    <button class="time-button" id="day-1">МАРГААШ</button>
    <button class="show-all-times">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path
          d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"
        />
      </svg>
      БҮХ ЦАГ (<span></span>)
    </button>
  </div>
  <div class="timetable-container">
  </div>`;
