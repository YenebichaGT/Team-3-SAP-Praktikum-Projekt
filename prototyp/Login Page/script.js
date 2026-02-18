document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault(); // Prevent page reload

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Hardcoded correct credentials (change as needed)
      if (email === "user@example.com" && password === "123") {
        window.location.href = "app.html"; // Redirect to your app
      } else {
        alert("Invalid email or password!");
      }
    });