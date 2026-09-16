package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.StockAlertDTO;
import io.mailtrap.client.MailtrapClient;
import io.mailtrap.config.MailtrapConfig;
import io.mailtrap.factory.MailtrapClientFactory;
import io.mailtrap.model.request.emails.Address;
import io.mailtrap.model.request.emails.MailtrapMail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Value("${app.mailtrap.token:}")
    private String mailtrapToken;

    @Async
    public void sendLowStockAlertEmail(String recipient, List<StockAlertDTO> alerts) {
        if (alerts == null || alerts.isEmpty()) return;

        try {
            // Si no hay token de Mailtrap configurado, usamos un log como fallback
            if (mailtrapToken == null || mailtrapToken.trim().isEmpty()) {
                System.out.println("No hay token de Mailtrap configurado. Simulación de envío a: " + recipient);
                return;
            }

            final MailtrapConfig config = new MailtrapConfig.Builder()
                .token(mailtrapToken)
                .build();

            final MailtrapClient client = MailtrapClientFactory.createMailtrapClient(config);

            String htmlContent = buildHtmlEmailContent(alerts);

            final MailtrapMail mail = MailtrapMail.builder()
                .from(new Address("hello@demomailtrap.co", "OptiPlant System"))
                .to(List.of(new Address(recipient)))
                .subject("⚠️ ALERTA DE STOCK: " + alerts.size() + " productos requieren atención")
                .html(htmlContent)
                .category("Integration Test")
                .build();

            System.out.println("Enviando correo con Mailtrap SDK a: " + recipient);
            System.out.println(client.send(mail));
        } catch (Exception e) {
            System.err.println("Error inesperado al enviar el correo con Mailtrap: " + e.getMessage());
            e.printStackTrace();
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
