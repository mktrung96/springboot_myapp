package com.stephen.iot.service;

public interface SecurityService {
    String findLoggedInUsername();

    void autoLogin(String username, String password);
}
