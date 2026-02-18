<?php
$db = new PDO("sqlite:firma.db");

$name = $_POST["name"] ?? '';
$password = $_POST["password"] ?? '';
$password2 = $_POST["password2"] ?? '';
$unternehmen_id = $_POST["id"] ?? '';

$stmt = $db->prepare("
    SELECT id, name, password
    FROM mitarbeiter 
    WHERE name = ?
");
$stmt->execute([$name]);

$user = $stmt->fetch();

if (!$user && $password == $password2) {
    echo "Du hast dich erfolgreich registriert " . $user["name"];
    $stmt = $db->prepare("
    INSERT INTO mitarbeiter (name, password, unternehmen_id)
    VALUES (?, ?, ?)
    ");

    $stmt->execute([$name, $password, $unternehmen_id]);
} else {
    echo "Account mit diesem Name exisitert bereits";
}
?>