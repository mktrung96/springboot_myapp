package com.stephen.iot.validator;

import com.stephen.iot.data.dto.ErrorDto;
import com.stephen.iot.model.User;
import com.stephen.iot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserValidator implements Validator {
    @Autowired
    private UserService userService;

    @Override
    public boolean supports(Class<?> aClass) {
        return User.class.equals(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        User user = (User) o;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "NotEmpty");
        if (user.getUsername().length() < 6 || user.getUsername().length() > 32) {
            errors.rejectValue("username", "Size.userForm.username");
        }
        if (userService.findByUsername(user.getUsername()) != null) {
            errors.rejectValue("username", "Duplicate.userForm.username");
        }

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty");
        if (user.getPassword().length() < 8 || user.getPassword().length() > 32) {
            errors.rejectValue("password", "Size.userForm.password");
        }

        if (!user.getPasswordConfirm().equals(user.getPassword())) {
            errors.rejectValue("passwordConfirm", "Diff.userForm.passwordConfirm");
        }
    }

    public List<ErrorDto> customValidate(Object o) {
        User user = (User) o;
        List<ErrorDto> ls = new ArrayList<>();
        if (user.getUsername() == null || !StringUtils.hasText(user.getUsername())) {
            ls.add(new ErrorDto("username", "This field is required."));
        }
        if (user.getUsername().length() < 6 || user.getUsername().length() > 32) {
            ls.add(new ErrorDto("username", "Please use between 6 and 32 characters."));
        }
        if (userService.findByUsername(user.getUsername()) != null) {
            ls.add(new ErrorDto("username", "Someone already has that username.e"));
        }

//        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty");
        if (user.getPassword() == null || !StringUtils.hasText(user.getPassword())) {
            ls.add(new ErrorDto("password", "This field is required."));
        }
        if (user.getPassword().length() < 8 || user.getPassword().length() > 32) {
            ls.add(new ErrorDto("password", "Try one with at least 8 characters."));
        }

        if (!user.getPasswordConfirm().equals(user.getPassword())) {
            ls.add(new ErrorDto("passwordConfirm", "These passwords don't match."));
        }
        return ls;
    }
}
