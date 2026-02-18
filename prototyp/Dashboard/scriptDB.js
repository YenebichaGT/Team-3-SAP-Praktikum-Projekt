if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html"; // Redirect to login if not logged in
    }
function logout() {
    sessionStorage.removeItem("loggedIn"); // Remove login flag
    window.location.href = "../Login Page/LoginPage.html"; // Redirect to login
  }
document.addEventListener('DOMContentLoaded', function () {
	const btn = document.getElementById('profileBtn');
	const dropdown = document.getElementById('profileDropdown');

	if (!btn || !dropdown) return;

	btn.addEventListener('click', function (e) {
		e.stopPropagation();
		const opened = dropdown.classList.toggle('open');
		btn.setAttribute('aria-expanded', opened);
		dropdown.setAttribute('aria-hidden', !opened);
	});

	// Close when clicking outside
	document.addEventListener('click', function (e) {
		if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
			dropdown.classList.remove('open');
			btn.setAttribute('aria-expanded', 'false');
			dropdown.setAttribute('aria-hidden', 'true');
		}
	});

	// Close on ESC
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			dropdown.classList.remove('open');
			btn.setAttribute('aria-expanded', 'false');
			dropdown.setAttribute('aria-hidden', 'true');
		}
	});
});
