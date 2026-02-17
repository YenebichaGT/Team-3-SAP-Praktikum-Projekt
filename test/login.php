<html>
<body>

<?php
$db = new PDO("sqlite:firma.db");

$name = $_POST["name"] ?? '';
$password = $_POST["password"] ?? '';

$stmt = $db->prepare("
    SELECT id, name, password
    FROM mitarbeiter 
    WHERE name = ?
");
$stmt->execute([$name]);

$user = $stmt->fetch();

if ($user && password_verify($password, $user["password"])) {
    echo "Hallo " . $user["name"];
} else {
    echo "Name oder Passwort ist falsch.";
}
?>

</body>
</html>