package com.liviodelacruz.ggjprototype;

import android.graphics.Canvas;

/**
 * Created by Smith on 1/30/2016.
 */
public class GameEngine {

    private static final int FRAME_RATE = 30;
    private static final long UPDATE_PERIOD = 1000000000L / FRAME_RATE; // nanoseconds

    private PlayerState state = PlayerState.NORMAL;
    private boolean keepRunning = true;

    public long startTime;

    public GameEngine(){
        gameloop();
    }

    private void gameloop(){
        long beginTime, timeTaken, timeLeft;
        while(keepRunning){
            if(startTime==0)
                startTime = System.nanoTime();
            beginTime = System.nanoTime();


            update();
            draw();

            // Provides necessary delay to meet the target frame rate
            timeTaken = System.nanoTime() - beginTime;
            timeLeft = (UPDATE_PERIOD - timeTaken) / 1000000; // in milliseconds
            if (timeLeft < 10)
                timeLeft = 10; // set a minimum
            try {
                Thread.sleep(timeLeft);
            } catch (InterruptedException ex) {
            }
        }
    }

    private void update(){

    }

    private void draw(){
        Canvas c = new Canvas();
    }
}
