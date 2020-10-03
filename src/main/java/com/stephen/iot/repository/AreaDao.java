package com.stephen.iot.repository;

import com.stephen.iot.data.common.ValidateUtils;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.AreaDto;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigInteger;
import java.util.List;

//import javax.persistence.Query;

@Repository("AreaDao")
@Transactional
public class AreaDao {
    @PersistenceContext
    private EntityManager manager;

    public List<AreaDto> getListArea(VfData vfData, AreaDto obj) {
        StringBuilder sql = new StringBuilder("SELECT a.area_id areaId,a.name,a.code,a.isactive isActive,a.parent_id parentId,a.issummary isSummary, " +
                " (SELECT code FROM area where area_id = a.parent_id ) parentCode " +
                " ,(SELECT name FROM area where area_id = a.parent_id ) parentName " +
                "FROM area a where 1=1 "
        );

        if (obj.getAreaId() != null && obj.getAreaId() != 0) {
            sql.append(" and area_id = :areaId ");
        }
        if (obj.getKeySearch() != null) {
            sql.append(" and upper(code) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&' or upper(name) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&' ");
        }

        if (StringUtils.isNotBlank(obj.getIsActive())) {
            sql.append(" and isactive = :isActive ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(") as tblCount ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        SQLQuery queryCount = vfData.createSQLQuery(sqlCount.toString());
        query.setResultTransformer(Transformers.aliasToBean(AreaDto.class));

        if (obj.getAreaId() != null && obj.getAreaId() != 0) {
            query.setParameter("areaId", obj.getAreaId());
            queryCount.setParameter("areaId", obj.getAreaId());
        }
        if (obj.getKeySearch() != null) {
            query.setParameter("keySearch", ValidateUtils.validateKeySearch(obj.getKeySearch().trim() ));
            queryCount.setParameter("keySearch", ValidateUtils.validateKeySearch(obj.getKeySearch().trim()));
        }
        if (StringUtils.isNotBlank(obj.getIsActive())) {
            query.setParameter("isActive", obj.getIsActive());
            queryCount.setParameter("isActive", obj.getIsActive());
        }
        // pagination
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());
        return query.list();
    }


    public boolean edit(VfData vfData, AreaDto areaDto) {
        StringBuilder sql = new StringBuilder("UPDATE area set code = :code " +
                " ,isactive = :isActive " +
                " ,name = :name " +
                " ,issummary = :isSummary " +
                " ,parent_id = :parentId " +
                " ,updated = SYSDATE() " +
                " where area_Id = :areaId ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("areaId", areaDto.getAreaId());
        query.setParameter("code", areaDto.getCode());
        query.setParameter("name", areaDto.getName());
        query.setParameter("isActive", areaDto.getIsActive());
        query.setParameter("parentId", areaDto.getParentId());
        query.setParameter("isSummary", areaDto.getIsSummary());

        return query.executeUpdate() > 0;
    }


    public boolean remove(VfData vfData, AreaDto areaDto) {
        StringBuilder sql = new StringBuilder("UPDATE area set isactive = 'N',updated = SYSDATE() where area_id = :id ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("id", areaDto.getAreaId());

        return query.executeUpdate() > 0;
    }

    public List<AreaDto> getParentAreasForAutoComplete(VfData vfData, AreaDto areaDto) {
        StringBuilder sql = new StringBuilder("SELECT area_id parentId,code parentCode, name parentName FROM area where 1=1 and issummary = 'Y' ");
        if (areaDto.getName() != null) {
            sql.append(" and ( upper(code) like CONCAT('%', upper(:name),'%') ESCAPE '&' or upper(name) like CONCAT('%', upper(:name),'%') ESCAPE '&' ) ");
        }
        sql.append(" LIMIT  10 ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AreaDto.class));
        if (areaDto.getName() != null) {
            query.setParameter("name", ValidateUtils.validateKeySearch(areaDto.getName().trim()));
        }
        return query.list();
    }

    public List<AreaDto> getAreasForAutoComplete(VfData vfData, AreaDto areaDto) {
        StringBuilder sql = new StringBuilder("SELECT code areaCode,name areaName,area_id areaId FROM area where 1=1 and isactive = 'Y' ");
        if (StringUtils.isNotBlank(areaDto.getName())) {
            sql.append(" and (upper(name) like CONCAT('%', upper(:name),'%') ESCAPE '&' or upper(code) like CONCAT('%', upper(:name),'%') ESCAPE '&' )");
        }
        sql.append(" LIMIT  10 ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AreaDto.class));
        if (StringUtils.isNotBlank(areaDto.getName())) {
            query.setParameter("name", ValidateUtils.validateKeySearch(areaDto.getName().trim()));
        }
        return query.list();
    }


}
