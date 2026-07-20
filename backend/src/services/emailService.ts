import transporter from "../config/email";

const GOLD = "#D4AF37";
const DARK = "#0F172A";
const LIGHT_BG = "#F8F9FA";
const WHITE = "#FFFFFF";
const TEXT_GRAY = "#6B7280";

const baseTemplate = (content: string, dir: string = "rtl"): string => `
<!DOCTYPE html>
<html dir="${dir}" lang="${dir === "rtl" ? "ar" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${LIGHT_BG}; }
    .container { max-width: 600px; margin: 0 auto; background: ${WHITE}; }
    .header { background: ${DARK}; padding: 30px 20px; text-align: center; }
    .header h1 { color: ${GOLD}; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: ${TEXT_GRAY}; margin: 5px 0 0; font-size: 14px; }
    .content { padding: 30px 20px; color: ${DARK}; }
    .footer { background: ${DARK}; padding: 20px; text-align: center; color: ${TEXT_GRAY}; font-size: 12px; }
    .btn { display: inline-block; background: ${GOLD}; color: ${DARK}; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 15px 0; }
    .info-box { background: ${LIGHT_BG}; border-radius: 8px; padding: 15px; margin: 15px 0; border-right: 4px solid ${GOLD}; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: ${TEXT_GRAY}; font-size: 14px; }
    .info-value { font-weight: 600; color: ${DARK}; font-size: 14px; }
    .item-card { background: ${LIGHT_BG}; border-radius: 8px; padding: 12px; margin: 8px 0; display: flex; gap: 12px; }
    .item-card img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
    .item-details { flex: 1; }
    .item-name { font-weight: 600; margin: 0 0 4px; font-size: 14px; }
    .item-meta { color: ${TEXT_GRAY}; font-size: 12px; margin: 0; }
    .total-box { background: ${DARK}; color: ${WHITE}; border-radius: 8px; padding: 15px 20px; margin: 20px 0; text-align: center; }
    .total-box .amount { font-size: 28px; font-weight: 700; color: ${GOLD}; }
    .total-box .label { font-size: 12px; color: ${TEXT_GRAY}; }
    .divider { height: 1px; background: #E5E7EB; margin: 20px 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-gold { background: ${GOLD}22; color: ${GOLD}; }
    .badge-dark { background: ${DARK}22; color: ${DARK}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ادم شوب | Adam Shop</h1>
      <p>Your Trusted Marketplace</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Adam Shop (ادم شوب). All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`;

export const sendOrderConfirmation = async (
  to: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number; image: string }>,
  totalAmount: number,
  shippingAddress: string,
  lang: string = "ar"
): Promise<void> => {
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const itemsHtml = items
    .map(
      (item) => `
    <div class="item-card">
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <p class="item-name">${item.name}</p>
        <p class="item-meta">${isArabic ? "الكمية" : "Qty"}: ${item.quantity} × ${item.price.toFixed(2)} LYD</p>
      </div>
    </div>`
    )
    .join("");

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-gold">${isArabic ? "✓ تم تأكيد طلبك" : "✓ Order Confirmed"}</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">${
      isArabic ? "شكراً لك!" : "Thank You!"
    }</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">${
      isArabic
        ? "تم استلام طلبك ونعمل على تجهيزه"
        : "Your order has been received and we are preparing it"
    }</p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">${isArabic ? "رقم الطلب" : "Order Number"}</span>
        <span class="info-value">${orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${isArabic ? "تاريخ الطلب" : "Order Date"}</span>
        <span class="info-value">${new Date().toLocaleDateString(isArabic ? "ar-LY" : "en-US")}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${isArabic ? "عنوان التوصيل" : "Delivery Address"}</span>
        <span class="info-value">${shippingAddress}</span>
      </div>
    </div>
    <h3>${isArabic ? "المنتجات" : "Items"}</h3>
    ${itemsHtml}
    <div class="total-box">
      <div class="label">${isArabic ? "المبلغ الإجمالي" : "Total Amount"}</div>
      <div class="amount">${totalAmount.toFixed(2)} LYD</div>
    </div>
    <p style="text-align: center; color: ${TEXT_GRAY}; font-size: 14px;">${
      isArabic
        ? "يمكنك متابعة حالة طلبك من حسابك"
        : "You can track your order from your account"
    }</p>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: isArabic
      ? `تأكيد الطلب - ${orderNumber}`
      : `Order Confirmation - ${orderNumber}`,
    html: baseTemplate(content, dir),
  });
};

export const sendSellerOrderNotification = async (
  to: string,
  storeName: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  totalAmount: number,
  customerName: string,
  customerPhone: string,
  shippingAddress: string
): Promise<void> => {
  const itemsHtml = items
    .map(
      (item) => `
    <div class="item-card">
      <div class="item-details">
        <p class="item-name">${item.name}</p>
        <p class="item-meta">الكمية: ${item.quantity} × ${item.price.toFixed(2)} LYD</p>
      </div>
    </div>`
    )
    .join("");

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-gold">🆕 طلب جديد</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">لديك طلب جديد!</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">
      متجر "${storeName}" تلقى طلباً جديداً
    </p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">رقم الطلب</span>
        <span class="info-value">${orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="info-label">العميل</span>
        <span class="info-value">${customerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">الهاتف</span>
        <span class="info-value">${customerPhone}</span>
      </div>
      <div class="info-row">
        <span class="info-label">العنوان</span>
        <span class="info-value">${shippingAddress}</span>
      </div>
    </div>
    <h3>المنتجات</h3>
    ${itemsHtml}
    <div class="total-box">
      <div class="label">المبلغ الإجمالي</div>
      <div class="amount">${totalAmount.toFixed(2)} LYD</div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: `طلب جديد - ${orderNumber} - ${storeName}`,
    html: baseTemplate(content, "rtl"),
  });
};

