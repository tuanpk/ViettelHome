package com.viettel.mobile.plugin;

import java.util.Set;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

public class VtTextView extends CordovaPlugin {

    private static final String ACTION_INIT = "init";
    private static final String ACTION_SET_FRAME = "setFrame";
    private static final String ACTION_HIDE = "hide";
    private static final String ACTION_SHOW = "show";
    private static final String ACTION_DESTROY = "destroy";
    private static final String ACTION_GET_TEXT = "getText";
    private static final String ACTION_SET_TEXT = "setText";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (action.equals(ACTION_INIT)) {
            this.init(callbackContext, args);
            return true;
        }
        if (action.equals(ACTION_SET_FRAME)) {
            this.setFrame(callbackContext);
            return true;
        }

        if (action.equals(ACTION_HIDE)) {
            this.hide(callbackContext);
            return true;
        }
        if (action.equals(ACTION_SHOW)) {
            this.show(callbackContext);
            return true;
        }
        if (action.equals(ACTION_DESTROY)) {
            this.destroy(args.getString(0), callbackContext);
            return true;
        }
        if (action.equals(ACTION_GET_TEXT)) {
            this.getText(args.getString(0), callbackContext);
            return true;
        }
        if (action.equals(ACTION_SET_TEXT)) {
            this.setText(args.getString(0), callbackContext);
            return true;
        }
        return false;
    }
    
    private void init(final CallbackContext callbackContext, final JSONArray args) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('init');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }

    private void setFrame(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('setFrame');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }

    private void hide(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('hide');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }

    private void show(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('show');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }

    private void destroy(final String channel, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('destroy');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }

    private void getText(final String channel, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('getText');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }
    
    private void setText(final String channel, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    callbackContext.success('setText');
                } catch (Exception e) {
                    callbackContext.error("Exception " + e.getMessage());
                }
            }
        });
    }
}
