package com.stephen.iot.repository;

import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.DataIndicatorDto;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

//import javax.persistence.Query;

@Repository("DataIndicatorDao")
@Transactional
public class DataIndicatorDao {

    public List<DataIndicatorDto> getListDataIndicator(VfData vfData, DataIndicatorDto obj) {
        StringBuilder sql = new StringBuilder("SELECT di.data_indicator_id dataIndicatorId ,u.user_id userId,u.username username,di.area_id areaId, " +
                "a.code areaCode,a.name areaName,di.content content, " +
                "di.indicator_id indicatorId,indi.code indicatorCode,indi.name indicatorName,di.date date,di.value value,indi.unit unit,di.created created,di.updated updated " +
                "FROM data_indicator di " +
                " inner join user u on di.user_id = u.user_id " +
                " inner join area a on a.area_id = di.area_id " +
                " inner join indicator indi on indi.indicator_id = di.indicator_id " +
                "where 1=1 ");
        if (obj.getDateFrom() != null) {
            sql.append(" and DATE(di.date) >= DATE(:dateFrom) ");
        }
        if (obj.getDateTo() != null) {
            sql.append(" and DATE(di.date) < DATE(:dateTo) +1 ");
        }
        if (obj.getUserId() != null && obj.getUserId() != 0) {
            sql.append(" and di.user_id = :userId ");
        }
        if (obj.getAreaId() != null && obj.getAreaId() != 0) {
            sql.append(" and di.area_id = :areaId ");
        }
        if (obj.getIndicatorId() != null && obj.getIndicatorId() != 0) {
            sql.append(" and di.indicator_id = :indicatorId ");
        }
//        if (dataIndicatorDto.getKeySearch() != null ) {
//            sql.append(" and upper(code) like upper(:keySearch) ESCAPE '&' or upper(name) like upper(:keySearch) ESCAPE '&' ");
//        }
        sql.append(" ORDER BY di.date,di.area_id,di.indicator_id,di.value,indi.unit ");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(") as tblCount ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        SQLQuery queryCount = vfData.createSQLQuery(sqlCount.toString());
        query.setResultTransformer(Transformers.aliasToBean(DataIndicatorDto.class));

        if (obj.getDateFrom() != null) {
            query.setParameter("dateFrom", obj.getDateFrom());
            queryCount.setParameter("dateFrom", obj.getDateFrom());
        }
        if (obj.getDateTo() != null) {
            query.setParameter("dateTo", obj.getDateTo());
            queryCount.setParameter("dateTo", obj.getDateTo());
        }
        if (obj.getUserId() != null && obj.getUserId() != 0) {
            query.setParameter("userId", obj.getUserId());
            queryCount.setParameter("userId", obj.getUserId());
        }
        if (obj.getAreaId() != null && obj.getAreaId() != 0) {
            query.setParameter("areaId", obj.getAreaId());
            queryCount.setParameter("areaId", obj.getAreaId());
        }
        if (obj.getIndicatorId() != null && obj.getIndicatorId() != 0) {
            query.setParameter("indicatorId", obj.getIndicatorId());
            queryCount.setParameter("indicatorId", obj.getIndicatorId());
        }
//        if (dataIndicatorDto.getKeySearch() != null ) {
//            query.setParameter("keySearch", ValidateUtils.validateKeySearch("%"+dataIndicatorDto.getKeySearch().trim()+"%"));
//        }
        // pagination
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<DataIndicatorDto> getListDataForMobile(VfData vfData, DataIndicatorDto obj) {
        StringBuilder sql = new StringBuilder("with t1 as (select indi.indicator_id, indi.code,indi.name, indi.unit,indi.parent_id  FROM indicator indi  "+
                "where parent_id = :parentId and indi.isactive = 'Y' and indi.issummary = 'N' ) "+
                "select t1.indicator_id indicatorId, t1.code indicatorCode,t1.name indicatorName,t1.parent_id parentId, t1.unit unit," +
                "t2.value value,t2.area_id areaId,t2.areaCode,t2.areaName,t2.content,t2.username from t1  "+
                "left join  "+
                "(select di.indicator_id indicator_id,di.value,di.date,a.area_id,a.code areaCode,a.name areaName,di.content,u.username " +
                " from data_indicator di  "+
                "inner join user u on di.user_id = u.user_id   "+
                "inner join area a on a.area_id = di.area_id where DATE(di.date) = DATE(:date) and di.user_id = :userId and di.area_id = :areaId ) t2 "+
                "on t1.indicator_id = t2.indicator_id ");
        sql.append(" ORDER BY t1.indicator_id  ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());

        query.setResultTransformer(Transformers.aliasToBean(DataIndicatorDto.class));

        if (obj.getDate() != null) {
            query.setParameter("date", obj.getDate());
        }
        if (obj.getUserId() != null && obj.getUserId() != 0) {
            query.setParameter("userId", obj.getUserId());
        }
        if (obj.getAreaId() != null && obj.getAreaId() != 0) {
            query.setParameter("areaId", obj.getAreaId());
        }
        if (obj.getParentId() != null && obj.getParentId() != 0) {
            query.setParameter("parentId", obj.getParentId());
        }
        return query.list();
    }

    public boolean edit(VfData vfData, DataIndicatorDto dataIndicatorDto) {
        StringBuilder sql = new StringBuilder("UPDATE data_indicator di set value = :value, updated = sysdate()  ");
        if (dataIndicatorDto.getContent() != null){
            sql.append(",content = :content  ");
        }
        sql.append(" where indicator_id = :indicatorId and DATE(di.date) = DATE(:date) and di.user_id = :userId and di.area_id = :areaId ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("userId", dataIndicatorDto.getUserId());
        query.setParameter("areaId", dataIndicatorDto.getAreaId());
        query.setParameter("indicatorId", dataIndicatorDto.getIndicatorId());
        if (dataIndicatorDto.getContent() != null){
            query.setParameter("content", dataIndicatorDto.getContent());
        }
        query.setParameter("date", dataIndicatorDto.getDate());
        query.setParameter("value", dataIndicatorDto.getValue());
//        query.setParameter("dataDataIndicatorId", dataIndicatorDto.getDataIndicatorId());
        return query.executeUpdate() > 0;
    }

    public boolean remove(VfData vfData, DataIndicatorDto dataIndicatorDto) {
        StringBuilder sql = new StringBuilder("DELETE FROM data_indicator where indicator_id = :indicatorId and DATE(di.date) = DATE(:date) and di.user_id = :userId and di.area_id = :areaId ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("dataDataIndicatorId", dataIndicatorDto.getDataIndicatorId());
        return query.executeUpdate() > 0;
    }
}
