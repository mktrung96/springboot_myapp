package com.stephen.iot.repository;

import com.stephen.iot.data.common.ValidateUtils;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.IndicatorDto;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

@Repository("IndicatorDao")
@Transactional
public class IndicatorDao {

    @SuppressWarnings("unchecked")
    public List<IndicatorDto> getListIndicator(VfData vfData, IndicatorDto obj) {
        StringBuilder sql = new StringBuilder("SELECT indi.indicator_id indicatorId, indi.code,indi.unit unit,indi.name name,indi.isactive isActive,indi.issummary isSummary,indi.seqno seqNo,indi.created created," +
                " indi.parent_id parentId,datatype dataType " +
                " ,(SELECT code FROM indicator where indicator_id = indi.parent_id ) parentCode " +
                " ,(SELECT name FROM indicator where indicator_id = indi.parent_id ) parentName " +
                " FROM indicator indi where 1=1 ");
        if (obj.getIndicatorId() != null && obj.getIndicatorId() != 0) {
            sql.append(" and indicator_id = :indicatorId ");
        }
        if (StringUtils.isNotBlank(obj.getIsActive())) {
            sql.append(" and isactive = :isActive ");
        }
        if (StringUtils.isNotBlank(obj.getIsSummary())) {
            sql.append(" and issummary = :isSummary ");
        }
        if (obj.getKeySearch() != null) {
            sql.append(" and upper(code) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&' or upper(name) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&' ");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(") as tblCount ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        SQLQuery queryCount = vfData.createSQLQuery(sqlCount.toString());
        query.setResultTransformer(Transformers.aliasToBean(IndicatorDto.class));

        if (obj.getIndicatorId() != null && obj.getIndicatorId() != 0) {
            query.setParameter("indicatorId", obj.getIndicatorId());
            queryCount.setParameter("indicatorId", obj.getIndicatorId());
        }
        if (StringUtils.isNotBlank(obj.getIsActive())) {
            query.setParameter("isActive", obj.getIsActive());
            queryCount.setParameter("isActive", obj.getIsActive());
        }
        if (StringUtils.isNotBlank(obj.getIsSummary())) {
            query.setParameter("isSummary", obj.getIsSummary());
            queryCount.setParameter("isSummary", obj.getIsSummary());
        }
        if (obj.getKeySearch() != null) {
            query.setParameter("keySearch", ValidateUtils.validateKeySearch(obj.getKeySearch().trim()));
            queryCount.setParameter("keySearch", ValidateUtils.validateKeySearch(obj.getKeySearch().trim()));
        }

        // pagination
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public boolean edit(VfData vfData, IndicatorDto indicatorDto) {
        StringBuilder sql = new StringBuilder("UPDATE indicator set " +
                " code = :code " +
                " ,name = :name " +
                " ,issummary = :isSummary " +
                " ,parent_id = :parentId " +
                " ,datatype = :datatype " +
                " ,unit = :unit " +
                " ,seqno = :seqNo " +
                " ,isactive = :isActive " +
                " where indicator_id = :indicatorId ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("indicatorId", indicatorDto.getIndicatorId());
        query.setParameter("code", indicatorDto.getCode());
        query.setParameter("name", indicatorDto.getName());
        query.setParameter("isSummary", indicatorDto.getIsSummary());
        query.setParameter("parentId", indicatorDto.getParentId());
        query.setParameter("datatype", indicatorDto.getDataType());
        query.setParameter("unit", indicatorDto.getUnit());
        query.setParameter("seqNo", indicatorDto.getSeqNo());
        query.setParameter("isActive", indicatorDto.getIsActive());


        return query.executeUpdate() > 0;
    }

    public boolean remove(VfData vfData, IndicatorDto indicatorDto) {
        StringBuilder sql = new StringBuilder("UPDATE indicator set isactive = 'N' where indicator_id = :id ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("id", indicatorDto.getIndicatorId());

        return query.executeUpdate() > 0;
    }

    public List<IndicatorDto> getParentIndicatorsForAutoComplete(VfData vfData, IndicatorDto indicatorDto) {
        StringBuilder sql = new StringBuilder("SELECT code parentCode,name parentName,isactive isActive,indicator_id parentId FROM indicator where 1=1 and issummary = 'Y' ");
        if (indicatorDto.getName() != null) {
            sql.append(" and ( upper(code) like CONCAT('%', upper(:name),'%') ESCAPE '&' or upper(name) like CONCAT('%', upper(:name),'%') ESCAPE '&' ) ");
        }
        sql.append(" LIMIT  10 ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(IndicatorDto.class));
        if (indicatorDto.getName() != null) {
            query.setParameter("name", ValidateUtils.validateKeySearch(indicatorDto.getName().trim()));
        }
        return query.list();
    }

    public List<IndicatorDto> getIndicatorsForApiAdd(VfData vfData, IndicatorDto indicatorDto) {
        StringBuilder sql = new StringBuilder("SELECT code,name,isactive isActive,parent_id parentId FROM indicator where 1=1 and isactive = 'Y' and issummary = 'N' ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(IndicatorDto.class));
        return query.list();
    }

    public List<IndicatorDto> getIndicatorsForAutoComplete(VfData vfData, IndicatorDto indicatorDto) {
        StringBuilder sql = new StringBuilder("SELECT code indicatorCode,name indicatorName,indicator_id indicatorId FROM indicator where 1=1 and isactive = 'Y' ");
        if (StringUtils.isNotBlank(indicatorDto.getName())) {
            sql.append(" and ( upper(name) like CONCAT('%', upper(:name),'%') ESCAPE '&' or upper(code) like CONCAT('%', upper(:name),'%') ESCAPE '&' ) ");
        }
        sql.append(" LIMIT  10 ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(IndicatorDto.class));
        if (StringUtils.isNotBlank(indicatorDto.getName())) {
            query.setParameter("name", ValidateUtils.validateKeySearch(indicatorDto.getName().trim()));
        }
        return query.list();
    }
}
