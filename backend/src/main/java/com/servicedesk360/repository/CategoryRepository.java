package com.servicedesk360.repository;

import com.servicedesk360.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Page<Category> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Category> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndName(Long tenantId, String name);
}
