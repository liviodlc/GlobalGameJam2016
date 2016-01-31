package com.liviodelacruz.ggjprototype2.gestures;

public class ShakeGesture implements Gesture {

    private static final double REQUIRED_ACCEL = 40;
    private static final int NUM_SHAKES = 12;

    private double maxAccelSoFar = 0;
    private int shakesSoFar = 0;

    @Override
    public boolean detectGesture(GestureData data){
        double accel = Math.abs(data.getAccelVector());

        if (accel > this.maxAccelSoFar) {
            this.maxAccelSoFar = accel;
        }

        if (this.maxAccelSoFar > REQUIRED_ACCEL) {
            shakesSoFar++;
        }

        if(shakesSoFar >= NUM_SHAKES)
            return true;
        return false;
    }
}
