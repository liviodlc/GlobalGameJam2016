package com.liviodelacruz.ggjprototype2;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;

public class Networker implements Runnable {


    private static Networker me = null;
    public static Networker getMe(){
        if(me == null)
            me = new Networker();
        return me;
    }

    private static final String TAG = Networker.class.getSimpleName();
    private static final String ENDPOINT = "http://ggj2016game.cloudapp.net/player/connect?id=";

    public static JSONArray sequence = null;
    public static int id;
    public static String name = null;

    private boolean keepPolling = true;
    private URL url = null;

    private NetworkerCallback cb1=null, cb2=null;

    private Networker(){
        Thread t = new Thread(this);
        t.start();

        id = (int) (Math.random() * 1000000);
    }


    public void addCallBack(NetworkerCallback cb){
        if(cb1 == null)
            cb1 = cb;
        else if(cb2 == null && cb1 != cb)
            cb2 = cb;
    }

    @Override
    public void run(){
        while(keepPolling){
            JSONObject json = null;
            try{
                json = new JSONObject(connect());
            }catch (JSONException e){
                Log.e(TAG, e.getMessage());
            }
            if(json != null){
                if(cb1 != null)
                    if(cb1.onPoll(json))
                        cb1 = null;
                if(cb2 != null)
                    if(cb2.onPoll(json))
                        cb2 = null;
            }

            try {
                Thread.sleep(2000);
            }catch (InterruptedException e){
                Log.e(TAG, e.getMessage());
            }
        }
    }

    private String connect(){
        String s = "";
        Log.d(TAG, ENDPOINT + id);
        try {
            s = new Scanner(new URL(ENDPOINT+id).openStream(), "UTF-8").useDelimiter("\\A").next();
        }catch (MalformedURLException e){
            Log.e(TAG, e.getMessage());
        }catch (IOException e){
            Log.e(TAG, e.getMessage());
        }
        Log.d(TAG, s);
        return s;
    }

    /*public JsonReader connect(){
        HttpURLConnection urlConnection = null;
        JsonReader reader = null;
        try {
            url = new URL(ENDPOINT+id);
            Log.i(TAG, ENDPOINT+id);
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
    }*/
}
