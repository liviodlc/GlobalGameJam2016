package com.liviodelacruz.ggjprototype2;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;

public class Networker implements Runnable {

    private static final String TAG = Networker.class.getSimpleName();
    private static final String URL1 = "http://ggj2016game.cloudapp.net/player/connect?id=";
    private static final String URL2 = "&roomCode=";

    private static final String ENDPOINT_FINISH = "http://ggj2016game.cloudapp.net/player/sequence/finish?id=";

    public static int id = (int) (Math.random() * 1000000);
    public static String roomCode = "";
    public static String name = null;

    public static void firstConnect(String _roomCode, NetworkerCallback callback){
        roomCode = _roomCode;
        Networker net = new Networker(NetworkCommand.FIRST_CONNECT, callback);
        Thread t = new Thread(net);
        t.start();
    }

    public static void pollGame(NetworkerCallback callback){
        Networker net = new Networker(NetworkCommand.POLL_GAME, callback);
        Thread t = new Thread(net);
        t.start();
    }

    private enum NetworkCommand {
        FIRST_CONNECT, POLL_GAME
    }

    private boolean keepPolling = true;
    private URL url = null;

    private NetworkerCallback callback;
    private NetworkCommand command;

    private Networker(NetworkCommand cmd, NetworkerCallback cb) {
        callback = cb;
        command = cmd;
    }

    @Override
    public void run() {
        if (command == NetworkCommand.FIRST_CONNECT)
            doFirstConnect();
        else if (command == NetworkCommand.POLL_GAME)
            doPollGame();
    }

    private void doFirstConnect(){
        JSONObject json = null;
        try {
            json = new JSONObject(connect(URL1 + id + URL2 + roomCode));
        } catch (JSONException e) {
            Log.e(TAG, e.getMessage());
        }
        callback.onServerResponse(json);
    }

    private void doPollGame(){
        while(keepPolling){
            JSONObject json = null;
            try{
                json = new JSONObject(connect(URL1 + id + URL2 + roomCode));
            }catch (JSONException e){
                Log.e(TAG, e.getMessage());
            }
            if(json != null){
                callback.onServerResponse(json);
            }

            try {
                Thread.sleep(2000);
            }catch (InterruptedException e){
                Log.e(TAG, e.getMessage());
            }
        }
    }

    public void finish(){
//        try {
        connect(ENDPOINT_FINISH + id);
//        }catch (JSONException e){
//            Log.e(TAG, e.toString());
//        }
    }

    private String connect(String url){
        String s = "";
        Log.d(TAG, url);
        try {
            s = new Scanner(new URL(url).openStream(), "UTF-8").useDelimiter("\\A").next();
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
