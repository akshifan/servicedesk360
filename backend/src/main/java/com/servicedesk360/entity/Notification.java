package com.servicedesk360.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "tenant_id", nullable = false) private Long tenantId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, length = 80) private String type;
    @Column(nullable = false, length = 200) private String title;
    @Column(nullable = false, length = 1000) private String message;
    @Column(name = "reference_type", length = 80) private String referenceType;
    @Column(name = "reference_id") private Long referenceId;
    @Column(name = "read_at") private Instant readAt;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    protected Notification() {}
    public Notification(Long tenantId, User user, String type, String title, String message, String referenceType, Long referenceId){this.tenantId=tenantId;this.user=user;this.type=type;this.title=title;this.message=message;this.referenceType=referenceType;this.referenceId=referenceId;}
    @PrePersist void create(){if(createdAt==null)createdAt=Instant.now();}
    public Long getId(){return id;} public Long getTenantId(){return tenantId;} public User getUser(){return user;} public String getType(){return type;} public String getTitle(){return title;} public String getMessage(){return message;} public String getReferenceType(){return referenceType;} public Long getReferenceId(){return referenceId;} public Instant getReadAt(){return readAt;} public void setReadAt(Instant v){readAt=v;} public Instant getCreatedAt(){return createdAt;}
}
