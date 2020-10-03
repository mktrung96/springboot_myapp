package com.stephen.iot.service;

import com.stephen.iot.dto.AreaDto;

import java.util.List;

public interface AreaService {
    boolean save(AreaDto areaDto);

    boolean edit(AreaDto areaDto);

    boolean remove(AreaDto areaDto);

    List<AreaDto> getListArea(AreaDto areaDto);

    List<AreaDto> getAreasForAutoComplete(AreaDto areaDto);

    List<AreaDto> getParentAreasForAutoComplete(AreaDto areaDto);
}
