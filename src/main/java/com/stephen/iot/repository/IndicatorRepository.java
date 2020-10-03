package com.stephen.iot.repository;

import com.stephen.iot.model.Indicator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndicatorRepository extends JpaRepository<Indicator, Long> {
//    Indicator findByIndicatorId(String username);
    Indicator findByCode(String code);
}
