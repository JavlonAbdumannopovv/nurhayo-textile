<?php
/**
 * ============================================================================
 * NURHAYO TEXTILE - TELEGRAM BACKEND YUBORUVCHI (PHP)
 * ============================================================================
 */

header('Content-Type: application/json; charset=UTF-8');

// Faqat POST so'rovlarni qabul qilish
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'description' => 'Faqat POST so\'rovlar qabul qilinadi.']);
    exit;
}

// ==========================================
// TELEGRAM SOZLAMALARI
// ==========================================
$botToken = '9047999050:AAG8Mdy2NpBBeTf_OfpOflgr54l96TGGdsc';
$chatIds  = [
    '8066680981', // 1-foydalanuvchi (@javlon_abdumannopov)
    '8955023942'  // 2-foydalanuvchi (@ooo_NURHAYO_textile)
];

// Kelgan ma'lumotlarni o'qish
$inputRaw = file_get_contents('php://input');
$data = json_decode($inputRaw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'description' => 'Noto\'g\'ri so\'rov formati.']);
    exit;
}

// Xabar matni
$message = $data['message'] ?? '';

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'description' => 'Xabar matni bo\'sh bo\'lishi mumkin emas.']);
    exit;
}

$telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
$hasSuccess = false;

foreach ($chatIds as $cId) {
    $postFields = [
        'chat_id' => $cId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $telegramUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postFields));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $result = json_decode($response, true);
    if ($httpCode === 200 && !empty($result['ok'])) {
        $hasSuccess = true;
    }
}

if ($hasSuccess) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(502);
    echo json_encode(['ok' => false, 'description' => 'Telegramga xabar yuborib bo\'lmadi.']);
}