export const sendSubscriptionRequest = async (
  to: string,
  userName: string,
  userEmail: string
): Promise<void> => {
  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-gold">📋 طلب اشتراك جديد</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">طلب اشتراك جديد</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">
      المستخدم "${userName}" يرغب في الاشتراك في منصة ادم شوب
    </p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">الاسم</span>
        <span class="info-value">${userName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">البريد الإلكتروني</span>
        <span class="info-value">${userEmail}</span>
      </div>
      <div class="info-row">
        <span class="info-label">الاشتراك الشهري</span>
        <span class="info-value">30 LYD / شهرياً</span>
      </div>
      <div class="info-row">
        <span class="info-label">التاريخ</span>
        <span class="info-value">${new Date().toLocaleDateString("ar-LY")}</span>
      </div>
    </div>
    <p style="text-align: center; color: ${TEXT_GRAY}; font-size: 14px;">
      يرجى مراجعة الطلب والرد على المستخدم
    </p>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: "طلب اشتراك جديد - ادم شوب",
    html: baseTemplate(content, "rtl"),
  });
};

export const sendNewSellerNotification = async (
  to: string,
  sellerName: string,
  storeName: string,
  sellerEmail: string
): Promise<void> => {
  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-gold">🏪 طلب بائع جديد</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">طلب بائع جديد</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">
      شخص يرغب في الانضمام كبائع على منصة ادم شوب
    </p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">اسم البائع</span>
        <span class="info-value">${sellerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">اسم المتجر</span>
        <span class="info-value">${storeName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">البريد الإلكتروني</span>
        <span class="info-value">${sellerEmail}</span>
      </div>
      <div class="info-row">
        <span class="info-label">التاريخ</span>
        <span class="info-value">${new Date().toLocaleDateString("ar-LY")}</span>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: "طلب بائع جديد - ادم شوب",
    html: baseTemplate(content, "rtl"),
  });
};

export const sendPasswordReset = async (
  to: string,
  resetToken: string,
  lang: string = "ar"
): Promise<void> => {
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-gold">${isArabic ? "🔑 إعادة تعيين كلمة المرور" : "🔑 Password Reset"}</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">${
      isArabic ? "إعادة تعيين كلمة المرور" : "Reset Your Password"
    }</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">${
      isArabic
        ? "تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك"
        : "We received a request to reset your password"
    }</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="btn">${
      isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password"
    }</a>
    </div>
    <div class="info-box">
      <p style="margin: 0; font-size: 14px; color: ${TEXT_GRAY};">
        ${isArabic
          ? "هذا الرابط صالح لمدة 15 دقيقة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد."
          : "This link is valid for 15 minutes only. If you did not request a password reset, please ignore this email."
        }
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: isArabic
      ? "إعادة تعيين كلمة المرور - ادم شوب"
      : "Password Reset - Adam Shop",
    html: baseTemplate(content, dir),
  });
};

export const sendSubscriptionApproval = async (
  to: string,
  userName: string,
  endDate: Date,
  lang: string = "ar"
): Promise<void> => {
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-gold">${isArabic ? "✅ تم الموافقة على اشتراكك" : "✅ Subscription Approved"}</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">${
      isArabic ? "مرحباً بك في ادم شوب!" : "Welcome to Adam Shop!"
    }</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">${
      isArabic
        ? "تم الموافقة على اشتراكك وأنت الآن بائع معتمد على المنصة"
        : "Your subscription has been approved and you are now an authorized seller"
    }</p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">${isArabic ? "المدة" : "Duration"}</span>
        <span class="info-value">${isArabic ? "شهر واحد" : "1 Month"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${isArabic ? "ينتهي في" : "Expires"}</span>
        <span class="info-value">${endDate.toLocaleDateString(isArabic ? "ar-LY" : "en-US")}</span>
      </div>
    </div>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.CLIENT_URL}/seller/dashboard" class="btn">${
      isArabic ? "لوحة التحكم" : "Go to Dashboard"
    }</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: isArabic
      ? "تم الموافقة على اشتراكك - ادم شوب"
      : "Subscription Approved - Adam Shop",
    html: baseTemplate(content, dir),
  });
};

export const sendSellerApplicationRejected = async (
  to: string,
  userName: string,
  reason?: string,
  lang: string = "ar"
): Promise<void> => {
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge badge-dark">${isArabic ? "❌ تم رفض الطلب" : "❌ Application Rejected"}</span>
    </div>
    <h2 style="text-align: center; margin: 10px 0;">${
      isArabic ? "تم رفض طلبك" : "Your Application Was Rejected"
    }</h2>
    <p style="text-align: center; color: ${TEXT_GRAY};">${
      isArabic
        ? "نأسف لإبلاغك بأنه تم رفض طلب الانضمام كبائع"
        : "We regret to inform you that your seller application has been rejected"
    }</p>
    ${
      reason
        ? `<div class="info-box">
        <p style="margin: 0; font-weight: 600; margin-bottom: 5px;">${isArabic ? "السبب:" : "Reason:"}</p>
        <p style="margin: 0; font-size: 14px; color: ${TEXT_GRAY};">${reason}</p>
      </div>`
        : ""
    }
    <p style="text-align: center; color: ${TEXT_GRAY}; font-size: 14px; margin-top: 20px;">
      ${isArabic
        ? "يمكنك إعادة تقديم الطلب في أي وقت"
        : "You can reapply at any time"
      }
    </p>
  `;

  await transporter.sendMail({
    from: `"Adam Shop" <${process.env.SMTP_USER}>`,
    to,
    subject: isArabic
      ? "تم رفض طلبك - ادم شوب"
      : "Application Rejected - Adam Shop",
    html: baseTemplate(content, dir),
  });
};
