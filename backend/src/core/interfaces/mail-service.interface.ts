export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendPaymentReceiptOptions {
  to: string;
  customerName: string;
  orderNumber: string;
  transactionRef: string;
  date: Date;
  amount: number;
  treeSpecies: string;
  planType: string;
  reserveName: string;
  quantity: number;
  certificateNumber?: string;
  treeTags?: string[];
  dedicationMessage?: string;
}

export interface SendVisitBookingConfirmationOptions {
  to: string;
  adopterName: string;
  bookingReference: string;
  visitDate: string;
  timeSlot: string;
  reserveName: string;
  numberOfGuests: number;
  experienceTitle?: string;
  guestPassCode?: string;
}

export interface IMailService {
  sendMail(options: SendEmailOptions): Promise<boolean>;
  sendOtpEmail(email: string, name: string, otp: string, expiresInMinutes?: number): Promise<boolean>;
  sendPasswordResetSuccessEmail(email: string, name: string): Promise<boolean>;
  sendWelcomeEmail(email: string, name: string): Promise<boolean>;
  sendLoginAlertEmail(
    email: string,
    name: string,
    metadata?: { ip?: string; userAgent?: string; time?: Date }
  ): Promise<boolean>;
  sendPaymentReceiptWithInvoiceEmail(options: SendPaymentReceiptOptions): Promise<boolean>;
  sendVisitBookingConfirmationEmail(options: SendVisitBookingConfirmationOptions): Promise<boolean>;
}
