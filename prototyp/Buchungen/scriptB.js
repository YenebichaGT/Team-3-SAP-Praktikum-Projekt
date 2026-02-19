if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html";
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "../Login Page/LoginPage.html";
}

function markActiveNavigation() {
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    const currentPage = window.location.pathname.split('/').pop();
    const linkPage = href.split('/').pop();
    if (currentPage === linkPage) {
      link.classList.add('active');
    }
  });
}

function toggleEditModeFromParent() {
  const tableFrame = document.getElementById('tableFrame');
  if (tableFrame && tableFrame.contentWindow) {
    // Call toggleEditMode in the iframe
    if (tableFrame.contentWindow.toggleEditMode) {
      tableFrame.contentWindow.toggleEditMode();
    }
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  // Mark active navigation
  markActiveNavigation();

  // Profile Dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileBtn && profileDropdown) {
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
  }
});
