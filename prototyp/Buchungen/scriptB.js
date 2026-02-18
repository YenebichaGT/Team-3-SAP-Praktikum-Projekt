if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html";
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "../Login Page/LoginPage.html";
}

document.addEventListener('DOMContentLoaded', function () {
  // Profile Dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (!profileBtn || !profileDropdown) return;

  profileBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const opened = profileDropdown.classList.toggle('open');
    profileBtn.setAttribute('aria-expanded', opened);
    profileDropdown.setAttribute('aria-hidden', !opened);
  });

  document.addEventListener('click', function (e) {
    if (!profileBtn.contains(e.target)) {
      profileDropdown.classList.remove('open');
      profileBtn.setAttribute('aria-expanded', 'false');
      profileDropdown.setAttribute('aria-hidden', 'true');
    }
  });
});
