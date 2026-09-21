package com.servicedesk360.service;

import com.servicedesk360.dto.common.PageResponse;
import com.servicedesk360.dto.ticket.*;
import com.servicedesk360.entity.*;
import com.servicedesk360.exception.*;
import com.servicedesk360.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TicketService {
 private final TicketRepository tickets; private final TicketCommentRepository comments; private final UserRepository users; private final CurrentUserService current; private final SlaService sla; private final NotificationService notifications;
 public TicketService(TicketRepository tickets,TicketCommentRepository comments,UserRepository users,CurrentUserService current,SlaService sla,NotificationService notifications){this.tickets=tickets;this.comments=comments;this.users=users;this.current=current;this.sla=sla;this.notifications=notifications;}
 @Transactional public TicketResponse create(TicketCreateRequest r){var me=current.getRequiredUser(); var t=tickets.save(new Ticket(me.tenantId(),me.user(),r.title().trim(),r.description().trim(),r.priority())); t.setTicketNumber("SD-"+java.time.Year.now()+"-"+String.format("%06d",t.getId())); var d=sla.deadline(me.tenantId(),r.priority(),t.getCreatedAt()); t.setFirstResponseDueAt(d.firstResponseDueAt()); t.setResolutionDueAt(d.resolutionDueAt()); return TicketResponse.from(t);}
 @Transactional(readOnly=true) public PageResponse<TicketResponse> list(Pageable p){var me=current.getRequiredUser(); Page<Ticket> page=switch(me.role()){case REQUESTER->tickets.findAllByTenantIdAndRequesterId(me.tenantId(),me.user().getId(),p);case AGENT->tickets.findAllByTenantIdAndAssigneeId(me.tenantId(),me.user().getId(),p);case MANAGER -> {
     if (me.user().getTeam() == null) {
         yield Page.empty(p);
     }

     yield tickets.findAllByTenantIdAndTeamId(
         me.tenantId(),
         me.user().getTeam().getId(),
         p
     );
 }

     case TENANT_ADMIN, PLATFORM_ADMIN ->
         tickets.findAllByTenantId(
             me.tenantId(),
             p
         );}; return PageResponse.from(page.map(TicketResponse::from));}
 @Transactional(readOnly=true) public TicketResponse get(Long id){return TicketResponse.from(find(id));}
 @Transactional public TicketResponse status(Long id,TicketStatusRequest r){var me=current.getRequiredUser(); if(me.role()==Role.REQUESTER)throw new UnauthorizedException("Requesters cannot change ticket status"); var t=find(id); if(!allowed(t.getStatus(),r.status())) throw new BusinessException("INVALID_STATUS_TRANSITION","Ticket cannot move from "+t.getStatus()+" to "+r.status()); t.setStatus(r.status()); if(!me.user().getId().equals(t.getRequester().getId()))notifications.create(me.tenantId(),t.getRequester().getId(),"TICKET_STATUS_CHANGED","Ticket status updated",t.getTicketNumber()+" is now "+r.status(),"TICKET",t.getId()); return TicketResponse.from(t);}
 @Transactional public TicketResponse
 assign(Long id,TicketAssignmentRequest r){var me=current.getRequiredUser(); if(me.role()!=Role.TENANT_ADMIN&&me.role()!=Role.MANAGER) throw new UnauthorizedException("Manager or tenant administrator role required"); var t=find(id); var assignee=users.findByIdAndTenantId(r.assigneeId(),me.tenantId()).orElseThrow(()->new ResourceNotFoundException("Assignee not found")); t.setAssignee(assignee); t.setTeam(assignee.getTeam()); notifications.create(me.tenantId(),assignee.getId(),"TICKET_ASSIGNED","Ticket assigned",t.getTicketNumber()+" was assigned to you","TICKET",t.getId()); return TicketResponse.from(t);}
 @Transactional public TicketResponse priority(Long id,TicketPriorityRequest r){var me=current.getRequiredUser(); if(me.role()!=Role.TENANT_ADMIN&&me.role()!=Role.MANAGER) throw new UnauthorizedException("Manager or tenant administrator role required"); var t=find(id); t.setPriority(r.priority()); return TicketResponse.from(t);}
 @Transactional public TicketCommentResponse addComment(Long id,TicketCommentRequest r){var me=current.getRequiredUser(); var t=find(id); if(r.visibility()==TicketCommentVisibility.INTERNAL&&me.role()==Role.REQUESTER) throw new UnauthorizedException("Requesters cannot create internal comments"); return TicketCommentResponse.from(comments.save(new TicketComment(me.tenantId(),t,me.user(),r.body().trim(),r.visibility())));}
 @Transactional(readOnly=true) public List<TicketCommentResponse> comments(Long id){var me=current.getRequiredUser(); find(id); return comments.findAllByTenantIdAndTicketId(me.tenantId(),id,Sort.by(Sort.Direction.ASC,"createdAt")).stream().filter(c->me.role()!=Role.REQUESTER||c.getVisibility()==TicketCommentVisibility.REQUESTER).map(TicketCommentResponse::from).toList();}
 private Ticket find(Long id){var me=current.getRequiredUser(); Ticket ticket=tickets.findByIdAndTenantId(id,me.tenantId()).orElseThrow(()->new ResourceNotFoundException("Ticket not found")); if(me.role()==Role.REQUESTER&&!me.user().getId().equals(ticket.getRequester().getId()))throw new ResourceNotFoundException("Ticket not found"); if(me.role()==Role.AGENT){boolean ownRequest=me.user().getId().equals(ticket.getRequester().getId()); boolean assigned=ticket.getAssignee()!=null&&me.user().getId().equals(ticket.getAssignee().getId()); if(!ownRequest&&!assigned)throw new ResourceNotFoundException("Ticket not found");} return ticket;}
 private boolean allowed(TicketStatus from,TicketStatus to){return switch(from){case OPEN->to==TicketStatus.IN_PROGRESS||to==TicketStatus.CANCELLED;case IN_PROGRESS->to==TicketStatus.WAITING_FOR_REQUESTER||to==TicketStatus.RESOLVED;case WAITING_FOR_REQUESTER->to==TicketStatus.IN_PROGRESS;case RESOLVED->to==TicketStatus.CLOSED||to==TicketStatus.IN_PROGRESS;case CLOSED,CANCELLED->false;};}
}
