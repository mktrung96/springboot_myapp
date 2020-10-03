package com.stephen.iot.service;

import com.stephen.iot.dto.AreaDto;
import com.stephen.iot.dto.DataIndicatorDto;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.model.DataIndicator;
import com.stephen.iot.model.User;

import java.util.List;

public interface DataIndicatorService {
//    void save(DataIndicatorDto dataIndicatorDto);
    void edit(DataIndicatorDto obj);
//    void updateDailyData(DataIndicatorDto dataIndicatorDto);

//    boolean remove(DataIndicatorDto dataIndicatorDto);
    List<DataIndicatorDto> getListDataIndicator(DataIndicatorDto dataIndicatorDto);
    List<DataIndicatorDto> getListDataForMobile(DataIndicatorDto dataIndicatorDto);
}
