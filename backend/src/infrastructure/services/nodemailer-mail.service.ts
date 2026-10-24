import nodemailer, { Transporter } from 'nodemailer';
import {
  IMailService,
  SendEmailOptions,
  SendPaymentReceiptOptions,
  SendVisitBookingConfirmationOptions,
} from '../../core/interfaces/mail-service.interface';
import { EmailTemplates } from './email-templates';

export class NodemailerMailService implements IMailService {
  private transporter: Transporter | null = null;
  private readonly isConfigured: boolean;
  private readonly defaultFrom: string;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly secure: boolean,
    private readonly user: string,
    private readonly pass: string,
    defaultFrom: string = 'PlantOnAgro <no-reply@plantonagro.com>'
  ) {
    this.defaultFrom = defaultFrom.trim() || 'PlantOnAgro <no-reply@plantonagro.com>';
    this.isConfigured = Boolean(this.host && this.host.trim() && this.user && this.user.trim());

    if (this.isConfigured) {
      try {
        this.transporter = nodemailer.createTransport({
          host: this.host.trim(),
          port: this.port,
          secure: this.secure,
          auth: {
            user: this.user.trim(),
            pass: this.pass ? this.pass.trim() : '',
          },
        });
        console.log(`📧 [EMAIL SERVICE] Configured with SMTP host: ${this.host}:${this.port}`);
      } catch (err) {
        console.error('❌ [EMAIL SERVICE] Failed to initialize SMTP transporter:', err);
      }
    } else {
      console.log('📬 [EMAIL SERVICE] Running in Development / Simulation mode (SMTP credentials not provided in .env).');
      console.log('   All dispatched emails (OTP, Invoices, Welcome alerts) will be logged to the console with full details.');
    }
  }

  public async sendMail(options: SendEmailOptions): Promise<boolean> {
    const from = this.defaultFrom;

    if (this.isConfigured && this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          replyTo: options.replyTo,
        });

        console.log(`✅ [EMAIL SENT] MessageId: ${info.messageId} -> To: ${options.to} | Subject: "${options.subject}"`);
        return true;
      } catch (error) {
        console.error(`❌ [EMAIL ERROR] Failed to send email via SMTP to ${options.to}:`, error);
        // Fall back to local console dispatch so flow doesn't break
      }
    }

    // Simulation / Development Fallback output
    console.log('\n───────────────────────────────────────────────────────────────────');
    console.log(`📨 [SIMULATED EMAIL DISPATCH]`);
    console.log(`   To:      ${options.to}`);
    console.log(`   From:    ${from}`);
    console.log(`   Subject: ${options.subject}`);
    if (options.text) {
      console.log(`   Snippet: ${options.text.substring(0, 150).replace(/\n/g, ' ')}...`);
    }
    console.log('───────────────────────────────────────────────────────────────────\n');
    return true;
  }

  public async sendOtpEmail(
    email: string,
    name: string,
    otp: string,
    expiresInMinutes: number = 10
  ): Promise<boolean> {
    const template = EmailTemplates.passwordResetOtp(name || 'Customer', otp, expiresInMinutes);
    console.log(`🔑 [PASSWORD RESET OTP] Generated OTP for ${email}: >>> ${otp} <<< (expires in ${expiresInMinutes}m)`);
    return this.sendMail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendPasswordResetSuccessEmail(email: string, name: string): Promise<boolean> {
    const template = EmailTemplates.passwordResetSuccess(name || 'Customer');
    return this.sendMail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const template = EmailTemplates.welcome(name || 'Eco-Citizen');
    return this.sendMail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendLoginAlertEmail(
    email: string,
    name: string,
    metadata?: { ip?: string; userAgent?: string; time?: Date }
  ): Promise<boolean> {
    const template = EmailTemplates.loginAlert(name || 'User', metadata);
    return this.sendMail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendPaymentReceiptWithInvoiceEmail(options: SendPaymentReceiptOptions): Promise<boolean> {
    const template = EmailTemplates.paymentReceiptWithInvoice(options);
    return this.sendMail({
      to: options.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendVisitBookingConfirmationEmail(
    options: SendVisitBookingConfirmationOptions
  ): Promise<boolean> {
    const template = EmailTemplates.visitBookingConfirmation(options);
    return this.sendMail({
      to: options.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}
