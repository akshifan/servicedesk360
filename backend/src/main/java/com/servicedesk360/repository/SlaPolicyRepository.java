package com.servicedesk360.repository;
import com.servicedesk360.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface SlaPolicyRepository extends JpaRepository<SlaPolicy,Long>{List<SlaPolicy> findAllByTenantId(Long tenantId); Optional<SlaPolicy> findByIdAndTenantId(Long id,Long tenantId); Optional<SlaPolicy> findByTenantIdAndPriorityAndActiveTrue(Long tenantId,TicketPriority priority);}
