package com.example.demo.geoapp.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;

@Controller
public class GeoappRootController {

    @NotNull
    @Value("${geoapp.viewer.url}")
    private String geoappViewerUrl;

    @GetMapping("/")
    public void redirectToGui(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Location", geoappViewerUrl);
        response.setStatus(HttpServletResponse.SC_FOUND);
    }
}
