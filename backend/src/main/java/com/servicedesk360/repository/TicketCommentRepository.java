package com.servicedesk360.repository;
import com.servicedesk360.entity.TicketComment;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TicketCommentRepository extends JpaRepository<TicketComment,Long>{ List<TicketComment> findAllByTenantIdAndTicketId(Long tenantId,Long ticketId,Sort sort); }
