package com.liviodelacruz.ggjprototype2.gestures;

public class FinisherGesture implements Gesture {

    private static final double REQUIRED_ACCEL1 = 25;
    private static final double REQUIRED_ACCEL2 = 40;
    private static final int NUM_FRAMES = 60;
    private static final int NUM_SHAKES = 3;

    private double maxAccelSoFar = 0;
    private int maxFramesSoFar = 0;
    private int framesAttained = 0;
    private int shakesSoFar = 0;

    private boolean hasSustainedSpeed = false;

    @Override
    public boolean detectGesture(GestureData data){
        double accel = Math.abs(data.getAccelVector());

        if(hasSustainedSpeed){
            if (accel > this.maxAccelSoFar) {
                this.maxAccelSoFar = accel;
            }

            if (this.maxAccelSoFar > REQUIRED_ACCEL2) {
                shakesSoFar++;
            }

            if(shakesSoFar >= NUM_SHAKES)
                return true;
        }else {

            if (accel > this.maxAccelSoFar) {
                this.maxAccelSoFar = accel;
            }

            if (accel > REQUIRED_ACCEL1) {
                framesAttained++;
            } else {
                if (framesAttained > maxFramesSoFar) {
                    maxFramesSoFar = framesAttained;
                }
                this.framesAttained = 0;
            }

            if (framesAttained >= NUM_FRAMES) {
                hasSustainedSpeed = true;
                maxAccelSoFar = 0;
                return true;
            }
        }

        return false;
    }
}
