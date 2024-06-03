package com.se2024.motoo.controller;

import com.se2024.motoo.dto.BoardDTO;
import com.se2024.motoo.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.view.RedirectView;
@RestController
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("api/board") //게시물 업로드
    public RedirectView createBoard(@ModelAttribute("board") BoardDTO boardDTO, HttpSession session) {
        //String userId = (String)session.getAttribute("loginID");
        String userId = boardDTO.getTitle(); //임시로,,
        //if(userId != null){ //로그인 안되어있을 경우엔 로그인화면으로
            boardDTO.setUser_id(userId);
            boardService.createBoard(boardDTO);
            return new RedirectView("/post.html");
        //}else{
           // return new RedirectView("/login.html");
        //}
    }

    @PostMapping("api/board/{board_id}") //게시물 수정
    public RedirectView updateBoard(@ModelAttribute("board") BoardDTO boardDTO, @PathVariable("board_id")Long board_id) {
        BoardDTO updatedBoard = boardService.updateBoard(board_id, boardDTO);
        return new RedirectView("/post.html");
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
        BoardDTO boardDTO = boardService.getBoardById(id);
        return ResponseEntity.ok(boardDTO);
    }

    @GetMapping("/{id}/tmp")
    public ResponseEntity<List<BoardDTO>> getAllBoards() {
        List<BoardDTO> boards = boardService.getAllBoards();
        return ResponseEntity.ok(boards);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }
}
