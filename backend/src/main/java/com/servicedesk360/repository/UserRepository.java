package com.servicedesk360.repository;

import com.servicedesk360.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByTenantIdAndEmail(Long tenantId, String email);

    Optional<User> findByTenant_CodeAndEmail(String tenantCode, String email);

    Optional<User> findByIdAndTenantId(Long id, Long tenantId);

    Page<User> findAllByTenantId(Long tenantId, Pageable pageable);

    boolean existsByTenantIdAndEmail(Long tenantId, String email); long countByTenantId(Long tenantId);
}
