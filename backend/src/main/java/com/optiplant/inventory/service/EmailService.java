package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.StockAlertDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendLowStockAlertEmail(String recipient, List<StockAlertDTO> alerts) {
        if (alerts == null || alerts.isEmpty()) return;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(recipient);
            helper.setSubject("⚠️ ALERTA DE STOCK: " + alerts.size() + " productos requieren atención");
            
            String htmlContent = buildHtmlEmailContent(alerts);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            // Se captura para no bloquear la ejecución del hilo
            System.err.println("Error al enviar el correo de alertas: " + e.getMessage());
        }
    }

    private String buildHtmlEmailContent(List<StockAlertDTO> alerts) {
        StringBuilder sb = new StringBuilder();
        sb.append("<h2 style='color: #d9534f;'>Reporte de Alertas de Stock</h2>");
        sb.append("<p>Los siguientes productos han alcanzado su límite mínimo de stock:</p>");
        
        sb.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
        sb.append("<tr style='background-color: #f2f2f2;'>");
        sb.append("<th>Sucursal</th><th>SKU</th><th>Producto</th><th>Stock Actual</th><th>Sugerido</th><th>Severidad</th>");
        sb.append("</tr>");

        for (StockAlertDTO alert : alerts) {
            String color = "CRITICAL".equals(alert.severity()) ? "#ffe6e6" : "#fff3cd";
            String textColor = "CRITICAL".equals(alert.severity()) ? "#cc0000" : "#856404";
            
            sb.append(String.format("<tr style='background-color: %s;'>", color));
            sb.append(String.format("<td>%s</td>", alert.branchName()));
            sb.append(String.format("<td>%s</td>", alert.productSku()));
            sb.append(String.format("<td>%s</td>", alert.productName()));
            sb.append(String.format("<td style='text-align: center; font-weight: bold; color: %s;'>%d</td>", textColor, alert.currentStock()));
            sb.append(String.format("<td style='text-align: center;'>%d</td>", alert.suggestedReorderQuantity()));
            sb.append(String.format("<td style='text-align: center; font-weight: bold; color: %s;'>%s</td>", textColor, alert.severity()));
            sb.append("</tr>");
        }

        sb.append("</table>");
        sb.append("<br><p>Por favor inicie los procesos de transferencia o compra correspondientes.</p>");
        
        return sb.toString();
    }
}
