import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config

def load_email_template():
    backend_dir = os.path.dirname(os.path.dirname(__file__))
    template_path = os.path.join(backend_dir, 'templates', 'verification_email.html')
    with open(template_path, 'r', encoding='utf-8') as file:
        return file.read()

def send_mail(email_to, otp):
    """Send verification email with professional HTML template"""
    sender_email = "auppecampus@icloud.com"
    receiver_email = email_to
    app_specific_password = Config.EMAIL_PASSWORD

    # Create message
    message = MIMEMultipart("alternative")
    message["From"] = f"AUPP eCampus <{sender_email}>"
    message["To"] = receiver_email
    message["Subject"] = "🎓 Verify Your AUPP eCampus Account - Action Required"

    # Load and customize HTML template
    html_template = load_email_template()
    html_content = html_template.replace("{OTP_CODE}", str(otp))

    # Create plain text version as fallback
    text_content = f"""
    AUPP eCampus - Email Verification
    
    Welcome to AUPP eCampus!
    
    Your verification code is: {otp}
    
    This code expires in 10 minutes.
    
    Please enter this code on the registration page to complete your account setup.
    
    If you didn't request this code, please ignore this email.
    
    ---
    AUPP eCampus
    American University of Phnom Penh
    Need help? Contact us at support@aupp.edu.kh
    """

    # Create MIMEText objects
    text_part = MIMEText(text_content, "plain")
    html_part = MIMEText(html_content, "html")

    # Add parts to message
    message.attach(text_part)
    message.attach(html_part)

    # Send email
    smtp_server = "smtp.mail.me.com"
    port = 587

    try:
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()
        server.login(sender_email, app_specific_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()
        print(f"✅ Verification email sent successfully to {email_to}")
        return True
    except Exception as e:
        print(f"❌ Error sending email to {email_to}: {e}")
        return False
