package com.optiplant.inventory.repository;

import com.optiplant.inventory.domain.dto.DashboardDTOs.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public class DashboardRepository {

    @PersistenceContext
    private EntityManager em;

    public DashboardMetricsDTO getGeneralMetrics() {
        Long totalProducts = em.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult();
        Long totalBranches = em.createQuery("SELECT COUNT(b) FROM Branch b WHERE b.active = true", Long.class).getSingleResult();
        
        Long totalStockUnits = em.createQuery("SELECT SUM(i.stock) FROM Inventory i", Long.class).getSingleResult();
        if (totalStockUnits == null) totalStockUnits = 0L;

        BigDecimal totalInventoryValue = em.createQuery("SELECT SUM(i.stock * p.weightedAverageCost) FROM Inventory i JOIN i.product p", BigDecimal.class).getSingleResult();
        if (totalInventoryValue == null) totalInventoryValue = BigDecimal.ZERO;

        BigDecimal totalMonthlySales = em.createQuery(
                "SELECT SUM(s.totalAmount) FROM Sale s WHERE EXTRACT(MONTH FROM s.saleDate) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM s.saleDate) = EXTRACT(YEAR FROM CURRENT_DATE)", 
                BigDecimal.class).getSingleResult();
        if (totalMonthlySales == null) totalMonthlySales = BigDecimal.ZERO;

        BigDecimal totalMonthlyPurchases = em.createQuery(
                "SELECT SUM(p.totalAmount) FROM Purchase p WHERE EXTRACT(MONTH FROM p.purchaseDate) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM p.purchaseDate) = EXTRACT(YEAR FROM CURRENT_DATE)", 
                BigDecimal.class).getSingleResult();
        if (totalMonthlyPurchases == null) totalMonthlyPurchases = BigDecimal.ZERO;

        return new DashboardMetricsDTO(totalProducts, totalBranches, totalStockUnits, totalInventoryValue, totalMonthlySales, totalMonthlyPurchases);
    }

    public List<StockValueByBranchDTO> getInventoryValueByBranch() {
        return em.createQuery(
                "SELECT new com.optiplant.inventory.domain.dto.DashboardDTOs$StockValueByBranchDTO(b.id, b.name, SUM(i.stock), SUM(i.stock * p.weightedAverageCost)) " +
                "FROM Inventory i JOIN i.branch b JOIN i.product p " +
                "GROUP BY b.id, b.name " +
                "ORDER BY SUM(i.stock * p.weightedAverageCost) DESC", 
                StockValueByBranchDTO.class).getResultList();
    }

    public List<TopSellingProductDTO> getTopSellingProducts(int limit) {
        return em.createQuery(
                "SELECT new com.optiplant.inventory.domain.dto.DashboardDTOs$TopSellingProductDTO(p.id, p.name, p.sku, SUM(sd.quantity), SUM(sd.subtotal)) " +
                "FROM SaleDetail sd JOIN sd.product p " +
                "GROUP BY p.id, p.name, p.sku " +
                "ORDER BY SUM(sd.quantity) DESC", 
                TopSellingProductDTO.class)
                .setMaxResults(limit)
                .getResultList();
    }
}
