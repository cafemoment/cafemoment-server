<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192705716-401344d5-1649-4094-ae33-22a5323ebd37.png" width="250">
</p>

## Cafemoment
>프로젝트 ‘Camo(Cafe Moment)’ 는 여러분에게 카페에서의 특별한 순간을 전달하기 위해 만들어진 공간입니다.<br>
>우리 주변에는 너무나 많은 카페들이 있습니다. 같은 모습과 맛을 가진 프렌차이즈 카페들이 즐비한 우리 주변에서 커피를 마시는 건 어렵지 않습니다.<br>
>그렇기에 잘 보이지 않아서 알 수 없었던 작은 카페들을 알릴 수 있는 계기가 되기 위해 기획했습니다.

<br>

## 순서
>1. 프로젝트 소개<br>
>2. 팀원 소개<br>
>3. 사용한 기술 스택<br>
>4. 플로우차트<br>
>5. pipeline<br>
>6. ERD<br>
>7. API Docs<br>
>8. 서버 폴더 구조<br>
>9. 프로젝트 설치<br>
>10. .env<br><br>

## 1. 프로젝트 소개
### 프로젝트명: 카페모먼트(Cafemoment)
### 프로젝트 페이지: https://cafemoment.site
### 소개글
>혹시 길을 걷다 우연히 그동안 발견하지 못했던 특별한 매력을 가진 카페를 찾아본 적 있으신가요?<br>
>카모는 당신에게 그런 카페를 알려드릴 커뮤니티 공간입니다.<br>
>나만 알고 있기 아쉬운 우리 주변의 숨겨진 카페들을 찾아 커뮤니티에 공유하고 커피를 좋아하는 다른 사람들에게 커피 뿐만이 아닌 카페에서 느낄 수 있는 작은 행복을 선물하세요.<br>
>카모(Camo)는 소규모 카페들과 협력하여 할인 혜택과 원하는 시간에 예약할 수 있는 기능을 제공합니다.<br>
>창가 좌석, 가장 안쪽 좌석 등 여러분이 커피를 더욱 맛있게 느낄 수 있는 곳으로 선택해 보세요.<br>

## 2. 팀원 소개
<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192709355-820c97fe-82d8-4d28-8775-222503665d87.jpg" width="400">
</p>

|포지션|이름|역할|담당|
|--|---|----|---|
|Backend|염준호|팀장|로그인, 카페 게시판, 리뷰, 마이페이지, 카페 예약, 찜|
|Backend|정승현|발표, 깃관리자|결제, 검색, 이미지 업로드, 커뮤니티 게시판, 좋아요, 댓글, GCP 배포|
|Frontend|정재인|노션 관리자|로그인, 회원가입, 마이페이지, Mobile Layout, AWS 배포|
|Frontend|정예은|발표자료 제작|랜딩페이지, 카페 게시판, Web Layout|
|Frontend|김성연|깃 관리자|카페 테이블 페이지, 댓글, Web Layout|

<br><br>

## 3. 사용한 기술 스택

<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192718472-f7a1849b-3a03-4f59-acc5-ff47fb30d659.png" width="900">
</p><br>

## 4. 플로우차트

<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192719394-118a21ec-059d-4b6b-ab75-7bf44dd565d5.jpg" width="900">
</p><br>

## 5. pipeline
<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192728879-c3111b0d-31d1-4084-8125-a2930ca59500.png" width="900">
</p><br>

## 6. ERD
<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192720990-2666ce94-5b7d-4f4b-b683-400d94802837.png" width="900">
</p><br>

## 7. API Docs
<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192721501-c1f50003-8c2f-42da-bb0d-003a16007874.png" width="900">
</p><br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/105836661/192721511-d6a62547-c000-4e8c-a57b-8d115eb1ec6e.png" width="900">
</p><br>

