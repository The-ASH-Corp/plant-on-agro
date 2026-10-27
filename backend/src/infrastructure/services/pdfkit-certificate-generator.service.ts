import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { IPdfGeneratorService, CertificatePdfData } from '../../core/interfaces/pdf-generator.interface';

export class PdfKitCertificateGeneratorService implements IPdfGeneratorService {
  public async generateCertificatePdf(data: CertificatePdfData): Promise<NodeJS.ReadableStream> {
    const { certificate, treeInstance, verificationFullUrl } = data;

    // 1. Generate High-Resolution QR Code as Buffer
    const qrBuffer = await QRCode.toBuffer(verificationFullUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#0e301f',
        light: '#ffffff',
      },
      width: 250,
    });

    // 2. Initialize Landscape A4 Document (841.89 x 595.28 pt)
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 20, bottom: 20, left: 20, right: 20 },
      info: {
        Title: `PlantOn Agro Digital Deed - ${certificate.certificateNumber}`,
        Author: 'PlantOn Agro Forestry Reserves',
        Subject: `Certificate of Living Stewardship for ${certificate.recipientName}`,
        Keywords: 'Agroforestry, Living Deed, Carbon Offset, Western Ghats, Certificate',
        CreationDate: certificate.issueDate || new Date(),
      },
    });

    const pageWidth = 841.89;
    const pageHeight = 595.28;

    // 3. Background Fill (Soft Ivory / Cream Parchment)
    doc.rect(0, 0, pageWidth, pageHeight).fill('#fbfdfa');

    // 4. Double Ornate Border
    // Outer forest green border
    doc
      .rect(18, 18, pageWidth - 36, pageHeight - 36)
      .lineWidth(3)
      .strokeColor('#153e28')
      .stroke();

    // Inner gold hairline border
    doc
      .rect(24, 24, pageWidth - 48, pageHeight - 48)
      .lineWidth(0.75)
      .strokeColor('#b38728')
      .stroke();

    // Corner decorative accents (gold florets)
    const cornerOffset = 24;
    const bracketSize = 14;
    // Top-left
    doc.moveTo(cornerOffset, cornerOffset + bracketSize).lineTo(cornerOffset + bracketSize, cornerOffset).lineWidth(1.5).strokeColor('#b38728').stroke();
    // Top-right
    doc.moveTo(pageWidth - cornerOffset - bracketSize, cornerOffset).lineTo(pageWidth - cornerOffset, cornerOffset + bracketSize).lineWidth(1.5).strokeColor('#b38728').stroke();
    // Bottom-left
    doc.moveTo(cornerOffset, pageHeight - cornerOffset - bracketSize).lineTo(cornerOffset + bracketSize, pageHeight - cornerOffset).lineWidth(1.5).strokeColor('#b38728').stroke();
    // Bottom-right
    doc.moveTo(pageWidth - cornerOffset - bracketSize, pageHeight - cornerOffset).lineTo(pageWidth - cornerOffset, pageHeight - cornerOffset - bracketSize).lineWidth(1.5).strokeColor('#b38728').stroke();

    // 5. Watermark in Center Background (Low Opacity)
    doc.save();
    doc.opacity(0.035);
    doc.circle(pageWidth / 2, pageHeight / 2 - 10, 150).lineWidth(10).strokeColor('#2d6a4f').stroke();
    doc.circle(pageWidth / 2, pageHeight / 2 - 10, 130).lineWidth(2).strokeColor('#b38728').stroke();
    doc.restore();

    // 6. Header Banner
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#b38728')
      .text('PLANTON AGRO  •  WESTERN GHATS ECOLOGICAL FORESTRY RESERVE', 0, 44, {
        align: 'center',
        width: pageWidth,
      });

    doc
      .font('Times-Bold')
      .fontSize(22)
      .fillColor('#0e301f')
      .text('OFFICIAL CERTIFICATE OF LIVING STEWARDSHIP', 0, 58, {
        align: 'center',
        width: pageWidth,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor('#2d6a4f')
      .text('PERMANENT AGROFORESTRY REGISTER & CRYPTOGRAPHIC BIOMETRIC CERTIFICATION', 0, 85, {
        align: 'center',
        width: pageWidth,
      });

    // Divider flourish
    doc.moveTo(250, 100).lineTo(400, 100).lineWidth(0.75).strokeColor('#b38728').stroke();
    doc.moveTo(442, 100).lineTo(592, 100).lineWidth(0.75).strokeColor('#b38728').stroke();
    doc.circle(421, 100, 3).fillColor('#b38728').fill();

    // 7. Recipient Conferral
    doc
      .font('Times-Italic')
      .fontSize(11)
      .fillColor('#3d5a45')
      .text('This verified ecological deed formally attests that', 0, 112, {
        align: 'center',
        width: pageWidth,
      });

    const recipient = certificate.recipientName || certificate.adopterName || 'Distinguished Eco-Guardian';
    doc
      .font('Times-Bold')
      .fontSize(24)
      .fillColor('#0a2918')
      .text(recipient, 0, 128, {
        align: 'center',
        width: pageWidth,
      });

    // Underline below recipient name
    doc.moveTo(290, 156).lineTo(552, 156).lineWidth(1).strokeColor('#b38728').stroke();

    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor('#264633')
      .text(
        'has officially sponsored and permanently adopted a verified native timber sapling under lifetime reserve stewardship,\nfostering permanent forest restoration, native canopy regeneration, and carbon sequestration in Kerala\'s Western Ghats.',
        100,
        164,
        {
          align: 'center',
          width: 642,
          lineGap: 3,
        }
      );

    // 8. Species Badge
    const species = certificate.treeSpecies || treeInstance?.treeVarietyName || 'Native Agroforestry Timber';
    doc.roundedRect(190, 202, 462, 30, 6).fillAndStroke('#eef6f0', '#b7d8c0');
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#916915')
      .text('ADOPTED SPECIES:  ', 200, 212, { continued: true });
    doc
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .fillColor('#0e301f')
      .text(species);

    // 9. Dedication Message
    const dedication = certificate.dedicatedMessage
      ? `« ${certificate.dedicatedMessage} »`
      : '« Dedicated for Sustainable Ecological Stewardship & Lifetime Forest Preservation »';

    doc
      .font('Times-Italic')
      .fontSize(9)
      .fillColor('#31533c')
      .text(dedication, 120, 238, {
        align: 'center',
        width: 602,
      });

    // 10. Specifications & Telemetry 4-Card Grid
    const cardY = 262;
    const treeTag = certificate.treeTag || treeInstance?.treeTag || 'POA-WEST-0001';
    const reserveName = certificate.reserveName || treeInstance?.assignedReserve || 'Wayanad Rainforest Reserve';
    
    // GPS formatting
    let gpsText = '11.6854° N, 76.1320° E';
    if (treeInstance?.gpsCoordinates) {
      gpsText = `${treeInstance.gpsCoordinates.latitude.toFixed(4)}° N, ${treeInstance.gpsCoordinates.longitude.toFixed(4)}° E`;
    }

    const cards = [
      { title: 'CERTIFICATE NUMBER', val: certificate.certificateNumber, sub: 'Immutable Serial ID' },
      { title: 'PHYSICAL TREE TAG', val: treeTag, sub: 'RFID & Geotagged' },
      { title: 'RESERVE SANCTUARY', val: reserveName, sub: 'Western Ghats, Kerala' },
      { title: 'GPS COORDINATES', val: gpsText, sub: 'Satellite Verified' },
    ];

    cards.forEach((c, idx) => {
      const cardX = 48 + idx * 188;
      doc.roundedRect(cardX, cardY, 178, 52, 5).fillAndStroke('#ffffff', '#d6e5db');
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#916915').text(c.title, cardX + 8, cardY + 7);
      doc.font('Courier-Bold').fontSize(9).fillColor('#0a2918').text(c.val, cardX + 8, cardY + 20, { width: 162 });
      doc.font('Helvetica').fontSize(6.5).fillColor('#52796f').text(c.sub, cardX + 8, cardY + 36);
    });

    // 11. Bottom Authentication Section (y: 326 to 480)
    // Left: High-Res QR Code & Instructions
    doc.image(qrBuffer, 55, 335, { width: 88, height: 88 });
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0a2918').text('VERIFY AUTHENTICITY', 152, 345);
    doc
      .font('Helvetica')
      .fontSize(7.5)
      .fillColor('#3b5a48')
      .text(
        'Scan this tamper-evident QR code with any smartphone to inspect live satellite coordinates, biometric telemetry, arborist logs, and blockchain certification.',
        152,
        360,
        { width: 175, lineGap: 2 }
      );
    doc
      .font('Courier')
      .fontSize(6.5)
      .fillColor('#1b4332')
      .text(verificationFullUrl, 152, 408, { width: 175 });

    // Center: Verified Seal Badge
    const sealX = 421;
    const sealY = 380;
    doc.circle(sealX, sealY, 44).lineWidth(2).strokeColor('#b38728').stroke();
    doc.circle(sealX, sealY, 40).fillColor('#163824').fill();
    doc.circle(sealX, sealY, 36).lineWidth(0.75).strokeColor('#d4af37').stroke();
    doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#d8f3dc').text('★ VERIFIED ★', sealX - 35, sealY - 24, { width: 70, align: 'center' });
    doc.font('Times-Bold').fontSize(12).fillColor('#d4af37').text('🌿', sealX - 35, sealY - 11, { width: 70, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#d4af37').text('PLANTON AGRO', sealX - 35, sealY + 5, { width: 70, align: 'center' });
    doc.font('Helvetica').fontSize(5.5).fillColor('#a7c4b0').text('OFFICIAL SEAL', sealX - 35, sealY + 17, { width: 70, align: 'center' });

    // Right: Authorized Signatures
    doc.moveTo(560, 395).lineTo(750, 395).lineWidth(0.75).strokeColor('#a3c2af').stroke();
    doc.font('Times-BoldItalic').fontSize(16).fillColor('#0a2918').text('Dr. K. R. Sharma', 570, 375);
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#0a2918').text('Dr. K. R. Sharma, Ph.D. Silviculture', 560, 402);
    doc.font('Helvetica').fontSize(7.5).fillColor('#3d5a45').text('Chief Silviculturist & Director of Forest Restoration', 560, 414);
    doc.font('Helvetica').fontSize(7).fillColor('#6c8577').text('Western Ghats Ecological Stewardship Board', 560, 425);

    // 12. Bottom Integrity Bar (SHA-256 Hash & Legal Framework)
    doc.roundedRect(30, 480, pageWidth - 60, 46, 4).fill('#f2f7f4');
    doc
      .font('Courier-Bold')
      .fontSize(6.5)
      .fillColor('#153e28')
      .text(`CRYPTOGRAPHIC DIGITAL LEDGER HASH (SHA-256): ${certificate.certificateHash}`, 35, 490, {
        align: 'center',
        width: pageWidth - 70,
      });

    const issueDateStr = certificate.issueDate
      ? new Date(certificate.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    doc
      .font('Helvetica')
      .fontSize(6.5)
      .fillColor('#52796f')
      .text(
        `Issued on: ${issueDateStr} • Legally valid digital deed issued under the Indian Environmental & Agroforestry Stewardship Framework • Immutable Biological Custody • PlantOn Agro × RAC Realty`,
        35,
        506,
        {
          align: 'center',
          width: pageWidth - 70,
        }
      );

    // Finalize PDF stream
    doc.end();

    return doc;
  }
}
