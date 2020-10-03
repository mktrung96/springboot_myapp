package com.stephen.iot.service;

import com.stephen.iot.dto.UserDto;
import com.stephen.iot.model.User;

import java.util.List;

public interface UserService {
    void save(User user);

    boolean edit(UserDto userDto);

    boolean remove(UserDto userDto);

    User findByUsername(String username);

    List<UserDto> getListEmployee(UserDto userDto);

    boolean saveEmployee(UserDto userDto);

    UserDto getUserInfoById(Integer userId);
    UserDto getUserInfoByUserName(String userName);

    List<UserDto> getUsersForAutoComplete(UserDto userDto);

    boolean changePass(UserDto userDto);
}
