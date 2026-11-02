export const CONFIG = {
  port: Number(process.env.PORT || 4000),
  // UPI collection details printed on the owner's payment QR.
  upi: {
    payee: process.env.UPI_PAYEE || 'Krishna HR Rochani',
    upiId: process.env.UPI_ID || 'krishnahrrochani@okhdfcbank',
    bank: process.env.UPI_BANK || 'IDBI Bank 0538',
    qrImage: '/payment/upi-qr.jpeg',
    currency: 'INR'
  },
  // 'demo' auto-verifies a submitted UTR so the flow is testable end-to-end.
  // Set PAYMENT_MODE=manual to keep orders pending until an admin approves them.
  paymentMode: process.env.PAYMENT_MODE || 'demo',
  adminKey: process.env.ADMIN_KEY || 'cosmic-oracle-admin',
  freeDailyLimit: Number(process.env.FREE_DAILY_LIMIT || 25),
  site: {
    name: 'Cosmic Oracle',
    tagline: 'Tarot · Numerology · Kundli',
    description: 'Vedic astrology, Lo Shu numerology and card cartomancy — read together, warmly and honestly.'
  }
};
