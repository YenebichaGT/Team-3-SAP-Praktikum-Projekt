<?php
$db = new PDO("sqlite:firma.db"); // DB 

// Alle Atribute (IF NOT EXISTS) später einfügen
$db->exec(" 
CREATE TABLE mitarbeiter ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    unternehmen_id INTEGER NOT NULL
)");


$db = new PDO("sqlite:firma.db");

$name = "asd";
$password = password_hash("asd", PASSWORD_DEFAULT);
$unternehmen_id = 1;

$stmt = $db->prepare("
    INSERT INTO mitarbeiter (name, password, unternehmen_id)
    VALUES (?, ?, ?)
");

$stmt->execute([$name, $password, $unternehmen_id]);

?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="login-container">
    <h2>Log In</h2>
    <div>
    <form action="login.php" method="post">
        Name: <input type="text" name="name"><br>
        Password: <input type="text" name="password"><br>
        <input type="submit">
    </form>
    </div>
     <div class="form-options">
       <label class="remember-me">
         <input type="checkbox" name="remember"> Remember me
       </label>
        <a href="#" class="forgot-password">Forgot password?</a>
     </div>

     <button type="submit" class="login-button">Log In</button>
   

    <p class="register-link">
      Don't have an account? <a href="signup.php">Sign up</a>
    </p>
  </div>
</body>
</html> 