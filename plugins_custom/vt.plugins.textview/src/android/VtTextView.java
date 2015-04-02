package com.viettel.mobile.plugin;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

public class VtTextView extends CordovaPlugin {

//    public native String stringFromJNI();
//
//    static {
//        System.loadLibrary("HelloJni");
//    }

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        if (action.equals("login")) {
            String name = data.getString(0);
//            String jni = stringFromJNI();
            String message = "Hello, " + name;
//            String userPassword = "pangchiu";
//            BasicPasswordEncryptor passwordEncryptor = new BasicPasswordEncryptor();
//            String encryptedPassword = passwordEncryptor.encryptPassword(userPassword);
//
//            if (passwordEncryptor.checkPassword(name, encryptedPassword)) {
//                // correct!
//                message += " Login Success " + name + " == " + userPassword;
//            } else {
//                // bad login!
//                message += " Login Fail " + name + " != " + userPassword;
//            }
            callbackContext.success(message);
            return true;
        } else {
            return false;
        }
    }
}
