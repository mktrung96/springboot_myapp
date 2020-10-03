package com.stephen.iot.service;

import com.stephen.iot.data.common.BusinessException;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.AreaDto;
import com.stephen.iot.model.Area;
import com.stephen.iot.repository.AreaDao;
import com.stephen.iot.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AreaServiceImpl implements AreaService {
    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private AreaDao areaDao;

    @Autowired
    private VfData vfData;

    @Override
    public boolean save(AreaDto areaDto) {
        Area areaCheck = areaRepository.findByCode(areaDto.getCode());
        if(areaCheck != null ){
            throw new BusinessException("Không thể thêm mới do trùng mã KV");
        }
        areaDto.setIsActive("Y");
        areaDto.setCreated(new Date());
        Area genDto = areaRepository.save(areaDto.toModel());
        return genDto.getAreaId() > 0;
    }

    @Override
    public boolean edit(AreaDto areaDto) {  
        Area areaCheck = areaRepository.findByCode(areaDto.getCode());
        if(areaCheck != null &&  !areaCheck.getAreaId().equals(areaDto.getAreaId()) && areaCheck.getCode().equals(areaDto.getCode())){
            throw new BusinessException("Không thể sửa do trùng mã KV");
        }
        return areaDao.edit(vfData, areaDto);
    }

    @Override
    public boolean remove(AreaDto areaDto) {
        return areaDao.remove(vfData, areaDto);
    }

    @Override
    public List<AreaDto> getListArea(AreaDto areaDto) {
        return areaDao.getListArea(vfData, areaDto);
    }

    @Override
    public List<AreaDto> getParentAreasForAutoComplete(AreaDto areaDto) {
        return areaDao.getParentAreasForAutoComplete(vfData, areaDto);
    }

    @Override
    public List<AreaDto> getAreasForAutoComplete(AreaDto areaDto) {
        return areaDao.getAreasForAutoComplete(vfData, areaDto);
    }

}
