![demo example](img/2step_demo_2x.gif)
## 1. Project Overview
- 트렌디한 운동화 판매를 위한 온라인 쇼핑몰 구현
- 직관적이고 사용하기 쉬운 인터페이스를 제공
- 최소 클릭으로 상품 구맹 기능을 제공하여 웹사이트 이용을 효율화
- 제품에 대한 간단한 설명과 이미지를 제공하여 사용자에게 제품 소개
## 2. Team Members
<table>
  <thead>
    <tr>
      <th style="width:20%; text-align:center;">구분 (Role)</th>
      <th style="width:20%; text-align:center;">이름</th>
      <th style="width:60%; text-align:left;">역할/담당 기능</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3" align="center"><b>🖥️ Frontend (Client)</b></td>
      <td align="center"><b>예림</b><br>(Team Leader)</td>
      <td>로그인 <br> 회원가입 <br> 마이페이지</td>
    </tr>
    <tr>
      <td align="center"><b>진택</b><br>(FE Leader)</td>
      <td>메인 페이지 <br> 상품목록/상세 <br> 장바구니</td>
    </tr>
    <tr>
      <td align="center"><b>경진</b></td>
      <td>장바구니 <br> 주문/결제 <br> 헤더/푸터</td>
    </tr>
    <tr>
      <td rowspan="3" align="center"><b>⚙️ Backend (Server)</b></td>
      <td align="center"><b>연서</b><br>(BE Leader)</td>
      <td>상품관리 API</td>
    </tr>
    <tr>
      <td align="center"><b>도아</b></td>
      <td>사용자 API</td>
    </tr>
    <tr>
      <td align="center"><b>은빈</b></td>
      <td>주문 API</td>
    </tr>
  </tbody>
</table>

## 3. Tech Stack

### 🖥️ Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)
![Bulma](https://img.shields.io/badge/Bulma-00D1B2?logo=bulma&logoColor=white)

### ⚙️ Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)

### 💻 Language
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 4. 주요 기능

### 👤 회원
- 회원가입 (비밀번호 확인)
- 로그인 / 로그아웃 (JWT 인증 기반)
- 마이페이지
  - 회원정보 조회 / 수정
  - 회원 탈퇴

### 🛒 상품
- 카테고리별 상품 목록 조회
- 상품 상세 정보 조회 (이름, 가격, 제조사 등)
- 이미지와 설명 제공

### 🛍 장바구니
- 상품 담기 / 삭제
- 수량 수정
- 전체 비우기 기능
- 페이지 새로고침 후에도 데이터 유지

### 📦 주문 / 결제
- 배송지 입력 (우편번호 API 자동완성)
- 총액 계산 및 주문 완료 페이지 제공
- 주문 내역 조회
- 주문 정보 수정 / 삭제

### ⚙️ 기타
- Swagger를 통한 API 문서화
- CORS 설정 적용
- 비밀번호 해싱 및 JWT 인증
