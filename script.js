var root = document.documentElement;
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Tema ---------- */
var tombolTema = document.getElementById("tema");
function gelap() {
  var t = root.getAttribute("data-theme");
  return t
    ? t === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function labelTema() {
  tombolTema.textContent = gelap() ? "Terang" : "Gelap";
}
try {
  var s = localStorage.getItem("tema");
  if (s) root.setAttribute("data-theme", s);
} catch (e) {}
labelTema();
tombolTema.addEventListener("click", function () {
  var baru = gelap() ? "light" : "dark";
  root.setAttribute("data-theme", baru);
  try {
    localStorage.setItem("tema", baru);
  } catch (e) {}
  labelTema();
});

/* ---------- Menu ponsel ---------- */
var menu = document.getElementById("menu");
var bukaMenu = document.getElementById("buka-menu");
bukaMenu.addEventListener("click", function () {
  var terbuka = menu.classList.toggle("buka");
  bukaMenu.setAttribute("aria-expanded", terbuka);
});
menu.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    menu.classList.remove("buka");
    bukaMenu.setAttribute("aria-expanded", false);
  }
});

/* ---------- Bar progres gulir ---------- */
var progres = document.getElementById("progres");
window.addEventListener(
  "scroll",
  function () {
    var tinggi = document.documentElement.scrollHeight - window.innerHeight;
    progres.style.width =
      (tinggi > 0 ? (window.scrollY / tinggi) * 100 : 0) + "%";
  },
  { passive: true },
);

/* ---------- Menu aktif saat gulir ---------- */
var tautan = document.querySelectorAll("nav a");
var pengamatMenu = new IntersectionObserver(
  function (daftar) {
    daftar.forEach(function (d) {
      if (d.isIntersecting) {
        tautan.forEach(function (a) {
          a.classList.toggle(
            "aktif",
            a.getAttribute("href") === "#" + d.target.id,
          );
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
document.querySelectorAll("main section[id]").forEach(function (s) {
  pengamatMenu.observe(s);
});

/* ---------- Teks mengetik ---------- */
var peran = ["pengembang web.", "pendesain antarmuka.", "pemecah masalah."];
var el = document.getElementById("ketik");
var p = 0,
  h = 0,
  hapus = false;
function ketik() {
  var kata = peran[p];
  el.textContent = kata.slice(0, h);
  if (!hapus && h === kata.length) {
    hapus = true;
    return setTimeout(ketik, 1500);
  }
  if (hapus && h === 0) {
    hapus = false;
    p = (p + 1) % peran.length;
  }
  h += hapus ? -1 : 1;
  setTimeout(ketik, hapus ? 40 : 90);
}
if (reduce) {
  el.textContent = peran[0];
} else {
  ketik();
}

/* ---------- Cahaya mengikuti kursor & avatar miring ---------- */
var hero = document.getElementById("hero");
var avatar = document.getElementById("avatar");
if (!reduce) {
  hero.addEventListener("mousemove", function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty("--x", e.clientX - r.left + "px");
    hero.style.setProperty("--y", e.clientY - r.top + "px");
    var a = avatar.getBoundingClientRect();
    var dx = (e.clientX - (a.left + a.width / 2)) / r.width;
    var dy = (e.clientY - (a.top + a.height / 2)) / r.height;
    avatar.style.transform =
      "rotateY(" + dx * 40 + "deg) rotateX(" + -dy * 40 + "deg)";
  });
  hero.addEventListener("mouseleave", function () {
    avatar.style.transform = "";
  });
}

/* ---------- Angka menghitung & bar keahlian ---------- */
function hitung(elm) {
  var target = +elm.dataset.target,
    mulai = null;
  function langkah(t) {
    if (!mulai) mulai = t;
    var k = Math.min((t - mulai) / 1200, 1);
    elm.textContent = Math.round(target * k);
    if (k < 1) requestAnimationFrame(langkah);
  }
  reduce ? (elm.textContent = target) : requestAnimationFrame(langkah);
}
var pengamatIsi = new IntersectionObserver(
  function (daftar) {
    daftar.forEach(function (d) {
      if (!d.isIntersecting) return;
      var x = d.target;
      if (x.dataset.target) hitung(x);
      else x.style.width = x.dataset.nilai + "%";
      pengamatIsi.unobserve(x);
    });
  },
  { threshold: 0.4 },
);
document.querySelectorAll("[data-target],[data-nilai]").forEach(function (x) {
  pengamatIsi.observe(x);
});

/* ---------- Filter proyek ---------- */
var tombolFilter = document.querySelectorAll(".filter button");
var kartu = document.querySelectorAll(".kartu");
tombolFilter.forEach(function (b) {
  b.addEventListener("click", function () {
    tombolFilter.forEach(function (x) {
      x.classList.remove("aktif");
    });
    b.classList.add("aktif");
    kartu.forEach(function (k) {
      k.classList.toggle(
        "sembunyi",
        b.dataset.filter !== "semua" && k.dataset.kategori !== b.dataset.filter,
      );
    });
  });
});

/* ---------- Jendela detail proyek ---------- */
var modal = document.getElementById("modal");
kartu.forEach(function (k) {
  k.addEventListener("click", function () {
    document.getElementById("m-judul").textContent = k.dataset.judul;
    document.getElementById("m-teks").textContent = k.dataset.deskripsi;
    document.getElementById("m-tek").textContent = k.dataset.teknologi;
    modal.showModal();
  });
});
document.getElementById("tutup").addEventListener("click", function () {
  modal.close();
});
modal.addEventListener("click", function (e) {
  if (e.target === modal) modal.close();
});

/* ---------- Formulir kontak ---------- */
var toast = document.getElementById("toast");
function tampilToast(teks) {
  toast.textContent = teks;
  toast.classList.add("tampil");
  setTimeout(function () {
    toast.classList.remove("tampil");
  }, 3000);
}
function periksa(input, pesan) {
  var label = input.closest("label");
  var salah =
    !input.value.trim() ||
    (input.type === "email" && !/^\S+@\S+\.\S+$/.test(input.value));
  label.classList.toggle("salah", salah);
  label.querySelector(".galat").textContent = salah ? pesan : "";
  return !salah;
}
document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();
  var a = periksa(document.getElementById("nama"), "Isi nama Anda.");
  var b = periksa(
    document.getElementById("email"),
    "Isi email yang valid, contoh: nama@email.com.",
  );
  var c = periksa(document.getElementById("pesan"), "Tulis pesan Anda.");
  if (a && b && c) {
    this.reset();
    tampilToast("Pesan terkirim. Terima kasih!");
  }
});

document.getElementById("tahun").textContent = "© " + new Date().getFullYear();
