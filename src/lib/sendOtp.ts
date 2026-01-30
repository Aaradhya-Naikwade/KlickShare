export async function sendOtpSMS(phone: string, otp: string) {
  try {
    const authKey = process.env.OTP_AUTHKEY;
    const sender = process.env.OTP_SENDER;
    const route = process.env.OTP_ROUTE;
    const country = process.env.OTP_COUNTRY;
    const templateId = process.env.OTPTEMP01;

    const message = `Dear User, Your OTP for Login Haltn is ${otp}. Please do not share it. With Regards Haltn`;

    const url = `http://136.243.171.112/api/sendhttp.php?authkey=${authKey}&sender=${sender}&route=${route}&country=${country}&DLT_TE_ID=${templateId}&mobiles=${country}${phone}&message=${encodeURIComponent(
      message
    )}`;

    const res = await fetch(url); // ✅ global fetch
    const text = await res.text();
    return text;
  } catch (err) {
    console.error("Send OTP error:", err);
    return "";
  }
}
