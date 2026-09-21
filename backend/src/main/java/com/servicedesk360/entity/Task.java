package com.servicedesk360.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="tasks")
public class Task {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="ticket_id") private Ticket ticket;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="assignee_id") private User assignee;
 @Column(nullable=false,length=240) private String title;
 @Column(columnDefinition="text") private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=32) private TicketPriority priority;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=32) private TaskStatus status;
 @Column(name="due_at") private Instant dueAt;
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
 @Column(name="updated_at",nullable=false) private Instant updatedAt;
 protected Task(){}

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

 public Task(Long tenantId,Ticket ticket,User assignee,String title,String description,TicketPriority priority,Instant dueAt){this.tenantId=tenantId;this.ticket=ticket;this.assignee=assignee;this.title=title;this.description=description;this.priority=priority;this.dueAt=dueAt;this.status=TaskStatus.TODO;}
 @PrePersist void create(){Instant n=Instant.now();createdAt=n;updatedAt=n;} @PreUpdate void update(){updatedAt=Instant.now();}
 public Long getId(){return id;} public Long getTenantId(){return tenantId;} public Ticket getTicket(){return ticket;} public void setTicket(Ticket v){ticket=v;} public User getAssignee(){return assignee;} public void setAssignee(User v){assignee=v;} public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public TicketPriority getPriority(){return priority;} public void setPriority(TicketPriority v){priority=v;} public TaskStatus getStatus(){return status;} public void setStatus(TaskStatus v){status=v;} public Instant getDueAt(){return dueAt;} public void setDueAt(Instant v){dueAt=v;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
}
