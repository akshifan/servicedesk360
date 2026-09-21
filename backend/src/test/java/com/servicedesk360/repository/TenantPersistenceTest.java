package com.servicedesk360.repository;

import com.servicedesk360.entity.Role;
import com.servicedesk360.entity.Tenant;
import com.servicedesk360.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class TenantPersistenceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void userLookupsRequireTheOwningTenant() {
        Tenant firstTenant = tenantRepository.saveAndFlush(
                new Tenant("First tenant", "first-tenant")
        );
        Tenant secondTenant = tenantRepository.saveAndFlush(
                new Tenant("Second tenant", "second-tenant")
        );

        User user = userRepository.saveAndFlush(
                new User(
                        firstTenant,
                        "First user",
                        "user@example.com",
                        "not-a-real-password-hash",
                        Role.REQUESTER
                )
        );

        assertThat(userRepository.findByTenantIdAndEmail(firstTenant.getId(), "user@example.com"))
                .contains(user);
        assertThat(userRepository.findByTenantIdAndEmail(secondTenant.getId(), "user@example.com"))
                .isEmpty();
        assertThat(userRepository.findByIdAndTenantId(user.getId(), secondTenant.getId()))
                .isEmpty();
    }
}
