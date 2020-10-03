/*
 * Copyright (C) 2018 Viettel Telecom. All rights reserved. VIETTEL PROPRIETARY/CONFIDENTIAL. Use is
 * subject to license terms.
 */
package com.stephen.iot.data.common;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * @author vietlv2
 * @version 1.0
 * @since Jul, 2018
 */
public interface VfData {
    /**
     * Get session factory.
     *
     * @return
     */
    SessionFactory getSessionFactory();

    /**
     * Get object by ID.
     *
     * @param dataModel
     * @param id
     * @return
     */
    <T> T get(Class dataModel, Serializable id);

    /**
     * Get session.
     *
     * @return
     */
    Session getSession();

    /**
     * Chuyen xau kieu CSDL sang xau kieu Java, ky tu dau tien viet thuong.
     *
     * @param input Xau dang ABC_DEF
     * @return Xau dang abcDef
     */
    String columnName(String input);

    /**
     * Save data Object.
     *
     * @param dataObject
     */
    void save(Object dataObject);

    /**
     * Delete object.
     *
     * @param entity
     */
    void delete(Object entity);

    /**
     * List all data by table.
     *
     * @param tableName
     * @param orderColumn
     * @return
     */
    <T> List<T> getAll(Class<T> tableName, String orderColumn);

    /**
     * Flush session.
     */
    void flushSession();

    /**
     * Clear session.
     */
    void clear();

    /**
     * Create HQL query.
     *
     * @param hql
     * @return
     */
    Query createQuery(String hql);

    /**
     * Create navtive SQL.
     *
     * @param sql
     * @return
     */
    SQLQuery createSQLQuery(String sql);

    /**
     * Check object duplicate.
     *
     * @param className
     * @param idColumn
     * @param idValue
     * @param codeColumn
     * @param codeValue
     * @return
     */
    boolean duplicate(Class className, String idColumn, Long idValue, String codeColumn, String codeValue);

    /**
     * ham set result transformer cua cau query
     *
     * @param query cau query
     * @param obj   doi tuong
     */
    void setResultTransformer(SQLQuery query, Class obj);

    /**
     * Get list alias column.
     *
     * @param query
     * @return
     */
    List<String> getReturnAliasColumns(SQLQuery query);

    /**
     * @param
     * @param obj
     * @return
     */
    <T> T get(String nativeQuery, Map<String, Object> mapParams, Class obj);

}
