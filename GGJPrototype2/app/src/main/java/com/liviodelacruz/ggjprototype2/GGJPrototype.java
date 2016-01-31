package com.liviodelacruz.ggjprototype2;

import android.app.Activity;
import android.content.Intent;
import android.graphics.drawable.AnimationDrawable;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.res.ResourcesCompat;
import android.support.v4.view.MotionEventCompat;
import android.util.JsonReader;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import java.io.*;
import java.net.*;

public class GGJPrototype extends Activity {

    private static final String TAG = GGJPrototype.class.getSimpleName();

    private HomeView menuView;

    public GGJPrototype(){
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        RelativeLayout layout = new RelativeLayout(this);
        layout.setGravity(Gravity.CENTER);
        RelativeLayout.LayoutParams lparams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT);

        menuView = new HomeView(this);
        layout.addView(menuView);

        ImageView img = new ImageView(this);
        img.setImageResource(R.drawable.logo);
        layout.addView(img);

        AnimationDrawable canim = new AnimationDrawable();
        canim.addFrame(ContextCompat.getDrawable(this, R.drawable.connecting1), 500);
        canim.addFrame(ContextCompat.getDrawable(this, R.drawable.connecting2), 500);
        canim.addFrame(ContextCompat.getDrawable(this, R.drawable.connecting3), 500);
        canim.addFrame(ContextCompat.getDrawable(this, R.drawable.connecting4), 500);
        canim.setOneShot(false);
        ImageView cimg = new ImageView(this);
        cimg.setImageDrawable(canim);
        RelativeLayout.LayoutParams iparams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        iparams.topMargin = (int) (300 * getResources().getDisplayMetrics().density);
        layout.addView(cimg, iparams);
        canim.start();

        setContentView(layout, lparams);

        new Networker();
    }

    @Override
    protected void onPause() {
        super.onPause();
        menuView.pause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        menuView.resume();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event){

        int action = MotionEventCompat.getActionMasked(event);

        switch(action) {
            case (MotionEvent.ACTION_DOWN) :
                Intent i = new Intent(this, Game.class);
                startActivity(i);
                return true;
            default :
                return super.onTouchEvent(event);
        }
    }
}
