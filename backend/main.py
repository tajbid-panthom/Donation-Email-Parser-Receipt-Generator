#main.py
"""
Donation Email Parser Receipt Generator - Backend API
This module provides FastAPI endpoints for parsing donation emails and generating PDF receipts.
"""

import os
import re
import io
from datetime import datetime
from random import randint
import random
from typing import Optional
from dateutil import parser as date_parser
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fpdf import FPDF

# --- Pydantic Models for Data Validation ---
class EmailTextPayload(BaseModel):
    """Request model for email text input from frontend"""
    emailText: str

class ParsedData(BaseModel):
    """Response model for parsed donation data with all required fields"""
    donorName: str          # Name of the donor
    amount: float           # Donation amount in dollars
    date: str              # Date of donation (YYYY-MM-DD format)
    paymentMethod: str     # Method of payment (e.g., Credit Card, PayPal)
    transactionId: str     # Unique transaction identifier
    charityName: str       # Name of the charity organization
    charityNumber: str     # Charity registration number
    receiptNumber: str     # Generated receipt number

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Donation Parser API",
    description="API to parse donation emails and generate PDF receipts."
)

# --- CORS Middleware Configuration ---
# Allow frontend to communicate with backend during development
origins = [
    "http://localhost:5173",  # React app running on Vite
    "http://localhost:3000",  # Alternative React port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper Functions ---
def extract_field(patterns, text):
    """
    Try a list of regex patterns and return the first match.
    
    Args:
        patterns: Single regex pattern or list of patterns to try
        text: Email text to search in
    
    Returns:
        str: First matched text or None if no match found
    """
    if isinstance(patterns, str):
        patterns = [patterns]
    
    # Try each pattern until a match is found
    for pattern in patterns:
        match = re.search(pattern, text, re.MULTILINE | re.IGNORECASE)
        if match:
            # Return captured group if available, otherwise full match
            return match.group(1).strip() if match.lastindex else match.group(0).strip()
    return None


def generate_receipt_number():
    """
    Generate unique receipt number with date and random number.
    Format: RCPT-YYYYMMDD-XXXX (where XXXX is random 4-digit number)
    
    Returns:
        str: Unique receipt number
    """
    date_str = datetime.now().strftime("%Y%m%d")
    random_number = random.randint(1000, 9999)
    return f"RCPT-{date_str}-{random_number}"

# --- API Endpoints ---
@app.post("/api/parse", response_model=ParsedData)
def parse_email(data: EmailTextPayload):
    """
    Parse donation email and extract structured data.
    
    This endpoint uses regex patterns to extract donation information from email text.
    It supports multiple formats and provides detailed error messages for missing fields.
    
    Args:
        data: EmailTextPayload containing the email text to parse
    
    Returns:
        ParsedData: Structured donation information
    
    Raises:
        HTTPException: If required fields cannot be extracted
    """
    text = data.emailText

    # Extract donor name from various greeting patterns
    # Supports: Hi John, Dear John Doe, Hello John, Hey John
    donorName = extract_field([
        r"Hi ([A-Za-z .'-]+),",      # Hi John,
        r"Dear ([A-Za-z .'-]+),",    # Dear John Doe,
        r"Hello ([A-Za-z .'-]+),",   # Hello John,
        r"Hey ([A-Za-z .'-]+),"      # Hey John,
    ], text)

    # Extract amount from various donation patterns
    # Supports: Amount: $500, donation of $500, thanks for $500 donation
    amount_str = extract_field([
        r"Amount:\s*\$([\d.,]+)",                    # Amount: $500.00
        r"donation of\s*\$([\d.,]+)",               # donation of $500
        r"thanks you for the \$([\d.,]+) donation", # thanks for $500 donation
        r"gave \$([\d.,]+) to"                      # gave $500 to
    ], text)

    # Extract date from various date patterns
    # Supports: Date: Dec 15, 2024, on Dec 15, 2024, Processed on Dec 15, 2024
    date_str = extract_field([
        r"Date:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})",     # Date: December 15, 2024
        r"on\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})",        # on December 15, 2024
        r"Processed on:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})", # Processed on: Dec 15, 2024
        r"Paid:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})"      # Paid: Dec 15, 2024
    ], text)

    # Extract payment method from various patterns
    # Supports: Payment Method: Credit Card, via PayPal, using Bank Transfer
    paymentMethod = extract_field([
        r"Payment Method:\s*([A-Za-z ]+)",  # Payment Method: Credit Card
        r"via\s*([A-Za-z ]+?)(?:\s+on|\n|\.|$)", # via PayPal
        r"via\s*([A-Za-z ]+)",              # via Credit Card
        r"Method:\s*([A-Za-z ]+)",          # Method: Credit Card
        r"using\s*([A-Za-z ]+)",            # using Bank Transfer
        r"Payment:\s*([A-Za-z ]+)"          # Payment: Credit Card
    ], text)

    # Extract transaction ID from various patterns
    # Supports: Transaction ID: TXN-12345, Txn ID: TXN-12345
    transactionId = extract_field([
        r"Transaction ID:\s*([\w\-]+)",     # Transaction ID: TXN-12345
        r"Txn ID:\s*([\w\-]+)",             # Txn ID: TXN-12345
        r"Transaction ID\s*[:\-]\s*([\w\-]+)", # Transaction ID: TXN-12345
        r"Txn ID\s*[:\-]\s*([\w\-]+)"       # Txn ID: TXN-12345
    ], text)

    # Extract charity information
    # Supports: Charity Name: Hope Foundation, to Hope Foundation
    charityName = extract_field([
        r"Charity Name:\s*(.+)",            # Charity Name: Hope Foundation
        r"to\s*(Hope Foundation)",          # to Hope Foundation
        r"Organization:\s*(.+)",            # Organization: Hope Foundation
        r"Hope Foundation",                 # Direct mention
        r"(Hope Foundation)"                # Captured mention
    ], text)

    # Extract charity registration number
    # Supports: Charity Number: CH123456, Charity Reg: CH123456
    charityNumber = extract_field([
        r"Charity Number:\s*(\w+)",         # Charity Number: CH123456
        r"Charity Registration Number:\s*(\w+)", # Charity Registration Number: CH123456
        r"Charity Reg:\s*(\w+)",            # Charity Reg: CH123456
        r"Charity No:\s*(\w+)"              # Charity No: CH123456
    ], text)

    # Validate all required fields - provide specific error messages
    if not donorName:
        raise HTTPException(status_code=400, detail="Donor name not found")
    if not amount_str:
        raise HTTPException(status_code=400, detail="Amount not found")
    if not date_str:
        raise HTTPException(status_code=400, detail="Date not found")
    if not paymentMethod:
        raise HTTPException(status_code=400, detail="Payment method not found")
    if not transactionId:
        raise HTTPException(status_code=400, detail="Transaction ID not found")
    if not charityName:
        raise HTTPException(status_code=400, detail="Charity name not found")
    if not charityNumber:
        raise HTTPException(status_code=400, detail="Charity number not found")

    # Convert amount string to float, handling comma separators
    try:
        amount = float(amount_str.replace(",", ""))
    except:
        raise HTTPException(status_code=400, detail="Invalid amount format")

    # Parse and format date using python-dateutil for flexibility
    try:
        parsed_date = date_parser.parse(date_str)
        date = parsed_date.strftime("%Y-%m-%d")
    except:
        raise HTTPException(status_code=400, detail="Invalid date format")

    # Generate unique receipt number
    receiptNumber = generate_receipt_number()

    return ParsedData(
        donorName=donorName,
        amount=amount,
        date=date,
        paymentMethod=paymentMethod,
        transactionId=transactionId,
        charityName=charityName,
        charityNumber=charityNumber,
        receiptNumber=receiptNumber
    )

@app.post("/api/download-receipt")
async def download_receipt(data: ParsedData):
    """
    Generate and download PDF receipt for donation.
    
    Creates a professional PDF receipt with all donation details and returns it
    as a downloadable file with proper headers.
    
    Args:
        data: ParsedData containing all donation information
    
    Returns:
        StreamingResponse: PDF file for download
    """
    # Initialize PDF document
    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(20, 20, 20)  # Set margins: left, top, right

    # Add logo if available (silently fail if logo not found)
    try:
        pdf.image("logo.png", x=20, y=6, w=30)
    except:
        pass  # Continue without logo if file not found

    # Header section with title and receipt information
    pdf.set_font("Helvetica", 'B', 22)
    pdf.cell(0, 10, "Donation Receipt", 0, 1, 'C')

    pdf.set_font("Helvetica", '', 12)
    pdf.cell(0, 10, f"Receipt Number: {data.receiptNumber}", 0, 1, 'C')
    pdf.cell(0, 6, f"Date: {data.date or datetime.now().strftime('%Y-%m-%d')}", 0, 1, 'C')
    pdf.line(20, 45, 190, 45)  # Horizontal line separator

    # Charity information section
    pdf.set_font("Helvetica", 'B', 14)
    pdf.cell(0, 10, "Charity Information", 0, 1)
    pdf.set_font("Helvetica", '', 12)
    pdf.cell(0, 8, f"Name: {data.charityName or 'N/A'}", 0, 1)
    pdf.cell(0, 8, f"Number: {data.charityNumber or 'N/A'}", 0, 1)
    pdf.ln(5)  # Add some spacing

    # Donor information section
    pdf.set_font("Helvetica", 'B', 14)
    pdf.cell(0, 10, "Donor Information", 0, 1)
    pdf.set_font("Helvetica", '', 12)
    pdf.cell(0, 8, f"Name: {data.donorName or 'N/A'}", 0, 1)
    pdf.ln(10)  # Add spacing before donation details

    # Donation details section with table-like layout
    pdf.set_font("Helvetica", 'B', 14)
    pdf.cell(0, 10, "Donation Details", 0, 1)
    pdf.line(20, pdf.get_y() + 1, 190, pdf.get_y() + 1)  # Section separator

    # Table header
    pdf.set_font("Helvetica", 'B', 12)
    pdf.cell(18, 10, "Amount", 0, 2, 'R')
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())  # Table header line

    # Donation line item
    pdf.set_font("Helvetica", '', 12)
    pdf.cell(140, 10, f"Donation - Transaction ID: {data.transactionId or 'N/A'}", 0, 0)
    pdf.cell(30, 10, f"${data.amount:.2f}", 0, 1, 'R')

    # Total line with separator
    pdf.line(130, pdf.get_y(), 190, pdf.get_y())  # Partial line before total
    pdf.set_font("Helvetica", 'B', 12)
    pdf.cell(140, 10, "Total Donated:", 0, 0)
    pdf.cell(30, 10, f"${data.amount:.2f}", 0, 1, 'R')
    pdf.ln(15)  # Spacing before thank you message

    # Thank you message
    pdf.set_font("Helvetica", 'I', 16)
    pdf.cell(0, 10, "Thank you for your generous donation!", 0, 1, 'C')

    # Convert PDF to bytes for streaming response
    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    buffer = io.BytesIO(pdf_bytes)

    # Set headers for file download
    headers = {
        'Content-Disposition': f'attachment; filename="Receipt-{data.receiptNumber}.pdf"'
    }

    return StreamingResponse(buffer, media_type='application/pdf', headers=headers)

