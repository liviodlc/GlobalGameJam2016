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

public class WizardView extends SurfaceView implements Runnable, SensorEventListener {

    private static final int FRAME_RATE = 30;
    private static final int FRAME_PERIOD = 1000/FRAME_RATE;
    private static final String TAG = WizardView.class.getSimpleName();

    private volatile boolean playing = false;
    private Thread gameThread = null;

    //accelerometer
    private SensorManager senSensorManager;
    private Sensor senAccelerometer;
    private int c = Color.BLACK;

    // For drawing
    private Paint paint;
    private Canvas canvas;
    private SurfaceHolder ourHolder;

    public WizardView(Context context){
        super(context);
        Log.d(TAG, "WizardView initializing!");

        //accelerometer
        senSensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        senSensorManager.registerListener(this, senAccelerometer , SensorManager.SENSOR_DELAY_NORMAL);

        MediaPlayer mediaPlayer = MediaPlayer.create(context, R.raw.ganon);
        mediaPlayer.start();

        // Initialize our drawing objects
        ourHolder = getHolder();
        paint = new Paint();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Sensor mySensor = event.sensor;

        if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];
            c = Color.rgb((int) ((x+15) * 10), (int) ((y+15) * 10), (int) ((z+15) * 10));
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    public void run(){
        while(playing){
            update();
            draw();
            control();
        }
    }

    private void update(){

    }

    private void draw(){
        if (ourHolder.getSurface().isValid()) {

            //First we lock the area of memory we will be drawing to
            canvas = ourHolder.lockCanvas();

            // Rub out the last frame
//            canvas.drawColor(Color.rgb((int) (Math.random() * 255), (int) (Math.random() * 255), (int) (Math.random() * 255)));
            canvas.drawColor(c);

//            canvas.drawCircle(5, 5, 50, paint);

            // Unlock and draw the scene
            ourHolder.unlockCanvasAndPost(canvas);
        }
    }
    private void control(){
//        Log.d(TAG, ""+System.currentTimeMillis());

        try {
            gameThread.sleep(FRAME_PERIOD);
        } catch (InterruptedException e) {
            Log.e(TAG, e.getMessage());
        }
    }

    public void pause() {
        Log.d(TAG, "I'm pausing!");
        if(playing) {
            playing = false;
            try {
                gameThread.join();
            } catch (InterruptedException e) {
                Log.e(TAG, e.getMessage());
            }
        }
    }

    // Make a new thread and start it
    // Execution moves to our R
    public void resume() {
        Log.d(TAG, "I'm resuming!");
        if(!playing) {
            playing = true;
            gameThread = new Thread(this);
            gameThread.start();
        }
    }
}
