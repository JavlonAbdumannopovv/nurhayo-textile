/**
 * ============================================================================
 * NURHAYO TEXTILE - TELEGRAM BOT WEBHOOK (VERCEL SERVERLESS)
 * ============================================================================
 * Ushbu funksiya Telegram botga har qanday odam /start bosganda
 * avtomatik ravishda sayt linki (https://nurhayo-textile.vercel.app/)
 * va ma'lumotlarni yuboradi.
 */

const BOT_TOKEN = "9047999050:AAG8Mdy2NpBBeTf_OfpOflgr54l96TGGdsc";
const SITE_URL = "https://nurhayo-textile.vercel.app/";

module.exports = async (req, res) => {
    // Faqat POST so'rovlarni qabul qilish
    if (req.method !== "POST") {
        return res.status(200).json({
            ok: true,
            message: "NURHAYO TEXTILE Telegram Webhook is active."
        });
    }

    try {
        const update = req.body;

        if (update && update.message && update.message.chat) {
            const chatId = update.message.chat.id;
            const text = (update.message.text || "").trim();
            const firstName = update.message.from?.first_name || "Mijoz";

            // Har qanday /start yoki xabarga javob qaytarish
            const welcomeText = [
                `👋 <b>Assalomu alaykum, ${firstName}!</b>`,
                `<b>NURHAYO TEXTILE</b> rasmiy botiga xush kelibsiz.`,
                "",
                "Kompaniyamiz trikotaj mato ishlab chiqarish, bo'yash va sifatli kiyim-kechak tikish bo'yicha to'liq tsiklli to'qimachilik majmuasidir.",
                "",
                "🌐 <b>Bizning rasmiy veb-saytimiz:</b>",
                `${SITE_URL}`,
                "",
                "Buyurtma berish yoki narxlarni hisoblash uchun saytimizga tashrif buyurishingiz yoki to'g'ridan-to'g'ri menejerlarimiz bilan bog'lanishingiz mumkin:",
                "📞 <b>Telefon:</b> +998 90 621-22-21",
                "💬 <b>Telegram:</b> @ooo_NURHAYO_textile"
            ].join("\n");

            const replyPayload = {
                chat_id: chatId,
                text: welcomeText,
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🌐 Veb-saytga o'tish (nurhayo-textile.vercel.app)",
                                url: SITE_URL
                            }
                        ],
                        [
                            {
                                text: "💬 Menejer bilan bog'lanish",
                                url: "https://t.me/ooo_NURHAYO_textile"
                            }
                        ]
                    ]
                }
            };

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(replyPayload)
            });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(200).json({ ok: false, error: error.message });
    }
};
