package com.stephen.iot.dto;

import com.stephen.iot.model.Area;
import com.stephen.iot.model.User;
import lombok.Data;

import java.util.Date;

@Data
public class UserDto extends BaseDto{
    private Integer userId;
    private String username;
    private String password;
    private String passwordConfirm;
    private String fullName;
    private String email;
    private String phone;
    private String isAdmin;
    private String isActive;
    private Date created;
    private Date updated;
    private String keySearch;
    public User toModel() {
        User userBO = new User();
        userBO.setId(this.getUserId());
        userBO.setFullname(this.getFullName());
        userBO.setUsername(this.getUsername());
        userBO.setEmail(this.getEmail());
        userBO.setPassword(this.getPassword());
        userBO.setPasswordConfirm(this.getPasswordConfirm());
        userBO.setPhone(this.getPhone());
        userBO.setIsActive(this.getIsActive());
        userBO.setIsAdmin(this.getIsAdmin());
        userBO.setCreated(this.getCreated());
        userBO.setUpdated(this.getUpdated());
        return userBO;
    }

}
