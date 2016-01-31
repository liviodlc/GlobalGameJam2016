package com.liviodelacruz.ggjprototype2;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.MediaPlayer;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import java.io.IOException;

public class HomeView extends SurfaceView implements SurfaceHolder.Callback {

    private static final String TAG = HomeView.class.getSimpleName();

    MediaPlayer firebg;
    boolean isPaused = false;
    Context context;

    private SurfaceHolder ourHolder;

    public HomeView(Context context){
        super(context);
        this.context = context;

//        MediaPlayer mediaPlayer = MediaPlayer.create(context, R.raw.ganon);
//        mediaPlayer.start();

        firebg = MediaPlayer.create(context, R.raw.fire);
        firebg.setLooping(true);

        // Initialize our drawing objects
        ourHolder = getHolder();
        ourHolder.addCallback(this);
    }

    @Override
    public void surfaceChanged(SurfaceHolder arg0, int arg1, int arg2, int arg3) {

    }

    @Override
    public void surfaceCreated(SurfaceHolder arg0) {
        firebg.setDisplay(ourHolder);
        firebg.start();
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder arg0) {
    }

    public void pause() {
        firebg.pause();
        isPaused = true;
    }

    // Make a new thread and start it
    // Execution moves to our R
    public void resume() {
        if(isPaused)
            firebg.start();
    }
}
