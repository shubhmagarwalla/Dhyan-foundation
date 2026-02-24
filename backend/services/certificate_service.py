"""
80G Donation Certificate Generator using ReportLab.
Template settings are loaded from DB (CertificateTemplate) or env defaults.
"""
import os
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import Image as RLImage
from config import get_settings

settings = get_settings()

CERT_DIR = Path("certificates")
CERT_DIR.mkdir(exist_ok=True)


def _hex_to_color(hex_str: str):
    hex_str = hex_str.lstrip("#")
    r, g, b = tuple(int(hex_str[i:i+2], 16) / 255 for i in (0, 2, 4))
    return colors.Color(r, g, b)


def generate_80g_certificate(
    donation_id: int,
    donor_name: str,
    donor_pan: str,
    donor_father_name: str,
    donor_address: str,
    donor_city: str,
    donor_state: str,
    donor_pincode: str,
    donor_email: str,
    donor_phone: str,
    amount: float,
    transaction_id: str,
    gateway: str,
    donation_date: datetime,
    cause: str = "General",
    template=None,  # CertificateTemplate ORM object or None
) -> str:
    """Generate PDF and return file path."""

    # Use template values or fall back to settings
    primary_color = _hex_to_color(getattr(template, "primary_color", None) or "#FF6B00")
    secondary_color = _hex_to_color(getattr(template, "secondary_color", None) or "#2D6A4F")
    ngo_name = getattr(template, "ngo_name", None) or settings.ngo_name
    ngo_pan = getattr(template, "ngo_pan", None) or settings.ngo_pan
    ngo_80g_reg = getattr(template, "ngo_80g_reg", None) or settings.ngo_80g_reg
    ngo_12a_reg = getattr(template, "ngo_12a_reg", None) or settings.ngo_12a_reg
    ngo_address = getattr(template, "ngo_address", None) or settings.ngo_address
    ngo_phone = getattr(template, "ngo_phone", None) or settings.ngo_phone
    ngo_email = getattr(template, "ngo_email", None) or settings.ngo_email
    footer_text = getattr(template, "footer_text", None) or (
        "This donation is eligible for deduction under Section 80G of the Income Tax Act, 1961."
    )
    thank_you = getattr(template, "thank_you_message", None) or (
        "Thank you for your generous contribution towards Gau Seva."
    )
    logo_path = getattr(template, "logo_path", None)
    signature_path = getattr(template, "signature_path", None)

    filename = f"80G_{donation_id}_{transaction_id}.pdf"
    filepath = CERT_DIR / filename

    doc = SimpleDocTemplate(
        str(filepath),
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=15*mm,
        bottomMargin=15*mm,
    )

    styles = getSampleStyleSheet()
    story = []

    # ── Header styles
    title_style = ParagraphStyle(
        "title", parent=styles["Normal"],
        fontSize=18, fontName="Helvetica-Bold",
        textColor=primary_color, alignment=TA_CENTER, spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "subtitle", parent=styles["Normal"],
        fontSize=11, fontName="Helvetica",
        textColor=secondary_color, alignment=TA_CENTER, spaceAfter=2,
    )
    label_style = ParagraphStyle(
        "label", parent=styles["Normal"],
        fontSize=9, fontName="Helvetica-Bold", textColor=colors.grey,
    )
    value_style = ParagraphStyle(
        "value", parent=styles["Normal"],
        fontSize=10, fontName="Helvetica",
    )
    footer_style = ParagraphStyle(
        "footer", parent=styles["Normal"],
        fontSize=8, fontName="Helvetica", textColor=colors.grey,
        alignment=TA_CENTER, spaceAfter=2,
    )
    amount_style = ParagraphStyle(
        "amount", parent=styles["Normal"],
        fontSize=22, fontName="Helvetica-Bold",
        textColor=secondary_color, alignment=TA_CENTER,
    )

    # ── Logo
    if logo_path and Path(logo_path).exists():
        story.append(RLImage(logo_path, width=60*mm, height=20*mm))
        story.append(Spacer(1, 4*mm))

    # ── Title block
    story.append(Paragraph(ngo_name.upper(), title_style))
    story.append(Paragraph("DONATION RECEIPT CUM 80G CERTIFICATE", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceAfter=6*mm))

    # ── Receipt number & date
    receipt_no = f"DFG/{donation_date.year}/{donation_id:05d}"
    meta_data = [
        [Paragraph("Receipt No:", label_style), Paragraph(receipt_no, value_style),
         Paragraph("Date:", label_style), Paragraph(donation_date.strftime("%d %B %Y"), value_style)],
        [Paragraph("Transaction ID:", label_style), Paragraph(f"{gateway.upper()}: {transaction_id}", value_style),
         Paragraph("Payment Mode:", label_style), Paragraph(gateway.upper(), value_style)],
    ]
    meta_table = Table(meta_data, colWidths=[35*mm, 70*mm, 30*mm, 55*mm])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF8F0")),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.HexColor("#FFF8F0"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#FFE0B2")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 5*mm))

    # ── Donor details
    story.append(Paragraph("DONOR DETAILS", ParagraphStyle(
        "section", parent=styles["Normal"],
        fontSize=10, fontName="Helvetica-Bold",
        textColor=secondary_color, spaceBefore=4, spaceAfter=3,
    )))
    donor_data = [
        [Paragraph("Full Name:", label_style), Paragraph(donor_name, value_style)],
        [Paragraph("Father's Name:", label_style), Paragraph(donor_father_name or "N/A", value_style)],
        [Paragraph("PAN Number:", label_style), Paragraph(donor_pan or "Not Provided", value_style)],
        [Paragraph("Address:", label_style), Paragraph(
            f"{donor_address}, {donor_city}, {donor_state} - {donor_pincode}", value_style)],
        [Paragraph("Phone:", label_style), Paragraph(donor_phone, value_style)],
        [Paragraph("Email:", label_style), Paragraph(donor_email, value_style)],
    ]
    donor_table = Table(donor_data, colWidths=[40*mm, 140*mm])
    donor_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E0E0E0")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#FAFAFA")]),
    ]))
    story.append(donor_table)
    story.append(Spacer(1, 5*mm))

    # ── Donation amount (prominent)
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=4*mm))
    story.append(Paragraph(f"Donation Amount: ₹{amount:,.2f}", amount_style))
    story.append(Paragraph(f"Purpose: {cause.title()}", ParagraphStyle(
        "cause", parent=styles["Normal"], fontSize=10,
        alignment=TA_CENTER, textColor=colors.grey, spaceAfter=2,
    )))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5*mm))

    # ── NGO details & 80G info
    story.append(Paragraph("ORGANISATION DETAILS", ParagraphStyle(
        "section2", parent=styles["Normal"],
        fontSize=10, fontName="Helvetica-Bold",
        textColor=secondary_color, spaceBefore=4, spaceAfter=3,
    )))
    ngo_data = [
        [Paragraph("Organisation:", label_style), Paragraph(ngo_name, value_style)],
        [Paragraph("PAN:", label_style), Paragraph(ngo_pan, value_style)],
        [Paragraph("80G Registration:", label_style), Paragraph(ngo_80g_reg or "Applied/Pending", value_style)],
        [Paragraph("12A Registration:", label_style), Paragraph(ngo_12a_reg or "Applied/Pending", value_style)],
        [Paragraph("Address:", label_style), Paragraph(ngo_address, value_style)],
        [Paragraph("Phone:", label_style), Paragraph(ngo_phone, value_style)],
        [Paragraph("Email:", label_style), Paragraph(ngo_email, value_style)],
    ]
    ngo_table = Table(ngo_data, colWidths=[40*mm, 140*mm])
    ngo_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E0E0E0")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#FAFAFA")]),
    ]))
    story.append(ngo_table)
    story.append(Spacer(1, 8*mm))

    # ── Signature block
    sig_data = [["", ""]]
    if signature_path and Path(signature_path).exists():
        sig_img = RLImage(signature_path, width=40*mm, height=15*mm)
        sig_data = [[sig_img, ""]]
    sig_table = Table(sig_data, colWidths=[95*mm, 95*mm])
    sig_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER")]))
    story.append(sig_table)

    sig_labels = Table(
        [[Paragraph("Authorised Signatory", label_style), Paragraph("Donor's Signature", label_style)]],
        colWidths=[95*mm, 95*mm]
    )
    sig_labels.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER")]))
    story.append(sig_labels)
    story.append(Spacer(1, 8*mm))

    # ── Footer
    story.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey, spaceAfter=3*mm))
    story.append(Paragraph(thank_you, footer_style))
    story.append(Paragraph(footer_text, footer_style))
    story.append(Paragraph(
        f"This certificate is computer generated and valid without physical signature. "
        f"Verify at: {settings.ngo_website}",
        footer_style,
    ))

    doc.build(story)
    return str(filepath)
