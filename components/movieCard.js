import { durationConverter } from "../utils/duration-converter.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :root {
      --primary-color: #ffa500;
      --secondary-color: #ffb733;
      --text-color: white;
      --bg-color: rgb(22, 22, 22);

      --black-text: black;
      --gray-text: gray;
      --white-text: white;
    }
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    .movie {
      display: flex;
      max-width: 750px;
      gap: 1rem;
      border-left: 5px rgb(228, 155, 15) dashed;
      border-top: 2px rgb(228, 155, 15) solid;
      border-right: rgb(228, 155, 15) solid;
      border-bottom: rgb(228, 155, 15) solid;
      border-radius: 1em;
      padding: 1.5rem 0.8rem;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgb(228, 155, 15), 0 0 40px rgba(255, 255, 255, 0.1),
        0 8px 16px rgba(255, 255, 255, 0.08);

      & .poster {
        min-width: 40%;
        max-width: 300px;
        max-height: 700px;
        aspect-ratio: 3 / 4;

        & img {
          border-radius: 1em;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      & .info-details {
        color: var(--gray-text);
      }

      /*
      & .title-flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        gap: 0.4rem;
      }*/

      & .title {
        display: inline;
        letter-spacing: 0.1rem;
        color: var(--white-text);
      }

      & .info .caption {
        margin: 1.3rem 0;
        color: var(--white-text);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & .info .cast {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & .info .duration {
        margin-bottom: 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      & .duration-text {
        display: inline-block;
      }
    }

    .movie:hover {
      transform: translateY(-20px);
      box-shadow: 0 0 40px rgba(255, 255, 255, 0.4),
        0 0 80px rgba(255, 255, 255, 0.2), 0 12px 24px rgba(255, 255, 255, 0.1);
    }
    .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .location {
      display: inline-block;
      background-color: var(--secondary-color);
      color: var(--black-text);
      padding: 0 10px;
      border-radius: 0.5em;
      backdrop-filter: blur(10px);
      font-size: 0.9rem;
    }

    .showtime-details {
      & .button-group {
        margin: 1rem 0 1.2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      & .time-button {
        padding: 0.4rem 1rem;
        border: 2px solid #ccc;
        border-radius: 8px;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        color: white;
        font-size: 0.85rem;
      }

      & .time-button:hover {
        border-color: #e49b0f;
        background-color: var(--secondary-color);
        color: var(--black-text);
        & svg {
          color: #ffff8f;
        }
      }

      & .time-button.active {
        background-color: #e49b0f;
        color: black;
        border-color: #e49b0f;
        opacity: 1;
        & svg {
          color: white;
        }
      }

      & .show-all-times {
        display: inline-flex;
        align-items: center;
        opacity: 0.6;
        & svg {
          color: var(--primary-color);
        }
      }
      & .show-all-times:hover {
        opacity: 1;
      }

      & .schedule {
        display: flex;
        flex-wrap: wrap;
      }

      & .day,
      .schedule {
        margin: 0.5rem 0;
      }

      & .branch {
        margin: 0.8rem 0;
        & p {
          font-size: 1rem;
          font-weight: bold;
        }
      }

      & .time {
        margin: 0.4rem;
        padding: 0 10px;
        border: 1px rgb(228, 155, 15) solid;
        border-radius: 0.5em;
        backdrop-filter: blur(10px);
        font-size: 1.2rem;
        line-height: 1.5rem;
        color: white;
        text-decoration: none;
        transition: 0.1s ease-in-out;
      }

      & .time:hover {
        background-color: rgba(228, 155, 15, 0.8);
      }
    }

    .lang {
      display: flex;
      align-items: center;
    }

    .gray {
      /* opacity: 0.5; */
      color: var(--white-text);
    }
    .rating {
      display: inline-block;
      font-size: 0.8rem;
      font-family: "Roboto Condensed";
      letter-spacing: normal;
      color: var(--white-text);
      padding: 0 10px;
      border-radius: 0.5em;
      backdrop-filter: blur(10px);
    }

    .age-pg13,
    .PG-13 {
      background-color: rgba(233, 0, 78, 0.5);
    }

    .age-pg,
    .PG {
      background-color: rgba(27, 233, 0, 0.5);
    }

    .age-g,
    .G {
      background-color: rgba(27, 233, 0, 0.5);
    }

    .age-r,
    .R {
      background-color: rgba(255, 5, 5, 0.5);
    }

    .mobile-poster {
      display: none;
    }

    @media (max-width: 695px) {
      .movie {
        padding: 1.5rem 1.5rem;
        max-width: 500px;
      }
      .mobile-poster {
        display: block;
        max-height: 210px;
        min-height: 210px;
        aspect-ratio: 3 / 4;
      }
      .desktop-poster {
        display: none;
      }
      .info-details {
        display: flex;
        gap: 1rem;
      }
      .info-text {
        font-size: clamp(0.8rem, 3vw, 1rem);
      }
      .rating {
        font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      }
    }

    @media (max-width: 440px) {
      .time-button {
        font-size: clamp(0.6rem, 3.6vw, 0.8rem) !important;
      }
    }
    @media (max-width: 426px) {
      .time-button {
        max-height: 25px;
        font-size: 0.6rem !important;
      }
    }

    @media (max-width: 420px) {
      .mobile-poster {
        max-height: 180px;
        min-height: 180px;
        margin: auto 0;
      }
      .info-text {
        font-size: clamp(0.7rem, 3vw, 1rem);
      }
      .info {
        .title {
          margin-bottom: 0;
        }
        .caption {
          margin: 0.8rem 0 !important;
        }
      }
      .time {
        font-size: clamp(0.7rem, 4vw, 1rem) !important;
      }
    }
    @media (max-width: 350px) {
      #cast {
        display: none;
      }
      .lang {
        display: none;
      }
      .timetable-container {
        max-height: 265px;
        overflow: scroll;
      }
    }

    @media (max-width: 340px) {
      .duration-caption {
        display: none;
      }
      .duration-text {
        color: var(--gray-text);
      }
    }

    @media (max-width: 305px) {
      .mobile-poster {
        max-height: 120px;
        min-width: 120px;
      }
    }
  </style>
  <div class="poster desktop-poster">
    <img />
  </div>
  <div class="info">
    <div class="info-details">
      <div class="mobile-poster">
        <div class="poster">
          <img/>
        </div>
      </div>
      <div class="info-text">
        <div class="title-flex">
          <h2 class="title"></h2>
          <sup class="rating"></sup>
        </div>
        <p class="caption"></p>
        <p class="cast" id="cast">
          <span class="white">Гол дүр:</span>
          <span class="gray"></span>
        </p>
        <p class="duration">
          <span class="duration-caption">Үргэлжлэх хугацаа:</span>
          <span class="gray duration-text"></span>
        </p>
        <p class="lang">
          <svg
            class="cc-icon gray"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path
              d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h120q17 0 28.5-11.5T720-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T680-600H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360ZM200-240v-480 480Z"
            />
          </svg>
          <span class="gray"></span>
        </p>
      </div>
    </div>
    <div class="showtime-details">
      <div class="button-group">
        <button class="time-button active">ӨНӨӨДӨР</button>
        <button class="time-button">МАРГААШ</button>
        <button class="time-button show-all-times">
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
          БҮХ ЦАГ
        </button>
      </div>
      <div class="timetable-container">
        <div class="today">
          <div class="branch branch-1">
            <p>Өргөө 1 <span class="location">Хороолол</span></p>
            <div class="schedule"></div>
          </div>
          <div class="branch branch-2">
            <p>Өргөө 2 <span class="location">IT Парк</span></p>
            <div class="schedule"></div>
          </div>
          <div class="branch branch-3">
            <p>Өргөө 3 <span class="location">IMAX Шангри-Ла</span></p>
            <div class="schedule"></div>
          </div>
          <div class="branch branch-4">
            <p>Өргөө 4 <span class="location">Дархан хот</span></p>
            <div class="schedule"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export class MovieCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("article");
    this.container.classList.add("movie");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));

    this.cast = [];
    this.genres = [];
    this.showtimes = [];
    this.selectedDay = [1, 2, 3, 4, 5, 6, 7];
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
      this.container.querySelectorAll(".poster img").forEach((img)=>(img.alt = `${newVal}'s poster`));
    }
    if (attr === "age_rating") {
      this.container.querySelector(".rating").textContent = newVal;
      this.container
        .querySelector(".title-flex .rating")
        .classList.add(`${newVal}`);
    }
    if (attr === "cc") {
      this.container.querySelector(".lang span").textContent = `${
        newVal === "mongolian" ? "Монгол хэл" : "Англи хэл"
      }`;
    }
  }

  connectedCallback() {
    this.render();
    // this.shadowRoot.querySelector("button").addEventListener("click", () => {
    //   this.dispatchEvent(
    //     new CustomEvent("remove-me", {
    //       detail: {
    //         id: this.getAttribute("id"),
    //       },
    //       bubbles: true,
    //       composed: true,
    //     })
    //   );
    // });
  }

  render() {
    this.container.querySelector(".cast .gray").textContent =
      this.cast.join(", ");

    const currentDay = new Date();
    const currentDayName = currentDay
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayShowtimes = this.container.querySelector(
      ".showtime-details .today"
    );
    for (let i = 1; i <= 4; i++) {
      const branch = todayShowtimes.querySelector(`.branch-${i}`);
      const showtimes = this.showtimes?.[`branch${i}`]?.[currentDayName];

      branch.querySelector(".schedule").innerHTML = showtimes
        ? showtimes
            .map((time) => `<a href="#" class="time">${time}</a>`)
            .join("")
        : `<span class="time">No showtimes available</span>`;
    }
  }

  disconnectedCallback() {}
}

customElements.define("movie-card", MovieCard);