@app.post("/api/preview-receipt")
async def preview_receipt(data: ParsedData):
    """
    Generate PDF receipt for preview (inline display).
    
    Similar to download endpoint but returns PDF for inline display in browser
    instead of triggering download.
    
    Args:
        data: ParsedData containing all donation information
    
    Returns:
        StreamingResponse: PDF file for inline display
    """
    # Initialize PDF document (same as download endpoint)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(20, 20, 20)

    # Add logo if available
    try:
        pdf.image("logo.png", x=20, y=6, w=30)
    except:
        pass

    # Header section
    pdf.set_font("Helvetica", 'B', 22)
    pdf.cell(0, 10, "Donation Receipt", 0, 1, 'C')

    pdf.set_font("Helvetica", '', 12)
    pdf.cell(0, 10, f"Receipt Number: {data.receiptNumber}", 0, 1, 'C')
    pdf.cell(0, 6, f"Date: {data.date or datetime.now().strftime('%Y-%m-%d')}", 0, 1, 'C')
    pdf.line(20, 45, 190, 45)

    # Charity information
    pdf.set_font("Helvetica", 'B', 14)
    pdf.cell(0, 10, "Charity Information", 0, 1)
    pdf.set_font("Helvetica", '', 12)
    pdf.cell(0, 8, f"Name: {data.charityName or 'N/A'}", 0, 1)
    pdf.cell(0, 8, f"Number: {data.charityNumber or 'N/A'}", 0, 1)
    pdf.ln(5)

    # Donor information
    pdf.set_font("Helvetica", 'B', 14)
    pdf.cell(0, 10, "Donor Information", 0, 1)
    pdf.set_font("Helvetica", '', 12)
    pdf.cell(0, 8, f"Name: {data.donorName or 'N/A'}", 0, 1)
    pdf.ln(10)

    # Donation details with table-like layout
    pdf.set_font("Helvetica", 'B', 14)
    pdf.cell(0, 10, "Donation Details", 0, 1)
    pdf.line(20, pdf.get_y() + 1, 190, pdf.get_y() + 1)

    pdf.set_font("Helvetica", 'B', 12)
    pdf.cell(18, 10, "Amount", 0, 2, 'R')
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())

    pdf.set_font("Helvetica", '', 12)
    pdf.cell(140, 10, f"Donation - Transaction ID: {data.transactionId or 'N/A'}", 0, 0)
    pdf.cell(30, 10, f"${data.amount:.2f}", 0, 1, 'R')

    pdf.line(130, pdf.get_y(), 190, pdf.get_y())
    pdf.set_font("Helvetica", 'B', 12)
    pdf.cell(140, 10, "Total Donated:", 0, 0)
    pdf.cell(30, 10, f"${data.amount:.2f}", 0, 1, 'R')
    pdf.ln(15)

    # Thank you message
    pdf.set_font("Helvetica", 'I', 16)
    pdf.cell(0, 10, "Thank you for your generous donation!", 0, 1, 'C')

    # Convert PDF to bytes for streaming response
    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    buffer = io.BytesIO(pdf_bytes)

    # Return PDF for preview (inline display instead of download)
    headers = {
        'Content-Disposition': f'inline; filename="Receipt-{data.receiptNumber}.pdf"'
    }

    return StreamingResponse(buffer, media_type='application/pdf', headers=headers)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)