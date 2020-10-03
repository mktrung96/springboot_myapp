package com.stephen.iot.data.common;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BooleanType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.hibernate.type.TimestampType;
import org.hibernate.type.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author trungpt29
 * @version 1.0
 * @since Jul, 2020
 */
@Component
public class VfDataImpl implements VfData {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private HttpServletRequest req;

    private static final Logger LOGGER = LoggerFactory.getLogger(VfDataImpl.class);

    public VfDataImpl() {
        super();
    }

    @Override
    public SessionFactory getSessionFactory() {
        return entityManager.getEntityManagerFactory().unwrap(SessionFactory.class);
    }

    @Override
    public <T> T get(Class dataModel, Serializable id) {
        return (T) getSession().get(dataModel, id);
    }

    @Override
    public Session getSession() {
        return entityManager.unwrap(Session.class);
    }

    @Override
    public String columnName(String input) {
        try {
            String output = "";
            for (int i = 0; i < input.length(); i++) {
                if (input.charAt(i) == '_') {
                    i++;
                    output += Character.toUpperCase(input.charAt(i));
                } else {
                    output += Character.toLowerCase(input.charAt(i));
                }
            }
            return output;
        } catch (Exception ex) {
            LOGGER.error("ERROR: ", ex);
            return "ABC";
        }
    }

    @Override
    public void save(Object dataObject) {
        getSession().save(dataObject);
    }

    @Override
    public void delete(Object entity) {
        getSession().delete(entity);
    }

    @Override
    public <T> List<T> getAll(Class<T> tableName, String orderColumn) {
        Session session = getSession();
        String hql = " FROM " + tableName.getName() + " t ORDER BY " + "t." + orderColumn;
        Query query = session.createQuery(hql);
        return query.list();
    }

    @Override
    public void flushSession() {
        getSession().flush();

    }

    @Override
    public void clear() {
        getSession().clear();

    }

    @Override
    public Query createQuery(String hql) {
        return getSession().createQuery(hql);
    }

    @Override
    public SQLQuery createSQLQuery(String sql) {
        return getSession().createSQLQuery(sql);
    }

    @Override
    public boolean duplicate(Class className, String idColumn, Long idValue, String codeColumn, String codeValue) {
        String hql = " SELECT COUNT(*) FROM " + className.getName() + " t WHERE LOWER(t." + codeColumn + ") = ? ";
        if (idValue != null) {
            hql += " AND t." + idColumn + " != ? ";
        }
        Query query = createQuery(hql);
        query.setParameter(0, codeValue.trim().toLowerCase());
        if (idValue != null) {
            query.setParameter(1, idValue);
        }
        query.setMaxResults(1);
        Long count = (Long) query.uniqueResult();
        return count > 0;
    }

    @Override
    public void setResultTransformer(SQLQuery query, Class obj) {
        Field[] fileds = obj.getDeclaredFields();
        Map<String, String> mapFileds = new HashMap();
        for (Field filed : fileds) {
            mapFileds.put(filed.getName(), filed.getGenericType().toString());
        }
        List<String> aliasColumns = getReturnAliasColumns(query);
        for (String aliasColumn : aliasColumns) {
            String dataType = mapFileds.get(aliasColumn);
            if (dataType == null) {
                LOGGER.debug(aliasColumn + " is not defined");
            } else {
                Type hbmType = null;
                if ("class java.lang.Long".equals(dataType)) {
                    hbmType = LongType.INSTANCE;
                } else if ("class java.lang.Integer".equals(dataType)) {
                    hbmType = IntegerType.INSTANCE;
                } else if ("class java.lang.Double".equals(dataType)) {
                    hbmType = DoubleType.INSTANCE;
                } else if ("class java.lang.String".equals(dataType)) {
                    hbmType = StringType.INSTANCE;
                } else if ("class java.lang.Boolean".equals(dataType)) {
                    hbmType = BooleanType.INSTANCE;
                } else if ("class java.util.Date".equals(dataType)) {
                    hbmType = TimestampType.INSTANCE;
                }
                if (hbmType == null) {
                    LOGGER.debug(dataType + " is not supported");
                } else {
                    query.addScalar(aliasColumn, hbmType);
                }
            }
        }
        query.setResultTransformer(Transformers.aliasToBean(obj));

    }

    @Override
    public List<String> getReturnAliasColumns(SQLQuery query) {
        List<String> aliasColumns = new ArrayList();
        String sqlQuery = query.getQueryString();
        sqlQuery = sqlQuery.replace("\n", " ");
        sqlQuery = sqlQuery.replace("\t", " ");
        int numOfRightPythis = 0;
        int startPythis = -1;
        int endPythis = 0;
        boolean hasRightPythis = true;
        while (hasRightPythis) {
            char[] arrStr = sqlQuery.toCharArray();
            hasRightPythis = false;
            int idx = 0;
            for (char c : arrStr) {
                if (idx > startPythis) {
                    if ("(".equalsIgnoreCase(String.valueOf(c))) {
                        if (numOfRightPythis == 0) {
                            startPythis = idx;
                        }
                        numOfRightPythis++;
                    } else if (")".equalsIgnoreCase(String.valueOf(c))) {
                        if (numOfRightPythis > 0) {
                            numOfRightPythis--;
                            if (numOfRightPythis == 0) {
                                endPythis = idx;
                                break;
                            }
                        }
                    }
                }
                idx++;
            }
            if (endPythis > 0) {
                sqlQuery = sqlQuery.substring(0, startPythis) + " # " + sqlQuery.substring(endPythis + 1);
                hasRightPythis = true;
                endPythis = 0;
            }
        }
        String arrStr[] = sqlQuery.substring(0, sqlQuery.toUpperCase().indexOf(" FROM ")).split(",");
        for (String str : arrStr) {
            String[] temp = str.trim().split(" ");
            String alias = temp[temp.length - 1].trim();
            if (alias.contains(".")) {
                alias = alias.substring(alias.lastIndexOf(".") + 1).trim();
            }
            if (alias.contains(",")) {
                alias = alias.substring(alias.lastIndexOf(",") + 1).trim();
            }
            if (alias.contains("`")) {
                alias = alias.replace("`", "");
            }
            if (!aliasColumns.contains(alias)) {
                aliasColumns.add(alias);
            }
        }
        return aliasColumns;
    }

    /**
     * @param
     * @param obj
     * @return
     */
    @Override
    public <T> T get(String nativeQuery, Map<String, Object> mapParams, Class obj) {
        SQLQuery query = createSQLQuery(nativeQuery);
        setResultTransformer(query, obj);

        if (mapParams != null && !mapParams.isEmpty()) {
            query.setProperties(mapParams);
        }
        query.setMaxResults(1);
        return (T) query.uniqueResult();
    }

}
