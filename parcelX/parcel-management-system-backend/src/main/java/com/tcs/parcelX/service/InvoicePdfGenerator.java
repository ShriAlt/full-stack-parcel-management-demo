package com.tcs.parcelX.service;

import com.tcs.parcelX.dto.InvoiceResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

final class InvoicePdfGenerator {
    private InvoicePdfGenerator() {
    }

    static byte[] generate(InvoiceResponse invoice) {
        List<String> lines = List.of(
                "Parcel Management System Invoice",
                "Parcel ID: " + value(invoice.getParcelId()),
                "Tracking ID: " + value(invoice.getTrackingId()),
                "Sender: " + value(invoice.getSender()),
                "Pickup Address: " + value(invoice.getPickupAddress()),
                "Drop Location: " + value(invoice.getDropLocation()),
                "Weight: " + value(invoice.getWeight()) + " g",
                "Delivery Type: " + value(invoice.getDeliveryType()),
                "Packaging Type: " + value(invoice.getPackagingType()),
                "Cost: INR " + value(invoice.getCost()),
                "Status: " + value(invoice.getStatus()),
                "Created At: " + value(invoice.getCreatedAt()));

        StringBuilder stream = new StringBuilder();
        stream.append("BT\n/F1 18 Tf\n50 780 Td\n(Parcel Management System Invoice) Tj\n");
        stream.append("/F1 11 Tf\n0 -32 Td\n");
        for (int i = 1; i < lines.size(); i++) {
            stream.append("(").append(escape(lines.get(i))).append(") Tj\n0 -22 Td\n");
        }
        stream.append("ET\n");

        byte[] streamBytes = stream.toString().getBytes(StandardCharsets.US_ASCII);
        List<String> objects = new ArrayList<>();
        objects.add("<< /Type /Catalog /Pages 2 0 R >>");
        objects.add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        objects.add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>");
        objects.add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
        objects.add("<< /Length " + streamBytes.length + " >>\nstream\n" + stream + "endstream");

        StringBuilder pdf = new StringBuilder("%PDF-1.4\n");
        List<Integer> offsets = new ArrayList<>();
        for (int i = 0; i < objects.size(); i++) {
            offsets.add(pdf.toString().getBytes(StandardCharsets.US_ASCII).length);
            pdf.append(i + 1).append(" 0 obj\n").append(objects.get(i)).append("\nendobj\n");
        }
        int xrefOffset = pdf.toString().getBytes(StandardCharsets.US_ASCII).length;
        pdf.append("xref\n0 ").append(objects.size() + 1).append("\n");
        pdf.append("0000000000 65535 f \n");
        for (Integer offset : offsets) {
            pdf.append(String.format("%010d 00000 n \n", offset));
        }
        pdf.append("trailer\n<< /Size ").append(objects.size() + 1).append(" /Root 1 0 R >>\n");
        pdf.append("startxref\n").append(xrefOffset).append("\n%%EOF\n");
        return pdf.toString().getBytes(StandardCharsets.US_ASCII);
    }

    private static String value(Object value) {
        return value == null ? "-" : String.valueOf(value);
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)");
    }
}
