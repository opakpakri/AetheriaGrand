// Inisialisasi Swiper untuk Review
const swiper = new Swiper(".review-slider", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  grabCursor: true,
  navigation: {
    nextEl: ".review-next",
    prevEl: ".review-prev",
  },
  breakpoints: {
    // Ketika lebar layar >= 768px (Tablet/Laptop)
    768: {
      slidesPerView: 2,
    },
    // Ketika lebar layar >= 1024px (Desktop)
    1024: {
      slidesPerView: 3,
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("booking-form");
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const toastContainer = document.getElementById("toast-container");

  // --- 1. LOGIC PEMBATASAN & PENYESUAIAN TANGGAL OTOMATIS ---
  checkinInput.addEventListener("change", () => {
    if (checkinInput.value) {
      const checkinDate = new Date(checkinInput.value);

      // Hitung tanggal minimal checkout (H+1 dari checkin)
      const minCheckout = new Date(checkinDate);
      minCheckout.setDate(minCheckout.getDate() + 1);

      const minCheckoutStr = minCheckout.toISOString().split("T")[0];

      // Kunci kalender checkout agar tidak bisa pilih tanggal sebelum/sama dengan checkin
      checkoutInput.min = minCheckoutStr;

      // RE-ADJUST LOGIC: Jika checkout sudah terisi tapi tidak valid (<= checkin)
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = minCheckoutStr;
        showToast("Check-out successfully updated", "success");
      }
    }
  });

  // --- 2. FUNGSI TOAST (NOTIFIKASI KANAN BAWAH) ---
  function showToast(message, type = "error") {
    const toast = document.createElement("div");
    const bgColor = type === "error" ? "bg-red-600" : "bg-emerald-800";

    toast.className = `${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-500 translate-y-10 opacity-0 flex items-center gap-3 font-medium text-sm`;
    toast.innerHTML = `<span>${type === "error" ? "⚠️" : "✨"}</span><p>${message}</p>`;

    toastContainer.appendChild(toast);

    // Animasi Muncul
    setTimeout(() => toast.classList.remove("translate-y-10", "opacity-0"), 10);

    // Hilang Otomatis
    setTimeout(() => {
      toast.classList.add("translate-y-10", "opacity-0");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // --- 3. LOGIC SUBMIT FORM & DINAMIS MESSAGE ---
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah refresh halaman agar loading & scroll terlihat

    const btnBooking = document.getElementById("btn-booking");
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
    const originalText = btnBooking.innerText;

    // Loading State
    btnBooking.innerText = "LOADING";
    btnBooking.disabled = true;
    showToast("Checking availability...", "success");

    setTimeout(() => {
      // Logic Pesan Sukses Dinamis
      let successMessage = `Room available for ${adults}`;
      if (children !== "0 Children") {
        successMessage += `, ${children}`;
      }

      showToast(successMessage, "success");

      // Smooth Scroll ke Section Rooms
      const roomSection = document.getElementById("rooms");
      if (roomSection) {
        roomSection.scrollIntoView({ behavior: "smooth" });
      }

      // Kembalikan Tombol
      btnBooking.innerText = originalText;
      btnBooking.disabled = false;
    }, 2000);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const spans = menuBtn.querySelectorAll("span");

  function toggleMenu() {
    // Cek apakah menu sedang terlihat (opacity-100)
    const isOpen = mobileMenu.classList.contains("opacity-100");

    if (!isOpen) {
      // Dropdown Ke Bawah
      mobileMenu.classList.remove("invisible");
      setTimeout(() => {
        mobileMenu.classList.remove("-translate-y-10", "opacity-0");
        mobileMenu.classList.add("translate-y-0", "opacity-100");
      }, 10);
    } else {
      // Tarik Ke Atas
      mobileMenu.classList.remove("translate-y-0", "opacity-100");
      mobileMenu.classList.add("-translate-y-10", "opacity-0");
      setTimeout(() => mobileMenu.classList.add("invisible"), 500);
    }

    // Animasi Hamburger ke 'X'
    spans[0].classList.toggle("rotate-45", !isOpen);
    spans[0].classList.toggle("translate-y-[8px]", !isOpen);
    spans[1].classList.toggle("opacity-0", !isOpen);
    spans[2].classList.toggle("-rotate-45", !isOpen);
    spans[2].classList.toggle("-translate-y-[8px]", !isOpen);
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    const isOpen = mobileMenu.classList.contains("opacity-100");
    if (
      isOpen &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      toggleMenu();
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu());
  });
});
