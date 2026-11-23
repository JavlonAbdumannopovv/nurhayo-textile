# NURHAYO TEXTILE — Telegram Bot Integratsiyasi Qo'llanmasi

Ushbu loyihada veb-saytdagi **"Запрос на расчет стоимости"** formasi Telegram bot bilan to'liq integratsiya qilindi. Foydalanuvchi saytdan ariza yuborganda, barcha ma'lumotlar avtomatik ravishda belgilangan Telegram profil, guruh yoki kanalga chiroyli va qulay formatda yetib boradi.

---

## 🚀 3 qadamda ishga tushirish

### 1-qadam: Telegram Bot yaratish va Token olish
1. Telegramda rasmiy **[@BotFather](https://t.me/BotFather)** botiga kiring va `/start` bosing.
2. `/newbot` buyrug'ini yuboring.
3. Botingiz uchun nom kiriting (masalan: `Nurhayo Textile Bot`).
4. Botingiz uchun `username` kiriting (u oxiri `bot` bilan tugashi shart, masalan: `nurhayo_order_bot`).
5. `@BotFather` sizga **API Token** beradi (masalan: `7891234567:AAFl...xyz`). Ushbu tokenni nusxalab oling.
6. O'zingiz yaratgan botga kirib, `/start` tugmasini bosib qo'ying (bu bot sizga xabar yuborishi uchun shart).

---

### 2-qadam: Chat ID (Xabarlar boradigan joy)ni olish

Siz xabarlarni **o'zingizning shaxsiy Telegramingizga** yoki **kompaniya xodimlari bo'lgan guruhga** yuborishingiz mumkin:

#### A) Shaxsiy profilingizga kelishi uchun:
1. Telegramda **[@userinfobot](https://t.me/userinfobot)** ga kiring va `/start` bosing.
2. Bot sizga `Id:` qatorida raqamli ID beradi (masalan: `123456789`). Uni nusxalab oling.

#### B) Guruhga kelishi uchun:
1. Yangi Telegram guruh oching yoki mavjud guruhga kiring.
2. 1-qadamda yaratgan botingizni ushbu guruhga **a'zo sifatida qo'shing** va unga **Admin** huquqini bering.
3. Guruhga biror ixtiyoriy xabar yozing (masalan: `test`).
4. Brauzeringizda quyidagi manzilni oching (o'rniga o'z bot tokeningizni qo'ying):
   ```
   https://api.telegram.org/bot<BOT_TOKENINGIZ>/getUpdates
   ```
5. Chiqqan natijada `"chat":{"id": -100xxxxxxxxxx}` ko'rinishidagi raqamni toping (guruh ID lari odatda `-` yoki `-100` bilan boshlanadi). Shu raqam sizning Chat ID ingizdir.

---

### 3-qadam: Sozlamalarni `telegram.js` ga kiritish
Loyihadagi `telegram.js` faylini oching va 16-24 qatorlardagi qiymatlarni o'zingizniki bilan almashtiring:

```javascript
const TELEGRAM_CONFIG = {
    // 1. Telegram bot tokeningiz (@BotFather dan olingan)
    botToken: "9047999050:AAG8Mdy2NpBBeTf_OfpOflgr54l96TGGdsc",

    // 2. Telegram chat ID lar ro'yxati (barcha ko'rsatilgan foydalanuvchilarga birdaniga boradi)
    chatIds: [
        "8066680981", // 1-menejer (@javlon_abdumannopov)
        "8955023942"  // 2-menejer (@ooo_NURHAYO_textile)
    ]
};
```

Faylni saqlang. **Integratsiya tayyor!**

---

## 📱 Telegramga boradigan xabar namunasi

Formani to'ldirib yuborganda Telegramga quyidagicha xabar boradi:

```text
🔔 НОВАЯ ЗАЯВКА С САЙТА | NURHAYO TEXTILE
━━━━━━━━━━━━━━━━━━━━
👤 Клиент / Компания: Иван Петров, ООО "Ритейл Бренд"
📞 Телефон / Telegram: +998 90 123-45-67
📧 Рабочий Email: ivan@company.ru
📦 Категория: Футболки и майки (кулирная гладь)
🔢 Тираж: 2 500 единиц (по 500 на цвет)

📝 Техническое задание / Пожелания:
Плотность 180 г/м2, 100% хлопок, брендирование шелкографией.
━━━━━━━━━━━━━━━━━━━━
⏰ Время заявки: 23.11.2026, 11:45:00
🌐 Источник: nurhayotextile.uz
```

---

## 🛡 Xavfsizlik va qo'shimcha imkoniyat (send.php)

Agar loyiha PHP qo'llab-quvvatlaydigan serverda (masalan: Apache, cPanel, Beget va h.k.) joylashtirilsa va siz Bot Token foydalanuvchi brauzerida ko'rinmasligini (backend orqali himoyalangan holda ketishini) xohlasangiz:

1. `send.php` faylini oching va `$botToken` hamda `$chatId` ni kiriting:
   ```php
   $botToken = 'YOUR_BOT_TOKEN_HERE';
   $chatId   = 'YOUR_CHAT_ID_HERE';
   ```
2. `telegram.js` faylida:
   ```javascript
   mode: "php"
   ```
   qilib o'zgartiring.

---

## ✨ Kiritilgan qulayliklar:
- **Yuklanish indikatori (Loading Spinner):** Ariza yuborilayotganda tugma bloklanadi, aylanuvchi belgi va "Отправка заявки..." yozuvi chiqadi.
- **Muvaffaqiyat xabari (Success Banner):** Ariza muvaffaqiyatli yuborilgach, foydalanuvchiga tasdiqlash xabari ko'rinadi va forma tozalanadi.
- **Xatoliklarni ushlash (Error Banner):** Internet uzilib qolsa yoki noto'g'ri sozlamalar bo'lsa, foydalanuvchiga tushunarli xatolik ko'rsatiladi.
- **HTML Injection himoyasi:** Mijoz kiritgan matndagi maxsus belgilar (`<`, `>`, `&`) Telegram API talabi bo'yicha avtomatik xavfsiz holatga o'giriladi.
