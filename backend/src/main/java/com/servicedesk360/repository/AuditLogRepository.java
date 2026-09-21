package com.servicedesk360.repository;
import com.servicedesk360.entity.AuditLog; import org.springframework.data.domain.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditLogRepository extends JpaRepository<AuditLog,Long>{Page<AuditLog> findAllByTenantId(Long tenantId,Pageable pageable);}
