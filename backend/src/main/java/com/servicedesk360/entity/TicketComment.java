package com.servicedesk360.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="ticket_comments")
public class TicketComment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="ticket_id", nullable=false) private Ticket ticket;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="author_id", nullable=false) private User author;
    @Column(nullable=false, columnDefinition="text") private String body;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private TicketCommentVisibility visibility;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    protected TicketComment() {}
    public TicketComment(Long tenantId, Ticket ticket, User author, String body, TicketCommentVisibility visibility){this.tenantId=tenantId;this.ticket=ticket;this.author=author;this.body=body;this.visibility=visibility;}
    @PrePersist void onCreate(){createdAt=Instant.now();}
    public Long getId(){return id;} public Long getTenantId(){return tenantId;} public Ticket getTicket(){return ticket;} public User getAuthor(){return author;} public String getBody(){return body;} public TicketCommentVisibility getVisibility(){return visibility;} public Instant getCreatedAt(){return createdAt;}
}
