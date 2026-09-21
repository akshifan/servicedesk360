package com.servicedesk360.repository;
import com.servicedesk360.entity.Task;
import com.servicedesk360.entity.TaskStatus;
import org.springframework.data.domain.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface TaskRepository extends JpaRepository<Task,Long>{ Page<Task> findAllByTenantId(Long tenantId,Pageable pageable); Page<Task> findAllByTenantIdAndAssigneeId(Long tenantId,Long assigneeId,Pageable pageable); java.util.Optional<Task> findByIdAndTenantId(Long id,Long tenantId); long countByTenantIdAndStatus(Long tenantId,com.servicedesk360.entity.TaskStatus status); long countByTenantIdAndAssigneeIdAndStatusIn(Long tenantId, Long assigneeId, java.util.Collection<com.servicedesk360.entity.TaskStatus> statuses);

    Page<Task> findAllByTenantIdAndTeamId(
        Long tenantId,
        Long teamId,
        Pageable pageable
    );

    long countByTenantIdAndTeamIdAndStatus(
        Long tenantId,
        Long teamId,
        TaskStatus status
    );
}
