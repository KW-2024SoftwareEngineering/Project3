package com.se2024.motoo.dto;

import com.se2024.motoo.domain.Board;
import com.se2024.motoo.domain.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
//@NoArgsConstructor
public class BoardDTO {
    private Long id;
    private Member userID;
    private LocalDateTime create_at;
    private LocalDateTime modified_at;
    private String title;
    private String content;
    private Integer isBoard; //0:board, 1:notice, 2:QnA
    private String board_type;
    private Integer viewCount;
    private Integer likeCount;
    private String us;

    public BoardDTO(){
        super();
    }
    public BoardDTO(Long id, Member userID, LocalDateTime create_at, LocalDateTime modified_at, String title, String content, Integer isBoard, String board_type, Integer viewCount, Integer likeCount, String us) {
        this.id = id;
        this.userID = userID;
        this.create_at = create_at;
        this.modified_at = modified_at;
        this.title = title;
        this.content = content;
        this.isBoard = isBoard;
        this.board_type = board_type;
        this.viewCount= viewCount;
        this.likeCount= likeCount;
        this.us = us;
    }

    // 예를 들어, 엔티티에서 DTO로 변환하는 메서드
    public static BoardDTO fromEntity(Board board) {
        return new BoardDTO(
                board.getId(),
                board.getUserID(),
                board.getCreate_at(),
                board.getModified_at(),
                board.getTitle(),
                board.getContent(),
                board.getIsBoard(),
                board.getBoard_type(),
                board.getViewCount(),
                board.getLikeCount(),
                board.getUs()
        );
    }
}