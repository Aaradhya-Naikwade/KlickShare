export async function sendOtpSms(phone: string, otp: string) {
  const baseUrl = process.env.SMS_API_URL!;
  const authkey = process.env.SMS_AUTH_KEY!;
  const sender = process.env.SMS_SENDER!;
  const route = process.env.SMS_ROUTE || "2";
  const country = process.env.SMS_COUNTRY || "91";
  const templateId = process.env.SMS_DLT_TEMPLATE_ID!;

  const message = `Dear User, Your OTP for Login Haltn is ${otp}. Please do not share it. With Regards Haltn`;

  const params = new URLSearchParams();
  params.set("authkey", authkey);
  params.set("sender", sender);
  params.set("route", route);
  params.set("country", country);
  params.set("DLT_TE_ID", templateId);
  params.set("mobiles", `${country}${phone}`);
  params.set("message", message);

  const url = `${baseUrl}?${params.toString()}`;

  const res = await fetch(url, { method: "GET" });
  const text = await res.text();

  return text; // provider response
}
