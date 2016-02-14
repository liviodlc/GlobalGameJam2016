package com.liviodelacruz.ggjprototype2;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.AnimationDrawable;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.text.InputFilter;
import android.text.InputType;
import android.text.Spanned;
import android.text.method.SingleLineTransformationMethod;
import android.text.method.TransformationMethod;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GGJPrototype extends Activity implements NetworkerCallback {

    private static final String TAG = GGJPrototype.class.getSimpleName();

    private RelativeLayout layout;
    private HomeView menuView;
    private TextView tview;
    private EditText et;

    public GGJPrototype(){
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        layout = new RelativeLayout(this);
        layout.setGravity(Gravity.CENTER);
        RelativeLayout.LayoutParams lparams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        menuView = new HomeView(this);
        layout.addView(menuView);

        ImageView img = new ImageView(this);
        img.setImageResource(R.drawable.logo);
        layout.addView(img);

        /*AnimationDrawable canim = new AnimationDrawable();
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
        canim.start();*/

        et = new EditText(this);
        et.setInputType(InputType.TYPE_CLASS_NUMBER);
        et.setHint("Room Code");
        RelativeLayout.LayoutParams tparams = new RelativeLayout.LayoutParams(500,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        tparams.topMargin = (int) (300 * getResources().getDisplayMetrics().density);
        tparams.addRule(RelativeLayout.CENTER_HORIZONTAL);
        et.setGravity(Gravity.CENTER);
        et.setTransformationMethod(SingleLineTransformationMethod.getInstance());
        et.setHorizontallyScrolling(true);
        InputFilter[] ifa = new InputFilter[1];
        ifa[0] = new InputFilter.LengthFilter(6);
        et.setFilters(ifa);
        et.setOnEditorActionListener(new EditText.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    String roomCode = et.getText().toString();
                    Log.i(TAG, roomCode);
                    JSONObject json = Networker.getMe().firstConnect(roomCode);
                    if(true || json == null || json.has("error")) {
                        et.setText("");
                        et.setHint("Error");
                    }
                    return true;
                }
                return false;
            }
        });
        layout.addView(et, tparams);

        tview = new TextView(this);
        tview.setTextColor(Color.parseColor("#CC0000"));
        tview.setTextSize(20f);
        tview.setShadowLayer(2f, 4f, 4f, Color.BLACK);
        //layout.addView(tview, tparams);

        setContentView(layout, lparams);
    }

    @Override
    public void onServerResponse(JSONObject json){
        try {
            if(json.has("error"))
                return;
            if (Networker.name == null && json.has("session")) {
                getPlayerName(json);
            }
            if(json.getJSONObject("session").getString("status").equals("STARTED")){
                WizardView.sequence = json.getJSONObject("session").getJSONArray("sequence");
                Intent i = new Intent(this, Game.class);
                startActivity(i);
            }
        }catch (JSONException e){
            Log.e(TAG, e.toString());
        }
    }

    private void getPlayerName(final JSONObject json){
        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONArray jarr = json.getJSONObject("session").getJSONArray("players");
                    RelativeLayout.LayoutParams tparams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT,
                            RelativeLayout.LayoutParams.WRAP_CONTENT);
                    tparams.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE);
                    if(jarr.getJSONObject(0).getString("id").equals(""+Networker.id)) {
                        Networker.name = jarr.getJSONObject(0).getString("name");
                        tview.setText("Welcome, "+Networker.name);
                        layout.addView(tview, tparams);
                    }else if(jarr.getJSONObject(1).getString("id").equals(""+Networker.id)) {
                        Networker.name = jarr.getJSONObject(1).getString("name");
                        tview.setText("Welcome, "+Networker.name);
                        layout.addView(tview, tparams);
                    }
                }catch (JSONException e){
                    Log.e(TAG, e.toString());
                }
            }
        });
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