## 8. 서버 폴더 구조
```
├── apis
│   ├── auths
│   │   ├── auths.controllers.ts
│   │   ├── auths.module.ts
│   │   ├── auths.resolver.ts
│   │   └── auths.service.ts
│   ├── cafeBoards
│   │   ├── cafeBoards.module.ts
│   │   ├── cafeBoards.resolver.ts
│   │   ├── cafeBoards.service.ts
│   │   ├── dto
│   │   │   ├── createCafeBoard.input.ts
│   │   │   └── updateCafeBoard.input.ts
│   │   └── entities
│   │       └── cafeBoard.entity.ts
│   ├── cafeReservations
│   │   ├── cafeReservations.module.ts
│   │   ├── cafeReservations.resolver.ts
│   │   ├── cafeReservations.service.ts
│   │   ├── dto
│   │   │   └── createReservation.input.ts
│   │   └── entities
│   │       └── cafeReservations.entity.ts
│   ├── chat
│   │   ├── chat.gateway.ts
│   │   ├── chat.module.ts
│   │   ├── chat.resolver.ts
│   │   ├── chat.service.ts
│   │   └── entities
│   │       ├── chatMessage.entity.ts
│   │       └── chatRoom.entity.ts
│   ├── comments
│   │   ├── comments.module.ts
│   │   ├── comments.resolver.ts
│   │   ├── comments.service.ts
│   │   ├── dto
│   │   │   ├── createComment.input.ts
│   │   │   └── updateComment.input.ts
│   │   └── entites
│   │       └── comment.entity.ts
│   ├── files
│   │   ├── file.module.ts
│   │   ├── file.resolver.ts
│   │   └── file.service.ts
│   ├── freeboards
│   │   ├── dto
│   │   │   ├── createFreeBoard.input.ts
│   │   │   ├── fetchFreeBoard.output.ts
│   │   │   └── updateFreeBoard.input.ts
│   │   ├── entities
│   │   │   └── freeBoard.entity.ts
│   │   ├── freeBoards.module.ts
│   │   ├── freeBoards.resolver.ts
│   │   └── freeBoards.service.ts
│   ├── iamport
│   │   └── iamport.service.ts
│   ├── images
│   │   ├── entities
│   │   │   └── image.entity.ts
│   │   ├── image.module.ts
│   │   ├── image.resolver.ts
│   │   └── image.service.ts
│   ├── likes
│   │   ├── entities
│   │   │   └── like.entity.ts
│   │   ├── likes.module.ts
│   │   ├── likes.resolver.ts
│   │   └── likes.service.ts
│   ├── payments
│   │   ├── entities
│   │   │   └── payment.entity.ts
│   │   ├── payments.module.ts
│   │   ├── payments.resolver.ts
│   │   └── payments.service.ts
│   ├── reviews
│   │   ├── dto
│   │   │   ├── createReview.input.ts
│   │   │   └── updateReview.input.ts
│   │   ├── entites
│   │   │   └── review.entity.ts
│   │   ├── reviews.module.ts
│   │   ├── reviews.resolver.ts
│   │   └── reviews.service.ts
│   ├── tags
│   │   ├── entities
│   │   │   └── tag.entity.ts
│   │   ├── tags.module.ts
│   │   ├── tags.resolver.ts
│   │   └── tags.service.ts
│   └── users
│       ├── dto
│       │   ├── createCafeOwner.input.ts
│       │   ├── createUser.input.ts
│       │   └── updateUser.input.ts
│       ├── entites
│       │   └── user.entity.ts
│       ├── users.module.ts
│       ├── users.resolver.ts
│       └── users.service.ts
├── app.module.ts
├── commons
│   ├── auth
│   │   ├── gql-auth.guard.ts
│   │   ├── jwt-access.strategy.ts
│   │   ├── jwt-admin.strategy.ts
│   │   ├── jwt-refresh.strategy.ts
│   │   ├── jwt-social-google.strategy.ts
│   │   ├── jwt-social-kakao.strategy.ts
│   │   ├── jwt-social-naver.strategy.ts
│   │   ├── roles.decorator.ts
│   │   └── roles.guard.ts
│   ├── filter
│   │   └── http-exception.filter.ts
│   ├── graphql
│   │   └── schema.gql
│   ├── libraries
│   │   └── utils.ts
│   └── type
│       ├── context.ts
│       └── user.ts
└── main.ts
```

## 9. 프로젝트 설치
```
git clone https://github.com/code-bootcamp/f8b4-team04-server.git
```

## 10. .env
```
# File upload
BUCKET
PROJECT_ID

# DB config
DATABASE_TYPE
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_DATABASE

# Token
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET

# Hashed Number
HASH_SECRET

# Social Login
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL

NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
NAVER_CALLBACK_URL

KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
KAKAO_CALLBACK_URL

# CoolSMS
SMS_KEY
SMS_SECRET
SMS_SENDER
EMAIL_PASS
EMAIL_SENDER
EMAIL_USER

# 결제
IMP_KEY
IMP_SECRET

# 소셜 로그인으로 계정 생성시 기본 비밀번호
DEFAULT_PASSWORD

# CORS config
CORS_ORIGIN

```
