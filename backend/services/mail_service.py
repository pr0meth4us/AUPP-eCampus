import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import config


def send_mail(email_to, otp):
    sender_email = "auppecampus@icloud.com"
    receiver_email = email_to
    app_specific_password = config.EMAIL_PASSWORD

    subject = "Test Email"
    body = otp

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    smtp_server = "smtp.mail.me.com"
    port = 587
    server = smtplib.SMTP(smtp_server, port)

    try:
        server.starttls()
        server.login(sender_email, app_specific_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")
    finally:
        server.quit()
