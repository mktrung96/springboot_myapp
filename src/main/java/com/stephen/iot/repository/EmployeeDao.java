package com.stephen.iot.repository;

import com.stephen.iot.data.common.ValidateUtils;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.dto.UserDto;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

@Repository("EmployeeDao")
@Transactional
public class EmployeeDao {
    @SuppressWarnings("unchecked")
    public List<UserDto> getListEmployee(VfData vfData, UserDto obj) {
        StringBuilder sql = new StringBuilder("SELECT user_id userId,fullname fullName,isactive isActive,isadmin isAdmin,email email,phone phone, username username FROM user where 1=1 ");
        if (obj.getUserId() != null && obj.getUserId() != 0) {
            sql.append(" and user_id = :id ");
        }
        if (StringUtils.isNotBlank(obj.getIsActive())) {
            sql.append(" and isactive = :isActive ");
        }
        if (obj.getKeySearch() != null) {
            sql.append(" and upper(email) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&' or upper(fullname) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&' or upper(username) like CONCAT('%', upper(:keySearch),'%') ESCAPE '&'");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(") as tblCount ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        SQLQuery queryCount = vfData.createSQLQuery(sqlCount.toString());
        query.setResultTransformer(Transformers.aliasToBean(UserDto.class));

        if (obj.getUserId() != null && obj.getUserId() != 0) {
            query.setParameter("id", obj.getUserId());
            queryCount.setParameter("id", obj.getUserId());
        }
        if (StringUtils.isNotBlank(obj.getIsActive())) {
            query.setParameter("isActive", obj.getIsActive());
            queryCount.setParameter("isActive", obj.getIsActive());
        }
        if (obj.getKeySearch() != null) {
            query.setParameter("keySearch", ValidateUtils.validateKeySearch( obj.getKeySearch().trim() ));
            queryCount.setParameter("keySearch", ValidateUtils.validateKeySearch( obj.getKeySearch().trim()));
        }
        // pagination
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public boolean edit(VfData vfData, UserDto userDto) {
        StringBuilder sql = new StringBuilder("UPDATE user set " +
                " fullname = :fullname " +
                " ,phone = :phone " +
                " ,email = :email " +
                " ,isAdmin = :isAdmin " +
                " where user_id = :id ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(UserDto.class));
        query.setParameter("id", userDto.getUserId());
        query.setParameter("fullname", userDto.getFullName());
        query.setParameter("phone", userDto.getPhone());
        query.setParameter("email", userDto.getEmail());
        query.setParameter("isAdmin", userDto.getIsAdmin());

        return query.executeUpdate() > 0;
    }


    public boolean remove(VfData vfData, UserDto userDto) {
        StringBuilder sql = new StringBuilder("UPDATE user set isactive = 'N' where user_id = :id ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setParameter("id", userDto.getUserId());
        return query.executeUpdate() > 0;
    }

    public UserDto getUserInfoById(VfData vfData, Integer userId) {
        StringBuilder sql = new StringBuilder("SELECT user_id userId,fullname fullName,isactive isActive,isadmin isAdmin,email email,phone phone, username username FROM user where 1=1 ");
        sql.append(" and user_id = :userId ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(UserDto.class));
        query.setParameter("userId", userId);
        return (UserDto) query.getSingleResult();
    }

    public UserDto getUserInfoByUserName(VfData vfData, String userName) {
        StringBuilder sql = new StringBuilder("SELECT user_id userId,fullname fullName,isactive isActive,isadmin isAdmin,email email,phone phone, username username FROM user where 1=1 ");
        sql.append(" and username = :userName ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(UserDto.class));
        query.setParameter("userName", userName);
        return (UserDto) query.getSingleResult();
    }

    public List<UserDto> getUsersForAutoComplete(VfData vfData, UserDto userDto) {
        StringBuilder sql = new StringBuilder("SELECT fullname fullName,username username,user_id userId FROM user where 1=1 and isactive = 'Y' ");
        if (StringUtils.isNotBlank(userDto.getUsername())) {
            sql.append(" and ( upper(username) LIKE CONCAT('%', upper(:username),'%') ESCAPE '&' or upper(fullname) LIKE CONCAT('%', upper(:username),'%') ESCAPE '&' ) ");
        }
        sql.append(" LIMIT  10 ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(UserDto.class));
        if (StringUtils.isNotBlank(userDto.getUsername())) {
            query.setParameter("username", ValidateUtils.validateKeySearch(userDto.getUsername().trim()));
        }
        return query.list();
    }

    public boolean changePass(VfData vfData, UserDto userDto) {
        StringBuilder sql = new StringBuilder("UPDATE user set " +
                " password = :password " +
                " where user_id = :id ");
        SQLQuery query = vfData.createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(UserDto.class));
        query.setParameter("id", userDto.getUserId());
        query.setParameter("password", userDto.getPassword());

        return query.executeUpdate() > 0;
    }


}
