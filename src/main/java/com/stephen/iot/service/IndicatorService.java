package com.stephen.iot.service;

import com.stephen.iot.data.dto.DataListDTO;
import com.stephen.iot.dto.IndicatorDto;

import java.util.List;

public interface IndicatorService {
    boolean save(IndicatorDto indicatorDto);

    boolean edit(IndicatorDto indicatorDto);

    boolean remove(IndicatorDto indicatorDto);

    List<IndicatorDto> getListIndicator(IndicatorDto indicatorDto);

    List<IndicatorDto> getParentIndicatorsForAutoComplete(IndicatorDto indicatorDto);

    List<IndicatorDto> getIndicatorsForApiAdd(IndicatorDto indicatorDto);

    List<IndicatorDto> getIndicatorsForAutoComplete(IndicatorDto indicatorDto);

}
