package com.liviodelacruz.ggjprototype2;

import org.json.JSONObject;

public interface NetworkerCallback {
    boolean onPoll(JSONObject json);
}
