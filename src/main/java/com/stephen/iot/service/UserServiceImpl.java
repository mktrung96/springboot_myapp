package com.stephen.iot.service;

import com.stephen.iot.data.common.BusinessException;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.data.dto.ErrorDto;
import com.stephen.iot.dto.UserDto;
import com.stephen.iot.model.Indicator;
import com.stephen.iot.model.User;
import com.stephen.iot.repository.EmployeeDao;
import com.stephen.iot.repository.UserRepository;
import com.stephen.iot.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;

import java.util.List;

//import com.stephen.iot.repository.RoleRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private VfData vfData;
    @Autowired
    UserValidator userValidator;
    //    @Autowired
//    private RoleRepository roleRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void save(User user) {
        User userCheck = userRepository.findByUsername(user.getUsername());
        if(!userCheck.getId().equals(user.getId()) && userCheck.getUsername().equals(userCheck.getUsername())){
            throw new BusinessException("Không thể thêm mới do trùng Mã nhân viên");
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
//        user.setRoles(new HashSet<>(roleRepository.findAll()));
        userRepository.save(user);
    }

    @Override
    public boolean edit(UserDto userDto) {
        User userCheck = userRepository.findByUsername(userDto.getUsername());
        if(!userCheck.getId().equals(userDto.getUserId()) && userCheck.getUsername().equals(userCheck.getUsername())){
            throw new BusinessException("Không thể sửa do trùng Mã nhân viên");
        }
        return employeeDao.edit(vfData,userDto);
    }


    @Override
    public boolean remove(UserDto userDto) {
        return employeeDao.remove(vfData,userDto);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<UserDto> getListEmployee(UserDto userDto) {
        return employeeDao.getListEmployee(vfData,userDto);
    }

    @Override
    public boolean saveEmployee(UserDto userDto) {
//        User  userBO = userRepository.findById(userDto.get);
        User userBO = userDto.toModel();
        userBO.setIsActive("Y");
        userBO.setPassword(bCryptPasswordEncoder.encode(userBO.getPassword()));
        User user =  userRepository.save(userBO);
        return user.getId() >1;
    }

    @Override
    public UserDto getUserInfoById(Integer userId) {
        return employeeDao.getUserInfoById(vfData,userId);
    }
    @Override
    public UserDto getUserInfoByUserName(String userName) {
        return employeeDao.getUserInfoByUserName(vfData,userName);
    }

    @Override
    public List<UserDto> getUsersForAutoComplete(UserDto userDto) {
        return employeeDao.getUsersForAutoComplete(vfData,userDto);
    }

    @Override
    public boolean changePass(UserDto userDto) {
        if (userDto.getPassword() == null || !StringUtils.hasText(userDto.getPassword())) {
            throw new BusinessException( "Mật khẩu là trường bắt buộc nhập!");
        }
        if (userDto.getPassword().length() < 8 || userDto.getPassword().length() > 32) {
            throw new BusinessException( "Mật khẩu phải có ít nhất 8 kí tự!");
        }
        if(!userDto.getPassword().equals(userDto.getPasswordConfirm())){
            throw new BusinessException("Mật khẩu và mật khẩu xác nhận không khớp nhau!");
        }
        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        return employeeDao.changePass(vfData,userDto);
    }
}
