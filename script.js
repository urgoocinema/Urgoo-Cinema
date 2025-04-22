let slideIndex = 1;
let index = document.querySelectorAll
const schedDaysBtns = document.querySelectorAll('.time-button');
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

schedDaysBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    schedDaysBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

const timetable = {
  1: ["09:00", "11:00", "13:00", "17:00", "20:00"],
  2: ["11:00", "14:00", "17:30", "22:00"],
  3: ["10:00", "12:00", "15:00", "18:00"],
  4: ["09:00", "12:00", "15:00", "19:00"],
}
const timetableContainer = document.querySelector('.timetable-container');
timetable.map(branch => {
  timetableContainer.innerHTML += `<div class="timetable-item">
                  <div class="branch branch-1">
                    <h4>Өргөө 1 <span class="location">Хороолол</span></h4>
                    <div class="schedule">
                      <a href="#" class="time">11:00</a>
                      <a href="#" class="time">14:00</a>
                      <a href="#" class="time">17:00</a>
                      <a href="#" class="time">20:00</a>
                    </div>
                  </div>
                  <div class="branch branch-2">
                    <h4>Өргөө 2 <span class="location">IT Парк</span></h4>
                    <div class="schedule">
                      <a href="#" class="time">11:00</a>
                      <a href="#" class="time">14:00</a>
                      <a href="#" class="time">17:00</a>
                      <a href="#" class="time">20:00</a>
                      <a href="#" class="time">23:00</a>
                    </div>
                  </div>
                  <div class="branch branch-3">
                    <h4>
                      Өргөө 3 <span class="location">IMAX Шангри-Ла</span>
                    </h4>
                    <div class="schedule">
                      <a href="#" class="time">11:00</a>
                      <a href="#" class="time">14:00</a>
                      <a href="#" class="time">17:00</a>
                      <a href="#" class="time">20:00</a>
                    </div>
                  </div>
                  <div class="branch branch-4">
                    <h4>Өргөө 4 <span class="location">Дархан хот</span></h4>
                    <div class="schedule">
                      <a href="#" class="time">11:00</a>
                      <a href="#" class="time">14:00</a>
                      <a href="#" class="time">17:00</a>
                      <a href="#" class="time">20:00</a>
                    </div>
                  </div>
  </div>`;
})