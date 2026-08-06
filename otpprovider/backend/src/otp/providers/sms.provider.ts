import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpDeliveryProvider } from './otp-provider.interface';

/**
 * SMS delivery provider.
 *
 * If TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER are set in
 * the environment, this uses the Twilio REST API directly (no SDK dependency
 * required). Otherwise it falls back to a "console" provider that logs the
 * code — useful for local development/demo without a paid SMS account.
 */
@Injectable()
export class SmsProvider implements OtpDeliveryProvider {
  private readonly logger = new Logger('SmsProvider');
  private readonly accountSid?: string;
  private readonly authToken?: string;
  private readonly fromNumber?: string;

  constructor(private config: ConfigService) {
    this.accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    this.authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.config.get<string>('TWILIO_FROM_NUMBER');
  }

  async send(destination: string, code: string) {
    const message = `Your OTPProvider Cloud verification code is: ${code}`;

    if (this.accountSid && this.authToken && this.fromNumber) {
      try {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
        const body = new URLSearchParams({
          To: destination,
          From: this.fromNumber,
          Body: message,
        });
        const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        const data = await res.json();
        if (!res.ok) {
          this.logger.error(`Twilio send failed: ${JSON.stringify(data)}`);
          return { success: false, error: data.message || 'Provider error' };
        }
        return { success: true, providerRef: data.sid };
      } catch (err: any) {
        this.logger.error(`Twilio send exception: ${err.message}`);
        return { success: false, error: err.message };
      }
    }

    // Fallback: console/demo provider
    this.logger.log(`[DEMO SMS -> ${destination}] ${message}`);
    return { success: true, providerRef: 'demo-console' };
  }
}
