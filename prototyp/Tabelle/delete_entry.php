<?php
// delete_entry.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Nur POST erlaubt']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['index'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Kein Index angegeben']);
    exit;
}


$dataFile = '../Buchungen/data.json';
if (!file_exists($dataFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Datei nicht gefunden']);
    exit;
}

$data = json_decode(file_get_contents($dataFile), true);
if (!isset($data['transactions'][$input['index']])) {
    http_response_code(404);
    echo json_encode(['error' => 'Eintrag nicht gefunden']);
    exit;
}

array_splice($data['transactions'], $input['index'], 1);
file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['success' => true]);
