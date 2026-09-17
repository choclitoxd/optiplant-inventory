package com.optiplant.inventory.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transfer")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_branch_id", nullable = false)
    private Branch originBranch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_branch_id", nullable = false)
    private Branch destinationBranch;

    @Column(name = "send_date", nullable = false)
    private LocalDateTime sendDate;

    @Column(name = "estimated_arrival")
    private LocalDateTime estimatedArrival;

    @Column(name = "receive_date")
    private LocalDateTime receiveDate;

    @Column(name = "transporter", length = 100)
    private String transporter;

    @Column(name = "route_priority", length = 50)
    private String routePriority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransferStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User responsibleUser;

    @OneToMany(mappedBy = "transfer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransferDetail> details;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Branch getOriginBranch() { return originBranch; }
    public void setOriginBranch(Branch originBranch) { this.originBranch = originBranch; }
    public Branch getDestinationBranch() { return destinationBranch; }
    public void setDestinationBranch(Branch destinationBranch) { this.destinationBranch = destinationBranch; }
    public LocalDateTime getSendDate() { return sendDate; }
    public void setSendDate(LocalDateTime sendDate) { this.sendDate = sendDate; }
    public LocalDateTime getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(LocalDateTime estimatedArrival) { this.estimatedArrival = estimatedArrival; }
    public LocalDateTime getReceiveDate() { return receiveDate; }
    public void setReceiveDate(LocalDateTime receiveDate) { this.receiveDate = receiveDate; }
    public String getTransporter() { return transporter; }
    public void setTransporter(String transporter) { this.transporter = transporter; }
    public String getRoutePriority() { return routePriority; }
    public void setRoutePriority(String routePriority) { this.routePriority = routePriority; }
    public TransferStatus getStatus() { return status; }
    public void setStatus(TransferStatus status) { this.status = status; }
    public User getResponsibleUser() { return responsibleUser; }
    public void setResponsibleUser(User responsibleUser) { this.responsibleUser = responsibleUser; }
    public List<TransferDetail> getDetails() { return details; }
    public void setDetails(List<TransferDetail> details) { this.details = details; }
}
