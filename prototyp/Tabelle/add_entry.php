<?php
// add_entry.php
header('Content-Type: application/json');

// Nur POST-Anfragen erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Nur POST erlaubt']);
    exit;
}

// Eingabedaten lesen
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige Eingabe']);
    exit;
}

// data.json laden

$dataFile = '../Buchungen/data.json';
if (!file_exists($dataFile)) {
    $data = ['transactions' => []];
} else {
    $data = json_decode(file_get_contents($dataFile), true);
    if (!$data) $data = ['transactions' => []];
}

// Neuen Eintrag hinzufügen
$data['transactions'][] = $input;

// Datei speichern
file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['success' => true, 'data' => $input]);
