package com.se2024.motoo.controller;

import com.se2024.motoo.dto.ResponseOutputDTO;
import com.se2024.motoo.service.KisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class KisController {
    private KisService kisService;

    @Autowired
    public KisController(KisService kisService) {
        this.kisService = kisService;
    }

    @GetMapping("/volume-rank")
    public Mono<List<ResponseOutputDTO>> getVolumeRank() {
        return kisService.getVolumeRank();
    }
}
