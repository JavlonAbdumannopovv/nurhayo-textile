/**
 * ============================================================================
 * NURHAYO TEXTILE - ARIZALARNI TELEGRAMGA YUBORISH (VERCEL SERVERLESS)
 * ============================================================================
 */

const BOT_TOKEN = "9047999050:AAG8Mdy2NpBBeTf_OfpOflgr54l96TGGdsc";
const CHAT_IDS = [
    "8066680981", // 1-menejer (@javlon_abdumannopov)
    "8955023942"  // 2-menejer (@ooo_NURHAYO_textile)
];

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, description: "Faqat POST so'rov qabul qilinadi" });
    }

    try {
        const { message } = req.body || {};

        if (!message) {
            return res.status(400).json({ ok: false, description: "Xabar matni bo'sh" });
        }

        // Barcha ko'rsatilgan administratorlarga xabarni yuborish
        const sendPromises = CHAT_IDS.map(async (chatId) => {
            const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            const response = await fetch(telegramUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "HTML"
                })
            });
            return await response.json();
        });

        const results = await Promise.all(sendPromises);
        const hasSuccess = results.some(r => r && r.ok);

        if (hasSuccess) {
            return res.status(200).json({ ok: true, results });
        } else {
            return res.status(502).json({
                ok: false,
                description: results[0]?.description || "Telegramga yetkazib bo'lmadi"
            });
        }
    } catch (error) {
        console.error("Vercel send error:", error);
        return res.status(500).json({ ok: false, error: error.message });
    }
};
