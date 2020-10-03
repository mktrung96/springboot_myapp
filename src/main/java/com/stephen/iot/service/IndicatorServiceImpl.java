package com.stephen.iot.service;

import com.stephen.iot.data.common.BusinessException;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.model.Area;
import com.stephen.iot.model.Indicator;
import com.stephen.iot.repository.IndicatorDao;
import com.stephen.iot.repository.IndicatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//import com.stephen.iot.repository.RoleRepository;

@Service
public class IndicatorServiceImpl implements IndicatorService {
    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private IndicatorDao indicatorDao;

    @Autowired
    private VfData vfData;

    @Override
    public boolean save(IndicatorDto indicatorDto) {
        Indicator indiCheck = indicatorRepository.findByCode(indicatorDto.getCode());
        if(indiCheck != null){
            throw new BusinessException("Không thể thêm mới do trùng mã Chỉ tiêu");
        }
        indicatorDto.setIsActive("Y");
        Indicator genDto = indicatorRepository.save(indicatorDto.toModel());
        return genDto.getIndicatorId() > 0;
    }

    @Override
    public boolean edit(IndicatorDto indicatorDto) {
        Indicator indiCheck = indicatorRepository.findByCode(indicatorDto.getCode());
        if(!indiCheck.getIndicatorId().equals(indicatorDto.getIndicatorId()) && indiCheck.getCode().equals(indicatorDto.getCode())){
            throw new BusinessException("Không thể sửa do trùng mã Chỉ tiêu");
        }
        return indicatorDao.edit(vfData,indicatorDto);
    }

    @Override
    public boolean remove(IndicatorDto indicatorDto) {
        return indicatorDao.remove(vfData,indicatorDto);
    }

    @Override
    public List<IndicatorDto> getListIndicator(IndicatorDto obj) {
        return indicatorDao.getListIndicator(vfData,obj);
    }

    @Override
    public List<IndicatorDto> getParentIndicatorsForAutoComplete(IndicatorDto indicatorDto) {
        return indicatorDao.getParentIndicatorsForAutoComplete(vfData,indicatorDto);
    }

    @Override
    public List<IndicatorDto> getIndicatorsForApiAdd(IndicatorDto indicatorDto) {
        return indicatorDao.getIndicatorsForApiAdd(vfData,indicatorDto);
    }

    @Override
    public List<IndicatorDto> getIndicatorsForAutoComplete(IndicatorDto indicatorDto) {
        return indicatorDao.getIndicatorsForAutoComplete(vfData,indicatorDto);
    }

}
