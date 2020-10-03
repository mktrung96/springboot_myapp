package com.stephen.iot.data.common;

import java.io.File;
import java.util.Calendar;

public class CommonUtil {
    public static Integer NVL(Integer value) {
        return value == null ? new Integer(0) : value;
    }
    public static String getFilePath(String folder, String subFolder) {
        Calendar cal = Calendar.getInstance();
        String filePath = folder + File.separator + CommonUtil.getSafeFileName(subFolder) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);

        File udir = new File(filePath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        return filePath;
    }
    public static String getSafeFileName(String input) {
        StringBuilder sb = new StringBuilder();
        if (input != null) {
            for (int i = 0; i < input.length(); i++) {
                char c = input.charAt(i);
                if (c != '/' && c != '\\' && c != 0) {
                    sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}
