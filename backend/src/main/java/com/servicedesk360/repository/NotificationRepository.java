package com.servicedesk360.repository;
import com.servicedesk360.entity.Notification;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface NotificationRepository extends JpaRepository<Notification,Long>{Page<Notification> findAllByTenantIdAndUserId(Long tenantId,Long userId,Pageable pageable); Optional<Notification> findByIdAndTenantIdAndUserId(Long id,Long tenantId,Long userId); long countByTenantIdAndUserIdAndReadAtIsNull(Long tenantId,Long userId);}
