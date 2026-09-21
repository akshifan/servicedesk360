package com.servicedesk360.controller;
import com.servicedesk360.dto.common.PageResponse; import com.servicedesk360.dto.ticket.*; import com.servicedesk360.service.TicketService; import jakarta.validation.Valid; import org.springframework.data.domain.Pageable; import org.springframework.data.web.PageableDefault; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/tickets") public class TicketController{
 private final TicketService service; public TicketController(TicketService service){this.service=service;}
 @GetMapping public PageResponse<TicketResponse> list(@PageableDefault(size=20,sort="createdAt") Pageable p){return service.list(p);}
 @GetMapping("/{id}") public TicketResponse get(@PathVariable Long id){return service.get(id);}
 @PostMapping public TicketResponse create(@Valid @RequestBody TicketCreateRequest r){return service.create(r);}
 @PatchMapping("/{id}/status") public TicketResponse status(@PathVariable Long id,@Valid @RequestBody TicketStatusRequest r){return service.status(id,r);}
 @PatchMapping("/{id}/assignment") public TicketResponse assign(@PathVariable Long id,@Valid @RequestBody TicketAssignmentRequest r){return service.assign(id,r);}
 @PatchMapping("/{id}/priority") public TicketResponse priority(@PathVariable Long id,@Valid @RequestBody TicketPriorityRequest r){return service.priority(id,r);}
 @PostMapping("/{id}/comments") public TicketCommentResponse comment(@PathVariable Long id,@Valid @RequestBody TicketCommentRequest r){return service.addComment(id,r);}
 @GetMapping("/{id}/comments") public List<TicketCommentResponse> comments(@PathVariable Long id){return service.comments(id);}
}
