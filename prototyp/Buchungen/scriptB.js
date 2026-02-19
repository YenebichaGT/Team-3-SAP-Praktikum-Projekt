if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html";
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "../Login Page/LoginPage.html";
}

document.addEventListener('DOMContentLoaded', async function () {
  // Navigation markieren
  markActiveNavigation();

  // Daten laden
  await loadTransactionData();
  renderTable();

  // Edit Mode Button
  const editModeBtn = document.getElementById('editModeBtn');
  if (editModeBtn) {
    editModeBtn.addEventListener('click', toggleEditMode);
  }

  // Neue Buchung hinzufügen Button
  const addNewBtn = document.getElementById('addNewRowBtn');
  if (addNewBtn) {
    addNewBtn.addEventListener('click', addNewTransaction);
  }

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
