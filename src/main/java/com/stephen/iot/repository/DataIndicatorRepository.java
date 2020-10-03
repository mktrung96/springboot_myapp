package com.stephen.iot.repository;

import com.stephen.iot.model.DataIndicator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataIndicatorRepository extends JpaRepository<DataIndicator, Long> {
    DataIndicator findByDataIndicatorId(Long indicatorId);
}
