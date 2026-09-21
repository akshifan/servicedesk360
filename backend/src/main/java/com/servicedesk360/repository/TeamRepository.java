package com.servicedesk360.repository;

import com.servicedesk360.entity.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Page<Team> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Team> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndName(Long tenantId, String name);
}
