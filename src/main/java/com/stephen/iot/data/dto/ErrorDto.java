package com.stephen.iot.data.dto;

import lombok.Data;

@Data
public class ErrorDto {
    private String name;
    private String value;

    public ErrorDto(String name, String value) {
        this.name = name;
        this.value = value;
    }

    @Override
    public String toString() {
        return
                "'" + name + " : " + value + "'\n"
        ;
    }
}
