import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from pathlib import Path
from config import get_settings

settings = get_settings()


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    attachment_path: str | None = None,
    attachment_name: str | None = None,
) -> bool:
    """Send email via Gmail SMTP. Returns True on success."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.email_from_name} <{settings.support_email}>"
        msg["To"] = to_email
        msg["Bcc"] = settings.support_email  # always BCC support

        msg.attach(MIMEText(html_body, "html"))

        if attachment_path and Path(attachment_path).exists():
            with open(attachment_path, "rb") as f:
                part = MIMEApplication(f.read(), Name=attachment_name or "certificate.pdf")
                part["Content-Disposition"] = f'attachment; filename="{attachment_name or "certificate.pdf"}"'
                msg.attach(part)

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(settings.support_email, settings.gmail_app_password)
            server.sendmail(settings.support_email, [to_email, settings.support_email], msg.as_string())

        return True
    except Exception as e:
        print(f"[Email] Failed to send to {to_email}: {e}")
        return False


def send_donation_confirmation(
    donor_email: str,
    donor_name: str,
    amount: float,
    transaction_id: str,
    certificate_path: str | None = None,
) -> bool:
    """Send 80G certificate email to donor."""
    subject = f"Donation Receipt — Dhyan Foundation Guwahati (₹{amount:,.0f})"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #FF6B00, #2D6A4F); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🙏 Thank You, {donor_name}!</h1>
        <p style="color: #ffe8cc; margin: 8px 0 0;">Your generosity makes a difference</p>
      </div>
      <div style="background: #fff8f0; padding: 30px; border: 1px solid #ffe0b2; border-top: none;">
        <p style="font-size: 16px;">Dear <strong>{donor_name}</strong>,</p>
        <p>Your donation of <strong>₹{amount:,.0f}</strong> has been received successfully.</p>
        <div style="background: white; border: 1px solid #ddd; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Transaction ID:</strong> {transaction_id}</p>
          <p style="margin: 4px 0;"><strong>Amount:</strong> ₹{amount:,.0f}</p>
          <p style="margin: 4px 0;"><strong>Organization:</strong> Dhyan Foundation Guwahati</p>
          <p style="margin: 4px 0;"><strong>PAN:</strong> AAATD5390E</p>
        </div>
        <p>Your 80G donation certificate is attached to this email. Please save it for your tax records.</p>
        <p style="color: #666; font-size: 14px;">
          This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="font-size: 13px; color: #888;">
          Dhyan Foundation Guwahati | Guwahati, Assam<br>
          Email: info@dhyanfoundation.com | Phone: +91-9999567895<br>
          Website: <a href="https://dhyanfoundationguwahati.org">dhyanfoundationguwahati.org</a>
        </p>
      </div>
    </body>
    </html>
    """

    return send_email(
        to_email=donor_email,
        subject=subject,
        html_body=html_body,
        attachment_path=certificate_path,
        attachment_name=f"80G_Certificate_{transaction_id}.pdf",
    )
