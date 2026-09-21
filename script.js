const toggle = document.querySelector("[data-menu-toggle]");
const panel = document.querySelector("[data-mobile-panel]");
const header = document.querySelector("[data-header]");

function setMenu(open) {
  toggle?.setAttribute("aria-expanded", String(open));
  toggle?.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  panel?.setAttribute("aria-hidden", String(!open));
  panel?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}

toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
panel?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 80), { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const bookingForm = document.querySelector("[data-booking-form]");
const arrival = bookingForm?.elements.arrival;
const departure = bookingForm?.elements.departure;
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
if (arrival) arrival.min = localToday;
if (departure) departure.min = localToday;

arrival?.addEventListener("change", () => {
  departure.min = arrival.value || localToday;
  if (departure.value && departure.value <= arrival.value) departure.value = "";
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const start = data.get("arrival");
  const end = data.get("departure");
  if (start && end && end <= start) {
    document.querySelector("[data-form-status]").textContent = "Data wyjazdu musi być późniejsza niż data przyjazdu.";
    departure.focus();
    return;
  }
  const subject = encodeURIComponent(`Zapytanie o pobyt: ${start} – ${end}`);
  const body = encodeURIComponent(`Dzień dobry,\n\nproszę o informację o dostępności pobytu:\nPrzyjazd: ${start}\nWyjazd: ${end}\nGoście: ${data.get("guests")}\nDomek: ${data.get("cabin")}\n\nPozdrawiam`);
  document.querySelector("[data-form-status]").textContent = "Otwieramy wiadomość e-mail z uzupełnionymi szczegółami pobytu.";
  window.location.href = `mailto:kontakt@osrodek-ciche.pl?subject=${subject}&body=${body}`;
});

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
document.querySelectorAll("[data-image]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.dataset.alt;
    lightbox.showModal();
  });
});
document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
