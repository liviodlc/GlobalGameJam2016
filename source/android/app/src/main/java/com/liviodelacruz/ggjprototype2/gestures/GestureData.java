package com.liviodelacruz.ggjprototype2.gestures;

import android.util.Log;

public class GestureData {

    private float[] linAccel = new float[3];

    public void setLinearAcceleration(float[] data){
        linAccel[0] = data[0];
        linAccel[1] = data[1];
        linAccel[2] = data[2];
        Log.i("GestureData", linAccel.toString());
    }

    public double getAccelVector(){
        return linAccel[0] * linAccel[0]
                + linAccel[1] * linAccel[1]
                + linAccel[2] * linAccel[2];
    }
}
