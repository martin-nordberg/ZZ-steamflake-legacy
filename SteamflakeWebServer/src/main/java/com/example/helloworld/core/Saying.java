package com.example.helloworld.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;

public class Saying {
    public Saying() {
        // Jackson deserialization
    }

    public Saying(long id, String content) {
        this.id = id;
        this.content = content;
    }

    @JsonProperty
    public String getContent() {
        return content;
    }

    @JsonProperty
    public long getId() {
        return id;
    }
    @Length(max = 3)
    private String content;
    private long id;
}