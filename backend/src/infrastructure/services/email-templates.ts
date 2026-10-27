import { SendPaymentReceiptOptions, SendVisitBookingConfirmationOptions } from '../../core/interfaces/mail-service.interface';
import { env } from '../../config/env';

/**
 * Base email layout wrapper providing unified brand styling for PlantOnAgro
 */
function wrapInBaseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f7f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #173324;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f7f4;
      padding: 32px 12px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(23, 51, 36, 0.08);
      border: 1px solid #e1ebe4;
    }
    .header {
      background: linear-gradient(135deg, #173324 0%, #1f4732 100%);
      padding: 32px 28px;
      text-align: center;
      color: #ffffff;
    }
    .logo-badge {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 9999px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #7eedaa;
      margin-bottom: 12px;
    }
    .brand-title {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-tagline {
      margin: 6px 0 0;
      font-size: 13px;
      color: #c7e8d4;
    }
    .body-content {
      padding: 36px 32px;
    }
    .footer {
      background-color: #f8faf8;
      border-top: 1px solid #eef2ef;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #5d7567;
      line-height: 1.6;
    }
    .footer-links a {
      color: #2d6a4f;
      text-decoration: none;
      font-weight: 600;
      margin: 0 8px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #2d6a4f 0%, #173324 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.25);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-badge">🌱 PlantOnAgro</div>
        <h1 class="brand-title">PlantOnAgro Living Ledger</h1>
        <p class="brand-tagline">You Plant. We Grow. Verified Agroforestry & Digital Stewardship.</p>
      </div>
      <div class="body-content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px;">
          PlantOnAgro Ecological Stewardship Initiative • Audited Field Agroforestry
        </p>
        <div class="footer-links">
          <a href="${env.FRONTEND_URL}">Marketplace</a> •
          <a href="${env.FRONTEND_URL}/buyer/dashboard">Buyer Dashboard</a> •
          <a href="mailto:support@plantonagro.com">Support</a>
        </div>
        <p style="margin: 12px 0 0; font-size: 11px; color: #8fa397;">
          This is an automated transactional security communication. Please do not reply directly to this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const EmailTemplates = {
  /**
   * Password Reset OTP Template
   */
  passwordResetOtp(name: string, otp: string, expiresInMinutes: number = 10): { subject: string; html: string; text: string } {
    const subject = `🔐 PlantOnAgro - Your Password Reset Code is ${otp}`;
    const text = `Hello ${name},\n\nYour one-time password (OTP) to reset your PlantOnAgro account password is: ${otp}\n\nThis code will expire in ${expiresInMinutes} minutes.\n\nIf you did not request this, please ignore this email or contact support immediately.\n\n— PlantOnAgro Security Team`;

    const content = `
      <h2 style="margin: 0 0 12px; font-size: 22px; color: #173324;">Password Reset Request</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #3a5042; margin: 0 0 24px;">
        Hello <strong>${name}</strong>,<br>
        We received a request to reset the password for your PlantOnAgro account. Use the 6-digit one-time verification code below to proceed:
      </p>

      <div style="background-color: #f2f8f4; border: 2px dashed #2d6a4f; border-radius: 14px; padding: 24px 20px; text-align: center; margin: 28px 0;">
        <span style="display: block; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #2d6a4f; margin-bottom: 8px;">
          YOUR VERIFICATION OTP
        </span>
        <div style="font-family: monospace, Courier, sans-serif; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #173324; margin: 4px 0;">
          ${otp}
        </div>
        <span style="display: block; font-size: 13px; color: #557060; margin-top: 8px;">
          ⏱️ Valid for <strong>${expiresInMinutes} minutes</strong>
        </span>
      </div>

      <div style="background-color: #fff9eb; border: 1px solid #fae1a0; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px; font-size: 13px; color: #7a5405; line-height: 1.5;">
        <strong>Security Tip:</strong> Never share this code with anyone. PlantOnAgro support representatives will never ask for your password or OTP.
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #6b8273; margin: 0;">
        If you did not initiate this request, someone else may have entered your email address by mistake. Your account is still secure and no changes have been made.
      </p>
    `;

    return { subject, html: wrapInBaseLayout('Password Reset Verification Code', content), text };
  },

  /**
   * Password Reset Success Template
   */
  passwordResetSuccess(name: string): { subject: string; html: string; text: string } {
    const subject = `✅ Password Changed Successfully - PlantOnAgro`;
    const text = `Hello ${name},\n\nYour PlantOnAgro account password has been successfully reset.\n\nIf you did not make this change, please contact our support team immediately.\n\n— PlantOnAgro Security Team`;

    const content = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background-color: #e6f4ea; color: #137333; font-size: 28px;">
          ✓
        </div>
      </div>
      <h2 style="margin: 0 0 12px; font-size: 22px; color: #173324; text-align: center;">Password Changed Successfully</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #3a5042; text-align: center; margin: 0 0 28px;">
        Hello <strong>${name}</strong>,<br>
        Your account password was updated on <strong>${new Date().toUTCString()}</strong>. You can now use your new password to sign in.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.FRONTEND_URL}/login" class="button">
          Sign In to Your Account →
        </a>
      </div>

      <div style="border-top: 1px solid #eef2ef; padding-top: 18px; font-size: 12px; color: #768a7c; line-height: 1.5;">
        If you did not perform this password change, please <a href="mailto:support@plantonagro.com" style="color: #c92a2a; font-weight: 600;">contact our security team immediately</a> to secure your account.
      </div>
    `;

    return { subject, html: wrapInBaseLayout('Password Reset Successful', content), text };
  },

  /**
   * Welcome Email for New Registration
   */
  welcome(name: string): { subject: string; html: string; text: string } {
    const subject = `🌱 Welcome to PlantOnAgro, ${name}! Your Green Journey Begins.`;
    const text = `Hello ${name},\n\nWelcome to PlantOnAgro! Thank you for joining our community dedicated to verified agroforestry, digital tree adoption, and environmental regeneration.\n\nVisit your dashboard: ${env.FRONTEND_URL}/buyer/dashboard\n\n— The PlantOnAgro Team`;

    const content = `
      <h2 style="margin: 0 0 12px; font-size: 24px; color: #173324;">Welcome to PlantOnAgro! 🌿</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #3a5042; margin: 0 0 20px;">
        Dear <strong>${name}</strong>,<br>
        Thank you for joining PlantOnAgro. We connect conscious individuals and organizations with real, verified agroforestry plantations where every tree you adopt is nurtured, geotagged, and preserved for life.
      </p>

      <div style="background-color: #f7faf8; border-radius: 14px; border: 1px solid #e2ebe5; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; font-size: 16px; color: #173324;">Here is what you can do next:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #3d5546;">
          <li><strong>Adopt Native Trees:</strong> Browse climate-resilient species in Western Ghats, Nashik Valley, and beyond.</li>
          <li><strong>Digital Deeds & Impact:</strong> Receive verifiable certificates with coordinates and satellite growth monitoring.</li>
          <li><strong>Book Plantation Tours:</strong> Visit your trees in person, meet the farmers, and experience nature harvesting.</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${env.FRONTEND_URL}" class="button">
          Explore Tree Marketplace →
        </a>
      </div>
    `;

    return { subject, html: wrapInBaseLayout('Welcome to PlantOnAgro', content), text };
  },

  /**
   * Security Sign-in Alert Email
   */
  loginAlert(name: string, metadata?: { ip?: string; userAgent?: string; time?: Date }): { subject: string; html: string; text: string } {
    const timeStr = (metadata?.time || new Date()).toLocaleString('en-US', { timeZoneName: 'short' });
    const subject = `🔔 Security Notice: New Sign-in to Your PlantOnAgro Account`;
    const text = `Hello ${name},\n\nA new sign-in was recorded on your PlantOnAgro account on ${timeStr}.\nIP Address: ${metadata?.ip || 'Unknown'}\nDevice: ${metadata?.userAgent || 'Browser'}\n\nIf this was you, you can safely disregard this email. If not, please reset your password immediately.`;

    const content = `
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #173324;">New Account Sign-in Detected</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #3a5042; margin: 0 0 20px;">
        Hello <strong>${name}</strong>,<br>
        We detected a successful sign-in to your PlantOnAgro account. Here are the details of the login session:
      </p>

      <div style="background-color: #f8faf8; border: 1px solid #e1ece4; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px; line-height: 1.7; color: #2e4436;">
        <div><strong>Date & Time:</strong> ${timeStr}</div>
        <div><strong>IP Address:</strong> ${metadata?.ip || 'Local / Secure Network'}</div>
        <div><strong>Client / Device:</strong> ${metadata?.userAgent ? metadata.userAgent.substring(0, 100) : 'Web Browser'}</div>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #5a7062; margin: 0 0 24px;">
        If you recognize this activity, no action is needed. If you suspect someone else has accessed your account, please change your password immediately.
      </p>

      <div style="text-align: center;">
        <a href="${env.FRONTEND_URL}/forgot-password" style="display: inline-block; color: #b91c1c; font-size: 13px; font-weight: 600; text-decoration: underline;">
          Not you? Secure your account here →
        </a>
      </div>
    `;

    return { subject, html: wrapInBaseLayout('Security Sign-in Alert', content), text };
  },

  /**
   * Payment Complete & Digital Invoice Email
   */
  paymentReceiptWithInvoice(options: SendPaymentReceiptOptions): { subject: string; html: string; text: string } {
    const formattedAmount = `₹${options.amount.toLocaleString('en-IN')}`;
    const dateFormatted = new Date(options.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const subject = `🧾 Official Receipt & Invoice #${options.orderNumber} - PlantOnAgro`;
    const text = `Dear ${options.customerName},\n\nThank you for adopting ${options.quantity} tree(s) with PlantOnAgro!\n\nOrder Number: ${options.orderNumber}\nAmount Paid: ${formattedAmount}\nSpecies: ${options.treeSpecies}\nPlan: ${options.planType}\nReserve: ${options.reserveName}\nCertificate Number: ${options.certificateNumber || 'Issued'}\n\nView your living ledger: ${env.FRONTEND_URL}/buyer/dashboard\n\n— PlantOnAgro`;

    const treeTagsList = (options.treeTags && options.treeTags.length > 0)
      ? options.treeTags.map((tag) => `<span style="display: inline-block; background-color: #eef7f2; border: 1px solid #c9e3d3; color: #173324; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-family: monospace; margin: 2px 4px 2px 0;">${tag}</span>`).join('')
      : `<span style="font-size: 12px; color: #5a7062;">Assigned in living ledger</span>`;

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5ede7; padding-bottom: 18px; margin-bottom: 24px;">
        <div>
          <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
            ✓ Payment Received
          </span>
          <h2 style="margin: 8px 0 2px; font-size: 22px; color: #173324;">Tax Invoice & Adoption Deed</h2>
          <div style="font-size: 13px; color: #62776a;">Invoice Ref: <strong>${options.orderNumber}</strong></div>
        </div>
        <div style="text-align: right; font-size: 13px; color: #62776a;">
          <div><strong>Date:</strong> ${dateFormatted}</div>
          <div><strong>Payment ID:</strong> ${options.transactionRef || 'Razorpay Verified'}</div>
        </div>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #2e4436; margin: 0 0 20px;">
        Dear <strong>${options.customerName}</strong>,<br>
        Thank you for supporting regenerative agroforestry. Your payment has been confirmed, your trees have been registered on our living ledger, and your official Digital Deed of Adoption has been issued.
      </p>

      <!-- Invoice Itemized Table -->
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px;">
        <thead>
          <tr style="background-color: #f2f7f4; color: #173324; text-align: left;">
            <th style="padding: 12px; border-bottom: 1.5px solid #d4e3d9;">Description</th>
            <th style="padding: 12px; border-bottom: 1.5px solid #d4e3d9; text-align: center;">Qty</th>
            <th style="padding: 12px; border-bottom: 1.5px solid #d4e3d9; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 14px 12px; border-bottom: 1px solid #edf2ee; color: #1e3327;">
              <strong>${options.treeSpecies}</strong> (${options.planType})<br>
              <span style="font-size: 12px; color: #5a7364;">Eco-Reserve: ${options.reserveName}</span>
              ${options.dedicationMessage ? `<br><span style="font-size: 11px; color: #728a7c; font-style: italic;">“${options.dedicationMessage}”</span>` : ''}
            </td>
            <td style="padding: 14px 12px; border-bottom: 1px solid #edf2ee; text-align: center; color: #1e3327;">
              ${options.quantity}
            </td>
            <td style="padding: 14px 12px; border-bottom: 1px solid #edf2ee; text-align: right; font-weight: 600; color: #173324;">
              ${formattedAmount}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px 12px; text-align: right; color: #5b7364; font-size: 12px;">Subtotal:</td>
            <td style="padding: 10px 12px; text-align: right; color: #173324; font-size: 12px;">${formattedAmount}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 6px 12px; text-align: right; color: #5b7364; font-size: 12px;">Taxes & Agro-fees (incl.):</td>
            <td style="padding: 6px 12px; text-align: right; color: #173324; font-size: 12px;">₹0.00</td>
          </tr>
          <tr style="background-color: #fafcfb;">
            <td colspan="2" style="padding: 14px 12px; text-align: right; font-size: 15px; font-weight: 700; color: #173324; border-top: 2px solid #d4e3d9;">
              Total Paid:
            </td>
            <td style="padding: 14px 12px; text-align: right; font-size: 17px; font-weight: 800; color: #173324; border-top: 2px solid #d4e3d9;">
              ${formattedAmount}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Tree Tags & Certificate Meta Card -->
      <div style="background-color: #f7faf8; border: 1px solid #d8e8de; border-radius: 12px; padding: 18px; margin: 24px 0;">
        <div style="margin-bottom: 10px;">
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #2d6a4f; letter-spacing: 1px;">
            Digital Deed Certificate:
          </span>
          <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #173324; margin-top: 2px;">
            ${options.certificateNumber || 'POA-CERT-ISSUED'}
          </div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #2d6a4f; letter-spacing: 1px;">
            Registered Tree Tag(s):
          </span>
          <div style="margin-top: 6px;">
            ${treeTagsList}
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${env.FRONTEND_URL}/buyer/dashboard" class="button">
          View in Buyer Dashboard & Download Certificate →
        </a>
      </div>
    `;

    return { subject, html: wrapInBaseLayout(`Invoice #${options.orderNumber}`, content), text };
  },

  /**
   * Plantation Visit Booking Confirmation Email
   */
  visitBookingConfirmation(options: SendVisitBookingConfirmationOptions): { subject: string; html: string; text: string } {
    const subject = `🌲 Plantation Visit Confirmed [Ref: ${options.bookingReference}] - PlantOnAgro`;
    const text = `Dear ${options.adopterName},\n\nYour plantation visit is confirmed!\n\nBooking Reference: ${options.bookingReference}\nGuest Pass: ${options.guestPassCode || 'ACTIVE'}\nVisit Date: ${options.visitDate}\nTime Slot: ${options.timeSlot}\nLocation: ${options.reserveName}\nGuests: ${options.numberOfGuests}\n\n— PlantOnAgro Tours`;

    const content = `
      <div style="border-bottom: 2px solid #e5ede7; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
          ✓ Booking Confirmed
        </span>
        <h2 style="margin: 8px 0 2px; font-size: 22px; color: #173324;">Plantation Visit & Eco-Pass</h2>
        <div style="font-size: 13px; color: #62776a;">Booking Reference: <strong>${options.bookingReference}</strong></div>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #2e4436; margin: 0 0 20px;">
        Dear <strong>${options.adopterName}</strong>,<br>
        Your visit to our agroforest plantation has been confirmed. Our field naturalists look forward to hosting you and introducing you to your adopted living trees.
      </p>

      <div style="background-color: #f4f9f5; border: 1px solid #c9e0d1; border-radius: 14px; padding: 22px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
          <span style="color: #557060;">Visit Date:</span>
          <strong style="color: #173324;">${options.visitDate}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
          <span style="color: #557060;">Time Slot:</span>
          <strong style="color: #173324;">${options.timeSlot}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
          <span style="color: #557060;">Reserve Location:</span>
          <strong style="color: #173324;">${options.reserveName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
          <span style="color: #557060;">Number of Guests:</span>
          <strong style="color: #173324;">${options.numberOfGuests} Person(s)</strong>
        </div>
        ${options.guestPassCode ? `
        <div style="border-top: 1px dashed #bdd8c7; padding-top: 14px; margin-top: 8px; text-align: center;">
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #2d6a4f; letter-spacing: 1px; display: block; margin-bottom: 4px;">
            GUEST GATE ENTRY PASS
          </span>
          <span style="font-family: monospace; font-size: 20px; font-weight: 800; color: #173324; letter-spacing: 3px;">
            ${options.guestPassCode}
          </span>
        </div>` : ''}
      </div>

      <div style="background-color: #fff9eb; border: 1px solid #fae1a0; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px; font-size: 13px; color: #7a5405; line-height: 1.5;">
        <strong>Visitor Tips:</strong> Please wear comfortable footwear and outdoor attire. Mineral water and local eco-refreshments are provided at the plantation welcome center.
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.FRONTEND_URL}/buyer/dashboard" class="button">
          View Visit Details in Dashboard →
        </a>
      </div>
    `;

    return { subject, html: wrapInBaseLayout(`Visit Confirmed [${options.bookingReference}]`, content), text };
  },
};
