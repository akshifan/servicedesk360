package com.servicedesk360.repository;

import com.servicedesk360.entity.Queue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QueueRepository extends JpaRepository<Queue, Long> {

    Page<Queue> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Queue> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndName(Long tenantId, String name);
}
