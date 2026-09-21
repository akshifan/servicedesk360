package com.servicedesk360.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tickets", uniqueConstraints = @UniqueConstraint(name = "uk_tickets_tenant_number", columnNames = {"tenant_id", "ticket_number"}))
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Column(name="ticket_number", nullable=false, length=40) private String ticketNumber;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="requester_id", nullable=false) private User requester;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="assignee_id") private User assignee;
    @Column(nullable=false, length=240) private String title;
    @Column(nullable=false, columnDefinition="text") private String description;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=32) private TicketPriority priority;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=40) private TicketStatus status;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @Column(name="updated_at", nullable=false) private Instant updatedAt;
    @Column(name="first_response_due_at") private Instant firstResponseDueAt;
    @Column(name="resolution_due_at") private Instant resolutionDueAt;
    @Column(name="first_responded_at") private Instant firstRespondedAt;
    @Column(name="resolved_at") private Instant resolvedAt;
    protected Ticket() {}

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Ticket(Long tenantId, User requester, String title, String description, TicketPriority priority) { this.tenantId=tenantId; this.requester=requester; this.title=title; this.description=description; this.priority=priority; this.status=TicketStatus.OPEN; this.ticketNumber="PENDING"; }
    @PrePersist void onCreate(){ Instant now=Instant.now(); createdAt=now; updatedAt=now; }
    @PreUpdate void onUpdate(){ updatedAt=Instant.now(); }
    public Long getId(){return id;} public Long getTenantId(){return tenantId;} public String getTicketNumber(){return ticketNumber;} public void setTicketNumber(String v){ticketNumber=v;} public User getRequester(){return requester;} public User getAssignee(){return assignee;} public void setAssignee(User v){assignee=v;} public String getTitle(){return title;} public String getDescription(){return description;} public TicketPriority getPriority(){return priority;} public void setPriority(TicketPriority v){priority=v;} public TicketStatus getStatus(){return status;} public void setStatus(TicketStatus v){status=v;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;} public Instant getFirstResponseDueAt(){return firstResponseDueAt;} public void setFirstResponseDueAt(Instant v){firstResponseDueAt=v;} public Instant getResolutionDueAt(){return resolutionDueAt;} public void setResolutionDueAt(Instant v){resolutionDueAt=v;} public Instant getResolvedAt(){return resolvedAt;} public void setResolvedAt(Instant v){resolvedAt=v;}
}
