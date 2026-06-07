"""
Email notification service
Handles sending emails to applicants
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models import EmailLog

# Email configuration
SMTP_SERVER = "smtp.gmail.com"  # Change to your email provider
SMTP_PORT = 587
SENDER_EMAIL = "your-email@gmail.com"  # Change this
SENDER_PASSWORD = "your-app-password"  # Change this (use app-specific password)

def send_email(recipient_email: str, subject: str, body: str, application_id: int = None, db: Session = None) -> bool:
    """
    Send email and log it in database
    
    Args:
        recipient_email: Recipient email address
        subject: Email subject
        body: Email body (HTML or plain text)
        application_id: Optional application ID for linking
        db: Database session
    
    Returns:
        bool: True if sent successfully, False otherwise
    """
    try:
        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        
        # Attach HTML body
        part = MIMEText(body, "html")
        message.attach(part)
        
        # Send via SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        # Log email in database if db session provided
        if db:
            email_log = EmailLog(
                recipient_email=recipient_email,
                subject=subject,
                body=body[:500],  # Store truncated body
                application_id=application_id,
                status="sent"
            )
            db.add(email_log)
            db.commit()
        
        return True
    
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        
        # Log failed email in database if db session provided
        if db:
            email_log = EmailLog(
                recipient_email=recipient_email,
                subject=subject,
                body=body[:500],
                application_id=application_id,
                status="failed"
            )
            db.add(email_log)
            db.commit()
        
        return False

def send_application_confirmation(
    recipient_email: str,
    full_name: str,
    university_name: str,
    major_name: str,
    application_id: int = None,
    db: Session = None
) -> bool:
    """Send application submission confirmation email"""
    
    subject = "Xác nhận nộp hồ sơ tuyển sinh"
    
    body = f"""
    <html>
        <body>
            <h2>Xác nhận nộp hồ sơ tuyển sinh</h2>
            <p>Xin chào {full_name},</p>
            <p>Hồ sơ tuyển sinh của bạn đã được nộp thành công.</p>
            <p><strong>Thông tin hồ sơ:</strong></p>
            <ul>
                <li>Trường: {university_name}</li>
                <li>Ngành: {major_name}</li>
                <li>Mã hồ sơ: {application_id}</li>
            </ul>
            <p>Vui lòng theo dõi trạng thái hồ sơ tại: <a href="http://localhost:8002/student">Cổng thông tin tuyển sinh</a></p>
            <p>Trân trọng,<br/>Ban Quản lý Tuyển sinh</p>
        </body>
    </html>
    """
    
    return send_email(recipient_email, subject, body, application_id, db)

def send_application_approved(
    recipient_email: str,
    full_name: str,
    university_name: str,
    major_name: str,
    application_id: int = None,
    db: Session = None
) -> bool:
    """Send application approved email"""
    
    subject = "Hồ sơ tuyển sinh được phê duyệt"
    
    body = f"""
    <html>
        <body>
            <h2 style="color: green;">Hồ sơ được phê duyệt</h2>
            <p>Xin chào {full_name},</p>
            <p>Chúc mừng! Hồ sơ tuyển sinh của bạn đã được phê duyệt.</p>
            <p><strong>Thông tin hồ sơ:</strong></p>
            <ul>
                <li>Trường: {university_name}</li>
                <li>Ngành: {major_name}</li>
                <li>Mã hồ sơ: {application_id}</li>
                <li>Trạng thái: <span style="color: green;">Được phê duyệt</span></li>
            </ul>
            <p>Vui lòng liên hệ với Phòng Tuyển sinh để biết thêm chi tiết.</p>
            <p>Trân trọng,<br/>Ban Quản lý Tuyển sinh</p>
        </body>
    </html>
    """
    
    return send_email(recipient_email, subject, body, application_id, db)

def send_application_rejected(
    recipient_email: str,
    full_name: str,
    university_name: str,
    major_name: str,
    reason: str = None,
    application_id: int = None,
    db: Session = None
) -> bool:
    """Send application rejected email"""
    
    subject = "Hồ sơ tuyển sinh không được phê duyệt"
    
    reason_text = f"<p><strong>Lý do:</strong> {reason}</p>" if reason else ""
    
    body = f"""
    <html>
        <body>
            <h2 style="color: red;">Hồ sơ không được phê duyệt</h2>
            <p>Xin chào {full_name},</p>
            <p>Xin lỗi, hồ sơ tuyển sinh của bạn không được phê duyệt.</p>
            <p><strong>Thông tin hồ sơ:</strong></p>
            <ul>
                <li>Trường: {university_name}</li>
                <li>Ngành: {major_name}</li>
                <li>Mã hồ sơ: {application_id}</li>
                <li>Trạng thái: <span style="color: red;">Không được phê duyệt</span></li>
            </ul>
            {reason_text}
            <p>Bạn có thể liên hệ Phòng Tuyển sinh để tìm hiểu thêm.</p>
            <p>Trân trọng,<br/>Ban Quản lý Tuyển sinh</p>
        </body>
    </html>
    """
    
    return send_email(recipient_email, subject, body, application_id, db)
