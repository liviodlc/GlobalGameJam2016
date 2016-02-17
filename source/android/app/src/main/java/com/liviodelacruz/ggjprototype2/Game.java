package com.liviodelacruz.ggjprototype2;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Game extends Activity implements NetworkerCallback{

    private static final String TAG = Game.class.getSimpleName();

    private WizardView gameView;
    private RelativeLayout layout;

    public Game(){

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        layout = new RelativeLayout(this);
        layout.setGravity(Gravity.CENTER);
        RelativeLayout.LayoutParams lparams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        gameView = new WizardView(this);
        layout.addView(gameView);

        TextView tview = new TextView(this);
        RelativeLayout.LayoutParams tparams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        tparams.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE);
        tview.setTextColor(Color.parseColor("#e33500"));
        tview.setSingleLine(false);
        tview.setText(Networker.name + ",\nFIGHT!");
//        tview.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
        tview.setGravity(Gravity.CENTER);
        tview.setTextSize(25f);
        layout.addView(tview, tparams);

        setContentView(layout, lparams);

//        Networker.getMe().addCallBack(this);
    }

    @Override
    public void onServerResponse(JSONObject json){
//        try {
//            if (!json.has("error") && json.getJSONObject("session").getString("status").equals("STARTED")) {
//
//            }
//        }catch (JSONException e){
//            Log.e(TAG, e.toString());
//        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        gameView.pause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        gameView.resume();
    }
}
