package com.servicedesk360.repository;
import com.servicedesk360.entity.Ticket;
import com.servicedesk360.entity.TicketStatus;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.Optional;
public interface TicketRepository extends JpaRepository<Ticket,Long>{ Page<Ticket> findAllByTenantId(Long tenantId, Pageable pageable); Page<Ticket> findAllByTenantIdAndRequesterId(Long tenantId, Long requesterId, Pageable pageable); Page<Ticket> findAllByTenantIdAndAssigneeId(Long tenantId, Long assigneeId, Pageable pageable); Optional<Ticket> findByIdAndTenantId(Long id,Long tenantId); long countByTenantIdAndStatus(Long tenantId,com.servicedesk360.entity.TicketStatus status); long countByTenantIdAndRequesterIdAndStatusIn(Long tenantId, Long requesterId, Collection<com.servicedesk360.entity.TicketStatus> statuses); long countByTenantIdAndAssigneeIdAndStatusIn(Long tenantId, Long assigneeId, Collection<com.servicedesk360.entity.TicketStatus> statuses);

    Page<Ticket> findAllByTenantIdAndTeamId(
        Long tenantId,
        Long teamId,
        Pageable pageable
    );

    long countByTenantIdAndTeamIdAndStatus(
        Long tenantId,
        Long teamId,
        TicketStatus status
    );
}
