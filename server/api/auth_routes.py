from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import secrets
import logging
import hashlib
import re
from datetime import datetime, timedelta, timezone

router = APIRouter(tags=["Auth"])

# In-memory store for OTPs (For production, use Redis)
# Format: OTP_STORE[target] = {"hash": str, "expires_at": datetime}
OTP_STORE = {}

logger = logging.getLogger(__name__)

class SendEmailOTPRequest(BaseModel):
    email: str

class VerifyEmailOTPRequest(BaseModel):
    email: str
    otp: str

class SMSOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    target: str # email or phone
    code: str

def hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()

def clean_expired_otps():
    now = datetime.now(timezone.utc)
    expired_keys = [k for k, v in OTP_STORE.items() if v["expires_at"] < now]
    for k in expired_keys:
        del OTP_STORE[k]

def is_valid_email(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(pattern, email) is not None

@router.post("/auth/send-email-otp")
async def send_email_otp(body: SendEmailOTPRequest):
    if not is_valid_email(body.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    clean_expired_otps()
    
    # Generate 6-digit numeric OTP
    code = "".join(secrets.choice("0123456789") for _ in range(6))
    
    expiry_minutes = int(os.environ.get("OTP_EXPIRY_MINUTES", "5"))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
    
    OTP_STORE[body.email] = {
        "hash": hash_otp(code),
        "expires_at": expires_at
    }
    
    resend_key = os.environ.get("RESEND_API_KEY")
    if not resend_key:
        logger.error("RESEND_API_KEY is not set. Cannot send OTP.")
        raise HTTPException(status_code=500, detail="Email service not configured")
        
    try:
        import resend
        resend.api_key = resend_key
        html_content = f"""
        <p>DANGEN Security Verification</p>
        <p>Your verification code is:</p>
        <h2>{code}</h2>
        <p>This code expires in {expiry_minutes} minutes.</p>
        <p>If you did not request this code, ignore this email.</p>
        """
        
        resend.Emails.send({
            "from": "onboarding@dangen.io",
            "to": body.email,
            "subject": "Verify Your DANGEN Account",
            "html": html_content
        })
        logger.info(f"Sent email OTP to {body.email} via Resend")
    except Exception as e:
        logger.error(f"Failed to send email via Resend: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email OTP")

    return {"success": True, "message": "OTP sent successfully"}

@router.post("/auth/verify-email-otp")
async def verify_email_otp(body: VerifyEmailOTPRequest):
    clean_expired_otps()
    
    record = OTP_STORE.get(body.email)
    if not record:
        raise HTTPException(status_code=400, detail="OTP expired or not requested")
    
    if record["expires_at"] < datetime.now(timezone.utc):
        del OTP_STORE[body.email]
        raise HTTPException(status_code=400, detail="OTP expired")
        
    if record["hash"] == hash_otp(body.otp):
        del OTP_STORE[body.email]
        return {"success": True, "verified": True}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

@router.post("/auth/send-sms")
async def send_sms_otp(body: SMSOTPRequest):
    clean_expired_otps()
    code = "".join(secrets.choice("0123456789") for _ in range(6))
    
    expiry_minutes = int(os.environ.get("OTP_EXPIRY_MINUTES", "5"))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
    
    OTP_STORE[body.phone] = {
        "hash": hash_otp(code),
        "expires_at": expires_at
    }
    
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN")
    twilio_from = os.environ.get("TWILIO_FROM_NUMBER")
    
    if not (twilio_sid and twilio_token and twilio_from):
        logger.error("TWILIO credentials are not set. Cannot send SMS.")
        raise HTTPException(status_code=500, detail="SMS service not configured")
        
    try:
        from twilio.rest import Client
        client = Client(twilio_sid, twilio_token)
        message = client.messages.create(
            body=f"Your DANGEN verification code is: {code}",
            from_=twilio_from,
            to=body.phone
        )
        logger.info(f"Sent SMS OTP to {body.phone} via Twilio. SID: {message.sid}")
    except Exception as e:
        logger.error(f"Failed to send SMS via Twilio: {e}")
        raise HTTPException(status_code=500, detail="Failed to send SMS OTP")

    return {"status": "success", "message": "SMS OTP sent"}

@router.post("/auth/verify")
async def verify_otp(body: VerifyOTPRequest):
    clean_expired_otps()
    
    record = OTP_STORE.get(body.target)
    if not record:
        raise HTTPException(status_code=400, detail="OTP expired or not requested")
    
    if record["expires_at"] < datetime.now(timezone.utc):
        del OTP_STORE[body.target]
        raise HTTPException(status_code=400, detail="OTP expired")
        
    if record["hash"] == hash_otp(body.code):
        del OTP_STORE[body.target]
        return {"status": "success", "message": "Verification successful"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
