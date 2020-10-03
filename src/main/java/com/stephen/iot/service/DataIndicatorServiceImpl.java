package com.stephen.iot.service;

import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.DataIndicatorDto;
import com.stephen.iot.repository.DataIndicatorDao;
import com.stephen.iot.repository.DataIndicatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

//import com.stephen.iot.repository.RoleRepository;

@Service
public class DataIndicatorServiceImpl implements DataIndicatorService {
    @Autowired
    private DataIndicatorDao dataIndicatorDao;

    @Autowired
    private DataIndicatorRepository dataIndicatorRepository;

    @Autowired
    private VfData vfData;


//    @Override
//    public void updateDailyData(DataIndicatorDto obj) {
//        // Lấy dữ liệu của ngày hôm đó theo parentId, dateFrom, dateTo,
//        List<DataIndicatorDto> ls = getListDataForMobile(obj);
//        // Nếu ngày hôm đó chưa có dữ liệu thì
//        if (ls.size() != 0) {
//
//        }
//
////        if (obj.getListChildDataIndicators().size() > 0){
////            List<DataIndicatorDto> ls = obj.getListChildDataIndicators();
////            for (DataIndicatorDto dto : ls ) {
////                dto.setUpdated(new Date());
////                dto.setAreaId(obj.getAreaId());
////                dto.setUserId(obj.getUserId());
////                dto.setDate(obj.getDate());
////                dto.setContent(obj.getContent());
////                dataIndicatorDao.edit(vfData, dto);
////            }
////        }
//    }


    @Override
    public List<DataIndicatorDto> getListDataIndicator(DataIndicatorDto dataIndicatorDto) {
        return dataIndicatorDao.getListDataIndicator(vfData, dataIndicatorDto);
    }

    @Override
    public List<DataIndicatorDto> getListDataForMobile(DataIndicatorDto dataIndicatorDto) {
        return dataIndicatorDao.getListDataForMobile(vfData, dataIndicatorDto);
    }

    //    @Override
//    public void save(DataIndicatorDto obj){
//        if (obj.getListChildDataIndicators().size() > 0){
//            List<DataIndicatorDto> ls = obj.getListChildDataIndicators();
//            for (DataIndicatorDto dto : ls ) {
//                dto.setCreated(new Date());
//                dto.setAreaId(obj.getAreaId());
//                dto.setUserId(obj.getUserId());
//                dto.setDate(obj.getDate());
//                dto.setContent(obj.getContent());
//                dataIndicatorRepository.save(dto.toModel());
//            }
//        }
//
//    }
    @Override
    public void edit(DataIndicatorDto obj) {
        if (obj.getListChildDataIndicators().size() > 0) {
            List<DataIndicatorDto> ls = obj.getListChildDataIndicators();
            for (DataIndicatorDto dto : ls) {
                dto.setAreaId(obj.getAreaId());
                dto.setUserId(obj.getUserId());
                dto.setDate(obj.getDate());
                dto.setContent(obj.getContent());
                boolean flag = dataIndicatorDao.edit(vfData, dto);
                if (!flag) {
                    dto.setCreated(new Date());
                    dataIndicatorRepository.save(dto.toModel());
                }
            }
        }

//        for (DataIndicatorDto dto : ls) {
//           boolean flag =  dataIndicatorDao.edit(vfData, dto);
//           if (!flag){
//               dataIndicatorRepository.save(dto.toModel());
//           }
//        }
    }
//@Override
//public boolean remove(DataIndicatorDto dataIndicatorDto) {
//    return dataIndicatorDao.remove(vfData,dataIndicatorDto);
//}
}
