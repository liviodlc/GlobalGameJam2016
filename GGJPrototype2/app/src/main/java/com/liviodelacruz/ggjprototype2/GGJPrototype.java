package com.liviodelacruz.ggjprototype2;

import android.app.Activity;
import android.content.Intent;
import android.graphics.drawable.AnimationDrawable;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GGJPrototype extends Activity implements NetworkerCallback {

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
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

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

        Networker.getMe().addCallBack(this);
    }

    @Override
    public boolean onPoll(JSONObject json){
        try {
            if (!json.has("error") && json.getJSONObject("session").getString("status").equals("STARTED")) {
                JSONArray jarr = json.getJSONObject("session").getJSONArray("players");
                if(jarr.getJSONObject(0).getString("id").equals(""+Networker.id)) {
                    Networker.name = jarr.getJSONObject(0).getString("name");
                }else if(jarr.getJSONObject(1).getString("id").equals(""+Networker.id)) {
                    Networker.name = jarr.getJSONObject(0).getString("name");
                }
                Intent i = new Intent(this, Game.class);
                startActivity(i);

                return true;
            }
        }catch (JSONException e){
            Log.e(TAG, e.toString());
        }
        return false;
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

//    @Override
//    public boolean onTouchEvent(MotionEvent event){
//
//        int action = MotionEventCompat.getActionMasked(event);
//
//        switch(action) {
//            case (MotionEvent.ACTION_DOWN) :
//                Intent i = new Intent(this, Game.class);
//                startActivity(i);
//                return true;
//            default :
//                return super.onTouchEvent(event);
//        }
//    }
}
