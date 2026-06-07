import smtplib
from email.mime.text import MIMEText

def send_email(
    to_email,
    subject,
    body
):
    sender =  "yourgmail@gmail.com"

    password =  "app-password"

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    server =smtplib.SMTP(
        "smtp.gmail.com",
        587
      )

    server.starttls()

    server.login(
      sender,
      password
    )

    server.sendmail(
      sender,
      to_email,
      msg.as_string()
    )

    server.quit()
