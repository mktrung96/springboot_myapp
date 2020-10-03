package com.stephen.iot.repository;

import com.stephen.iot.model.Area;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaRepository extends JpaRepository<Area, Long> {
    Area findByAreaId(Long id);
    Area findByCode(String code);
}
