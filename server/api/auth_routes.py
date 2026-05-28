from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import os
import random
import logging

router = APIRouter(tags=["Auth"])

# In-memory store for OTPs (For production, use Redis)
OTP_STORE = {}

logger = logging.getLogger(__name__)

class EmailOTPRequest(BaseModel):
    email: str

class SMSOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    target: str # email or phone
    code: str

@router.post("/auth/send-email")
async def send_email_otp(body: EmailOTPRequest):
    code = f"{random.randint(100000, 999999)}"
    OTP_STORE[body.email] = code
    
    resend_key = os.environ.get("RESEND_API_KEY")
    if resend_key:
        try:
            import resend
            resend.api_key = resend_key
            resend.Emails.send({
                "from": "onboarding@dangen.io",
                "to": body.email,
                "subject": "DANGEN Console - Verification Code",
                "html": f"<p>Your DANGEN verification code is: <strong>{code}</strong></p>"
            })
            logger.info(f"Sent email OTP to {body.email} via Resend")
        except Exception as e:
            logger.error(f"Failed to send email via Resend: {e}")
            raise HTTPException(status_code=500, detail="Failed to send email OTP")
    else:
        # Fallback to local logging for development without keys
        logger.warning(f"RESEND_API_KEY not set. Mock Email OTP for {body.email} is {code}")
        print(f"\n[DANGEN AUTH] MOCK EMAIL OTP FOR {body.email}: {code}\n")

    return {"status": "success", "message": "Email OTP sent"}

@router.post("/auth/send-sms")
async def send_sms_otp(body: SMSOTPRequest):
    code = f"{random.randint(100000, 999999)}"
    OTP_STORE[body.phone] = code
    
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN")
    twilio_from = os.environ.get("TWILIO_FROM_NUMBER")
    
    if twilio_sid and twilio_token and twilio_from:
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
    else:
        # Fallback to local logging for development without keys
        logger.warning(f"TWILIO credentials not set. Mock SMS OTP for {body.phone} is {code}")
        print(f"\n[DANGEN AUTH] MOCK SMS OTP FOR {body.phone}: {code}\n")

    return {"status": "success", "message": "SMS OTP sent"}

@router.post("/auth/verify")
async def verify_otp(body: VerifyOTPRequest):
    stored_code = OTP_STORE.get(body.target)
    if not stored_code:
        raise HTTPException(status_code=400, detail="OTP expired or not requested")
    
    if stored_code == body.code:
        # Clear the code after successful verification
        del OTP_STORE[body.target]
        return {"status": "success", "message": "Verification successful"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
