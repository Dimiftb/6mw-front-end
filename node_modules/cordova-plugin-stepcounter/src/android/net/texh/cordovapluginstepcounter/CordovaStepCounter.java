package net.texh.cordovapluginstepcounter;

/*
    Copyright 2015 Jarrod Linahan <jarrod@texh.net>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import java.lang.Integer;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CordovaStepCounter extends CordovaPlugin {

    private final String TAG = "CordovaStepCounter";

    //private final String ACTION_CONFIGURE        = "configure";
    private final String ACTION_START            = "start";
    private final String ACTION_STOP             = "stop";
    private final String ACTION_GET_STEPS        = "get_step_count";
    private final String ACTION_GET_TODAY_STEPS  = "get_today_step_count";
    private final String ACTION_CAN_COUNT_STEPS  = "can_count_steps";
    private final String ACTION_GET_HISTORY      = "get_history";

    public static final String USER_DATA_PREF              = "UserData";
    public static final String PEDOMETER_HISTORY_PREF      = "pedometerData";
    public static final String PEDOMETER_ACTIVE_PREF       = "pedometerActive";
    public static final String PEDOMETER_TOTAL_COUNT_PREF        = "pedometerTotalCount";


    private Intent  stepCounterIntent;
    private Boolean isEnabled    = false;

    private StepCounterService stepCounterService;
    private boolean bound = false;

    private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className,
                                       IBinder service) {
            StepCounterService.StepCounterServiceBinder binder = (StepCounterService.StepCounterServiceBinder) service;
            stepCounterService = binder.getService();
            bound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            bound = false;
        }
    };

    @Override
    public void onStart() {
        Activity activity = this.cordova.getActivity();
        SharedPreferences sharedPref = activity.getSharedPreferences(USER_DATA_PREF, Context.MODE_PRIVATE);
        Boolean pActive = this.getPedometerIsActive(sharedPref);
        if(pActive){
            if(stepCounterIntent == null){
                stepCounterIntent = new Intent(activity, StepCounterService.class);
                activity.startService(stepCounterIntent);
            }

            if(!bound){
                activity.bindService(stepCounterIntent, mConnection, Context.BIND_AUTO_CREATE);
            }

        }

        super.onStart();
    }

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
        LOG.i(TAG, "execute()");
        Boolean result = true;

        Activity activity = this.cordova.getActivity();
        stepCounterIntent = new Intent(activity, StepCounterService.class);

        //Get stored value for pedometerActive
        SharedPreferences sharedPref = activity.getSharedPreferences(USER_DATA_PREF, Context.MODE_PRIVATE);
        Boolean pActive = this.getPedometerIsActive(sharedPref);


        if (ACTION_CAN_COUNT_STEPS.equals(action)) {
            Boolean can = deviceHasStepCounter(activity.getPackageManager());
            Log.i(TAG, "Checking if device has step counter APIS: "+ can);
            callbackContext.success( can ? 1 : 0 );
        }
        else if (ACTION_START.equals(action)) {

            if(!pActive){
                Log.i(TAG, "Starting StepCounterService");
                //Update pedometerActive preference
                this.setPedometerIsActive(sharedPref, true);
                activity.startService(stepCounterIntent);
            }else{
                Log.i(TAG, "StepCounterService Already Started before, just binding to it");
            }

            if(!bound){
                Log.i(TAG, "Binding StepCounterService");
                activity.bindService(stepCounterIntent, mConnection, Context.BIND_AUTO_CREATE);
            }else{
                Log.i(TAG, "StepCounterService already binded");
            }

            //Try getting given param (starting value)
            Integer startingValue = 0;
            try{
                if(data.length() > 0){
                    startingValue = data.getInt(0);
                }
            }catch(JSONException error){
                Log.i(TAG, "JSON EXCEPTION While Reading startingValue from 'execute' parameters (JSONArray)");
            }

            //Reset TOTAL COUNT on start
            CordovaStepCounter.setTotalCount(sharedPref, startingValue);
            callbackContext.success(startingValue);
        }
        else if (ACTION_STOP.equals(action)) {
            if(pActive) {
                Log.i(TAG, "Stopping StepCounterService");
                this.setPedometerIsActive(sharedPref, false);
                activity.stopService(stepCounterIntent);
            }else {
                Log.i(TAG, "StepCounterService already stopped");
            }

            if (bound) {
                Log.i(TAG, "Unbinding StepCounterService");
                activity.unbindService(mConnection);
            } else{
                Log.i(TAG, "StepCounterService already unbinded");
            }

            activity.stopService(stepCounterIntent);
            Integer currentCount = CordovaStepCounter.getTotalCount(sharedPref);
            //Callback with final count
            callbackContext.success(currentCount);
        }
        else if (ACTION_GET_STEPS.equals(action)) {
            if(!pActive){
                Log.i(TAG, "Be Careful you're getting a Step count with inactive Pedometer");
            }

            Integer steps = CordovaStepCounter.getTotalCount(sharedPref);
            Log.i(TAG, "Geting steps counted from stepCounterService: " + steps);
            callbackContext.success(steps);
        }
        else if (ACTION_GET_TODAY_STEPS.equals(action)) {
            if(sharedPref.contains(PEDOMETER_HISTORY_PREF)){
                String pDataString = sharedPref.getString(PEDOMETER_HISTORY_PREF, "{}");

                Date currentDate = new Date();
                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
                String currentDateString = dateFormatter.format(currentDate);

                JSONObject pData = new JSONObject();
                JSONObject dayData = new JSONObject();
                Integer daySteps = -1;
                try{
                    pData = new JSONObject(pDataString);
                    Log.d(TAG," got json shared prefs "+pData.toString());
                }catch (JSONException err){
                    Log.d(TAG," Exception while parsing json string : "+pDataString);
                }

                if(pData.has(currentDateString)){
                    try {
                        dayData = pData.getJSONObject(currentDateString);
                        daySteps = dayData.getInt("steps");
                    }catch(JSONException err){
                        Log.e(TAG,"Exception while getting Object from JSON for "+currentDateString);
                    }
                }

                Log.i(TAG, "Getting steps for today: " + daySteps);
                callbackContext.success(daySteps);
            }else{
                Log.i(TAG, "No steps history found in stepCounterService !");
                callbackContext.success(-1);
            }
        }
        else if(ACTION_GET_HISTORY.equals(action)){
            if(sharedPref.contains(PEDOMETER_HISTORY_PREF)){
                String pDataString = sharedPref.getString(PEDOMETER_HISTORY_PREF,"{}");
                Log.i(TAG, "Getting steps history from stepCounterService: " + pDataString);
                callbackContext.success(pDataString);
            }else{
                Log.i(TAG, "No steps history found in stepCounterService !");
                callbackContext.success("{}");
            }
        }
        else {
            Log.e(TAG, "Invalid action called on class " + TAG + ", " + action);
            callbackContext.error("Invalid action called on class " + TAG + ", " + action);
        }

        return result;
    }

    public static boolean deviceHasStepCounter(PackageManager pm) {
        // Require at least Android KitKat
        int currentApiVersion = Build.VERSION.SDK_INT;

        // Check that the device supports the step counter and detector sensors
        return currentApiVersion >= 19
                && pm.hasSystemFeature(PackageManager.FEATURE_SENSOR_STEP_COUNTER)
                && pm.hasSystemFeature(PackageManager.FEATURE_SENSOR_STEP_DETECTOR);
    }

    @Override
    public void onDestroy() {
        if(bound){
            Activity activity = this.cordova.getActivity();
            activity.unbindService(mConnection);
        }
        super.onDestroy();
    }

    //Getter / Setter for pedometerActive preferences
    public static boolean getPedometerIsActive(SharedPreferences sharedPref){
        Boolean pActive = false;
        if(sharedPref.contains(CordovaStepCounter.PEDOMETER_ACTIVE_PREF)) {
            pActive = sharedPref.getBoolean(CordovaStepCounter.PEDOMETER_ACTIVE_PREF, false);
        }
        return pActive;
    }
    protected static void setPedometerIsActive(SharedPreferences sharedPref, Boolean newValue){
        SharedPreferences.Editor sharedPrefEditor = sharedPref.edit();
        sharedPrefEditor.putBoolean(CordovaStepCounter.PEDOMETER_ACTIVE_PREF, newValue);
        sharedPrefEditor.commit();
    }

    //Getter / Setter for TotalCount preferences
    public static int getTotalCount(SharedPreferences sharedPref){
        Integer totalCount = 0;
        if(sharedPref.contains(CordovaStepCounter.PEDOMETER_TOTAL_COUNT_PREF)) {
            totalCount = sharedPref.getInt(CordovaStepCounter.PEDOMETER_TOTAL_COUNT_PREF, 0);
        }
        return totalCount;
    }
    protected static void setTotalCount(SharedPreferences sharedPref, Integer newValue){
        SharedPreferences.Editor sharedPrefEditor = sharedPref.edit();
        sharedPrefEditor.putInt(CordovaStepCounter.PEDOMETER_TOTAL_COUNT_PREF, newValue);
        sharedPrefEditor.commit();
    }
}