package com.liviodelacruz.ggjprototype2;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

public class GGJPrototype extends Activity {

    private WizardView gameView;

    public GGJPrototype(){

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        gameView = new WizardView(this);
        setContentView(gameView);
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
