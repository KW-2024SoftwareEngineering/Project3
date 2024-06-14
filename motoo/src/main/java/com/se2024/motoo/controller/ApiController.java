package com.se2024.motoo.controller;

import com.se2024.motoo.domain.Board;
import com.se2024.motoo.domain.Member;
import com.se2024.motoo.dto.BoardDTO;
import com.se2024.motoo.dto.SignupResponseDTO;
import com.se2024.motoo.repository.MemberRepository;
import com.se2024.motoo.service.BoardService;
import com.se2024.motoo.dto.SignupDTO;
import com.se2024.motoo.service.MemberService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.servlet.view.RedirectView;
@Controller
@RequiredArgsConstructor
public class ApiController {
    private final BoardService boardService;
    private final MemberRepository memberRepository;

    @GetMapping("/api/boards")
    public ResponseEntity<List<BoardDTO>> getAllBoards(){
        try {
            List<BoardDTO> boardList = boardService.getAllBoards();
            return ResponseEntity.ok(boardList);
        } catch (Exception e) {
            // 로그에 에러 메시지 출력
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/api/notice")
    public ResponseEntity<List<BoardDTO>> getAllNotices(){
        List<BoardDTO> boardlist = boardService.getAllNotices();
        return ResponseEntity.ok(boardlist);
    }
    @GetMapping("/api/qna")
    public ResponseEntity<List<BoardDTO>> getAllQnAs(){
        List<BoardDTO> boardlist = boardService.getAllQnAs();
        return ResponseEntity.ok(boardlist);
    }

    @GetMapping("/api/boards/{board_id}")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable("board_id") Long board_id) {
        try {
            BoardDTO board = boardService.getBoardById(board_id);
            boardService.updateViewcount(board_id);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/api/qna/{board_id}")
    public ResponseEntity<BoardDTO> getQnAById(@PathVariable("board_id") Long board_id) {
        try {
            BoardDTO board = boardService.getBoardById(board_id);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/boards/{board_id}/like")
    public ResponseEntity<BoardDTO> getAfterLike(@PathVariable("board_id") Long board_id) {
        try {
            BoardDTO board = boardService.getBoardById(board_id);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    private final MemberService memberService;

    @GetMapping("/signup")
    public String saveForm(){
        return "signup";
    }

    @PostMapping("/signup")
    @ResponseBody
    public String join(@ModelAttribute SignupDTO signupDTO, Model model){
        try {
            SignupResponseDTO response = memberService.duplicationCheck(signupDTO);
            if (!response.isAvailable()) {
                model.addAttribute("errorMessage", "중복된 아이디입니다.");
                return "중복된 아이디입니다.";
            }
            // 중복된 아이디가 없을 경우 회원가입 진행
            System.out.println("UserController.signup");
            System.out.println("signupDTO = " + signupDTO);
            memberService.save(signupDTO);
            return "회원가입이 정상적으로 처리되었습니다.";
        }catch (Error error){
            return "회원가입이 비정상적으로 처리되었습니다.";
        }
    }

    @GetMapping("/login")
    public String loginForm(){
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute SignupDTO signupDTO, HttpSession session, Model model){
        SignupDTO loginResult =memberService.login(signupDTO);

        if(loginResult != null){
            session.setAttribute("loginID", loginResult.getUserID());
            return "redirect:/user/stock";
        }else{
            model.addAttribute("loginError", "회원 정보가 없습니다");
            System.out.println("로그인 실패!!!!!!!!!!");
            return "login";
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        System.out.println("사용자 로그아웃!!!!!!!!!!!");
        return "redirect:/login?logout=true";
    }
    
    //아이디 중복확인
    @PostMapping("/checkDuplicate")
    @ResponseBody
    public SignupResponseDTO checkDuplicate(@RequestBody SignupDTO signupDTO) {
        return memberService.duplicationCheck(signupDTO);
    }

    @GetMapping("/user/stock")
    public String stockPage(){
        return "stock";
    }

    @GetMapping("/news")
    public String newsPage() {
        return "news";
    }

    @GetMapping("/ranking")
    public String rankingPage() {
        return "ranking";
    }

    @GetMapping("/api/profile")
    @ResponseBody
    public String getUserProfile(Model model, HttpSession session) {
        String loginID = (String) session.getAttribute("loginID");
        Optional<Member> mem = memberRepository.findByUserID(loginID);
        if (loginID != null) {
            model.addAttribute("user", mem);
            return "Profile";
        }
        return "Login";
    }

}
