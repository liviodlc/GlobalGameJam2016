package com.liviodelacruz.ggjprototype;

import android.graphics.Canvas;

/**
 * Created by Smith on 1/30/2016.
 */
public class GameEngine extends Thread {

    private PlayerState state = PlayerState.NORMAL;
    private boolean keepRunning = true;

    @Override
    public void run(){
        while(keepRunning){
            update();
            draw();
        }
    }

    private void update(){

    }

    private void draw(){
        Canvas c = new Canvas();
    }
}
