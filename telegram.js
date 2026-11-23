/**
 * ============================================================================
 * NURHAYO TEXTILE - TELEGRAM INTEGRATSIYASI & KENGAYTIRILGAN VALIDATSIYA
 * ============================================================================
 */

const TELEGRAM_CONFIG = {
    // 1. Telegram bot tokeningiz (@BotFather dan olingan)
    botToken: "9047999050:AAG8Mdy2NpBBeTf_OfpOflgr54l96TGGdsc",

    // 2. Telegram chat ID lar ro'yxati (xabarlar har ikki foydalanuvchiga boradi)
    chatIds: [
        "8066680981", // 1-foydalanuvchi (@javlon_abdumannopov)
        "8955023942"  // 2-foydalanuvchi (@ooo_NURHAYO_textile)
    ]
};

function initTelegramIntegration() {
    const form = document.getElementById("quote-form");
    if (!form) return;

    const submitBtn = document.getElementById("quote-submit-btn");
    const submitText = document.getElementById("quote-submit-text");
    const submitIcon = document.getElementById("quote-submit-icon");
    const successBanner = document.getElementById("form-success-banner");
    const errorBanner = document.getElementById("form-error-banner");
    const errorTitle = document.getElementById("form-error-title");
    const errorDesc = document.getElementById("form-error-desc");

    const nameInput = document.getElementById("client-name");
    const emailInput = document.getElementById("client-email");
    const phoneInput = document.getElementById("client-phone");
    const consentInput = document.getElementById("privacy-consent");

    const nameError = document.getElementById("client-name-error");
    const emailError = document.getElementById("client-email-error");
    const phoneError = document.getElementById("client-phone-error");
    const consentError = document.getElementById("privacy-consent-error");

    // HTML belgilarni xavfsiz formatlash (Telegram parse_mode: HTML uchun)
    function escapeHtml(text) {
        if (!text) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Joriy sana va vaqt
    function getFormattedDate() {
        const now = new Date();
        return now.toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    // Maydon ostidagi xatolikni ko'rsatish
    function setFieldError(input, errorElement, message) {
        if (!input || !errorElement) return;
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
        input.classList.add("border-red-500", "focus:border-red-500", "ring-1", "ring-red-500/50");
        input.classList.remove("border-outline-variant");
    }

    // Maydon xatoligini tozalash
    function clearFieldError(input, errorElement) {
        if (!input || !errorElement) return;
        errorElement.textContent = "";
        errorElement.classList.add("hidden");
        input.classList.remove("border-red-500", "focus:border-red-500", "ring-1", "ring-red-500/50");
        input.classList.add("border-outline-variant");
    }

    // Real-time (yozish jarayonida) xatolikni tozalash
    if (nameInput) {
        nameInput.addEventListener("input", () => clearFieldError(nameInput, nameError));
    }
    if (emailInput) {
        emailInput.addEventListener("input", () => clearFieldError(emailInput, emailError));
    }
    if (phoneInput) {
        phoneInput.addEventListener("input", () => clearFieldError(phoneInput, phoneError));
    }
    if (consentInput) {
        consentInput.addEventListener("change", () => clearFieldError(consentInput, consentError));
    }

    // 1. Ism va kompaniya validatsiyasi
    function validateName(val) {
        const name = (val || "").trim();
        if (!name) {
            return "Пожалуйста, укажите ваше имя и компанию.";
        }
        if (name.length < 2) {
            return "Имя слишком короткое (минимум 2 символа).";
        }
        if (!/[\p{L}]/u.test(name)) {
            return "Имя должно содержать буквы.";
        }
        return null;
    }

    // 2. Email validatsiyasi
    function validateEmail(val) {
        const email = (val || "").trim();
        if (!email) {
            return "Пожалуйста, укажите рабочий Email.";
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return "Укажите корректный Email (например: name@company.ru).";
        }
        return null;
    }

    // 3. Telefon / Telegram validatsiyasi
    function validatePhone(val) {
        const phone = (val || "").trim();
        if (!phone) {
            return "Пожалуйста, укажите номер телефона или Telegram.";
        }

        // Agar Telegram username kiritilgan bo'lsa (@username)
        if (phone.startsWith("@")) {
            const tgRegex = /^@[a-zA-Z0-9_]{4,32}$/;
            if (!tgRegex.test(phone)) {
                return "Некорректный Telegram username (например: @username, от 4 до 32 символов).";
            }
            return null;
        }

        // Telefon raqami tekshiruvi (faqat raqamlar soni)
        const digits = phone.replace(/\D/g, "");
        const validCharsRegex = /^(\+?[0-9\s\-\(\)\.]+)$/;

        if (!validCharsRegex.test(phone) || digits.length < 9 || digits.length > 15) {
            return "Укажите действующий номер телефона (от 9 до 15 цифр, например: +998 90 123-45-67) или Telegram (@username).";
        }

        return null;
    }

    // 4. Rozilik katakchasi validatsiyasi
    function validateConsent(checked) {
        if (!checked) {
            return "Для отправки необходимо подтвердить согласие на обработку данных.";
        }
        return null;
    }

    // Tugma yuklanish animatsiyasi
    function setLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;

        if (isLoading) {
            submitBtn.classList.add("opacity-70", "cursor-not-allowed");
            if (submitText) submitText.textContent = "Отправка заявки...";
            if (submitIcon) {
                submitIcon.textContent = "sync";
                submitIcon.classList.add("animate-spin");
            }
        } else {
            submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
            if (submitText) submitText.textContent = "Отправить запрос на расчет стоимости";
            if (submitIcon) {
                submitIcon.textContent = "send";
                submitIcon.classList.remove("animate-spin");
            }
        }
    }

    // Umumiy xatolik xabarini ko'rsatish
    function showGlobalError(title, message) {
        if (successBanner) successBanner.classList.add("hidden");
        if (errorBanner) {
            if (errorTitle) errorTitle.textContent = title || "Ошибка!";
            if (errorDesc) errorDesc.textContent = message;
            errorBanner.classList.remove("hidden");
            errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    // Muvaffaqiyat xabari
    function showGlobalSuccess() {
        if (errorBanner) errorBanner.classList.add("hidden");
        if (successBanner) {
            successBanner.classList.remove("hidden");
            successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    // FORM SUBMIT HODISASI
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Maydonlarni olish
        const clientName = nameInput ? nameInput.value.trim() : "";
        const clientEmail = emailInput ? emailInput.value.trim() : "";
        const clientPhone = phoneInput ? phoneInput.value.trim() : "";
        const isConsent = consentInput ? consentInput.checked : false;

        // 2. Maydonlarni qat'iy tekshirish
        const errName = validateName(clientName);
        const errEmail = validateEmail(clientEmail);
        const errPhone = validatePhone(clientPhone);
        const errConsent = validateConsent(isConsent);

        let hasError = false;
        let firstInvalidField = null;

        if (errName) {
            setFieldError(nameInput, nameError, errName);
            hasError = true;
            if (!firstInvalidField) firstInvalidField = nameInput;
        } else {
            clearFieldError(nameInput, nameError);
        }

        if (errEmail) {
            setFieldError(emailInput, emailError, errEmail);
            hasError = true;
            if (!firstInvalidField) firstInvalidField = emailInput;
        } else {
            clearFieldError(emailInput, emailError);
        }

        if (errPhone) {
            setFieldError(phoneInput, phoneError, errPhone);
            hasError = true;
            if (!firstInvalidField) firstInvalidField = phoneInput;
        } else {
            clearFieldError(phoneInput, phoneError);
        }

        if (errConsent) {
            setFieldError(consentInput, consentError, errConsent);
            hasError = true;
            if (!firstInvalidField) firstInvalidField = consentInput;
        } else {
            clearFieldError(consentInput, consentError);
        }

        // Agar xatolik bo'lsa, birinchi xato maydonga siljish va to'xtatish
        if (hasError) {
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
                if (firstInvalidField.focus) firstInvalidField.focus();
            }
            return;
        }

        // 3. Telegram xabari matnini shakllantirish
        const productSelect = document.getElementById("product-type");
        const productText = productSelect ? productSelect.options[productSelect.selectedIndex]?.text : "Не указана";
        const orderQuantity = document.getElementById("order-quantity")?.value.trim() || "Не указан";
        const orderSpecs = document.getElementById("order-specs")?.value.trim() || "Не указано";

        const messageText = [
            "🔔 <b>НОВАЯ ЗАЯВКА С САЙТА | NURHAYO TEXTILE</b>",
            "━━━━━━━━━━━━━━━━━━━━",
            `👤 <b>Клиент / Компания:</b> ${escapeHtml(clientName)}`,
            `📞 <b>Телефон / Telegram:</b> ${escapeHtml(clientPhone)}`,
            `📧 <b>Рабочий Email:</b> ${escapeHtml(clientEmail)}`,
            `📦 <b>Категория:</b> ${escapeHtml(productText)}`,
            `🔢 <b>Тираж:</b> ${escapeHtml(orderQuantity)}`,
            "",
            "📝 <b>Техническое задание / Пожелания:</b>",
            `${escapeHtml(orderSpecs)}`,
            "━━━━━━━━━━━━━━━━━━━━",
            `⏰ <b>Время заявки:</b> ${getFormattedDate()}`,
            `🌐 <b>Источник:</b> nurhayotextile.uz`
        ].join("\n");

        setLoading(true);

        try {
            let sentSuccessfully = false;
            let lastErrorMsg = "";

            // 1-USUL: Backend API orqali (server.js /api/send)
            // Bu usul brauzerdagi DNS yoki uBlock/AdBlock cheklovlarini to'liq chetlab o'tadi
            if (window.location.protocol !== "file:") {
                try {
                    const backendRes = await fetch("/api/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: messageText })
                    });

                    if (backendRes.ok) {
                        const bData = await backendRes.json();
                        if (bData.ok) {
                            sentSuccessfully = true;
                        }
                    }
                } catch (bErr) {
                    console.warn("Backend orqali yuborishda xatolik, to'g'ridan-to'g'ri API ga o'tilmoqda:", bErr);
                }
            }

            // 2-USUL: Agar backend yo'q bo'lsa yoki ishlamasa, to'g'ridan-to'g'ri Telegram API ga yuborish
            // Barcha ko'rsatilgan chatlarga birdaniga yuboriladi
            if (!sentSuccessfully) {
                const sendPromises = TELEGRAM_CONFIG.chatIds.map(async (chatId) => {
                    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
                    const response = await fetch(telegramUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: messageText,
                            parse_mode: "HTML"
                        })
                    });
                    return await response.json();
                });

                const results = await Promise.all(sendPromises);
                const hasSuccess = results.some(r => r && r.ok);

                if (hasSuccess) {
                    sentSuccessfully = true;
                } else {
                    lastErrorMsg = results[0]?.description || "Telegram API xatolik qaytardi";
                }
            }

            if (sentSuccessfully) {
                showGlobalSuccess();
                form.reset();
                if (consentInput) consentInput.checked = true;
            } else {
                throw new Error(lastErrorMsg || "Arizani yuborib bo'lmadi");
            }
        } catch (error) {
            console.error("Yuborishda xatolik:", error);
            showGlobalError(
                "Ошибка при отправке!",
                "Не удалось отправить заявку (" + (error.message || "Сетевая ошибка") + "). Пожалуйста, свяжитесь с нами напрямую по номеру +998 90 621-22-21."
            );
        } finally {
            setLoading(false);
        }
    });

    console.log("✅ Nurhayo Textile: Telegram integratsiyasi va validatsiya faol.");
}

// Skriptni yuklash
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTelegramIntegration);
} else {
    initTelegramIntegration();
}
