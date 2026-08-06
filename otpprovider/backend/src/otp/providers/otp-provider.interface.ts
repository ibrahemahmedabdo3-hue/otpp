export interface OtpDeliveryProvider {
  send(destination: string, code: string): Promise<{ success: boolean; providerRef?: string; error?: string }>;
}
