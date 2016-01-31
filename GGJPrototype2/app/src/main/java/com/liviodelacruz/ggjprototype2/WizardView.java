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

import com.liviodelacruz.ggjprototype2.gestures.FinisherGesture;
import com.liviodelacruz.ggjprototype2.gestures.Gesture;
import com.liviodelacruz.ggjprototype2.gestures.GestureData;
import com.liviodelacruz.ggjprototype2.gestures.ShakeGesture;

import org.json.JSONArray;
import org.json.JSONException;

public class WizardView extends SurfaceView implements Runnable, SensorEventListener {

    private static final String TAG = WizardView.class.getSimpleName();

    private static final int FRAME_RATE = 30;
    private static final int FRAME_PERIOD = 1000/FRAME_RATE;

    public static JSONArray sequence = null;
    private static final int GESTURE_TIME = 2;//seconds
    private static final int GESTURE_BUFFER = 2;//seconds

    private int i = 0;
    private int n = 0;

    private volatile boolean playing = false;
    private Thread gameThread = null;

    private Gesture currentGesture;
    private GestureData gData;

    //accelerometer
    private SensorManager senSensorManager;
    private Sensor senAccelerometer;
    private int c = Color.BLACK;

    //audio
    MediaPlayer shakeSound = null;
    MediaPlayer finisherSound = null;
    MediaPlayer currentSound = null;

    // For drawing
    private Paint paint;
    private Canvas canvas;
    private SurfaceHolder ourHolder;

    public WizardView(Context context){
        super(context);
        Log.d(TAG, "WizardView initializing!");

        //accelerometer
        senSensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        senSensorManager.registerListener(this, senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_NORMAL);
        senSensorManager.registerListener(this, senSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION), SensorManager.SENSOR_DELAY_NORMAL);

        gData = new GestureData();

        shakeSound = MediaPlayer.create(context, R.raw.ganon);
        finisherSound = MediaPlayer.create(context, R.raw.finisher);

        // Initialize our drawing objects
        ourHolder = getHolder();
        paint = new Paint();

        
    }

    private void endGame(){
        c = Color.BLACK;
        Networker.getMe().finish();
        pause();
    }

    private void nextGesture(){
        if(i>=n) {
            endGame();
            return;
        }
        try {
            String g = sequence.getString(i);
            if(g.equals("SHAKE")){
                currentGesture = new ShakeGesture();
                currentSound = shakeSound;
            }
            if(g.equals("FINISH")){
                currentGesture = new FinisherGesture();
                currentSound = finisherSound;
            }
            gData = new GestureData();
            i++;
        }catch (JSONException e){
            Log.e (TAG, e.toString());
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Sensor mySensor = event.sensor;

        if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            //update colors
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];
            c = Color.rgb((int) ((x+15) * 10), (int) ((y+15) * 10), (int) ((z+15) * 10));
        }else if(mySensor.getType() == Sensor.TYPE_LINEAR_ACCELERATION){
            gData.setLinearAcceleration(event.values);
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
        if(currentGesture == null)
            return;
        if(currentGesture.detectGesture(gData)) {
            currentSound.start();
            nextGesture();
        }
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
            n = sequence.length();
            nextGesture();
            playing = true;
            gameThread = new Thread(this);
            gameThread.start();
        }
    }
}
