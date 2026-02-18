document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault(); // Prevent page reload

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Hardcoded correct credentials (change as needed)
      if (email === "user@example.com" && password === "123") {
        sessionStorage.setItem("loggedIn", "true"); // Set session variable
        window.location.href = "../Dashboard/dashboard.html"; // Redirect to the dashboard page
      } else {
        alert("Invalid email or password!");
      }
    });