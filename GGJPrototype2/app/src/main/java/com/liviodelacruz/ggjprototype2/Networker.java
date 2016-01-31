package com.liviodelacruz.ggjprototype2;


import android.util.JsonReader;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class Networker implements Runnable {

    private static final String TAG = Networker.class.getSimpleName();
    private static final String ENDPOINT = "http://ggj2016game.cloudapp.net/player/connect";

    private boolean keepPolling = true;
    private URL url = null;

    public Networker(){
        Thread t = new Thread(this);
        t.start();
    }

    @Override
    public void run(){
        while(keepPolling){
            JsonReader r = connect();
            if(r == null)
                Log.d(TAG, "NULL");
            else
                Log.d(TAG, r.toString());

            try {
                Thread.sleep(2000);
            }catch (InterruptedException e){
                Log.d(TAG, e.getMessage());
            }
        }
    }

    public JsonReader connect(){
        HttpURLConnection urlConnection = null;
        JsonReader reader = null;
        try {
            url = new URL(ENDPOINT);
            urlConnection = (HttpURLConnection) url.openConnection();
            InputStream in = new BufferedInputStream(urlConnection.getInputStream());
            BufferedInputStream bufferedStream = new BufferedInputStream(in);
            InputStreamReader streamReader = new InputStreamReader(bufferedStream);

            return reader = new JsonReader(streamReader);
        }catch (MalformedURLException e){
            Log.e(TAG, e.getMessage());
        }catch (IOException e){
            Log.e(TAG, e.getMessage());
        }finally {
            if(urlConnection != null)
                urlConnection.disconnect();
            if(reader != null) {
                try {
                    reader.close();
                }catch (IOException e){
                    Log.d(TAG, e.getMessage());
                }
            }
        }
        return null;
    }
}
